import { LuTrophy, LuDumbbell, LuBookOpen, LuBot } from 'react-icons/lu'
import styles from './Work.module.css'

const projects = [
  {
    num: '01',
    title: "Bolão da Família",
    desc: 'Bolão da Copa do Mundo para a família. Palpites por jogo, ranking automático e placares sincronizados em tempo real com a API football-data.org.',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'REST API'],
    url: 'https://bolao-familiacat.vercel.app/',
    repo: 'https://github.com/Ceabta/bolao-copa',
    notice: { type: 'warning', text: 'Site no ar · banco de dados pausado no momento' },
    image: '/projetos/bolao.jpg',
    icon: <LuTrophy />,
  },
  {
    num: '02',
    title: "Evoluto",
    desc: 'Site para acompanhamento de evolução na academia. Registre treinos, pesos e visualize seu progresso ao longo do tempo.',
    tags: ['React', 'Typescript', 'Tailwind CSS', 'Vite', 'Supabase'],
    url: '',
    repo: 'https://github.com/Ceabta/Evoluto',
    image: '/projetos/evoluto.jpg',
    icon: <LuDumbbell />,
  },
  {
    num: '03',
    title: "Read'n Play",
    desc: 'Aplicativo para estimular a leitura de livros através de gamificação. Registre suas leituras, avalie livros e descubra recomendações de outras pessoas.',
    tags: ['Flutter', 'FlutterFlow', 'Firebase'],
    url: 'https://telas-app-l2m3n5.flutterflow.app/login',
    repo: 'https://github.com/A-Marvulle/readnplay',
    notice: { type: 'info', text: 'TCC · IFSP Pirituba' },
    image: '/projetos/readnplay.jpg',
    icon: <LuBookOpen />,
  },
  {
    num: '04',
    title: 'Oráculo de Arton',
    desc: 'Bot de Discord para campanhas de Tormenta 20. Gerencia fichas de personagem (HP, Mana, Sanidade) e consulta magias direto no servidor, com paginação e confirmação em duas etapas.',
    tags: ['TypeScript', 'Node.js', 'Discord.js'],
    url: '',
    repo: 'https://github.com/Ceabta/Oraculo-de-Arton-Bot-Discord',
    notice: { type: 'wip', text: 'Em construção' },
    image: '',
    icon: <LuBot />,
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
            <div className={styles.thumb}>
              {p.image ? (
                <img src={p.image} alt={`Tela do projeto ${p.title}`} loading="lazy" />
              ) : (
                <span className={styles.thumbIcon} aria-hidden="true">{p.icon}</span>
              )}
            </div>
            <div className={styles.info}>
              <h3 className={styles.projectTitle}>{p.title}</h3>
              {p.notice && (
                <p className={`${styles.notice} ${styles[p.notice.type] ?? ''}`}>
                  <span className={styles.noticeDot} aria-hidden="true" />
                  {p.notice.text}
                </p>
              )}
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
                  Ver site ↗
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
