import apiClient from './axios'

// Thin wrappers around the Facebook integration endpoints. All requests go
// through apiClient, which adds the JWT Authorization header and handles
// refresh automatically. Errors bubble up — callers should surface them via
// antd `message.error(err.response?.data?.error || err.message)`.

export async function exchangeFacebookToken({ shortLivedToken, companyId }) {
  const { data } = await apiClient.post('/v1/integrations/facebook/exchange-token/', {
    short_lived_token: shortLivedToken,
    company_id: companyId,
  })
  return data
}

export async function connectFacebookPage({ companyId, pageId }) {
  const { data } = await apiClient.post('/v1/integrations/facebook/connect-page/', {
    company_id: companyId,
    page_id: pageId,
  })
  return data
}

export async function getFacebookStatus(companyId) {
  const { data } = await apiClient.get('/v1/integrations/facebook/status/', {
    params: { company_id: companyId },
  })
  return data
}

export async function disconnectFacebookPage(companyId) {
  const { data } = await apiClient.post('/v1/integrations/facebook/disconnect-page/', {
    company_id: companyId,
  })
  return data
}

// --- WhatsApp Business -----------------------------------------------------
//
// Backend endpoints (Agent B):
//   POST /v1/integrations/whatsapp-signup-exchange/
//     body: { company_id, code, waba_id, phone_number_id }
//     -> exchanges the Embedded Signup auth code for a system-user access
//        token, persists the WABA + phone number on Company, subscribes the
//        webhook, and returns the same status shape extended with WhatsApp
//        fields.
//
//   POST /v1/integrations/disconnect-whatsapp/
//     body: { company_id }
//     -> clears whatsapp_* fields on Company and unsubscribes the WABA
//        webhook on Meta's side.

export async function whatsappSignupExchange({
  companyId,
  code,
  wabaId,
  phoneNumberId,
}) {
  const { data } = await apiClient.post(
    '/v1/integrations/whatsapp-signup-exchange/',
    {
      company_id: companyId,
      code,
      waba_id: wabaId,
      phone_number_id: phoneNumberId,
    },
  )
  return data
}

export async function disconnectWhatsApp(companyId) {
  const { data } = await apiClient.post(
    '/v1/integrations/disconnect-whatsapp/',
    { company_id: companyId },
  )
  return data
}
