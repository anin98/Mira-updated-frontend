import { Typography, Divider, Anchor } from 'antd'
import { ScrollText, Mail, MapPin } from 'lucide-react'

const { Title, Paragraph, Text } = Typography

const LAST_UPDATED = '2026-05-21'
const COMPANY_NAME = 'Grayscale Technologies'
const CONTACT_EMAIL = 'contact@grayscale-technologies.com'
const PRIMARY_DOMAIN = 'mira-ai.grayscale-technologies.com'

const sections = [
  { key: 'acceptance', href: '#acceptance', title: '1. Acceptance of Terms' },
  { key: 'service', href: '#service', title: '2. Service Description' },
  { key: 'accounts', href: '#accounts', title: '3. Account Registration' },
  { key: 'acceptable-use', href: '#acceptable-use', title: '4. Acceptable Use' },
  { key: 'merchant-responsibilities', href: '#merchant-responsibilities', title: '5. Merchant Responsibilities' },
  { key: 'ip', href: '#ip', title: '6. Intellectual Property' },
  { key: 'payment', href: '#payment', title: '7. Payment and Fees' },
  { key: 'third-party', href: '#third-party', title: '8. Third-Party Services' },
  { key: 'disclaimers', href: '#disclaimers', title: '9. Disclaimers' },
  { key: 'liability', href: '#liability', title: '10. Limitation of Liability' },
  { key: 'termination', href: '#termination', title: '11. Termination' },
  { key: 'governing-law', href: '#governing-law', title: '12. Governing Law and Dispute Resolution' },
  { key: 'changes', href: '#changes', title: '13. Changes to These Terms' },
  { key: 'contact', href: '#contact', title: '14. Contact' },
]

export default function TermsOfService() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="section gradient-bg-subtle">
        <div className="container-custom text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ScrollText size={16} />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            The agreement between you and {COMPANY_NAME} for use of the Mira AI Chatbot
            platform.
          </p>
          <Text type="secondary">Last updated: {LAST_UPDATED}</Text>
        </div>
      </section>

      {/* Body */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_3fr] gap-10 max-w-6xl mx-auto">
            {/* Table of Contents (sticky on large screens) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <Title level={5} style={{ marginBottom: 12 }}>
                  On this page
                </Title>
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

            {/* Content */}
            <article className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-10">
              <Typography>
                <Paragraph>
                  Welcome to Mira AI Chatbot ("<Text strong>Mira</Text>", "<Text strong>we</Text>",
                  "<Text strong>our</Text>", or "<Text strong>us</Text>"), a service operated by{' '}
                  <Text strong>{COMPANY_NAME}</Text>, a company organized under the laws of
                  Bangladesh. These Terms of Service (the "<Text strong>Terms</Text>") govern your
                  access to and use of the Mira platform, including our website at{' '}
                  <Text code>{PRIMARY_DOMAIN}</Text>, our merchant dashboard, our web chat widget,
                  our Facebook Messenger integration, and any related APIs, software, and services
                  (collectively, the "<Text strong>Service</Text>").
                </Paragraph>
                <Paragraph>
                  Please read these Terms carefully. By accessing or using the Service, you agree to
                  be bound by these Terms. If you do not agree, you may not access or use the
                  Service.
                </Paragraph>

                <Divider />

                {/* 1. Acceptance of Terms */}
                <Title level={2} id="acceptance">
                  1. Acceptance of Terms
                </Title>
                <Paragraph>
                  By creating an account, connecting a Facebook Page, embedding our web chat widget,
                  or otherwise interacting with the Service, you confirm that you have read,
                  understood, and accepted these Terms. If you are using the Service on behalf of an
                  organization, you represent that you have the authority to bind that organization
                  to these Terms, and in that case "you" refers to both you and that organization.
                </Paragraph>
                <Paragraph>
                  These Terms apply to two categories of users:
                </Paragraph>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>
                    <Text strong>Merchants</Text> — businesses or individuals who register a Mira
                    account, configure an AI assistant, and use the Service to communicate with
                    their own customers.
                  </li>
                  <li>
                    <Text strong>End Customers</Text> — individuals who interact with a Merchant's
                    AI assistant through Facebook Messenger or a Mira-powered web chat widget on a
                    Merchant's website.
                  </li>
                </ul>

                {/* 2. Service Description */}
                <Title level={2} id="service">
                  2. Service Description
                </Title>
                <Paragraph>
                  Mira provides AI chatbot infrastructure designed primarily for small and medium
                  businesses in Bangladesh. The Service includes, without limitation:
                </Paragraph>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>Hosting of Merchant product catalogs, including images, descriptions, and prices in Bangladeshi Taka (BDT).</li>
                  <li>An AI-powered conversational agent that responds to End Customer messages on behalf of the Merchant.</li>
                  <li>Inbound and outbound messaging through Facebook Messenger and a Mira-hosted web chat widget.</li>
                  <li>Order intake supporting Cash on Delivery (COD) and Mobile Financial Services (MFS) such as bKash and Nagad.</li>
                  <li>A Merchant dashboard exposing conversation history, basic analytics, and order management.</li>
                </ul>
                <Paragraph>
                  We may add, remove, or modify features at any time. Where a change materially
                  reduces the functionality of the Service, we will make reasonable efforts to
                  notify active Merchants.
                </Paragraph>

                {/* 3. Account Registration */}
                <Title level={2} id="accounts">
                  3. Account Registration
                </Title>
                <Paragraph>
                  To use the Merchant-facing features of the Service, you must create an account.
                  When you do so, you agree that:
                </Paragraph>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>You are at least 18 years old, or the legal age of majority in your jurisdiction.</li>
                  <li>You are the owner of, or an authorized representative of, the business you are registering.</li>
                  <li>The information you provide (business name, contact details, Facebook Page, payment information, etc.) is accurate, current, and complete, and you will keep it updated.</li>
                  <li>You are responsible for safeguarding your account credentials and for all activity that occurs under your account.</li>
                  <li>You will notify us promptly at <Text code>{CONTACT_EMAIL}</Text> if you become aware of any unauthorized use of your account.</li>
                </ul>
                <Paragraph>
                  End Customers are not required to register a Mira account in order to chat with a
                  Merchant's AI assistant. End Customer interactions are governed by these Terms
                  and our Privacy Policy.
                </Paragraph>

                {/* 4. Acceptable Use */}
                <Title level={2} id="acceptable-use">
                  4. Acceptable Use
                </Title>
                <Paragraph>You agree not to use the Service to:</Paragraph>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>Send unsolicited bulk messages, spam, or any content that violates anti-spam or anti-marketing laws.</li>
                  <li>Promote, sell, or facilitate the sale of illegal goods or services, including counterfeit products, controlled substances, or anything prohibited under Bangladeshi law or the policies of any platform we integrate with (such as Meta).</li>
                  <li>Harass, threaten, defraud, or impersonate any person or entity.</li>
                  <li>Use the AI assistant to deceive End Customers, fabricate orders, run scams, run phishing campaigns, or extract money or sensitive data under false pretenses.</li>
                  <li>Attempt to reverse-engineer, decompile, or otherwise discover the source code of the Service, except to the extent expressly permitted by law.</li>
                  <li>Probe, scan, or test the vulnerability of the Service or attempt to bypass any security or rate-limiting feature.</li>
                  <li>Use the Service to train a competing AI model, build a competing product, or scrape data from the platform in bulk.</li>
                  <li>Upload or transmit viruses, malware, or other malicious code.</li>
                  <li>Violate any applicable law or regulation, including data protection laws, consumer protection laws, and tax laws.</li>
                </ul>
                <Paragraph>
                  We reserve the right to investigate suspected violations and to suspend or
                  terminate accounts that breach this section.
                </Paragraph>

                {/* 5. Merchant Responsibilities */}
                <Title level={2} id="merchant-responsibilities">
                  5. Merchant Responsibilities
                </Title>
                <Paragraph>
                  Merchants use the Service to interact with their own customers. Because those
                  interactions happen on platforms we do not own (such as Facebook Messenger) and
                  involve the Merchant's own business, the Merchant has specific responsibilities:
                </Paragraph>
                <Title level={4}>5.1 Meta Platform Compliance</Title>
                <Paragraph>
                  When you connect a Facebook Page to Mira, you authorize Mira to send and receive
                  messages on behalf of that Page. You remain responsible for complying with all
                  applicable Meta policies, including the{' '}
                  <Text strong>Meta Platform Terms</Text>, the{' '}
                  <Text strong>Messenger Platform Policy</Text>, the{' '}
                  <Text strong>Community Standards</Text>, and any messaging-window rules (such as
                  the 24-hour standard messaging window and approved message tags). A violation of
                  Meta's policies by you may result in restriction or removal of your Page by Meta
                  and may also result in suspension of your Mira account.
                </Paragraph>
                <Title level={4}>5.2 Accurate Product Information and Pricing</Title>
                <Paragraph>
                  You are responsible for the accuracy of all product information, images,
                  descriptions, prices (in BDT), variants, stock status, and delivery details you
                  upload to the Service. The AI assistant will quote prices and availability from
                  the data you provide; if that data is wrong, the resulting conversations and
                  orders will be wrong, and Mira is not liable for that.
                </Paragraph>
                <Title level={4}>5.3 Honoring Orders</Title>
                <Paragraph>
                  Orders placed through the Service — including COD and MFS orders — create a sales
                  relationship between the Merchant and the End Customer. The Merchant is solely
                  responsible for fulfilling those orders, collecting payment, issuing refunds, and
                  handling customer service after the order is placed. Mira facilitates the
                  conversation and the order capture; we do not act as the merchant of record.
                </Paragraph>
                <Title level={4}>5.4 Your Own Privacy and Compliance Obligations</Title>
                <Paragraph>
                  If you collect personal data from End Customers beyond what Mira collects through
                  the Service (for example, by asking for additional information in chat or by
                  exporting conversation data), you are responsible for that data and for any
                  privacy policy, consent, or regulatory obligations that apply to it. We recommend
                  that you publish your own privacy policy explaining how you handle End Customer
                  data.
                </Paragraph>
                <Title level={4}>5.5 AI Output</Title>
                <Paragraph>
                  The AI assistant generates responses on your behalf based on the configuration and
                  product data you provide. You acknowledge that you remain responsible for these
                  responses as if you had sent them yourself, including any claims they make, any
                  prices they quote, and any commitments they appear to create.
                </Paragraph>

                {/* 6. Intellectual Property */}
                <Title level={2} id="ip">
                  6. Intellectual Property
                </Title>
                <Paragraph>
                  <Text strong>Mira's IP.</Text> The Service — including the platform, the
                  dashboard, the underlying software, the AI orchestration logic, the documentation,
                  and the Mira brand — is owned by {COMPANY_NAME} and its licensors and is protected
                  by copyright, trademark, and other applicable laws. We grant you a limited,
                  non-exclusive, non-transferable, revocable license to use the Service in
                  accordance with these Terms.
                </Paragraph>
                <Paragraph>
                  <Text strong>Your content.</Text> You retain ownership of the content you upload
                  to the Service, including product information, images, descriptions, business
                  logos, and any other materials you provide ("<Text strong>Merchant Content</Text>
                  "). You grant Mira a worldwide, non-exclusive, royalty-free license to host,
                  store, transmit, display, and process the Merchant Content solely for the purpose
                  of providing and improving the Service to you. This license ends when you delete
                  the relevant content or close your account, except where retention is required by
                  law or by our legitimate operational needs (for example, in order backups for a
                  reasonable period).
                </Paragraph>
                <Paragraph>
                  <Text strong>Feedback.</Text> If you send us suggestions, ideas, or feedback about
                  the Service, you grant us a perpetual, royalty-free license to use that feedback
                  without obligation to you.
                </Paragraph>

                {/* 7. Payment */}
                <Title level={2} id="payment">
                  7. Payment and Fees
                </Title>
                <Paragraph>
                  The Service is currently offered free of charge during our launch and early
                  access phase. We reserve the right to introduce paid plans and to charge fees for
                  the Service or for specific features in the future. If we introduce paid plans,
                  we will provide advance notice and will not start charging existing Merchants
                  retroactively for use of features that were previously free. Any future paid
                  plans will be governed by additional terms that we will publish at that time.
                </Paragraph>
                <Paragraph>
                  Where the Service handles payments from End Customers (for example, MFS payments
                  via bKash or Nagad), funds flow according to the configuration of the relevant
                  MFS provider and the Merchant's own account with that provider. Mira does not
                  hold End Customer funds and is not a payment processor.
                </Paragraph>

                {/* 8. Third-Party Services */}
                <Title level={2} id="third-party">
                  8. Third-Party Services
                </Title>
                <Paragraph>
                  The Service integrates with and depends on third-party providers, including but
                  not limited to:
                </Paragraph>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li><Text strong>Meta Platforms, Inc.</Text> — Facebook Page connection, Messenger messaging, and login.</li>
                  <li><Text strong>AI model providers</Text> — language model inference used by the AI assistant.</li>
                  <li><Text strong>Amazon Web Services (AWS)</Text> — hosting, storage, and caching infrastructure.</li>
                  <li><Text strong>Mobile Financial Services (MFS) providers</Text> such as bKash and Nagad — payment collection.</li>
                </ul>
                <Paragraph>
                  Your use of the Service may be subject to the terms and policies of these
                  third-party providers, and your relationship with them is independent of your
                  relationship with us. Mira is not responsible for the availability, accuracy, or
                  behavior of any third-party service, and we are not liable for any losses caused
                  by an outage, change in policy, or other action of a third-party provider.
                </Paragraph>

                {/* 9. Disclaimers */}
                <Title level={2} id="disclaimers">
                  9. Disclaimers
                </Title>
                <Paragraph>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTIES OF ANY
                  KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE
                  LAW, MIRA AND {COMPANY_NAME.toUpperCase()} DISCLAIM ALL WARRANTIES, INCLUDING ANY
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                  NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF
                  TRADE.
                </Paragraph>
                <Paragraph>
                  We do not warrant that the Service will be uninterrupted, error-free, secure, or
                  free of harmful components, or that any defects will be corrected. AI-generated
                  responses may contain mistakes, hallucinated facts, incorrect prices, or
                  out-of-date information. You are responsible for reviewing AI output and for any
                  decisions or commitments made on the basis of it.
                </Paragraph>
                <Paragraph>
                  Nothing in these Terms is intended to exclude any warranty or right that cannot
                  be excluded under applicable law.
                </Paragraph>

                {/* 10. Limitation of Liability */}
                <Title level={2} id="liability">
                  10. Limitation of Liability
                </Title>
                <Paragraph>
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL MIRA,{' '}
                  {COMPANY_NAME.toUpperCase()}, OR THEIR DIRECTORS, OFFICERS, EMPLOYEES, OR AGENTS
                  BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
                  DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS
                  OPPORTUNITY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE
                  THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </Paragraph>
                <Paragraph>
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL AGGREGATE LIABILITY
                  TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THE SERVICE OR THESE TERMS WILL
                  NOT EXCEED THE GREATER OF (A) THE AMOUNTS YOU HAVE PAID TO US FOR THE SERVICE
                  DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR
                  (B) BDT 5,000.
                </Paragraph>
                <Paragraph>
                  These limitations apply regardless of the legal theory on which the claim is
                  based, including contract, tort, negligence, or strict liability, and even if a
                  limited remedy fails of its essential purpose.
                </Paragraph>

                {/* 11. Termination */}
                <Title level={2} id="termination">
                  11. Termination
                </Title>
                <Paragraph>
                  <Text strong>Termination by you.</Text> You may stop using the Service at any
                  time. Merchants may close their account by contacting us at{' '}
                  <Text code>{CONTACT_EMAIL}</Text>.
                </Paragraph>
                <Paragraph>
                  <Text strong>Termination or suspension by us.</Text> We may suspend or terminate
                  your access to the Service, in whole or in part, at any time, with or without
                  notice, if we believe that:
                </Paragraph>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
                  <li>You have breached these Terms, including the Acceptable Use section.</li>
                  <li>You have breached the policies of a platform we integrate with (in particular Meta Platform Terms or Messenger Platform Policy).</li>
                  <li>Your use of the Service poses a security, legal, or reputational risk to us or to other users.</li>
                  <li>We are required to do so by law or by a regulator.</li>
                  <li>We are discontinuing the Service or a specific feature.</li>
                </ul>
                <Paragraph>
                  Upon termination, your right to use the Service ceases immediately. Sections of
                  these Terms that by their nature should survive termination — including
                  Intellectual Property, Disclaimers, Limitation of Liability, Governing Law, and
                  Contact — will survive.
                </Paragraph>

                {/* 12. Governing Law */}
                <Title level={2} id="governing-law">
                  12. Governing Law and Dispute Resolution
                </Title>
                <Paragraph>
                  These Terms and any dispute arising out of or related to them or to your use of
                  the Service are governed by the laws of the People's Republic of Bangladesh,
                  without regard to its conflict-of-laws rules.
                </Paragraph>
                <Paragraph>
                  We encourage you to contact us first at <Text code>{CONTACT_EMAIL}</Text> if you
                  have a concern; most issues can be resolved informally. If a dispute cannot be
                  resolved informally, you and {COMPANY_NAME} agree to attempt in good faith to
                  resolve it through negotiation. If negotiation fails, the dispute will be
                  submitted to the competent courts located in Bangladesh, which will have
                  exclusive jurisdiction, except where applicable law grants you a non-waivable
                  right to a different forum.
                </Paragraph>

                {/* 13. Changes */}
                <Title level={2} id="changes">
                  13. Changes to These Terms
                </Title>
                <Paragraph>
                  We may update these Terms from time to time to reflect changes in the Service, in
                  the law, or in our business. When we make material changes, we will update the
                  "Last updated" date at the top of this page and, where appropriate, notify active
                  Merchants by email or through the dashboard. Your continued use of the Service
                  after the changes take effect constitutes acceptance of the updated Terms. If you
                  do not agree to the updated Terms, you must stop using the Service.
                </Paragraph>

                {/* 14. Contact */}
                <Title level={2} id="contact">
                  14. Contact
                </Title>
                <Paragraph>
                  Questions, concerns, or notices regarding these Terms should be sent to:
                </Paragraph>
                <div className="bg-muted rounded-xl p-6 not-italic">
                  <div className="font-semibold mb-2">{COMPANY_NAME}</div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail size={16} />
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span>Bangladesh</span>
                  </div>
                </div>

                <Divider />

                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  By using the Mira AI Chatbot platform, you acknowledge that you have read and
                  agreed to these Terms of Service.
                </Paragraph>
              </Typography>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
