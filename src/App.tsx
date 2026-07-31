import { Rail } from './components/Rail'
import { Hero } from './components/Hero'
import { Education } from './components/Education'
import { Certification } from './components/Certification'
import { Coursework } from './components/Coursework'
import { Flagships } from './components/Flagships'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#education">
        Skip to content
      </a>
      <Rail />
      <Hero />
      <main>
        <Education />
        <Certification />
        <Coursework />
        <Flagships />
      </main>
      <Footer />
    </>
  )
}
