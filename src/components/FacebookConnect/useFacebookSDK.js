import { useEffect, useState, useCallback } from 'react'

// Scope-based fallback used only when no Login-for-Business config_id is set.
// With config_id (the production path), Meta sources the scopes from the saved
// Login Configuration and ignores this list.
const FB_SCOPES = [
  'pages_messaging',
  'pages_show_list',
  'pages_manage_metadata',
  'pages_read_engagement',
  'pages_utility_messaging',
].join(',')

const FB_VERSION = 'v22.0'
const FB_SDK_SRC = 'https://connect.facebook.net/en_US/sdk.js'

let sdkLoadPromise = null

function loadSdk(appId) {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Facebook SDK can only be loaded in the browser'))
  }
  if (window.FB) {
    return Promise.resolve(window.FB)
  }
  if (sdkLoadPromise) {
    return sdkLoadPromise
  }

  sdkLoadPromise = new Promise((resolve, reject) => {
    // fbAsyncInit must be defined BEFORE the script loads — the SDK calls it
    // automatically once it's ready.
    window.fbAsyncInit = function () {
      try {
        window.FB.init({
          appId,
          cookie: false,
          xfbml: false,
          version: FB_VERSION,
        })
        resolve(window.FB)
      } catch (err) {
        reject(err)
      }
    }

    // Avoid injecting twice if the script tag is already in the DOM.
    if (document.getElementById('facebook-jssdk')) {
      return
    }

    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.async = true
    script.defer = true
    script.src = FB_SDK_SRC
    script.onerror = () => reject(new Error('Failed to load the Facebook SDK'))
    document.head.appendChild(script)
  })

  return sdkLoadPromise
}

export default function useFacebookSDK() {
  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.FB)
  const [error, setError] = useState(null)
  const appId = import.meta.env.VITE_FACEBOOK_APP_ID

  useEffect(() => {
    if (!appId) {
      setError(new Error('VITE_FACEBOOK_APP_ID is not configured'))
      return
    }
    let cancelled = false
    loadSdk(appId)
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
    return () => {
      cancelled = true
    }
  }, [appId])

  const login = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('Facebook SDK is not ready yet'))
        return
      }
      const configId = import.meta.env.VITE_FACEBOOK_CONFIG_ID
      // With config_id, Meta sources the scopes from the saved Login Configuration.
      // response_type:'token' keeps the client-side short-lived token flow our
      // backend already expects (POST /exchange-token/ with short_lived_token).
      // Without config_id (plain Facebook Login product), fall back to scope-based.
      const loginOptions = configId
        ? { config_id: configId, response_type: 'token', override_default_response_type: true }
        : { scope: FB_SCOPES, auth_type: 'rerequest' }
      window.FB.login(
        (response) => {
          if (response && response.authResponse) {
            resolve(response.authResponse)
          } else {
            reject(new Error('Facebook login was cancelled or denied'))
          }
        },
        loginOptions,
      )
    })
  }, [])

  const logout = useCallback(() => {
    if (window.FB) {
      window.FB.logout()
    }
  }, [])

  return { ready, error, login, logout }
}
