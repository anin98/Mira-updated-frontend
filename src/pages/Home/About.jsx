import { CheckCircle, ArrowRight, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const highlights = [
  'Founded by e-commerce and AI experts',
  'Powered by NVIDIA Inception Program',
  'Cutting-edge AI technology',
  'Built for businesses of all sizes',
]

export default function About() {
  return (
    <section id="about" className="section gradient-bg-subtle">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Building2 size={16} />
              About MIRA AI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Building the Future of{' '}
              <span className="gradient-text">Conversational Commerce</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              MIRA AI was born from a simple observation: e-commerce businesses lose significant revenue due to slow response times and limited support availability. Our AI-powered platform bridges this gap by providing instant, intelligent, and personalized shopping assistance.
            </p>
            <p className="text-muted-foreground mb-8">
              Our mission is to democratize AI-powered commerce, making enterprise-level conversational AI accessible to businesses of all sizes. Whether you're a small boutique or a large retailer, MIRA scales with your needs.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-8">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/company-auth"
              className="btn-primary px-6 py-3 inline-flex gap-2 group"
            >
              Join Our Growing Community
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Content - NVIDIA Inception Program */}
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-border text-center max-w-md">
              <div className="mb-6">
                {/* Placeholder for NVIDIA Inception Logo */}
                <div className=" rounded-xl flex items-center justify-center ">
                  <img src="/src/assets/nvidia-inception.png" alt="MIRA AI" className="w-50 h-50" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Powered by NVIDIA Inception</h3>
              <p className="text-muted-foreground mb-4">
                We're proud to be part of the NVIDIA Inception Program, gaining access to cutting-edge AI technology, expertise, and resources to accelerate our innovation.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                <CheckCircle size={16} />
                Official Member
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  )
}
