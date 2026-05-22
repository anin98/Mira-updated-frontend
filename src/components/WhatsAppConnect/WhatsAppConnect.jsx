import { useState } from 'react'
import { Card, Button, Popconfirm, Typography, Tag, Spin, message } from 'antd'
import {
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Unplug,
} from 'lucide-react'
import useFacebookSDK from '../FacebookConnect/useFacebookSDK'
import { useWhatsAppEmbeddedSignup } from './useWhatsAppEmbeddedSignup'
import {
  whatsappSignupExchange,
  disconnectWhatsApp,
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
 * WhatsApp Business connect card.
 *
 * Three visible states (mirrors InstagramConnect's shape, but its own backend
 * flow — WhatsApp identity is the WABA + phone-number id, not a Page):
 *
 *   1. Not connected -> "Connect WhatsApp" button launches Embedded Signup
 *      via FB.login(config_id=VITE_FACEBOOK_CONFIG_ID_WHATSAPP,
 *      response_type='code', extras.featureType='whatsapp_business_app_
 *      onboarding'). The popup also posts `{ waba_id, phone_number_id }`
 *      back via window.postMessage; the hook captures both pieces.
 *
 *   2. Connected, webhook NOT subscribed -> show display number + business
 *      name + an orange "Webhook not subscribed" tag with a contact-support
 *      hint. Disconnect button still available.
 *
 *   3. Connected + subscribed -> green check + Disconnect button.
 *
 * Reads the WhatsApp fields off `status` (the same /facebook/status/ payload
 * that the FB and IG cards already use — Agent B is extending the StatusView
 * to include whatsapp_waba_id / whatsapp_phone_number_id /
 * whatsapp_phone_number_display / whatsapp_business_name /
 * whatsapp_subscribed). Defensive defaults are applied so the card still
 * renders cleanly if Agent B's extension hasn't landed yet.
 */
export default function WhatsAppConnect({
  companyId,
  status,
  statusLoading,
  onChanged,
}) {
  const { ready: sdkReady, error: sdkError } = useFacebookSDK()
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const { launchSignup } = useWhatsAppEmbeddedSignup({
    onSignup: async ({ code, waba_id, phone_number_id }) => {
      if (!companyId) {
        message.error('No company selected')
        setConnecting(false)
        return
      }
      try {
        await whatsappSignupExchange({
          companyId,
          code,
          wabaId: waba_id,
          phoneNumberId: phone_number_id,
        })
        message.success('WhatsApp Business connected')
        if (onChanged) await onChanged()
      } catch (err) {
        message.error(extractError(err, 'Could not connect WhatsApp'))
      } finally {
        setConnecting(false)
      }
    },
    onError: (err) => {
      message.error(err?.message || 'WhatsApp signup failed')
      setConnecting(false)
    },
  })

  const handleConnectClick = () => {
    if (!companyId) {
      message.error('No company selected')
      return
    }
    setConnecting(true)
    launchSignup()
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await disconnectWhatsApp(companyId)
      message.success('WhatsApp disconnected')
      if (onChanged) await onChanged()
    } catch (err) {
      message.error(extractError(err, 'Could not disconnect WhatsApp'))
    } finally {
      setDisconnecting(false)
    }
  }

  const headerTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MessageCircle size={22} color="#fff" />
      </div>
      <div>
        <Title level={5} style={{ margin: 0 }}>
          WhatsApp Business
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Reply to WhatsApp conversations from your own business phone number.
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

  // Defensive: WhatsApp fields are added by Agent B; default to null so the
  // card renders the "not connected" state cleanly if Agent B's StatusView
  // extension hasn't shipped yet.
  const wabaId = status?.whatsapp_waba_id || null
  const phoneNumberId = status?.whatsapp_phone_number_id || null
  const phoneNumberDisplay = status?.whatsapp_phone_number_display || null
  const businessName = status?.whatsapp_business_name || null
  const subscribed = !!status?.whatsapp_subscribed

  const connected = !!phoneNumberId

  if (!connected) {
    return (
      <Card title={headerTitle}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Paragraph type="secondary" style={{ margin: 0 }}>
            Sign in with the Facebook account that manages your WhatsApp
            Business Account. Meta will walk you through choosing (or
            creating) a business, picking the phone number Mira should
            send and receive on, and verifying it. Mira can only message
            customers who message you first within the WhatsApp 24-hour
            window, or via pre-approved templates.
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
              icon={<MessageCircle size={18} />}
              onClick={handleConnectClick}
              loading={connecting}
              disabled={!sdkReady || !companyId}
              style={{ background: '#25D366', borderColor: '#25D366' }}
            >
              Connect WhatsApp
            </Button>
          </div>
        </div>
      </Card>
    )
  }

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
            <Text strong>{businessName || 'Connected'}</Text>
          </div>
          {phoneNumberDisplay && (
            <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
              {phoneNumberDisplay}
            </Text>
          )}
          {wabaId && (
            <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>
              WABA ID: {wabaId}
            </Text>
          )}
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

        {!subscribed && (
          <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
            We registered the connection but couldn&apos;t subscribe Mira to
            this WABA&apos;s webhook automatically. Contact support — usually
            this clears once Meta finishes provisioning the phone number.
          </Paragraph>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popconfirm
            title="Disconnect WhatsApp?"
            description="Mira will stop receiving and replying to WhatsApp messages on this number."
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
    </Card>
  )
}
