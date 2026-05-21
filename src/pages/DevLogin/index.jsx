import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Alert } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import apiClient from '../../api/axios'
import { ENDPOINTS } from '../../api/config'

export default function DevLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, loginCompany } = useAuth()
  const [error, setError] = useState(null)
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) return
    hasRunRef.current = true

    const token = searchParams.get('token')
    if (!token) {
      setError('Missing magic link token in URL.')
      return
    }

    const run = async () => {
      try {
        const { data } = await apiClient.post(ENDPOINTS.AUTH.MAGIC_LOGIN, { token })

        const info = data.user_info || {}
        login(
          {
            id: info.id,
            customerId: info.customer_id,
            first_name: info.first_name,
            last_name: info.last_name,
            email: info.email,
            phone: info.phone,
          },
          { access: data.access, refresh: data.refresh },
        )

        const companyResp = await apiClient.get(ENDPOINTS.COMPANIES.BASE)
        const companies = Array.isArray(companyResp.data) ? companyResp.data : []
        if (companies.length === 0) {
          setError('Magic link target has no Company. Run mint_review_magic_link to provision one.')
          return
        }

        loginCompany(companies[0], data.access)
        navigate('/dashboard', { replace: true })
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          'Magic link login failed.'
        setError(msg)
      }
    }

    run()
  }, [searchParams, navigate, login, loginCompany])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {error ? (
        <Alert
          type="error"
          message="Magic link login failed"
          description={error}
          showIcon
          style={{ maxWidth: 520 }}
        />
      ) : (
        <Spin size="large" tip="Signing you in…" />
      )}
    </div>
  )
}
