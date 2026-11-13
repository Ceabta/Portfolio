import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Christmas from './components/Christmas'
import { isChristmasSeason } from './components/ChristmasTree'
import About from './components/About'
import Skills from './components/Skills'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      {isChristmasSeason() && <Christmas />}
      <About />
      <Skills />
      <Work />
      <Contact />
      <Footer />
    </>
  )
}
