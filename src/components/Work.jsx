import styles from './Work.module.css'

const projects = [
  {
    num: '01',
    title: "HORIZON",
    desc: 'Site para controle de tarefas e organização. Foco em design moderno, responsivo e usabilidade.',
    tags: ['JS', 'React', 'Typescript', 'Tailwind CSS', 'Vite', 'Supabase'],
    url: 'https://horizon-gestao-demo.vercel.app',
    repo: 'https://github.com/Ceabta/Horizon',
  },
  {
    num: '02',
    title: "Evoluto",
    desc: 'Site para acompanhamento de evolução na academia. Registre treinos, pesos e visualize seu progresso ao longo do tempo.',
    tags: ['React', 'Typescript', 'Tailwind CSS', 'Vite', 'Supabase'],
    url: '',
    repo: 'https://github.com/Ceabta/Evoluto',
  },
  {
    num: '03',
    title: "Read'n Play",
    desc: 'Aplicativo para estimular a leitura de livros através de gamificação. Registre suas leituras, avalie livros e descubra recomendações de outras pessoas.',
    tags: ['Flutter', 'FlutterFlow', 'Firebase'],
    url: 'https://telas-app-l2m3n5.flutterflow.app/login',
    repo: 'https://github.com/A-Marvulle/readnplay',
  },
]

export default function Work() {
  return (
    <section className={styles.work} id="work">
      <div className={styles.header}>
        <p className={styles.label}>// projetos</p>
        <h2 className={styles.title}>
          Meus <span className={styles.accent}>Projetos</span>
        </h2>
      </div>

      <div className={styles.list}>
        {projects.map((p, i) => (
          <article key={p.num} className={styles.item}>
            <div className={styles.numCol}>
              <span className={styles.num}>{p.num}</span>
            </div>
            <div className={styles.info}>
              <h3 className={styles.projectTitle}>{p.title}</h3>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
            <div className={styles.links}>
              {p.url && (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                  Demo ↗
                </a>
              )}
              <a href={p.repo} target="_blank" rel="noopener noreferrer" className={styles.linkGhost}>
                GitHub
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.more}>
        <a
          href="https://github.com/Ceabta?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.moreBtn}
        >
          Ver todos os repositórios →
        </a>
      </div>
    </section>
  )
}
