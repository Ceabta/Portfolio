import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>
          <span className={styles.acc}>&lt;</span>LC<span className={styles.acc}>/&gt;</span>
        </span>
        <p className={styles.copy}>
          © {year} Leonardo Cesário
        </p>
        <div className={styles.links}>
          <a href="https://github.com/Ceabta" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/leonardocesarioat/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="mailto:leocesario.abta@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  )
}
