import { FaHtml5, FaCss3Alt, FaJava, FaReact, FaJs, FaGithub, FaWindows, FaPhp } from "react-icons/fa";
import { FaFlutter } from "react-icons/fa6";
import { DiMsqlServer } from "react-icons/di";
import { DiPhotoshop } from "react-icons/di";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { TbBrandCSharp } from "react-icons/tb";
import { MdTranslate } from "react-icons/md";
import styles from './Skills.module.css'

const skills = [
  {
    name: 'JavaScript',
    level: 60,
    icon: <FaJs />,
    desc: 'Manipulação do DOM, lógica client-side e integração com frameworks modernos.',
    color: '#f7df1e',
  },
  {
    name: 'HTML 5',
    level: 60,
    icon: <FaHtml5 />,
    desc: 'Estruturação semântica de páginas web com foco em acessibilidade.',
    color: '#e34f26',
  },
  {
    name: 'CSS 3',
    level: 60,
    icon: <FaCss3Alt />,
    desc: 'Estilização responsiva, animações e layouts com Flexbox e Grid.',
    color: '#1572b6',
  },
  {
    name: 'Java',
    level: 60,
    icon: <FaJava />,
    desc: 'POO, estruturas de dados, lógica de negócio e aplicações desktop.',
    color: '#f7c948',
  },
  {
    name: 'MySQL & SQLServer',
    level: 60,
    icon: <DiMsqlServer />,
    desc: 'Modelagem, consultas, joins e desenvolvimento de relatórios personalizados.',
    color: '#00aff0',
  },
  {
    name: 'C & C#',
    level: 60,
    icon: <TbBrandCSharp />,
    desc: 'Programação estruturada e desenvolvimento com .NET/Windows Forms.',
    color: '#9b59b6',
  },
  {
    name: 'React',
    level: 60,
    icon: <FaReact />,
    desc: 'Componentes funcionais, hooks, estado e construção de UIs modernas.',
    color: '#61dafb',
  },
  {
    name: 'Flutter',
    level: 20,
    icon: <FaFlutter />,
    desc: 'Desenvolvimento mobile multiplataforma com Dart.',
    color: '#54c5f8',
  },
  {
    name: 'PHP',
    level: 60,
    icon: <FaPhp />,
    desc: 'Desenvolvimento back-end e integração com banco de dados.',
    color: '#777bb4',
  },
  {
    name: 'Pacote Office',
    level: 60,
    icon: <PiMicrosoftExcelLogo />,
    desc: 'Excel, Word e PowerPoint para produtividade e relatórios.',
    color: '#217346',
  },
  {
    name: 'Photoshop',
    level: 40,
    icon: <DiPhotoshop />,
    desc: 'Edição e tratamento de imagens para projetos visuais.',
    color: '#31a8ff',
  },
  {
    name: 'GitHub',
    level: 60,
    icon: <FaGithub />,
    desc: 'Versionamento de código, pull requests e colaboração em projetos.',
    color: '#f0f0f0',
  },
  {
    name: 'Windows',
    level: 60,
    icon: <FaWindows />,
    desc: 'Administração, configuração e suporte ao sistema operacional.',
    color: '#0078d4',
  },
  {
    name: 'Inglês',
    level: 60,
    icon: <MdTranslate />,
    desc: 'Leitura técnica, documentações e comunicação no contexto de TI.',
    color: '#ff9800',
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
        {skills.map((skill) => (
          <div key={skill.name} className={styles.card} style={{ '--clr': skill.color }}>
            <div className={styles.cardTop}>
              <span className={styles.icon}>{skill.icon}</span>
              <div className={styles.bar}>
                <div
                  className={styles.barFill}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <span className={styles.percent}>{skill.level}%</span>
            </div>
            <h3 className={styles.skillName}>{skill.name}</h3>
            <p className={styles.skillDesc}>{skill.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
