import { useState } from 'react'
import { Card, Button, Popconfirm, Typography, Tag, Spin, message } from 'antd'
import { Facebook, CheckCircle2, AlertCircle, Unplug } from 'lucide-react'
import useFacebookSDK from './useFacebookSDK'
import PageSelector from './PageSelector'
import {
  exchangeFacebookToken,
  connectFacebookPage,
  disconnectFacebookPage,
} from '../../api/integrations'

const { Title, Text, Paragraph } = Typography

// Pulls a usable error string out of an axios error.
function extractError(err, fallback) {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.detail ||
    err?.message ||
    fallback
  )
}

export default function FacebookConnect({ companyId, status, statusLoading, onChanged }) {
  const { ready: sdkReady, error: sdkError, login } = useFacebookSDK()
  const [connecting, setConnecting] = useState(false)
  const [pages, setPages] = useState([])
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [savingPage, setSavingPage] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const handleConnectClick = async () => {
    if (!companyId) {
      message.error('No company selected')
      return
    }
    setConnecting(true)
    try {
      const authResponse = await login()
      const data = await exchangeFacebookToken({
        shortLivedToken: authResponse.accessToken,
        companyId,
      })
      const fetchedPages = data?.pages || []
      if (fetchedPages.length === 0) {
        message.warning(
          'No Facebook Pages were returned. Make sure you grant access to at least one Page during login.',
        )
        return
      }
      setPages(fetchedPages)
      setSelectorOpen(true)
    } catch (err) {
      message.error(extractError(err, 'Could not connect to Facebook'))
    } finally {
      setConnecting(false)
    }
  }

  const handleSelectPage = async (pageId) => {
    setSavingPage(true)
    try {
      await connectFacebookPage({ companyId, pageId })
      message.success('Facebook Page connected')
      setSelectorOpen(false)
      setPages([])
      if (onChanged) await onChanged()
    } catch (err) {
      message.error(extractError(err, 'Could not save the selected Page'))
    } finally {
      setSavingPage(false)
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await disconnectFacebookPage(companyId)
      message.success('Facebook Page disconnected')
      if (onChanged) await onChanged()
    } catch (err) {
      message.error(extractError(err, 'Could not disconnect the Page'))
    } finally {
      setDisconnecting(false)
    }
  }

  if (statusLoading) {
    return (
      <Card>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      </Card>
    )
  }

  const connected = !!status?.connected

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#1877F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Facebook size={22} color="#fff" />
            </div>
            <div>
              <Title level={5} style={{ margin: 0 }}>Facebook Messenger</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Connect a Page so Mira can reply to Messenger conversations.
              </Text>
            </div>
          </div>
        }
      >
        {connected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <CheckCircle2 size={18} color="#52c41a" />
                <Text strong>{status.page_name || 'Connected'}</Text>
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Page ID: {status.page_id}
              </Text>
            </div>

            <div>
              {status.subscribed ? (
                <Tag color="green">Webhook subscribed</Tag>
              ) : (
                <Tag color="orange" icon={<AlertCircle size={12} />}>
                  Webhook not subscribed
                </Tag>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Popconfirm
                title="Disconnect this Facebook Page?"
                description="Mira will stop receiving and replying to Messenger conversations for this Page."
                okText="Disconnect"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                onConfirm={handleDisconnect}
              >
                <Button danger icon={<Unplug size={16} />} loading={disconnecting}>
                  Disconnect
                </Button>
              </Popconfirm>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              Sign in with the Facebook account that manages your business Page. You will be
              asked to grant permissions so Mira can read incoming messages and reply on your
              behalf. After login, pick which Page to connect.
            </Paragraph>

            {sdkError && (
              <div style={{ color: '#ff4d4f', fontSize: 13 }}>
                Could not load the Facebook SDK: {sdkError.message}
              </div>
            )}

            <div>
              <Button
                type="primary"
                size="large"
                icon={<Facebook size={18} />}
                onClick={handleConnectClick}
                loading={connecting}
                disabled={!sdkReady || !companyId}
              >
                Connect Facebook Page
              </Button>
            </div>
          </div>
        )}
      </Card>

      <PageSelector
        open={selectorOpen}
        pages={pages}
        loading={savingPage}
        onCancel={() => {
          if (!savingPage) {
            setSelectorOpen(false)
            setPages([])
          }
        }}
        onConfirm={handleSelectPage}
      />
    </>
  )
}
