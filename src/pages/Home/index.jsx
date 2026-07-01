import Hero from './Hero'
import Problem from './Problem'
import Solution from './Solution'
import HowItWorks from './HowItWorks'
import Compare from './Compare'
import Features from './Features'
import About from './About'
import Contact from './Contact'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Compare />
      <Features />
      <About />
      <Contact />
    </div>
  )
}
