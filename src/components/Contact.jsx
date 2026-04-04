import { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaWhatsapp, FaLinkedin, FaGithub } from "react-icons/fa";
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', msg: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const mailto = `mailto:leocesario.abta@gmail.com?subject=Contato via Portfolio - ${form.nome}&body=${encodeURIComponent(form.msg)}%0A%0AEmail de resposta: ${form.email}`
    window.open(mailto)
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section className={styles.contact} id="contact">
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.label}>// contato</p>
          <h2 className={styles.title}>
            Vamos<br />
            <span className={styles.accent}>conversar</span>?
          </h2>
          <p className={styles.sub}>
            Estou em busca da minha primeira oportunidade na área de tecnologia.
            Se você tem uma vaga, um projeto ou só quer trocar uma ideia — me manda uma mensagem.
          </p>

          <div className={styles.contactItems}>
            <a href="mailto:leocesario.abta@gmail.com" className={styles.contactItem}>
              <span className={styles.ciIcon}>
                <MdEmail />
              </span>
              <span>leocesario.abta@gmail.com</span>
            </a>
            <a href="tel:+5511939321415" className={styles.contactItem}>
              <span className={styles.ciIcon}>
                <BsFillTelephoneFill />
              </span>
              <span>+55 (11) 93932-1415</span>
            </a>
            <span className={styles.contactItem}>
              <span className={styles.ciIcon}>📍</span>
              <span>São Paulo, SP — Brasil</span>
            </span>
          </div>

          <div className={styles.socials}>
            <a
              href="https://wa.me/5511939321415"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              title="WhatsApp"
            >
              <FaWhatsapp className={styles.socialIcon} />
            </a>
            <a
              href="https://www.linkedin.com/in/leonardocesarioat/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              title="LinkedIn"
            >
              <FaLinkedin className={styles.socialIcon} />
            </a>
            <a
              href="https://github.com/Ceabta"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              title="GitHub"
            >
              <FaGithub className={styles.socialIcon} />
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Nome</label>
              <input
                className={styles.input}
                type="text"
                name="nome"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email</label>
              <input
                className={styles.input}
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Mensagem</label>
              <textarea
                className={styles.textarea}
                name="msg"
                placeholder="Conte-me sobre a oportunidade ou projeto..."
                value={form.msg}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className={styles.submit}>
              {sent ? 'Enviado! ✓' : 'Enviar Mensagem →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
