import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { key: 'reply', label: 'First reply', off: 'Hours', on: 'Seconds' },
  { key: 'coverage', label: 'Coverage', off: 'Business hours only', on: '24 hours, every day' },
  { key: 'missed', label: 'Messages missed overnight', off: 'Most of them', on: 'None — Mira replies instantly' },
  { key: 'repeat', label: 'Who answers repeat questions', off: 'You, every time', on: 'Mira, instantly' },
  { key: 'lead', label: 'Where a hot lead sits at 2am', off: 'In the unread pile', on: 'Already qualified & mid-order' },
]

export default function Compare() {
  const [isOn, setIsOn] = useState(false)

  return (
    <section className="section bg-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Flip the switch.</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Same shop. Same evening rush. Everything below changes the moment Mira takes the inbox.
        </p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-semibold transition-colors ${!isOn ? 'text-foreground' : 'text-muted-foreground'}`}>
            Without Mira
          </span>
          <button
            onClick={() => setIsOn((v) => !v)}
            aria-label="Toggle Mira on and off"
            className={`w-16 h-8 rounded-full relative transition-colors border border-border ${
              isOn ? 'bg-primary/15' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full transition-all ${
                isOn ? 'left-[35px] bg-primary' : 'left-0.5 bg-muted-foreground'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${isOn ? 'text-primary' : 'text-muted-foreground'}`}>
            With Mira
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-12">
          {stats.map((s) => (
            <div key={s.key} className="bg-muted border border-border rounded-xl p-5">
              <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
              <div className={`font-bold text-sm transition-colors ${isOn ? 'text-primary' : 'text-destructive'}`}>
                {isOn ? s.on : s.off}
              </div>
            </div>
          ))}
        </div>

        <Link to="/company-auth" className="btn-primary px-8 py-4 text-base inline-flex gap-2 group">
          Get this for my Page
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
