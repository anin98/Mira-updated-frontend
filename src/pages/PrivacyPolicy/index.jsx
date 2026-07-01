import { Typography, Divider, Anchor, Card, Tag } from 'antd'
import { Link } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const CONTACT_EMAIL = 'contact@grayscale-technologies.com'
const PRIMARY_DOMAIN = 'mira-ai.grayscale-technologies.com'
const LAST_UPDATED = '2026-05-21'

const sections = [
  { key: 'introduction', href: '#introduction', title: '1. Introduction' },
  { key: 'data-we-collect', href: '#data-we-collect', title: '2. Data We Collect' },
  { key: 'how-we-use-it', href: '#how-we-use-it', title: '3. How We Use Your Data' },
  { key: 'subprocessors', href: '#subprocessors', title: '4. Sub-processors' },
  { key: 'data-sharing', href: '#data-sharing', title: '5. Data Sharing' },
  { key: 'retention', href: '#retention', title: '6. Data Retention' },
  { key: 'user-rights', href: '#user-rights', title: '7. Your Rights' },
  { key: 'cookies', href: '#cookies', title: '8. Cookies and Local Storage' },
  { key: 'children', href: '#children', title: "9. Children's Privacy" },
  { key: 'changes', href: '#changes', title: '10. Changes to This Policy' },
  { key: 'contact', href: '#contact', title: '11. Contact Us' },
]

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-16 px-4">
      <div className="container-custom max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Tag color="blue" className="mb-3">Legal</Tag>
          <Title level={1} style={{ marginBottom: 8 }}>
            Privacy Policy
          </Title>
          <Text type="secondary">
            Last updated: {LAST_UPDATED}
          </Text>
        </div>

        <Divider />

        {/* Two-column layout: nav + body */}
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sticky table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Anchor
                affix={false}
                items={sections.map((s) => ({
                  key: s.key,
                  href: s.href,
                  title: s.title,
                }))}
              />
            </div>
          </aside>

          {/* Body */}
          <article>
            <Typography>
              {/* 1. Introduction */}
              <section id="introduction">
                <Title level={2}>1. Introduction</Title>
                <Paragraph>
                  This Privacy Policy describes how <Text strong>Grayscale Technologies</Text> ("Mira AI",
                  "we", "us", or "our") collects, uses, and shares personal information when you
                  interact with the Mira AI Chatbot platform, including our website at{' '}
                  <Text code>{PRIMARY_DOMAIN}</Text>, our merchant dashboard, our web chat widget
                  embedded on merchant websites, and our chatbot integrations on Facebook Messenger
                  and other supported messaging channels.
                </Paragraph>
                <Paragraph>
                  Mira AI is a business-to-business (B2B) software-as-a-service platform that helps
                  merchants in Bangladesh and the broader region operate AI-powered conversational
                  commerce experiences. We act as a <Text strong>data processor</Text> on behalf of
                  the merchants who use our platform ("Merchants") for the conversations they have
                  with their own customers, and as a <Text strong>data controller</Text> for the
                  account information of the Merchants themselves.
                </Paragraph>
                <Paragraph>
                  By using the Mira AI platform, chatting with a Mira-powered bot, or signing up as
                  a Merchant, you agree to the practices described in this Policy. If you do not
                  agree, please discontinue use of the service.
                </Paragraph>
              </section>

              <Divider />

              {/* 2. Data We Collect */}
              <section id="data-we-collect">
                <Title level={2}>2. Data We Collect</Title>
                <Paragraph>
                  The information we collect depends on who you are and how you interact with our
                  platform.
                </Paragraph>

                <Title level={3}>2.1 Customers chatting via Facebook Messenger</Title>
                <Paragraph>
                  When you message a Merchant's Facebook Page that uses Mira AI, we receive the
                  following from Meta:
                </Paragraph>
                <ul>
                  <li>
                    Your <Text strong>Page-Scoped ID (PSID)</Text> — a Meta-issued identifier that
                    is unique to that Page and not your real Facebook account ID.
                  </li>
                  <li>
                    Your <Text strong>first name and last name</Text> from your Facebook public
                    profile, when the Merchant's Page is granted{' '}
                    <Text code>public_profile</Text> access by you.
                  </li>
                  <li>
                    The <Text strong>content of the messages</Text> you send to the Page, along
                    with any attachments and standard message metadata (timestamps, message IDs).
                  </li>
                </ul>

                <Title level={3}>2.2 Customers using the Mira web chat widget</Title>
                <Paragraph>
                  When you chat with a Merchant through the Mira web widget embedded on their
                  website, we collect:
                </Paragraph>
                <ul>
                  <li>
                    A <Text strong>browser-generated session ID</Text> stored in your browser to
                    keep the conversation continuous.
                  </li>
                  <li>
                    The <Text strong>content of your chat messages</Text> with the Merchant's bot.
                  </li>
                  <li>
                    Optional information you choose to provide, such as your{' '}
                    <Text strong>phone number</Text> (for order verification),{' '}
                    <Text strong>name</Text>, and <Text strong>shipping address</Text>, when you
                    place an order through the widget.
                  </li>
                </ul>

                <Title level={3}>2.3 Order and payment data</Title>
                <Paragraph>
                  When an order is placed through a Merchant's bot, we record:
                </Paragraph>
                <ul>
                  <li>Items, variants, quantities, and prices.</li>
                  <li>Shipping address and contact details you provided.</li>
                  <li>
                    Mobile Financial Service (MFS) transaction identifiers you submit (for
                    example, bKash or Nagad TrxIDs) so the Merchant can verify your payment. We do
                    not receive or store your MFS account password or PIN.
                  </li>
                </ul>

                <Title level={3}>2.4 Merchants using the Mira dashboard</Title>
                <Paragraph>
                  When you sign up as a Merchant we collect:
                </Paragraph>
                <ul>
                  <li>Your email address and a salted, hashed password.</li>
                  <li>Your business name and basic profile information.</li>
                  <li>
                    Your <Text strong>Facebook Page access token</Text>, granted to us via Facebook
                    Login for Business, so that we can receive webhooks and send replies on your
                    behalf through the Meta Graph API.
                  </li>
                  <li>
                    Operational data generated by your use of the dashboard — for example, product
                    catalog entries, bot configuration, and chat session metadata.
                  </li>
                </ul>

                <Title level={3}>2.5 Chat logs</Title>
                <Paragraph>
                  We maintain a persistent log of conversations handled by the bot so that the
                  Merchant can review history, train the AI, and resolve customer support issues.
                  These logs are stored under the Merchant account that the conversation belongs
                  to.
                </Paragraph>

                <Title level={3}>2.6 Technical and diagnostic data</Title>
                <Paragraph>
                  As is standard for any web service, our servers automatically receive certain
                  technical information such as IP address, user agent, and timestamps. We use
                  Sentry to capture error reports, which may include stack traces and limited
                  context from the request that failed.
                </Paragraph>
              </section>

              <Divider />

              {/* 3. How We Use It */}
              <section id="how-we-use-it">
                <Title level={2}>3. How We Use Your Data</Title>
                <Paragraph>We use the data described above to:</Paragraph>
                <ul>
                  <li>
                    Operate the chatbot: route your message to the correct Merchant, generate an
                    AI response, and send replies back to you on the channel you used.
                  </li>
                  <li>
                    Process orders: calculate totals, hand off shipping information to the
                    Merchant, and help reconcile MFS payments.
                  </li>
                  <li>
                    Provide the Merchant dashboard: show conversations, analytics, order status,
                    and notifications to the Merchant who serves you.
                  </li>
                  <li>
                    Improve the service: monitor performance, debug errors, and tune AI prompts.
                    We do not sell your data or use it to train third-party foundation models.
                  </li>
                  <li>
                    Comply with legal obligations and respond to lawful requests from competent
                    authorities.
                  </li>
                </ul>
                <Paragraph>
                  Our legal bases for processing are: (a) <Text strong>performance of a contract</Text>{' '}
                  with the Merchant whose service you are using; (b){' '}
                  <Text strong>legitimate interests</Text> in operating and securing the platform;
                  and (c) your <Text strong>consent</Text>, where consent is the appropriate basis
                  (for example, optional profile fields you fill in).
                </Paragraph>
              </section>

              <Divider />

              {/* 4. Sub-processors */}
              <section id="subprocessors">
                <Title level={2}>4. Sub-processors</Title>
                <Paragraph>
                  We rely on a small number of trusted third-party service providers
                  ("sub-processors") to deliver the Mira platform. Each is bound by its own
                  privacy and security commitments. The current list is:
                </Paragraph>

                <Card size="small" style={{ marginBottom: 16 }}>
                  <ul style={{ marginBottom: 0 }}>
                    <li>
                      <Text strong>Amazon Web Services (AWS)</Text> — application hosting, object
                      storage for product images and uploads, and in-memory cache for session
                      state. Data is hosted in AWS regions selected for latency and availability.
                    </li>
                    <li>
                      <Text strong>Large language model (LLM) provider</Text> — generates AI
                      responses. Message content is transmitted to our LLM provider for the sole
                      purpose of producing a reply. Processing may occur outside Bangladesh. We do
                      not authorize our LLM provider to retain your data for model training
                      beyond what is required to produce the API response.
                    </li>
                    <li>
                      <Text strong>Meta Platforms</Text> — Messenger Platform and Graph API.
                      Inbound messages reach us via Meta webhooks, and outbound replies are sent
                      back through the Graph API.
                    </li>
                    <li>
                      <Text strong>Google Firebase Cloud Messaging (FCM)</Text> — used to send
                      push notifications to Merchants in the dashboard (for example, when a new
                      message arrives).
                    </li>
                    <li>
                      <Text strong>Error monitoring provider</Text> — error and performance
                      monitoring. May capture stack traces and limited request context when an
                      error occurs.
                    </li>
                    <li>
                      <Text strong>SMS gateway</Text> — SMS delivery for one-time passwords (OTPs)
                      and operational notifications to Bangladesh mobile numbers.
                    </li>
                  </ul>
                </Card>

                <Paragraph>
                  We will update this list when we add, remove, or replace a sub-processor.
                </Paragraph>
              </section>

              <Divider />

              {/* 5. Data Sharing */}
              <section id="data-sharing">
                <Title level={2}>5. Data Sharing</Title>
                <Paragraph>
                  We share personal information only in the following limited circumstances:
                </Paragraph>
                <ul>
                  <li>
                    <Text strong>With the Merchant you are chatting with.</Text> If you message a
                    Merchant's bot, that Merchant can see the contents of your conversation, your
                    profile information shared with their Page, and any order or contact details
                    you provided to them. Each Merchant is independently responsible for how they
                    use that information.
                  </li>
                  <li>
                    <Text strong>With our sub-processors</Text> listed in Section 4, strictly to
                    deliver the service.
                  </li>
                  <li>
                    <Text strong>For legal reasons</Text> — to comply with applicable law, lawful
                    requests from authorities, or to protect the rights, property, or safety of
                    Mira AI, our users, or the public.
                  </li>
                  <li>
                    <Text strong>In the event of a business transfer</Text> — for example, a
                    merger, acquisition, or sale of assets — in which case any successor will be
                    bound by commitments at least as protective as this Policy.
                  </li>
                </ul>
                <Paragraph>
                  <Text strong>We do not sell your personal information.</Text>
                </Paragraph>
              </section>

              <Divider />

              {/* 6. Retention */}
              <section id="retention">
                <Title level={2}>6. Data Retention</Title>
                <ul>
                  <li>
                    <Text strong>Chat logs</Text> are retained for the lifetime of the Merchant
                    account that the conversation belongs to. They can be deleted earlier upon
                    request from either you or the Merchant (see Section 7).
                  </li>
                  <li>
                    <Text strong>Order records</Text> are retained for as long as needed to
                    fulfil the order and to comply with Merchant record-keeping obligations.
                  </li>
                  <li>
                    <Text strong>Session state</Text> in Redis is retained on a sliding 7-day TTL
                    and is automatically expired.
                  </li>
                  <li>
                    <Text strong>Merchant account data</Text> is retained while the account is
                    active and for a reasonable period afterwards to handle billing, disputes,
                    and legal obligations.
                  </li>
                  <li>
                    <Text strong>Diagnostic data</Text> (Sentry error events) is retained on the
                    default retention window provided by Sentry.
                  </li>
                </ul>
              </section>

              <Divider />

              {/* 7. User Rights */}
              <section id="user-rights">
                <Title level={2}>7. Your Rights</Title>
                <Paragraph>
                  Subject to applicable law, you have the following rights with respect to your
                  personal data:
                </Paragraph>
                <ul>
                  <li>
                    <Text strong>Right of access</Text> — you can request a copy of the personal
                    data we hold about you by emailing{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </li>
                  <li>
                    <Text strong>Right of deletion</Text> — you can ask us to delete your data.
                    For data we receive from Meta (Facebook Messenger conversations), Meta also
                    requires that we expose a Data Deletion Callback. Our callback endpoint is:
                    <br />
                    <Text code>
                      https://{PRIMARY_DOMAIN}/api/v1/integrations/facebook/data-deletion-callback/
                    </Text>
                    <br />
                    You can also trigger deletion of your Mira data tied to your Facebook account
                    from your Facebook Settings &rarr; Apps and Websites &rarr; Mira AI &rarr;
                    Remove. We will process the callback and confirm completion.
                  </li>
                  <li>
                    <Text strong>Right to correct</Text> — you can ask us to fix inaccurate
                    information we hold about you.
                  </li>
                  <li>
                    <Text strong>Right to object or restrict</Text> — you can object to or ask us
                    to restrict certain processing activities. Note that this may limit our
                    ability to provide the service to you.
                  </li>
                  <li>
                    <Text strong>Right to withdraw consent</Text> — where we rely on your consent,
                    you can withdraw it at any time. Withdrawal does not affect the lawfulness of
                    processing carried out before withdrawal.
                  </li>
                  <li>
                    <Text strong>Right to lodge a complaint</Text> — if you believe we have
                    handled your data improperly, you may lodge a complaint with a competent data
                    protection authority in your jurisdiction.
                  </li>
                </ul>
                <Paragraph>
                  To exercise any of these rights, email us at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with enough information
                  for us to identify your records (for example, the Page or Merchant you
                  interacted with and the approximate date). We will respond within a reasonable
                  timeframe.
                </Paragraph>
              </section>

              <Divider />

              {/* 8. Cookies */}
              <section id="cookies">
                <Title level={2}>8. Cookies and Local Storage</Title>
                <Paragraph>
                  Mira AI uses cookies and browser local storage in limited ways:
                </Paragraph>
                <ul>
                  <li>
                    <Text strong>Authentication cookies / JWT tokens</Text> to keep Merchants
                    logged in to the dashboard.
                  </li>
                  <li>
                    <Text strong>Session identifiers</Text> generated by the web chat widget so a
                    visitor's conversation persists across page reloads.
                  </li>
                  <li>
                    <Text strong>Preference data</Text>, such as UI theme.
                  </li>
                </ul>
                <Paragraph>
                  We do not currently use cross-site tracking cookies or third-party advertising
                  cookies. You can clear cookies and local storage from your browser at any time;
                  doing so will sign you out of the dashboard and start a new chat session in the
                  web widget.
                </Paragraph>
              </section>

              <Divider />

              {/* 9. Children's Privacy */}
              <section id="children">
                <Title level={2}>9. Children's Privacy</Title>
                <Paragraph>
                  The Mira AI platform is intended for use by businesses and adult consumers. It
                  is not directed at children under the age of 13 (or the equivalent minimum age
                  in your jurisdiction). We do not knowingly collect personal information from
                  children. If you believe a child has provided us with personal information,
                  please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
                  we will delete it.
                </Paragraph>
              </section>

              <Divider />

              {/* 10. Changes */}
              <section id="changes">
                <Title level={2}>10. Changes to This Policy</Title>
                <Paragraph>
                  We may update this Privacy Policy from time to time to reflect changes in our
                  practices or for other operational, legal, or regulatory reasons. When we do,
                  we will revise the "Last updated" date at the top of this page. For material
                  changes that affect how we use your personal information, we will provide a
                  more prominent notice — for example, an in-product banner or an email to
                  registered Merchants.
                </Paragraph>
                <Paragraph>
                  Continued use of the Mira AI platform after a revised policy becomes effective
                  constitutes your acceptance of the updated terms.
                </Paragraph>
              </section>

              <Divider />

              {/* 11. Contact */}
              <section id="contact">
                <Title level={2}>11. Contact Us</Title>
                <Paragraph>
                  If you have any questions, concerns, or requests related to this Privacy Policy
                  or your personal data, please contact us:
                </Paragraph>
                <Paragraph>
                  <Text strong>Grayscale Technologies</Text>
                  <br />
                  Email:{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  <br />
                  Website:{' '}
                  <a href={`https://${PRIMARY_DOMAIN}`} target="_blank" rel="noopener noreferrer">
                    {PRIMARY_DOMAIN}
                  </a>
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: 13 }}>
                  This page is also linked from our Facebook App configuration as the official
                  Privacy Policy URL required by Meta App Review.
                </Paragraph>
              </section>
            </Typography>

            <Divider />

            <div className="text-center text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Back to home
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
