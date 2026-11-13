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

/* ---------- Grade de caracteres ---------- */
const COLS = 140
const ROWS = 118
const ASPECT = 1.65 // altura/largura de cada célula
const NCELLS = COLS * ROWS

/* ---------- Câmera ---------- */
const D = 2.6 // distância (menor = perspectiva mais forte)
const TILT = 0.3 // câmera acima, olhando pra baixo
const Y_CENTER = 0.62
const SPIN_SPEED = 0.55 // rad/s
const LIGHT = normalize([-0.8, 0.5, -0.35])

/* ---------- Árvore ---------- */
const TAU = Math.PI * 2
const Y_BASE = 0.36 // onde começam os galhos
const Y_TOP = 1.3
const MAX_R = 0.46
const TIERS = 3
const TRUNK_R = 0.07
const GARLAND_TURNS = 3
const N_LIGHTS = 170
const N_ORNAMENTS = 24

/* ---------- Linha do tempo (s) ---------- */
const T_TRUNK = 0.8
const T_LEADER = 2.0
const T_BRANCH = 0.6
const T_GARLAND_START = T_TRUNK + T_LEADER + T_BRANCH
const T_GARLAND = 1.0
const T_LIGHTS = T_GARLAND_START + 0.4
const T_ORNAMENTS = T_GARLAND_START + T_GARLAND
const T_STAR = T_ORNAMENTS + 0.8
const T_GIFTS = T_STAR + 0.4
const GIFT_DROP = 0.45
const FPS_INTERVAL = 1000 / 30

/* ---------- Tipos de ponto ---------- */
const LEAF = 0, TRUNK = 1, GARLAND = 2, LIGHTB = 3, ORN = 4, GIFT = 5, GROUND = 6, SNOW = 7
const BIAS = [0, 0, 0.004, 0.02, 0.01, 0, -0.08, -0.02]

/* ---------- Paleta (cada cor tem LEVELS níveis de brilho) ---------- */
const PALETTE = [
  [58, 186, 82], [38, 148, 64], [104, 206, 104], [28, 118, 58], [160, 230, 140], // 0-4 folhas
  [170, 112, 62], // 5 tronco
  [235, 185, 70], // 6 festão
  [255, 205, 110], [255, 238, 185], // 7-8 luzes
  [215, 38, 52], [225, 172, 52], // 9-10 bolas
  [200, 48, 60], [60, 120, 220], [222, 170, 60], [40, 160, 90], [220, 220, 225], // 11-15 presentes
  [255, 212, 92], [235, 60, 72], [255, 255, 255], // 16-18 fitas
  [95, 102, 115], // 19 chão
  [228, 234, 245], // 20 neve
  [215, 255, 228], // 21 ponta crescendo
]
const P_TRUNK = 5, P_GARLAND = 6, P_LIGHT = 7, P_ORN = 9, P_GIFT = 11, P_RIBBON = 16, P_GROUND = 19, P_SNOW = 20, P_TIP = 21
const LEVELS = 10
const COLORS = PALETTE.flatMap(([r, g, b]) =>
  Array.from({ length: LEVELS }, (_, lv) => {
    const f = 0.16 + (1.05 * lv) / (LEVELS - 1)
    const c = (v) => Math.min(255, Math.round(v * f))
    return `rgb(${c(r)},${c(g)},${c(b)})`
  })
)

const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const CHARSET = LETTERS + '.:-=+~*o#%@O0'
const CH = (s) => CHARSET.indexOf(s)
const GLYPHS = CHARSET.split('')

function normalize([x, y, z]) {
  const l = Math.hypot(x, y, z) || 1
  return [x / l, y / l, z / l]
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const mod = (a, n) => ((a % n) + n) % n
function seeded(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Silhueta: cone levemente convexo com camadas suaves
function envelope(t) {
  const u = mod(t * TIERS, 1)
  return Math.max(0.015, MAX_R * Math.pow(1 - t, 0.9) * (0.82 + 0.18 * (1 - u)))
}
const leaderTime = (y) => T_TRUNK + clamp((y - Y_BASE) / (Y_TOP - Y_BASE), 0, 1) * T_LEADER

/* ---------- Nuvem de pontos (gerada uma vez) ---------- */
function buildPoints() {
  const rnd = seeded(2512)
  const gauss = () => {
    const u = Math.max(1e-9, rnd())
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rnd())
  }
  const letter = () => Math.floor(rnd() * LETTERS.length)
  const A = { x: [], y: [], z: [], nx: [], ny: [], nz: [], birth: [], kind: [], pal: [], ch: [], gain: [], phase: [], drop: [] }
  const add = (x, y, z, n, birth, kind, pal, ch, gain = 1, phase = 0, drop = 0) => {
    const [nx, ny, nz] = normalize(n)
    A.x.push(x); A.y.push(y); A.z.push(z)
    A.nx.push(nx); A.ny.push(ny); A.nz.push(nz)
    A.birth.push(birth); A.kind.push(kind); A.pal.push(pal); A.ch.push(ch)
    A.gain.push(gain); A.phase.push(phase); A.drop.push(drop)
  }

  // Chão: disco de pontos que some nas bordas
  const groundChars = ['.', '.', '.', ':', ':', '-', '=', '+'].map(CH)
  for (let i = 0; i < 6000; i++) {
    const r = 0.95 * Math.sqrt(rnd())
    const a = rnd() * TAU
    add(Math.cos(a) * r, 0, Math.sin(a) * r, [0, 1, 0], 0, GROUND, P_GROUND,
      groundChars[Math.floor(rnd() * groundChars.length)], 0.55 * Math.pow(1 - r / 0.95, 0.8))
  }

  // Neve acumulada no pé da árvore
  const snowChars = ['*', 'o', '.', ':', '='].map(CH)
  for (let i = 0; i < 1800; i++) {
    const r = 0.09 + 0.45 * Math.sqrt(rnd())
    const a = rnd() * TAU
    const h = 0.04 * Math.pow(1 - (r - 0.09) / 0.45, 1.4) + rnd() * 0.006
    add(Math.cos(a) * r, h, Math.sin(a) * r, [Math.cos(a) * 0.3, 1, Math.sin(a) * 0.3], 0, SNOW, P_SNOW,
      snowChars[Math.floor(rnd() * snowChars.length)])
  }

  // Tronco
  const trunkH = Y_BASE + 0.05
  for (let y = 0; y <= trunkH; y += 0.005) {
    for (let k = 0; k < 44; k++) {
      const a = (k / 44) * TAU
      add(Math.cos(a) * TRUNK_R, y, Math.sin(a) * TRUNK_R, [Math.cos(a), 0, Math.sin(a)],
        (y / trunkH) * T_TRUNK, TRUNK, P_TRUNK, letter())
    }
  }

  // Eixo central
  for (let y = Y_BASE; y <= Y_TOP - 0.02; y += 0.004) {
    add(gauss() * 0.004, y, gauss() * 0.004, [0, 1, -0.4], leaderTime(y), LEAF, 0, letter())
  }

  // Galhos como nuvens de agulhas (mesma ideia do vídeo)
  let level = 0
  for (let y = Y_BASE + 0.02; y < Y_TOP - 0.04; y += 0.032, level++) {
    const t = (y - Y_BASE) / (Y_TOP - Y_BASE)
    const R = envelope(t)
    const nb = Math.round(6 + 9 * (1 - t))
    for (let b = 0; b < nb; b++) {
      const a = (TAU * b) / nb + level * 0.618 * TAU + gauss() * 0.08
      const L = R * (0.82 + rnd() * 0.24)
      const n = Math.round(60 + 620 * L)
      const dx = Math.cos(a)
      const dz = Math.sin(a)
      for (let k = 0; k < n; k++) {
        const s = Math.pow(rnd(), 0.65) // concentra perto da ponta
        const k = clamp(L / 0.22, 0.2, 1) // galhos pequenos (topo) = nuvem mais compacta
        const spread = (0.02 + 0.07 * s) * gauss() * k
        const r = s * L
        const yy = y + 0.05 * r - 0.3 * r * r + 0.018 * gauss() * s * k
        const x = dx * r - dz * spread
        const z = dz * r + dx * spread
        const pal = rnd() < 0.05 ? 4 : Math.floor(rnd() * 4)
        add(x, yy, z, [dx, 0.45, dz], leaderTime(y) + s * T_BRANCH, LEAF, pal, letter(), 0.9 + rnd() * 0.25)
      }
    }
  }

  // Ponta da árvore: cone compacto até a base da estrela
  const tipStart = Y_TOP - 0.16
  for (let i = 0; i < 900; i++) {
    const u = rnd() // 0 = base da ponta, 1 = topo
    const y = tipStart + u * (Y_TOP - tipStart)
    const R = envelope((tipStart - Y_BASE) / (Y_TOP - Y_BASE)) * (1 - u) * Math.sqrt(rnd())
    const a = rnd() * TAU
    const pal = rnd() < 0.05 ? 4 : Math.floor(rnd() * 4)
    add(Math.cos(a) * R, y, Math.sin(a) * R, [Math.cos(a), 0.5, Math.sin(a)], leaderTime(y), LEAF, pal, letter())
  }

  // Festão dourado em espiral
  for (let i = 0; i <= 2400; i++) {
    const u = i / 2400
    const y = Y_BASE + 0.03 + u * (Y_TOP - Y_BASE - 0.12)
    const t = (y - Y_BASE) / (Y_TOP - Y_BASE)
    const a = u * GARLAND_TURNS * TAU + gauss() * 0.02
    const r = envelope(t) * 0.97 + 0.01 + gauss() * 0.006
    add(Math.cos(a) * r, y - 0.02 + gauss() * 0.006, Math.sin(a) * r, [Math.cos(a), 0.3, Math.sin(a)],
      T_GARLAND_START + u * T_GARLAND, GARLAND, P_GARLAND, letter())
  }

  // Luzinhas
  for (let i = 0; i < N_LIGHTS; i++) {
    const t = Math.pow(rnd(), 0.85) * 0.95
    const a = rnd() * TAU
    const r = envelope(t) * (0.82 + rnd() * 0.2)
    const y = Y_BASE + t * (Y_TOP - Y_BASE) - 0.02
    add(Math.cos(a) * r, y, Math.sin(a) * r, [Math.cos(a), 0.3, Math.sin(a)],
      T_LIGHTS + rnd() * 1.2, LIGHTB, P_LIGHT + (rnd() < 0.35 ? 1 : 0), letter(), 1, rnd() * TAU)
  }

  // Bolas (esferas de pontos)
  const ornChars = ['O', 'o', '@', '0'].map(CH)
  for (let i = 0; i < N_ORNAMENTS; i++) {
    const t = 0.06 + rnd() * 0.8
    const a = rnd() * TAU
    const r = envelope(t) * 0.94
    const cy = Y_BASE + t * (Y_TOP - Y_BASE) - 0.03
    const cx = Math.cos(a) * r
    const cz = Math.sin(a) * r
    const rad = 0.022 + rnd() * 0.012
    const pal = P_ORN + (rnd() < 0.7 ? 0 : 1)
    const birth = T_ORNAMENTS + rnd() * 0.6
    const M = 90
    for (let k = 0; k < M; k++) { // esfera de Fibonacci
      const yy = 1 - (2 * (k + 0.5)) / M
      const rr = Math.sqrt(1 - yy * yy)
      const th = k * 2.39996
      const n = [Math.cos(th) * rr, yy, Math.sin(th) * rr]
      add(cx + n[0] * rad, cy + n[1] * rad, cz + n[2] * rad, n, birth, ORN, pal,
        ornChars[Math.floor(rnd() * ornChars.length)])
    }
  }

  // Presentes: caixas sólidas com fita e laço, caem do alto no fim
  const giftChars = ['#', '%', '=', '+'].map(CH)
  const gifts = [
    { a: 0.35, dist: 0.56, w: 0.17, d: 0.15, h: 0.13, yaw: 0.3, pal: P_GIFT, rib: P_RIBBON },
    { a: 1.5, dist: 0.6, w: 0.11, d: 0.11, h: 0.09, yaw: 0.9, pal: P_GIFT + 2, rib: P_RIBBON + 1 },
    { a: 2.7, dist: 0.55, w: 0.15, d: 0.12, h: 0.16, yaw: -0.4, pal: P_GIFT + 1, rib: P_RIBBON + 2 },
    { a: 4.0, dist: 0.6, w: 0.13, d: 0.13, h: 0.1, yaw: 0.6, pal: P_GIFT + 3, rib: P_RIBBON + 1 },
    { a: 5.2, dist: 0.54, w: 0.12, d: 0.16, h: 0.12, yaw: 0.1, pal: P_GIFT + 4, rib: P_RIBBON },
  ]
  gifts.forEach((g, gi) => {
    const gx = Math.cos(g.a) * g.dist
    const gz = Math.sin(g.a) * g.dist
    const cy = Math.cos(g.yaw)
    const sy = Math.sin(g.yaw)
    const birth = T_GIFTS + gi * 0.18
    const STEP = 0.0065
    const RIB = 0.011
    const put = (lx, ly, lz, n, isRibbon) => {
      add(gx + lx * cy - lz * sy, ly + 0.03, gz + lx * sy + lz * cy,
        [n[0] * cy - n[2] * sy, n[1], n[0] * sy + n[2] * cy], birth, GIFT,
        isRibbon ? g.rib : g.pal, giftChars[Math.floor(rnd() * giftChars.length)], 1, 0, 1)
    }
    const hw = g.w / 2
    const hd = g.d / 2
    for (let ly = 0; ly <= g.h; ly += STEP) {
      for (let lx = -hw; lx <= hw; lx += STEP) {
        put(lx, ly, -hd, [0, 0, -1], Math.abs(lx) < RIB)
        put(lx, ly, hd, [0, 0, 1], Math.abs(lx) < RIB)
      }
      for (let lz = -hd; lz <= hd; lz += STEP) {
        put(-hw, ly, lz, [-1, 0, 0], Math.abs(lz) < RIB)
        put(hw, ly, lz, [1, 0, 0], Math.abs(lz) < RIB)
      }
    }
    for (let lx = -hw; lx <= hw; lx += STEP) {
      for (let lz = -hd; lz <= hd; lz += STEP) {
        put(lx, g.h, lz, [0, 1, 0], Math.abs(lx) < RIB || Math.abs(lz) < RIB)
      }
    }
    for (let k = 0; k < 60; k++) { // laço
      const a = (k / 60) * TAU
      const lr = 0.028 * Math.abs(Math.cos(a))
      put(Math.cos(a) * lr * 1.6, g.h + 0.012 + Math.abs(Math.sin(a)) * 0.022, Math.sin(a) * lr, [0, 1, -0.5], true)
    }
  })

  const f32 = (a) => Float32Array.from(a)
  return {
    n: A.x.length,
    x: f32(A.x), y: f32(A.y), z: f32(A.z),
    nx: f32(A.nx), ny: f32(A.ny), nz: f32(A.nz),
    birth: f32(A.birth), gain: f32(A.gain), phase: f32(A.phase),
    kind: Uint8Array.from(A.kind), pal: Uint8Array.from(A.pal),
    ch: Uint8Array.from(A.ch), drop: Uint8Array.from(A.drop),
  }
}

let PTS = null // gerado sob demanda (só quando a seção aparece)
const STAR_Y = Y_TOP + 0.025
const ct = Math.cos(TILT)
const st = Math.sin(TILT)

function computeFit(P) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  let minI = Infinity, maxI = -Infinity
  const proj = (x, y, z, cr, sr) => {
    const xr = x * cr - z * sr
    const zr = x * sr + z * cr
    const yc = y - Y_CENTER
    const inv = 1 / (-yc * st + zr * ct + D)
    return [xr * inv, (yc * ct + zr * st) * inv, inv]
  }
  for (let k = 0; k < 12; k++) {
    const cr = Math.cos((k / 12) * TAU)
    const sr = Math.sin((k / 12) * TAU)
    for (let p = 0; p < P.n; p += 7) {
      if (P.kind[p] === GROUND) continue
      const [x, y, inv] = proj(P.x[p], P.y[p], P.z[p], cr, sr)
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      if (inv < minI) minI = inv
      if (inv > maxI) maxI = inv
    }
  }
  maxY = Math.max(maxY, proj(0, STAR_Y + 0.06, 0, 1, 0)[1])
  const sy = Math.min((ROWS - 4) / (maxY - minY), (COLS - 6) / ((maxX - minX) * ASPECT))
  return {
    sx: sy * ASPECT,
    sy,
    cx: COLS / 2 - ((minX + maxX) / 2) * sy * ASPECT,
    cy: ROWS / 2 + ((minY + maxY) / 2) * sy,
    minI,
    maxI,
  }
}

function makeGlow(r, g, b) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  const grd = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grd.addColorStop(0.25, `rgba(${r},${g},${b},0.45)`)
  grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
  x.fillStyle = grd
  x.fillRect(0, 0, 64, 64)
  return c
}

export default function ChristmasTree() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const hud = {
    time: useRef(null),
    rot: useRef(null),
    letters: useRef(null),
    fps: useRef(null),
  }

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let P = null
    let FIT = null
    const zbuf = new Float32Array(NCELLS)
    const invb = new Float32Array(NCELLS)
    const owner = new Int32Array(NCELLS)
    const bucketOf = new Int16Array(NCELLS)
    const NB = PALETTE.length * LEVELS
    const counts = new Int32Array(NB + 1)
    const order = new Int32Array(NCELLS)
    const litLights = []
    const glowWarm = makeGlow(255, 200, 100)
    const glowStar = makeGlow(255, 220, 120)

    // Neve caindo (em coordenadas da tela, 0..1)
    const flakeRnd = seeded(99)
    const flakes = Array.from({ length: 140 }, () => ({
      x: flakeRnd(), y: flakeRnd(), v: 0.02 + flakeRnd() * 0.05,
      drift: flakeRnd() * TAU, ch: flakeRnd() < 0.7 ? '.' : '*', a: 0.25 + flakeRnd() * 0.55,
    }))

    let cssW = 0, cssH = 0, cellW = 0, cellH = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssW = wrap.clientWidth
      cellW = cssW / COLS
      cellH = cellW * ASPECT
      cssH = cellH * ROWS
      canvas.style.height = `${cssH}px`
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function render(elapsed, rot, dt) {
      ctx.clearRect(0, 0, cssW, cssH)
      const cr = Math.cos(rot)
      const sr = Math.sin(rot)
      zbuf.fill(0)
      owner.fill(-1)

      // 1) projeção + z-buffer
      const { x: X, y: Y, z: Z, birth, kind, drop } = P
      for (let p = 0; p < P.n; p++) {
        if (elapsed < birth[p]) continue
        let y = Y[p]
        if (drop[p]) {
          const k = clamp(1 - (elapsed - birth[p]) / GIFT_DROP, 0, 1)
          y += k * k * 0.8
        }
        const xr = X[p] * cr - Z[p] * sr
        const zr = X[p] * sr + Z[p] * cr
        const yc = y - Y_CENTER
        const inv = 1 / (-yc * st + zr * ct + D)
        const col = Math.floor(FIT.cx + xr * inv * FIT.sx)
        const row = Math.floor(FIT.cy - (yc * ct + zr * st) * inv * FIT.sy)
        if (col < 0 || col >= COLS || row < 0 || row >= ROWS) continue
        const i = row * COLS + col
        const d = inv + BIAS[kind[p]]
        if (d > zbuf[i]) { zbuf[i] = d; owner[i] = p; invb[i] = inv }
      }

      // 2) cor de cada célula (agrupada por cor pra desenhar rápido)
      counts.fill(0)
      litLights.length = 0
      let letters = 0
      const span = FIT.maxI - FIT.minI
      for (let i = 0; i < NCELLS; i++) {
        const p = owner[i]
        if (p < 0) { bucketOf[i] = -1; continue }
        const k = kind[p]
        const near = clamp((invb[i] - FIT.minI) / span, 0, 1)
        let pal = P.pal[p]
        let b
        if (k === GROUND) {
          b = P.gain[p] * (0.35 + 0.45 * near)
        } else if (k === SNOW) {
          b = 0.45 + 0.4 * near
        } else {
          const nxr = P.nx[p] * cr - P.nz[p] * sr
          const nzr = P.nx[p] * sr + P.nz[p] * cr
          const L = nxr * LIGHT[0] + (P.ny[p] * ct + nzr * st) * LIGHT[1] + (-P.ny[p] * st + nzr * ct) * LIGHT[2]
          const lit = clamp((L + 0.25) / 1.25, 0, 1)
          b = (0.32 + 0.68 * (lit * 0.6 + near * 0.4)) * P.gain[p]
          if (k === LIGHTB) {
            const tw = 0.5 + 0.5 * Math.sin(elapsed * 3 + P.phase[p])
            b = 0.55 + 0.5 * tw
            if (near > 0.3) litLights.push(i, tw)
          } else if (k === ORN) {
            b = 0.25 + 0.85 * lit * (0.5 + 0.5 * near)
          }
          if (k !== GIFT && elapsed - birth[p] < 0.07) { pal = P_TIP; b = 0.8 }
          letters++
        }
        const lv = clamp(Math.round(b * (LEVELS - 1)), 0, LEVELS - 1)
        const bk = pal * LEVELS + lv
        bucketOf[i] = bk
        counts[bk + 1]++
      }
      for (let k = 1; k <= NB; k++) counts[k] += counts[k - 1]
      const start = counts.slice()
      for (let i = 0; i < NCELLS; i++) {
        const bk = bucketOf[i]
        if (bk >= 0) order[start[bk]++] = i
      }

      // 3) desenha as letras
      ctx.font = `${cellH * 0.98}px "Space Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let bk = 0; bk < NB; bk++) {
        const a = counts[bk]
        const z = counts[bk + 1]
        if (a === z) continue
        ctx.fillStyle = COLORS[bk]
        for (let j = a; j < z; j++) {
          const i = order[j]
          ctx.fillText(GLYPHS[P.ch[owner[i]]], (i % COLS + 0.5) * cellW, (Math.floor(i / COLS) + 0.5) * cellH)
        }
      }

      // 4) brilho das luzes
      ctx.globalCompositeOperation = 'lighter'
      const gs = cellH * 4.2
      for (let j = 0; j < litLights.length; j += 2) {
        const i = litLights[j]
        ctx.globalAlpha = 0.15 + 0.4 * litLights[j + 1]
        ctx.drawImage(glowWarm, (i % COLS + 0.5) * cellW - gs / 2, (Math.floor(i / COLS) + 0.5) * cellH - gs / 2, gs, gs)
      }
      ctx.globalAlpha = 1

      // 5) estrela com raios
      if (elapsed >= T_STAR) {
        const yc = STAR_Y - Y_CENTER
        const inv = 1 / (-yc * st + D)
        const sx = (FIT.cx + 0) * cellW
        const sy = (FIT.cy - yc * ct * inv * FIT.sy) * cellH
        const pop = clamp((elapsed - T_STAR) / 0.4, 0, 1)
        const pulse = 0.85 + 0.15 * Math.sin(elapsed * 2.4)
        const size = cellH * 2.4 * (pop < 1 ? 0.4 + 1.2 * Math.sin(pop * Math.PI * 0.75) : 1)

        const g = cellH * 16 * pulse
        ctx.globalAlpha = 0.55 * pop
        ctx.drawImage(glowStar, sx - g / 2, sy - g / 2, g, g)
        ctx.globalAlpha = pop

        ctx.lineWidth = Math.max(0.6, cellW * 0.25)
        for (let k = 0; k < 12; k++) {
          const ang = (k / 12) * TAU + elapsed * 0.15
          const len = cellH * (k % 2 ? 4 : 7) * (0.8 + 0.2 * Math.sin(elapsed * 3 + k))
          const ex = sx + Math.cos(ang) * len
          const ey = sy + Math.sin(ang) * len
          const grd = ctx.createLinearGradient(sx, sy, ex, ey)
          grd.addColorStop(0, 'rgba(255,225,140,0.9)')
          grd.addColorStop(1, 'rgba(255,225,140,0)')
          ctx.strokeStyle = grd
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(ex, ey)
          ctx.stroke()
        }
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = '#ffe9a6'
        ctx.beginPath()
        for (let k = 0; k < 10; k++) {
          const r = k % 2 ? size * 0.42 : size
          const ang = -Math.PI / 2 + (k / 10) * TAU
          ctx.lineTo(sx + Math.cos(ang) * r, sy + Math.sin(ang) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
      }
      ctx.globalCompositeOperation = 'source-over'

      // 6) neve caindo
      ctx.fillStyle = '#e8eef8'
      for (const f of flakes) {
        f.y += f.v * dt
        f.x += Math.sin(elapsed * 0.8 + f.drift) * 0.004 * dt
        if (f.y > 1) { f.y -= 1; f.x = Math.random() }
        ctx.globalAlpha = f.a
        ctx.fillText(f.ch, mod(f.x, 1) * cssW, f.y * cssH)
      }
      ctx.globalAlpha = 1

      return letters
    }

    // HUD
    let frames = 0
    let fpsClock = 0
    let fps = 30
    const updateHud = (elapsed, rot, letters) => {
      if (hud.time.current) hud.time.current.textContent = `t ${elapsed.toFixed(2).padStart(5, '0')}s`
      if (hud.rot.current) hud.rot.current.textContent = `${((rot * 180) / Math.PI).toFixed(2)}°`
      if (hud.letters.current) hud.letters.current.textContent = letters.toLocaleString('pt-BR')
      if (hud.fps.current) hud.fps.current.textContent = `${Math.round(fps)} fps`
    }

    let raf = 0
    let visible = false
    let started = false
    let elapsed = 0
    let rot = 0.6
    let prev = null
    let lastDraw = 0

    const ensureData = () => {
      if (!PTS) PTS = buildPoints()
      P = PTS
      if (!FIT) FIT = computeFit(P)
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible) { prev = null; return }
      if (now - lastDraw < FPS_INTERVAL - 2) return
      const dt = prev === null ? 0 : Math.min(0.1, (now - prev) / 1000)
      prev = now
      lastDraw = now
      elapsed += dt
      rot = mod(rot + dt * SPIN_SPEED, TAU)
      const letters = render(elapsed, rot, dt)
      frames++
      fpsClock += dt
      if (fpsClock >= 0.5) { fps = frames / fpsClock; frames = 0; fpsClock = 0 }
      if (frames % 3 === 0) updateHud(elapsed, rot, letters)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (reduce && P) updateHud(T_GIFTS + 2, 0.6, render(T_GIFTS + 2, 0.6, 0))
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !started) {
        started = true
        ensureData()
        if (reduce) {
          updateHud(T_GIFTS + 2, 0.6, render(T_GIFTS + 2, 0.6, 0))
        } else {
          raf = requestAnimationFrame(frame)
        }
      }
    }, { threshold: 0.15 })
    io.observe(wrap)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <div className={styles.card} role="img" aria-label="Árvore de Natal 3D feita de letras, girando">
      <div className={styles.header}>
        <span>// feliz_natal.js</span>
        <span className={styles.time} ref={hud.time}>t 00.00s</span>
      </div>

      <div className={styles.stage} ref={wrapRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.stats}>
        <span>rotação <b ref={hud.rot}>0.00°</b></span>
        <span>luzes <b>{N_LIGHTS}</b></span>
        <span>letras <b ref={hud.letters}>0</b></span>
      </div>

      <div className={styles.footer}>
        <span><span className={styles.kw}>while</span> (<span className={styles.bool}>true</span>) arvore.<span className={styles.fn}>girar</span>()</span>
        <span className={styles.running}>running · <span ref={hud.fps}>30 fps</span></span>
      </div>
    </div>
  )
}
