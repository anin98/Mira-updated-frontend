import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook that drives Meta's WhatsApp Embedded Signup popup.
 *
 * Embedded Signup uses the same FB JS SDK as Login for Business (loaded by
 * useFacebookSDK), but with two important twists:
 *
 *   1. It is launched via `window.FB.login(cb, { config_id, response_type:
 *      'code', extras: { featureType: 'whatsapp_business_app_onboarding',
 *      sessionInfoVersion: '3' } })` — note `response_type: 'code'`, not
 *      `'token'`. The callback returns an authorization code that the
 *      backend exchanges for a system-user access token scoped to the
 *      merchant's WABA.
 *
 *   2. The popup also POSTs session info (the new WABA id + phone number id
 *      Meta provisioned for the merchant) back to the parent window via
 *      `window.postMessage`. That happens out-of-band of the FB.login
 *      callback, so we have to listen on `window` for messages with type
 *      `WA_EMBEDDED_SIGNUP`, validate the origin against
 *      facebook.com / web.facebook.com, and stash whatever Meta sent us
 *      into a ref so the FB.login callback can pick it up when the popup
 *      finally closes.
 *
 * Returns { launchSignup } — call it on user click. Wires errors back via
 * the `onError` prop; calls `onSignup({ code, waba_id, phone_number_id })`
 * on success.
 */
export function useWhatsAppEmbeddedSignup({ onSignup, onError }) {
  const sessionInfoRef = useRef(null)
  const onSignupRef = useRef(onSignup)
  const onErrorRef = useRef(onError)

  // Keep latest callbacks in refs so the postMessage listener (which only
  // attaches once) always sees the freshest closures.
  useEffect(() => {
    onSignupRef.current = onSignup
    onErrorRef.current = onError
  }, [onSignup, onError])

  useEffect(() => {
    const handler = (event) => {
      // Origin check — Meta posts from these origins only. Anything else
      // is either a stray message from another integration's SDK or a
      // probe; ignore.
      if (
        event.origin !== 'https://www.facebook.com' &&
        event.origin !== 'https://web.facebook.com'
      ) {
        return
      }
      let data
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
      } catch {
        // Non-JSON string message — not for us.
        return
      }
      if (!data || data.type !== 'WA_EMBEDDED_SIGNUP') return

      if (data.event === 'FINISH') {
        // data.data contains { waba_id, phone_number_id, business_id }
        sessionInfoRef.current = data.data || null
      } else if (data.event === 'CANCEL') {
        sessionInfoRef.current = null
      } else if (data.event === 'ERROR') {
        const msg = data.data?.error_message || 'Embedded Signup error'
        onErrorRef.current?.(new Error(msg))
      }
    }

    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  const launchSignup = useCallback(() => {
    if (typeof window === 'undefined' || !window.FB) {
      onErrorRef.current?.(new Error('Facebook SDK is not ready yet'))
      return
    }

    const configId = import.meta.env.VITE_FACEBOOK_CONFIG_ID_WHATSAPP
    if (!configId) {
      onErrorRef.current?.(
        new Error('VITE_FACEBOOK_CONFIG_ID_WHATSAPP is not configured'),
      )
      return
    }

    // Reset any stale session info from a previous attempt.
    sessionInfoRef.current = null

    window.FB.login(
      (response) => {
        const code = response?.authResponse?.code
        if (!code) {
          onErrorRef.current?.(
            new Error('WhatsApp signup was cancelled or denied'),
          )
          return
        }
        const sessionInfo = sessionInfoRef.current
        if (!sessionInfo?.waba_id || !sessionInfo?.phone_number_id) {
          onErrorRef.current?.(
            new Error(
              'Embedded Signup did not return WABA or phone-number info',
            ),
          )
          return
        }
        onSignupRef.current?.({
          code,
          waba_id: sessionInfo.waba_id,
          phone_number_id: sessionInfo.phone_number_id,
        })
      },
      {
        config_id: configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: 'whatsapp_business_app_onboarding',
          sessionInfoVersion: '3',
        },
      },
    )
  }, [])

  return { launchSignup }
}

export default useWhatsAppEmbeddedSignup
