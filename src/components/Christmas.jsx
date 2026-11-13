import ChristmasTree from './ChristmasTree'
import styles from './Christmas.module.css'

export default function Christmas() {
  const anoQueVem = new Date().getMonth() === 0 ? new Date().getFullYear() : new Date().getFullYear() + 1

  return (
    <section className={styles.section} id="natal">
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.label}>
            <span className={styles.dot} /> // temporada.especial
          </p>

          <h2 className={styles.title}>
            Boas<br />
            <span className={styles.outline}>Festas</span>
          </h2>

          <p className={styles.sub}>
            Que {anoQueVem} venha com menos bugs, builds verdes de primeira
            e deploys de sexta-feira que dão certo.
          </p>

          <pre className={styles.terminal}>
            <span className={styles.prompt}>$</span> git commit -m <span className={styles.str}>"feliz natal 🎄"</span>
            {'\n'}<span className={styles.ok}>✓</span> 1 file changed, ∞ insertions(+)
          </pre>
        </div>

        <ChristmasTree />
      </div>
    </section>
  )
}
