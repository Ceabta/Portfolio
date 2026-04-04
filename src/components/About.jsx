import styles from './About.module.css'

function getAge() {
  const today = new Date()
  const birthMonth = 9 
  const birthDay = 3
  const birthYear = 2003

  const hasTurnedThisYear =
    today.getMonth() + 1 > birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay)

  return today.getFullYear() - birthYear - (hasTurnedThisYear ? 0 : 1)
}

const experience = [
  {
    company: 'Crescer Informática Ltda',
    logo: '../public/logo-crescer.jfif',
    totalDuration: '3 anos 7 meses',
    roles: [
      {
        role: 'Analista de Desenv. de Sistema Junior',
        type: 'Tempo integral',
        period: 'set de 2025 — momento',
        duration: '8 meses',
        location: null,
        desc: null,
        tags: ['PHP', 'JavaScript', 'React', 'SQL', 'Laravel', 'PostgreSQL', 'TypeScript'],
      },
      {
        role: 'Helpdesk de TI',
        type: 'Tempo integral',
        period: 'jan de 2024 — set de 2025',
        duration: '1 ano 9 meses',
        location: 'São Paulo, Brasil · Remoto',
        desc: 'Atendimento e esclarecimento de dúvidas de clientes via telefone, chat e e-mail. Análise técnica de problemas, abertura de chamados, criação de manuais técnicos, treinamento e implantação de sistemas em clientes. Desenvolvimento de relatórios SQL personalizados.',
        tags: ['SQL', 'Microsoft SQL Server', 'Banco de dados'],
      },
      {
        role: 'Estagiário de Suporte',
        type: 'Estágio',
        period: 'out de 2022 — dez de 2023',
        duration: '1 ano 3 meses',
        location: 'São Paulo, Brasil',
        desc: 'Atendimento e esclarecimento de dúvidas de clientes via telefone, chat e e-mail. Análise técnica de problemas, abertura de chamados, criação de manuais técnicos, treinamento e implantação de sistemas em clientes. Desenvolvimento de relatórios SQL personalizados.',
        tags: ['SQL', 'Microsoft SQL Server', 'Banco de dados'],
      },
    ],
  },
]

export default function About() {
  const age = getAge()

  return (
    <section className={styles.about} id="about">
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.label}>// sobre mim</p>
          <h2 className={styles.title}>
            Dev em<br />
            <span className={styles.accent}>construção</span><br />
            constante.
          </h2>
        </div>

        <div className={styles.right}>
          <div className={styles.bio}>
            <p>
              Tenho <strong>{age} anos</strong>, moro em São Paulo e trabalho na área de tecnologia.
              Me chamo <strong>Leonardo Cesário</strong> e desde que descobri programação, não consegui mais parar.
            </p>
            <p>
              Cursei <strong>Análise e Desenvolvimento de Sistemas</strong> pela Etec Jaraguá e
              sou graduado em Tecnologia em Análise e Desenvolvimento de Sistemas no <strong>IFSP Pirituba</strong>.
              Gosto de entender como as coisas funcionam por dentro — e de criar soluções que realmente
              funcionam por fora.
            </p>
            <p>
              Atualmente atuando como <strong>Analista de Desenvolvimento Junior</strong> na Crescer Informática,
              trabalhando com React, PHP e SQL no dia a dia.
            </p>
          </div>

          <div className={styles.facts}>
            <div className={styles.fact}>
              <span className={styles.num}>3+</span>
              <span className={styles.desc}>Anos de experiência</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.num}>30+</span>
              <span className={styles.desc}>Repositórios no GitHub</span>
            </div>
            <div className={styles.fact}>
              <span className={styles.num}>SP</span>
              <span className={styles.desc}>São Paulo, Brasil</span>
            </div>
          </div>

          {/* Experiência */}
          <div className={styles.expSection}>
            <p className={styles.expLabel}>// experiência</p>
            <div className={styles.expList}>
              {experience.map((company, ci) => (
                <div key={ci} className={styles.expCompanyGroup}>

                  {/* Cabeçalho da empresa */}
                  <div className={styles.expCompanyHeader}>
                    <div className={styles.expCompanyLogo}>
                      <img src={company.logo} className={styles.expCompanyImg} />
                    </div>
                    <div>
                      <h4 className={styles.expCompanyName}>{company.company}</h4>
                      <span className={styles.expCompanyDuration}>{company.totalDuration}</span>
                    </div>
                  </div>

                  {/* Cargos */}
                  <div className={styles.expRoleList}>
                    {company.roles.map((exp, i) => (
                      <div key={i} className={styles.expItem}>
                        <div className={styles.expHeader}>
                          <div>
                            <h4 className={styles.expRole}>{exp.role}</h4>
                            <span className={styles.expType}>{exp.type}</span>
                          </div>
                          <div className={styles.expMeta}>
                            <span className={styles.expPeriod}>{exp.period}</span>
                            <span className={styles.expDuration}>{exp.duration}</span>
                          </div>
                        </div>
                        {exp.location && (
                          <p className={styles.expLocation}>{exp.location}</p>
                        )}
                        {exp.desc && (
                          <p className={styles.expDesc}>{exp.desc}</p>
                        )}
                        <div className={styles.expTags}>
                          {exp.tags.map((t) => (
                            <span key={t} className={styles.expTag}>{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}