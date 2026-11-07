import { useState } from 'react'
import { MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaWhatsapp, FaLinkedin, FaGithub } from "react-icons/fa";
import styles from './Contact.module.css'

// Chave pública do Web3Forms (pode ficar no código). Pegue a sua em https://web3forms.com
const WEB3FORMS_KEY = 'c329efe3-43d3-4829-98b8-67a5c9dafd30'
const EMAIL = 'leocesario.abta@gmail.com'

export default function Contact() {
  const [form, setForm] = useState({ nome: '', email: '', msg: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Sem chave configurada, mantém o comportamento antigo (abre o app de e-mail)
    if (!WEB3FORMS_KEY) {
      window.open(`mailto:${EMAIL}?subject=Contato via Portfolio - ${form.nome}&body=${encodeURIComponent(form.msg)}%0A%0AEmail de resposta: ${form.email}`)
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Contato via Portfolio - ${form.nome}`,
          from_name: 'Portfolio',
          name: form.nome,
          email: form.email,
          replyto: form.email,
          message: form.msg,
          botcheck: e.target.botcheck.checked,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      setStatus('sent')
      setForm({ nome: '', email: '', msg: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
    }
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
            Estou aberto a novas oportunidades e projetos.
            Se você tem uma vaga, um projeto ou só quer trocar uma ideia, me manda uma mensagem.
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
            {/* Anti-spam: campo invisível que só bots preenchem */}
            <input type="checkbox" name="botcheck" className={styles.honeypot} tabIndex={-1} autoComplete="off" />
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
            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando...' : status === 'sent' ? 'Enviado! ✓' : 'Enviar Mensagem →'}
            </button>
            {status === 'sent' && (
              <p className={styles.feedback} role="status">
                Mensagem recebida! Respondo assim que possível.
              </p>
            )}
            {status === 'error' && (
              <p className={`${styles.feedback} ${styles.feedbackError}`} role="alert">
                Não consegui enviar agora. Tente de novo ou escreva direto para{' '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
