import { useEffect, useRef, useState } from 'react'

const script = [
  { cls: 'customer', text: 'apu, ei saree ta ki stock e ache? size?' },
  { cls: 'system', text: 'Mira replied · 4 seconds later' },
  { cls: 'mira', text: 'Ji apu, available ache! Free size, one-size fits most. Color confirm korben — maroon na?' },
  { cls: 'customer', text: 'hae, maroon ta. delivery koto din?' },
  { cls: 'mira', text: 'Dhaka er moddhe 2 din, bahire 4-5 din lage. Cash on delivery ache, apni ki order confirm korte chan?' },
  { cls: 'customer', text: 'hae, confirm.' },
  { cls: 'mira', text: 'Order confirm! Delivery details ekhoni pathiye dicchi. Dhonnobad apu ❤️' },
  { cls: 'system', text: 'Order handed off · seller notified' },
]

export default function Solution() {
  const sectionRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [status, setStatus] = useState('typing…')

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        let delay = 0
        script.forEach((s, i) => {
          delay += s.cls === 'mira' ? 900 : 700
          setTimeout(() => {
            setStatus(i < script.length - 1 ? 'typing…' : 'online')
            setVisibleCount((c) => Math.max(c, i + 1))
          }, delay)
        })
      },
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="solution" ref={sectionRef} className="section bg-white">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Now watch <span className="gradient-text">Mira</span> take the same messages.
          </h2>
          <p className="text-lg text-muted-foreground">
            Same customer, same question, same busy evening. This time nobody waits.
          </p>
        </div>

        <div className="max-w-sm mx-auto bg-white border border-border rounded-3xl shadow-xl overflow-hidden">
          <div className="h-2 bg-muted" />
          <div className="flex items-center gap-3 px-4 py-3 bg-muted border-b border-border">
            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <div className="font-semibold text-sm">Mira — Sunset Sarees BD</div>
              <div className="text-xs font-mono text-primary">{status}</div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2 min-h-[360px]">
            {script.slice(0, visibleCount).map((s, i) => (
              <div
                key={i}
                className={
                  s.cls === 'customer'
                    ? 'self-start max-w-[78%] bg-muted rounded-2xl rounded-bl-sm px-4 py-2 text-sm animate-fade-in'
                    : s.cls === 'mira'
                    ? 'self-end max-w-[78%] bg-primary text-white font-medium rounded-2xl rounded-br-sm px-4 py-2 text-sm animate-fade-in'
                    : 'self-center text-xs font-mono text-muted-foreground animate-fade-in'
                }
              >
                {s.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
