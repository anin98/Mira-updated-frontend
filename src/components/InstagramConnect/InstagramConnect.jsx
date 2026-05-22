import { useState } from 'react'
import { Card, Button, Tag, Typography, Spin, message } from 'antd'
import { Instagram, CheckCircle2, AlertCircle, Link2Off } from 'lucide-react'
import useFacebookSDK from '../FacebookConnect/useFacebookSDK'
import PageSelector from '../FacebookConnect/PageSelector'
import {
  exchangeFacebookToken,
  connectFacebookPage,
} from '../../api/integrations'

const { Title, Text, Paragraph } = Typography

function extractError(err, fallback) {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.detail ||
    err?.message ||
    fallback
  )
}

/**
 * Instagram side of the connection.
 *
 * Decoupled from FacebookConnect — has its own OAuth flow that uses the
 * Messenger+Instagram Login Configuration (VITE_FACEBOOK_CONFIG_ID_INSTAGRAM).
 * The merchant clicks "Connect Instagram" explicitly when they want IG; the
 * default FacebookConnect button uses the Messenger-only config and skips the
 * mandatory IG asset picker.
 *
 * Four states:
 *   1. No Facebook Page connected → tell them to connect FB first.
 *   2. Page connected, no IG linked yet → "Connect Instagram" button that
 *      triggers OAuth with the broader config; user picks the same Page +
 *      whichever IG they want linked to it.
 *   3. Page + IG connected → show @username + webhook subscription state.
 *   4. (Loading) → spinner.
 *
 * Backend endpoints are reused — same /exchange-token/ + /connect-page/ that
 * FacebookConnect uses. The Django side already persists the IG fields if the
 * picked Page has an IG Business account linked.
 */
export default function InstagramConnect({
  companyId,
  status,
  statusLoading,
  onChanged,
}) {
  const { ready: sdkReady, error: sdkError, login } = useFacebookSDK()
  const [connecting, setConnecting] = useState(false)
  const [pages, setPages] = useState([])
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [savingPage, setSavingPage] = useState(false)

  const handleConnectClick = async () => {
    if (!companyId) {
      message.error('No company selected')
      return
    }
    setConnecting(true)
    try {
      const authResponse = await login(
        import.meta.env.VITE_FACEBOOK_CONFIG_ID_INSTAGRAM,
      )
      const data = await exchangeFacebookToken({
        shortLivedToken: authResponse.accessToken,
        companyId,
      })
      const fetchedPages = data?.pages || []
      if (fetchedPages.length === 0) {
        message.warning(
          'No Facebook Pages were returned. Make sure you grant access to a Page (with a linked Instagram Business account) during login.',
        )
        return
      }
      setPages(fetchedPages)
      setSelectorOpen(true)
    } catch (err) {
      message.error(extractError(err, 'Could not connect to Instagram'))
    } finally {
      setConnecting(false)
    }
  }

  const handleSelectPage = async (pageId) => {
    setSavingPage(true)
    try {
      await connectFacebookPage({ companyId, pageId })
      message.success('Instagram connected')
      setSelectorOpen(false)
      setPages([])
      if (onChanged) await onChanged()
    } catch (err) {
      message.error(extractError(err, 'Could not save the selected Page'))
    } finally {
      setSavingPage(false)
    }
  }

  const headerTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background:
            'linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Instagram size={22} color="#fff" />
      </div>
      <div>
        <Title level={5} style={{ margin: 0 }}>
          Instagram Direct
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Reply to Instagram DMs from a Facebook Page with a linked IG Business account.
        </Text>
      </div>
    </div>
  )

  if (statusLoading) {
    return (
      <Card title={headerTitle}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      </Card>
    )
  }

  // Case 1: no Facebook Page connected — IG inherits from the Page, so they
  // need to connect FB first.
  if (!status?.connected) {
    return (
      <Card title={headerTitle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link2Off size={18} color="#8c8c8c" />
            <Text type="secondary">Not connected</Text>
          </div>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Connect your Facebook Page above first. Instagram messaging routes
            through the Page that the IG Business account is linked to — so the
            Page connection has to exist before you can opt into Instagram.
          </Paragraph>
        </div>
      </Card>
    )
  }

  // Case 2: Page connected, IG not yet — show the explicit Connect Instagram button.
  if (!status?.instagram_business_account_id) {
    return (
      <>
        <Card title={headerTitle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              Your Facebook Page <Text strong>{status.page_name}</Text> is
              connected. To also reply to Instagram DMs, click below and grant
              Mira access to the IG Business account linked to this Page. If
              your Page doesn&apos;t have an IG account linked yet, open the
              Page&apos;s settings in Facebook → <Text strong>Linked Accounts</Text>{' '}
              → <Text strong>Instagram</Text> first.
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
                icon={<Instagram size={18} />}
                onClick={handleConnectClick}
                loading={connecting}
                disabled={!sdkReady || !companyId}
              >
                Connect Instagram
              </Button>
            </div>
          </div>
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

  // Case 3: IG linked. Identity + delivery (webhook subscription) state.
  const subscribed = !!status?.instagram_subscribed
  return (
    <Card title={headerTitle}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <CheckCircle2 size={18} color="#52c41a" />
            <Text strong>
              {status.instagram_username
                ? `@${status.instagram_username}`
                : 'Instagram Business account linked'}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 13 }}>
            IG Business Account ID: {status.instagram_business_account_id}
          </Text>
        </div>

        <div>
          {subscribed ? (
            <Tag color="green">Webhook subscribed</Tag>
          ) : (
            <Tag color="orange" icon={<AlertCircle size={12} />}>
              Webhook not subscribed
            </Tag>
          )}
        </div>

        <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
          Instagram access is bound to the Facebook Page connection above. To
          disconnect Instagram, disconnect the Page (Mira will stop receiving
          IG DMs as well).
        </Paragraph>
      </div>
    </Card>
  )
}
