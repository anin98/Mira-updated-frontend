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
