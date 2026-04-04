import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = [
  { label: 'Início', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projetos', href: '#work' },
  { label: 'Contato', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#home" className={styles.logo}>
        <span className={styles.logoAccent}>&lt;</span>LC
        <span className={styles.logoAccent}>/&gt;</span>
      </a>

      <nav className={`${styles.nav} ${open ? styles.open : ''}`}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={styles.link}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <button
        className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        <span /><span /><span />
      </button>
    </header>
  )
}
