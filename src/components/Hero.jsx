import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.greeting}>
          <span className={styles.dot} /> Aberto a novos desafios
        </p>

        <h1 className={styles.title}>
          Leonardo<br />
          <span className={styles.outline}>Cesário</span>
        </h1>

        <p className={styles.role}>
          <span className={styles.mono}>{'{ '}</span>
          Programador & Analista de Sistemas
          <span className={styles.mono}>{' }'}</span>
        </p>

        <p className={styles.sub}>
          Analista de Desenv. de Sistema Junior pela <a href="https://www.linkedin.com/company/crescer-informatica/" target="_blank" rel="noopener noreferrer" className={styles.link}>Crescer Informática Ltda.</a> <br />
          Transformo ideias em código limpo, interfaces funcionais e soluções que fazem sentido.
        </p>

        <div className={styles.cta}>
          <a href="#work" className={styles.btnPrimary}>Ver Projetos</a>
          <a href="#contact" className={styles.btnSecondary}>Falar Comigo</a>
        </div>

        <div className={styles.stack}>
          {['React', 'Java', 'C#', 'HTML/CSS', 'MySQL'].map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      <div className={styles.decoration} aria-hidden="true">
        <div className={styles.ring} />
        <div className={styles.ring2} />
        <div className={styles.codeBlock}>
          <span className={styles.codeComment}>// olá, mundo</span>
          <span><span className={styles.codeKw}>const</span> dev = {'{'}</span>
          <span>&nbsp;&nbsp;nome: <span className={styles.codeStr}>'Leonardo'</span>,</span>
          <span>&nbsp;&nbsp;foco: <span className={styles.codeStr}>'Full Stack'</span>,</span>
          <span>&nbsp;&nbsp;café: <span className={styles.codeBool}>false</span></span>
          <span>{'}'}</span>
        </div>
      </div>
    </section>
  )
}
