import { FaHtml5, FaCss3Alt, FaJava, FaReact, FaJs, FaGithub, FaPhp } from 'react-icons/fa'
import {
  SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiLaravel, SiPostgresql,
  SiFirebase, SiDocker, SiVite, SiVercel, SiNodedotjs, SiMysql, SiFlutter,
} from 'react-icons/si'
import { DiMsqlServer, DiPhotoshop } from 'react-icons/di'
import { TbBrandCSharp } from 'react-icons/tb'
import { MdTranslate } from 'react-icons/md'
import { LuMonitor, LuServer, LuDatabase, LuWrench } from 'react-icons/lu'
import styles from './Skills.module.css'

const groups = [
  {
    title: 'Front-end',
    icon: <LuMonitor />,
    color: '#61dafb',
    desc: 'Interfaces responsivas, componentes reutilizáveis e foco em usabilidade.',
    items: [
      { name: 'React', icon: <FaReact />, color: '#61dafb' },
      { name: 'Next.js', icon: <SiNextdotjs />, color: '#f0f0f0' },
      { name: 'TypeScript', icon: <SiTypescript />, color: '#3178c6' },
      { name: 'JavaScript', icon: <FaJs />, color: '#f7df1e' },
      { name: 'HTML 5', icon: <FaHtml5 />, color: '#e34f26' },
      { name: 'CSS 3', icon: <FaCss3Alt />, color: '#1572b6' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss />, color: '#38bdf8' },
    ],
  },
  {
    title: 'Back-end',
    icon: <LuServer />,
    color: '#777bb4',
    desc: 'Regras de negócio, APIs e integrações com serviços externos.',
    items: [
      { name: 'PHP', icon: <FaPhp />, color: '#777bb4' },
      { name: 'Laravel', icon: <SiLaravel />, color: '#ff2d20' },
      { name: 'Node.js', icon: <SiNodedotjs />, color: '#5fa04e' },
      { name: 'Java', icon: <FaJava />, color: '#f7c948' },
      { name: 'C#', icon: <TbBrandCSharp />, color: '#9b59b6' },
    ],
  },
  {
    title: 'Banco de dados',
    icon: <LuDatabase />,
    color: '#3ecf8e',
    desc: 'Modelagem, consultas complexas, migrations e relatórios personalizados.',
    items: [
      { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#4169e1' },
      { name: 'Supabase', icon: <SiSupabase />, color: '#3ecf8e' },
      { name: 'SQL Server', icon: <DiMsqlServer />, color: '#00aff0' },
      { name: 'MySQL', icon: <SiMysql />, color: '#00758f' },
      { name: 'Firebase', icon: <SiFirebase />, color: '#ffca28' },
    ],
  },
  {
    title: 'Ferramentas & outros',
    icon: <LuWrench />,
    color: '#ff9800',
    desc: 'Versionamento, deploy, containers, mobile e o que mais o projeto pedir.',
    items: [
      { name: 'Git & GitHub', icon: <FaGithub />, color: '#f0f0f0' },
      { name: 'Docker', icon: <SiDocker />, color: '#2496ed' },
      { name: 'Vite', icon: <SiVite />, color: '#a78bfa' },
      { name: 'Vercel', icon: <SiVercel />, color: '#f0f0f0' },
      { name: 'Flutter', icon: <SiFlutter />, color: '#54c5f8' },
      { name: 'Photoshop', icon: <DiPhotoshop />, color: '#31a8ff' },
      { name: 'Inglês técnico', icon: <MdTranslate />, color: '#ff9800' },
    ],
  },
]

export default function Skills() {
  return (
    <section className={styles.skills} id="skills">
      <div className={styles.header}>
        <p className={styles.label}>// conhecimentos</p>
        <h2 className={styles.title}>
          Meu <span className={styles.accent}>Stack</span>
        </h2>
      </div>

      <div className={styles.grid}>
        {groups.map((g) => (
          <div key={g.title} className={styles.card} style={{ '--clr': g.color }}>
            <div className={styles.cardTop}>
              <span className={styles.icon}>{g.icon}</span>
              <h3 className={styles.groupName}>{g.title}</h3>
              <span className={styles.count}>{String(g.items.length).padStart(2, '0')}</span>
            </div>
            <p className={styles.groupDesc}>{g.desc}</p>
            <ul className={styles.items}>
              {g.items.map((item) => (
                <li key={item.name} className={styles.item} style={{ '--ic': item.color }}>
                  <span className={styles.itemIcon}>{item.icon}</span>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
