import { useEffect, useRef, useState } from 'react'

const rows = [
  { who: 'Farhana', msg: 'available ache? size M?', t: '2m ago' },
  { who: 'Rakib', msg: 'delivery koto din lagbe?', t: '9m ago' },
  { who: 'Nusrat', msg: 'price koto ei ta?', t: '22m ago' },
  { who: 'Tanvir', msg: 'cash on delivery ache?', t: '41m ago' },
  { who: 'Ayesha', msg: 'ekhon order dile kobe pabo?', t: '1h ago' },
  { who: 'Shuvo', msg: 'still interested, replying?', t: '3h ago' },
]

export default function Problem() {
  const sectionRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [staleIds, setStaleIds] = useState([])
  const [lossCount, setLossCount] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        rows.forEach((_, i) => {
          setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), i * 380)
          setTimeout(() => {
            setStaleIds((prev) => [...prev, i])
            setLossCount((c) => c + 1)
          }, i * 380 + 1600)
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
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            This is what "I'll reply later" costs you.
          </h2>
          <p className="text-lg text-muted-foreground">
            A typical seller's inbox during one busy evening. Watch what happens to messages nobody gets to in time.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="w-2 h-2 rounded-full bg-border" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">Page Inbox — Sunset Sarees BD</span>
          </div>
          <div className="p-2 min-h-[300px]">
            {rows.slice(0, visibleCount).map((r, i) => {
              const stale = staleIds.includes(i)
              return (
                <div
                  key={r.who}
                  className={`flex items-center justify-between gap-4 px-3 py-3 my-1 rounded-lg border transition-colors duration-500 animate-fade-in ${
                    stale ? 'bg-destructive/5 border-destructive/30' : 'bg-muted border-transparent'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-sm">{r.who}</div>
                    <div className={`text-sm text-muted-foreground ${stale ? 'line-through decoration-destructive/50' : ''}`}>
                      {r.msg}
                    </div>
                  </div>
                  <div className={`font-mono text-xs whitespace-nowrap ${stale ? 'text-destructive' : 'text-primary'}`}>
                    {stale ? 'customer left' : r.t}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-10">
          <div className="font-mono text-5xl font-bold text-destructive">{lossCount}</div>
          <div className="text-muted-foreground">customers went cold before anyone replied</div>
        </div>
      </div>
    </section>
  )
}
