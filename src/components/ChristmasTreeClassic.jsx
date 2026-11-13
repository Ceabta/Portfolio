import { useEffect, useRef } from 'react'
import styles from './ChristmasTree.module.css'

/* ---------- Temporada ---------- */
// Ativa de 1º/dez até 6/jan (Dia de Reis).
// Para testar fora da época: ?natal  |  para forçar desligado: ?natal=0
export function isChristmasSeason(date = new Date()) {
  const params = new URLSearchParams(window.location.search)
  if (params.has('natal')) return params.get('natal') !== '0'
  const m = date.getMonth()
  const d = date.getDate()
  return m === 11 || (m === 0 && d <= 6)
}

/* ---------- Config da grade ---------- */
const COLS = 43
const ROWS = 22
const CX = Math.floor(COLS / 2)
const FOLIAGE_TOP = 3
const FOLIAGE_BOTTOM = 19
const MAX_RADIUS = 19
const TAU = Math.PI * 2

const BUILD_DURATION = 2.4 // segundos até a estrela acender
const SCRAMBLE_WINDOW = 0.35 // quanto tempo cada célula fica "embaralhando"
const SCRAMBLE_CHARS = '01{}/\\;=+*#$%'
const SHADE = '.,:;+*#'
const SPIN_SPEED = 0.9 // rad/s
const GARLAND_TURNS = 1.8
const FPS_INTERVAL = 1000 / 30

const mod = (a, n) => ((a % n) + n) % n
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)
const hash = (x) => {
  const s = Math.sin(x * 12.9898) * 43758.5453
  return s - Math.floor(s)
}
function seeded(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Raio (0..1) em função da altura: 3 camadas sobrepostas
function radiusAt(t) {
  if (t < 0.34) return lerp(0.08, 0.42, t / 0.34)
  if (t < 0.68) return lerp(0.26, 0.72, (t - 0.34) / 0.34)
  return lerp(0.48, 1, (t - 0.68) / 0.32)
}

const tOf = (row) => (row - FOLIAGE_TOP) / (FOLIAGE_BOTTOM - FOLIAGE_TOP)
const HALF = Array.from({ length: ROWS }, (_, row) =>
  row >= FOLIAGE_TOP && row <= FOLIAGE_BOTTOM
    ? Math.max(1, Math.round(radiusAt(tOf(row)) * MAX_RADIUS))
    : 0
)

const rand = seeded(2512)
const ORNAMENT_COLORS = ['red', 'gold', 'blue', 'white']
const ORNAMENTS = Array.from({ length: 22 }, (_, i) => ({
  row: FOLIAGE_TOP + Math.round(lerp(0.12, 0.97, rand()) * (FOLIAGE_BOTTOM - FOLIAGE_TOP)),
  phi: rand() * TAU,
  color: ORNAMENT_COLORS[i % ORNAMENT_COLORS.length],
  char: rand() > 0.5 ? 'o' : '@',
  phase: rand() * TAU,
}))

const GIFTS = [
  { col: CX - 10, char: '#', color: 'giftRed' },
  { col: CX - 6, char: '+', color: 'giftBlue' },
  { col: CX + 6, char: '*', color: 'giftGold' },
  { col: CX + 10, char: '#', color: 'giftGreen' },
]

export default function ChristmasTreeClassic() {
  const preRef = useRef(null)

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return

    const N = ROWS * COLS
    const chars = new Array(N)
    const cls = new Array(N)

    // Momento em que cada célula "assenta": de baixo pra cima, com ruído
    const reveal = new Float32Array(N)
    const r = seeded(7)
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        reveal[row * COLS + col] =
          ((ROWS - 1 - row) / (ROWS - 1)) * (BUILD_DURATION - 0.8) + r() * 0.6
      }
    }
    for (let row = 0; row < FOLIAGE_TOP; row++) {
      for (let col = CX - 1; col <= CX + 1; col++) reveal[row * COLS + col] = BUILD_DURATION
    }

    const set = (row, col, ch, k) => {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return
      const i = row * COLS + col
      chars[i] = ch
      cls[i] = k
    }

    function draw(elapsed, rot) {
      chars.fill(' ')
      cls.fill('')

      // Folhagem (cone 3D, só a face da frente)
      for (let row = FOLIAGE_TOP; row <= FOLIAGE_BOTTOM; row++) {
        const half = HALF[row]
        for (let dc = -half; dc <= half; dc++) {
          if (dc === -half) { set(row, CX + dc, '/', styles.edge); continue }
          if (dc === half) { set(row, CX + dc, '\\', styles.edge); continue }
          const a = Math.asin(dc / (half + 0.5))
          const phi = a + rot
          const lit = Math.max(0, Math.cos(a + 0.55)) // luz vindo da esquerda
          const b = 0.12 + 0.88 * lit
          const sector = Math.floor((mod(phi, TAU) / TAU) * 28)
          const n = hash(sector * 31 + row * 17)
          const idx = Math.floor(clamp(b * 0.7 + n * 0.35, 0, 0.999) * SHADE.length)
          set(row, CX + dc, SHADE[idx], idx >= 4 ? styles.leaf : styles.leafDark)
        }
      }

      // Festão em espiral
      for (let row = FOLIAGE_TOP; row < FOLIAGE_BOTTOM; row++) {
        const half = HALF[row]
        if (half < 3) continue
        const a0 = mod(-tOf(row) * GARLAND_TURNS * TAU - rot + Math.PI, TAU) - Math.PI
        const a1 = a0 - (tOf(row + 1) - tOf(row)) * GARLAND_TURNS * TAU
        for (let k = 0; k <= 12; k++) {
          const a = lerp(a0, a1, k / 12)
          if (Math.cos(a) <= 0.05) continue
          const dc = clamp(Math.round(Math.sin(a) * (half + 0.5)), -half + 1, half - 1)
          set(row, CX + dc, '~', styles.garland)
        }
      }

      // Bolinhas (piscam depois de montada)
      ORNAMENTS.forEach((o, i) => {
        const half = HALF[o.row]
        if (half < 2) return
        const rel = o.phi - rot
        if (Math.cos(rel) < 0.1) return
        const dc = clamp(Math.round(Math.sin(rel) * (half + 0.5)), -half + 1, half - 1)
        const on = elapsed < BUILD_DURATION || Math.sin(elapsed * 2.6 + o.phase + i) > -0.35
        set(o.row, CX + dc, o.char, on ? styles[o.color] : `${styles[o.color]} ${styles.dim}`)
      })

      // Estrela
      const flash = Math.sin(elapsed * 2.2) > 0.6
      const starCls = flash ? styles.starFlash : styles.star
      ;['\\', '|', '/'].forEach((ch, j) => set(0, CX - 1 + j, ch, starCls))
      ;['-', '*', '-'].forEach((ch, j) => set(1, CX - 1 + j, ch, starCls))
      ;['/', '|', '\\'].forEach((ch, j) => set(2, CX - 1 + j, ch, starCls))

      // Tronco
      const tr = FOLIAGE_BOTTOM + 1
      set(tr, CX - 2, '|', styles.trunk)
      set(tr, CX + 2, '|', styles.trunk)
      ;['|', '_', '_', '_', '|'].forEach((ch, j) => set(tr + 1, CX - 2 + j, ch, styles.trunk))

      // Presentes
      GIFTS.forEach((g) => {
        for (let j = -1; j <= 1; j++) set(tr, g.col + j, '_', styles[g.color])
        set(tr + 1, g.col - 1, '[', styles[g.color])
        set(tr + 1, g.col, g.char, styles[g.color])
        set(tr + 1, g.col + 1, ']', styles[g.color])
      })

      // Montagem + serialização (agrupa caracteres consecutivos da mesma classe)
      let html = ''
      for (let row = 0; row < ROWS; row++) {
        let runCls = null
        let run = ''
        for (let col = 0; col < COLS; col++) {
          const i = row * COLS + col
          let ch = chars[i]
          let k = cls[i]
          if (ch !== ' ') {
            const rt = reveal[i]
            if (elapsed < rt - SCRAMBLE_WINDOW) { ch = ' '; k = '' }
            else if (elapsed < rt) {
              ch = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
              k = styles.scramble
            }
          }
          if (k !== runCls) {
            if (run) html += runCls ? `<span class="${runCls}">${run}</span>` : run
            run = ''
            runCls = k
          }
          run += ch
        }
        if (run) html += runCls ? `<span class="${runCls}">${run}</span>` : run
        html += '\n'
      }
      pre.innerHTML = html
    }

    // Sem animação para quem prefere movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(BUILD_DURATION + 1, 0.6)
      return
    }

    let raf
    let visible = true
    let elapsed = 0
    let rot = 0.6
    let prev = null
    let lastDraw = 0

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible) { prev = null; return }
      if (now - lastDraw < FPS_INTERVAL) return
      const dt = prev === null ? 0 : Math.min(0.1, (now - prev) / 1000)
      prev = now
      lastDraw = now
      elapsed += dt
      const ramp = smooth(clamp((elapsed - 0.8) / 2.5, 0, 1)) // começa a girar devagar
      rot = mod(rot + dt * SPIN_SPEED * ramp, TAU)
      draw(elapsed, rot)
    }
    raf = requestAnimationFrame(frame)

    // Pausa quando sai da tela
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(pre)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <div className={styles.card} role="img" aria-label="Árvore de Natal em ASCII girando">
      <div className={styles.header}>
        <span>// feliz_natal.js</span>
        <span className={styles.dots}><i /><i /><i /></span>
      </div>
      <pre ref={preRef} className={styles.tree} aria-hidden="true" />
      <div className={styles.footer}>
        <span className={styles.kw}>while</span> (<span className={styles.bool}>true</span>) arvore.<span className={styles.fn}>girar</span>()
      </div>
    </div>
  )
}
