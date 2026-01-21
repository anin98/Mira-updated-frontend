import { Link } from 'react-router-dom'
import {
  MessageSquare,
  ShoppingBag,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Bot,
  Users,
  ArrowRight,
  CheckCircle,
  TrendingDown,
  Clock,
  DollarSign,
} from 'lucide-react'

const problemStats = [
  { icon: TrendingDown, value: '67%', label: 'Revenue lost due to slow responses', color: 'text-red-500' },
  { icon: Clock, value: '12h', label: 'Average response time without AI', color: 'text-orange-500' },
  { icon: DollarSign, value: '35%', label: 'Cart abandonment from poor support', color: 'text-yellow-500' },
]

const features = [
  {
    icon: Bot,
    title: 'AI Sales Agent',
    description: 'Intelligent chatbot that understands customer intent, recommends products, and handles objections like a trained sales representative.',
    benefits: ['24/7 availability', 'Consistent responses', 'Scalable support', 'Multi-language support'],
    image: 'sales',
  },
  {
    icon: ShoppingBag,
    title: 'Order Management System',
    description: 'Seamless order tracking, inventory management, and automated fulfillment updates all integrated into your conversational interface.',
    benefits: ['Real-time tracking', 'Automated updates', 'Inventory sync', 'Return handling'],
    image: 'orders',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Deploy across WhatsApp, Facebook Messenger, Instagram, and your website with a single unified integration.',
    benefits: ['WhatsApp Business', 'Facebook Messenger', 'Instagram DMs', 'Web chat widget'],
    image: 'platforms',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights into customer behavior, sales performance, and conversation metrics to optimize your strategy.',
    benefits: ['Conversion tracking', 'Customer insights', 'Performance reports', 'A/B testing'],
    image: 'analytics',
  },
]

const useCases = [
  {
    title: 'E-commerce Stores',
    description: 'Automate product discovery, recommendations, and checkout process.',
    icon: ShoppingBag,
  },
  {
    title: 'Food & Restaurants',
    description: 'Handle orders, reservations, and menu inquiries automatically.',
    icon: '🍕',
  },
  {
    title: 'Fashion & Apparel',
    description: 'Provide style recommendations and size guidance.',
    icon: '👗',
  },
  {
    title: 'Electronics',
    description: 'Answer technical questions and compare products.',
    icon: '💻',
  },
]

export default function Features() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section gradient-bg-subtle">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap size={16} />
            Powerful Features
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Automate Sales</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            MIRA AI combines cutting-edge artificial intelligence with e-commerce best practices to deliver an unmatched shopping experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/company-auth" className="btn-primary px-8 py-4 text-base gap-2">
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="btn-outline px-8 py-4 text-base">
              Try Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Statistics */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {problemStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon size={32} className={`mx-auto mb-3 ${stat.color}`} />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Detail */}
      <section className="section">
        <div className="container-custom">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`grid lg:grid-cols-2 gap-12 items-center mb-20 last:mb-0 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-6">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                <ul className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 aspect-square flex items-center justify-center">
                  <feature.icon size={120} className="text-primary/30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Control Modes */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Control Level
            </h2>
            <p className="text-muted-foreground">
              Whether you want AI assistance or full automation, MIRA adapts to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Users size={28} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Co-Pilot Mode</h3>
              <p className="text-muted-foreground mb-6">
                AI assists your team by suggesting responses and handling routine queries while humans handle complex cases.
              </p>
              <ul className="space-y-3">
                {['Human approval for orders', 'AI-suggested responses', 'Seamless handoff', 'Training mode'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={18} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Bot size={28} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Autopilot Mode</h3>
              <p className="text-muted-foreground mb-6">
                Fully autonomous AI handles everything from product discovery to checkout without human intervention.
              </p>
              <ul className="space-y-3">
                {['Automatic order processing', 'Smart upselling', 'Payment handling', 'Follow-up messages'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle size={18} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Every Business
            </h2>
            <p className="text-muted-foreground text-lg">
              MIRA AI adapts to your industry with specialized capabilities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="card-hover text-center">
                <div className="text-4xl mb-4">
                  {typeof useCase.icon === 'string' ? useCase.icon : <useCase.icon size={40} className="mx-auto text-primary" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section gradient-bg text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join hundreds of businesses already using MIRA AI to automate their sales and delight customers.
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
