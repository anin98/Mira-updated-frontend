import {
  MessageSquare,
  ShoppingBag,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Bot,
  Users,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: Bot,
    title: 'AI Sales Agent',
    description: 'Intelligent chatbot that understands customer intent, recommends products, and handles objections like a trained sales rep.',
    color: 'bg-blue-500',
  },
  {
    icon: ShoppingBag,
    title: 'Order Management',
    description: 'Seamless order tracking, inventory management, and automated fulfillment updates all in one place.',
    color: 'bg-green-500',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Deploy across WhatsApp, Facebook Messenger, Instagram, and your website with a single integration.',
    color: 'bg-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights into customer behavior, sales performance, and conversation metrics.',
    color: 'bg-orange-500',
  },
  {
    icon: Zap,
    title: 'Instant Responses',
    description: '24/7 availability with sub-second response times. Never miss a sale due to slow support.',
    color: 'bg-yellow-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption, GDPR compliance, and secure data handling for peace of mind.',
    color: 'bg-red-500',
  },
]

const controlModes = [
  {
    title: 'Co-Pilot Mode',
    description: 'AI assists your team by suggesting responses and handling routine queries while humans handle complex cases.',
    features: ['Human approval for orders', 'AI-suggested responses', 'Seamless handoff', 'Training mode'],
    icon: Users,
  },
  {
    title: 'Autopilot Mode',
    description: 'Fully autonomous AI handles everything from product discovery to checkout without human intervention.',
    features: ['Automatic order processing', 'Smart upselling', 'Payment handling', 'Follow-up messages'],
    icon: Bot,
  },
]

export default function Features() {
  return (
    <section id="features" className="section bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap size={16} />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="gradient-text">Automate Sales</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            MIRA AI combines cutting-edge artificial intelligence with e-commerce best practices to deliver an unmatched shopping experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-hover group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Control Modes */}
        <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Choose Your Control Level
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you want AI assistance or full automation, MIRA adapts to your business needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {controlModes.map((mode) => (
              <div
                key={mode.title}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <mode.icon size={24} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">{mode.title}</h4>
                </div>
                <p className="text-muted-foreground mb-6">{mode.description}</p>
                <ul className="space-y-3">
                  {mode.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <TrendingUp size={12} className="text-green-500" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
