import { useEffect, useRef, useState } from 'react'
import { Link2, BookOpen, Zap } from 'lucide-react'

const steps = [
  {
    icon: Link2,
    title: 'Connect your Page',
    text: 'Mira links to the Facebook Page and Messenger inbox you already run. No new app for your customers to download.',
  },
  {
    icon: BookOpen,
    title: 'Feed her your catalog',
    text: 'Products, prices, sizes, delivery areas — the things you already answer forty times a day. Mira learns it once.',
  },
  {
    icon: Zap,
    title: 'She sells, around the clock',
    text: 'Mira greets, answers, qualifies, and closes orders in Bangla or English — while you handle the parts that need a human.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        steps.forEach((_, i) => {
          setTimeout(() => setLit((c) => Math.max(c, i + 1)), i * 380)
        })
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="section gradient-bg-subtle">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Going live takes an afternoon, <span className="gradient-text">not a rebuild</span>.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`card transition-all duration-500 ${
                i < lit ? 'opacity-100 translate-y-0 border-primary/40 shadow-md' : 'opacity-40 translate-y-3'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <step.icon size={20} className="text-primary" />
              </div>
              <div className="font-mono text-xs text-primary mb-2">0{i + 1}</div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
