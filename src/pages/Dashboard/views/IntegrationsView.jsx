import { useState, useEffect, useCallback } from 'react'
import { Plug } from 'lucide-react'
import { message } from 'antd'
import FacebookConnect from '../../../components/FacebookConnect/FacebookConnect'
import InstagramConnect from '../../../components/InstagramConnect/InstagramConnect'
import WhatsAppConnect from '../../../components/WhatsAppConnect/WhatsAppConnect'
import { getFacebookStatus } from '../../../api/integrations'

const API_BASE = 'https://api.grayscale-technologies.com/api'

// Pulls the merchant's current company id the same way CompanyView does —
// /v1/user-companies/ returns an array, we take the first. This keeps a single
// source of truth for "which company am I editing" across the dashboard.
function useCompanyId() {
  const [companyId, setCompanyId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    fetch(`${API_BASE}/v1/user-companies/`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch company')
        return r.json()
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCompanyId(data[0].id)
        }
      })
      .catch((err) => {
        console.error(err)
        message.error('Could not resolve your company')
      })
      .finally(() => setLoading(false))
  }, [])

  return { companyId, loading }
}

export default function IntegrationsView() {
  const { companyId, loading: companyLoading } = useCompanyId()
  const [status, setStatus] = useState(null)
  const [statusLoading, setStatusLoading] = useState(true)

  const refreshStatus = useCallback(async () => {
    if (!companyId) return
    setStatusLoading(true)
    try {
      const data = await getFacebookStatus(companyId)
      setStatus(data)
    } catch (err) {
      console.error(err)
      message.error(
        err?.response?.data?.error ||
          err?.message ||
          'Could not load integration status',
      )
    } finally {
      setStatusLoading(false)
    }
  }, [companyId])

  useEffect(() => {
    if (companyId) {
      refreshStatus()
    }
  }, [companyId, refreshStatus])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
            <Plug size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Integrations</h2>
            <p className="text-sm text-muted-foreground">
              Connect external messaging channels so Mira can reply on your behalf.
            </p>
          </div>
        </div>
      </div>

      <FacebookConnect
        companyId={companyId}
        status={status}
        statusLoading={companyLoading || statusLoading}
        onChanged={refreshStatus}
      />

      {/*
       * Instagram is opt-in and decoupled from the Messenger connect above.
       * The IG card has its own OAuth flow that uses a *different* Login
       * Configuration (VITE_FACEBOOK_CONFIG_ID_INSTAGRAM) — the one that
       * includes the IG scopes. Merchants who only want Messenger never see
       * the mandatory IG asset picker.
       */}
      <InstagramConnect
        companyId={companyId}
        status={status}
        statusLoading={companyLoading || statusLoading}
        onChanged={refreshStatus}
      />

      {/*
       * WhatsApp Business is a separate product line from Messenger/IG even
       * though it uses the same FB JS SDK shell for OAuth. Its own Embedded
       * Signup popup picks (or creates) a WABA + phone number, and posts the
       * resulting waba_id + phone_number_id back via window.postMessage —
       * the WhatsAppConnect component captures both and exchanges them for a
       * system-user access token on Django.
       */}
      <WhatsAppConnect
        companyId={companyId}
        status={status}
        statusLoading={companyLoading || statusLoading}
        onChanged={refreshStatus}
      />
    </div>
  )
}
