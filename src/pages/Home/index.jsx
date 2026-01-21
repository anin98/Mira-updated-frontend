import Hero from './Hero'
import Features from './Features'
import About from './About'
import Contact from './Contact'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <About />
      <Contact />
    </div>
  )
}
