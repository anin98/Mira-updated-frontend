import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Zap, Building2, Crown, ArrowRight, HelpCircle } from 'lucide-react'
import { Tooltip } from 'antd'

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    period: 'forever',
    icon: Zap,
    color: 'border-gray-200',
    buttonClass: 'btn-secondary',
    features: [
      { text: '100 conversations/month', included: true },
      { text: '1 AI assistant', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Email support', included: true },
      { text: 'Web chat widget', included: true },
      { text: 'WhatsApp integration', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Standard',
    description: 'Best for growing businesses',
    price: 2999,
    period: 'month',
    icon: Building2,
    color: 'border-primary',
    popular: true,
    buttonClass: 'btn-primary',
    features: [
      { text: 'Unlimited conversations', included: true },
      { text: '3 AI assistants', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Web chat widget', included: true },
      { text: 'WhatsApp integration', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
      { text: 'Priority support', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large scale operations',
    price: null,
    period: 'custom',
    icon: Crown,
    color: 'border-accent',
    buttonClass: 'btn-outline',
    features: [
      { text: 'Unlimited conversations', included: true },
      { text: 'Unlimited AI assistants', included: true },
      { text: 'Custom analytics', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Web chat widget', included: true },
      { text: 'All platform integrations', included: true },
      { text: 'White-label solution', included: true },
      { text: 'Full API access', included: true },
      { text: 'SLA guarantee', included: true },
    ],
  },
]

const faqs = [
  {
    question: 'What happens when I exceed my conversation limit?',
    answer: 'On the Free plan, your AI will stop responding until the next month. We recommend upgrading to Standard for unlimited conversations.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bKash, Nagad, and bank transfers for enterprise customers.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! All paid plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What is included in the WhatsApp integration?',
    answer: 'Full WhatsApp Business API integration including message templates, quick replies, and media support.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.',
  },
]

const comparisons = [
  { feature: 'Conversations', free: '100/month', standard: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Assistants', free: '1', standard: '3', enterprise: 'Unlimited' },
  { feature: 'Team Members', free: '1', standard: '5', enterprise: 'Unlimited' },
  { feature: 'Analytics', free: 'Basic', standard: 'Advanced', enterprise: 'Custom' },
  { feature: 'Support', free: 'Email', standard: 'Priority', enterprise: '24/7 Dedicated' },
  { feature: 'Integrations', free: 'Web only', standard: 'All platforms', enterprise: 'Custom' },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section gradient-bg-subtle">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. Start free and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-full">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !annual ? 'bg-white shadow-sm' : ''
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                annual ? 'bg-white shadow-sm' : ''
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-green-600 font-semibold">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section -mt-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card relative ${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                    plan.popular ? 'gradient-bg' : 'bg-muted'
                  }`}>
                    <plan.icon size={28} className={plan.popular ? 'text-white' : 'text-primary'} />
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold">
                        ৳{annual ? Math.floor(plan.price * 0.8) : plan.price}
                      </span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold">Contact Us</span>
                  )}
                </div>

                <Link
                  to={plan.price !== null ? '/payment' : '/#contact'}
                  className={`${plan.buttonClass} w-full py-3 mb-6`}
                >
                  {plan.price !== null ? 'Get Started' : 'Contact Sales'}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={18} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <X size={18} className="text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? '' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section bg-muted">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Feature Comparison
          </h2>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4 bg-primary/5">Standard</th>
                  <th className="text-center p-4">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="text-center p-4">{row.free}</td>
                    <td className="text-center p-4 bg-primary/5">{row.standard}</td>
                    <td className="text-center p-4">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card">
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <HelpCircle size={18} className="text-primary" />
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Your Free Trial Today
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            No credit card required. Get started in minutes and see the difference AI can make.
          </p>
          <Link to="/company-auth" className="btn bg-white text-primary hover:bg-white/90 px-8 py-4 text-base gap-2">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
