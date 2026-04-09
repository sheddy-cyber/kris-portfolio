<template>
  <div class="game-body">

    <!-- Challenge banner -->
    <div class="game-challenge-banner">
      <div class="gcb-trophy">🏆</div>
      <div class="gcb-text">
        <div class="gcb-title">CAN YOU BEAT MY HIGH SCORE?</div>
        <div class="gcb-sub">My record: <strong>{{ KRIS_SCORE }} pts</strong> — Dare you try?</div>
      </div>
    </div>

    <!-- HUD -->
    <div class="game-hud">
      <div class="hud-item">
        <div class="hud-label">YOUR SCORE</div>
        <div class="hud-val">{{ score }}</div>
      </div>
      <div class="hud-item hud-center">
        <div class="hud-label">MY HIGH SCORE</div>
        <div class="hud-val hud-rival">{{ KRIS_SCORE }}</div>
      </div>
      <div class="hud-item hud-right">
        <div class="hud-label">YOUR BEST</div>
        <div class="hud-val" :style="{ color: playerBest > KRIS_SCORE ? '#ffd700' : '#fff' }">{{ playerBest }}</div>
      </div>
    </div>

    <!-- Canvas area -->
    <div class="cp-wrap" ref="wrapEl" @click="onTap" @touchstart.prevent="onTap">
      <canvas ref="canvasEl" class="cp-canvas"></canvas>

      <!-- Overlay (start / dead) -->
      <div v-if="phase !== 'playing'" class="game-overlay">
        <div class="go-inner">

          <template v-if="phase === 'start'">
            <div class="go-plane-anim">✈</div>
            <div class="go-title">CRASHY PLANE</div>
            <div class="go-tagline">Tap or click to fly. Dodge the towers.</div>
            <div class="go-record">🏆 My record: <strong>{{ KRIS_SCORE }} pts</strong></div>
            <button class="go-btn" @click.stop="startGame">▶ FLY NOW</button>
            <div class="go-hint">Click / Tap = go up &nbsp;·&nbsp; Let go = fall &nbsp;·&nbsp; P = pause</div>
          </template>

          <template v-if="phase === 'dead'">
            <div class="go-plane-anim" style="animation:none;filter:grayscale(1) brightness(0.7)">💥</div>
            <div class="go-title" :style="{ color: score > KRIS_SCORE ? '#ffd700':'#fff' }">
              {{ score > KRIS_SCORE ? '🏆 YOU BEAT ME!' : 'CRASHED!' }}
            </div>
            <div class="go-tagline" :style="{ color: score > KRIS_SCORE ? '#ffd700':'var(--cp-muted)' }">
              {{ score > KRIS_SCORE
                ? 'Unbelievable. You actually did it.'
                : "I'm still the champion… for now." }}
            </div>
            <div class="go-scores">
              <div class="go-score-col">
                <div class="go-score-label">YOUR SCORE</div>
                <div class="go-score-val" :style="{ color: score > KRIS_SCORE ? '#ffd700':'#fff' }">{{ score }}</div>
              </div>
              <div class="go-score-col">
                <div class="go-score-label">MY BEST</div>
                <div class="go-score-val" style="color:#ffd700">{{ KRIS_SCORE }}</div>
              </div>
              <div class="go-score-col">
                <div class="go-score-label">YOUR BEST</div>
                <div class="go-score-val" :style="{ color: playerBest > KRIS_SCORE ? '#ffd700':'#fff' }">{{ playerBest }}</div>
              </div>
            </div>
            <button class="go-btn" @click.stop="startGame">▶ FLY AGAIN</button>
          </template>

        </div>
      </div>
    </div>

    <div class="cp-hint">Click / Tap to go UP &nbsp;|&nbsp; Release to fall &nbsp;|&nbsp; P Pause</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({ active: { type: Boolean, default: true } })

// ─── TUNING ────────────────────────────────────────────────────
const KRIS_SCORE    = 31
const GRAVITY       = 0.22        // was 0.40 — gentler fall
const FLAP_VEL      = -5.8        // was -7.5 — softer tap punch
const HOLD_LIFT     = -0.08       // sustained hold lift per frame
const TERMINAL_VEL  = 7           // max fall speed cap
const PIPE_W        = 54
const PIPE_GAP      = 155         // slightly wider gap gives more room
const PIPE_SPD_BASE = 2.4
const PIPE_SPD_STEP = 0.18
const PIPE_EVERY    = 130
const PLANE_R       = 0.22
const PW            = 46
const PH            = 26
const GH            = 46

// ─── REFS ─────────────────────────────────────────────────────
const canvasEl   = ref(null)
const wrapEl     = ref(null)
const phase      = ref('start')
const score      = ref(0)
const playerBest = ref(0)

const LS_KEY = 'kris_portfolio_best_score'

// Load saved best from localStorage on mount
onMounted(() => {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved !== null) playerBest.value = parseInt(saved, 10) || 0
  } catch (_) {}
})

// Persist best whenever it changes
watch(playerBest, val => {
  try { localStorage.setItem(LS_KEY, String(val)) } catch (_) {}
})

let ctx, W, H
let rafId = null

// mutable game state
let py, vy, held
let pipes, pTimer, frame
let clouds, sparks

// ─── HELPERS ──────────────────────────────────────────────────
const px = () => W * PLANE_R
const spd = () => PIPE_SPD_BASE + Math.floor(score.value / 10) * PIPE_SPD_STEP

function reset() {
  py = H * 0.42; vy = 0; held = false
  pipes = []; pTimer = 0; frame = 0; sparks = []
  score.value = 0
  clouds = Array.from({ length: 5 }, (_, i) => ({
    x: (i / 5) * W + 30,
    y: 20 + Math.random() * (H * 0.38),
    w: 55 + Math.random() * 70,
    s: 0.3 + Math.random() * 0.4,
    a: 0.05 + Math.random() * 0.07,
  }))
}

// ─── MAIN LOOP ─────────────────────────────────────────────────
function loop() {
  rafId = requestAnimationFrame(loop)
  if (paused || phase.value !== 'playing') { draw(); return }

  frame++

  // Physics
  vy += GRAVITY
  if (held) vy += HOLD_LIFT
  if (vy > TERMINAL_VEL) vy = TERMINAL_VEL  // cap fall speed
  py += vy

  // Spawn pipe
  pTimer++
  if (pTimer >= PIPE_EVERY) {
    pTimer = 0
    const minT = 36, maxT = H - GH - PIPE_GAP - 36
    pipes.push({ x: W + 8, tH: minT + Math.random() * (maxT - minT), done: false })
  }

  // Update pipes
  const s = spd()
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= s
    if (pipes[i].x + PIPE_W < 0) { pipes.splice(i, 1); continue }

    // Score gate
    if (!pipes[i].done && pipes[i].x + PIPE_W < px()) {
      pipes[i].done = true
      score.value++
      if (score.value > playerBest.value) playerBest.value = score.value
    }

    // Collision (shrunk hitbox for fairness)
    const hb = 6
    const lx = px() + hb, rx2 = px() + PW - hb
    const ty = py + hb,  by = py + PH - hb
    if (rx2 > pipes[i].x + hb && lx < pipes[i].x + PIPE_W - hb) {
      if (ty < pipes[i].tH || by > pipes[i].tH + PIPE_GAP) { doCrash(); return }
    }
  }

  // Boundary
  if (py + PH >= H - GH || py <= 0) { doCrash(); return }

  // Clouds
  clouds.forEach(c => { c.x -= c.s; if (c.x + c.w < 0) { c.x = W + 20; c.y = 20 + Math.random() * (H * 0.38) } })

  // Sparks age
  sparks = sparks.filter(s => { s.life--; s.x += s.vx; s.y += s.vy; s.vy += 0.22; return s.life > 0 })

  draw()
}

let paused = false

function doCrash() {
  // Burst of sparks
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 4.5
    sparks.push({
      x: px() + PW / 2, y: py + PH / 2,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.8,
      life: 30 + Math.floor(Math.random() * 18),
      c: ['#ff5f57','#febc2e','#58a6ff','#fff','#3fb950'][Math.floor(Math.random() * 5)],
    })
  }
  cancelAnimationFrame(rafId); rafId = null

  // Animate sparks then show overlay
  let t = 0
  const sl = () => {
    draw()
    sparks.forEach(s => { s.life--; s.x += s.vx; s.y += s.vy; s.vy += 0.22 })
    sparks = sparks.filter(s => s.life > 0)
    if (++t < 38) requestAnimationFrame(sl)
    else phase.value = 'dead'
  }
  requestAnimationFrame(sl)
}

// ─── DRAW ──────────────────────────────────────────────────────
function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)

  // Sky
  const sk = ctx.createLinearGradient(0, 0, 0, H)
  sk.addColorStop(0,   '#06080e')
  sk.addColorStop(0.7, '#0d1220')
  sk.addColorStop(1,   '#111928')
  ctx.fillStyle = sk; ctx.fillRect(0, 0, W, H)

  // Stars (deterministic so they don't flicker)
  ctx.fillStyle = 'rgba(200,220,255,0.45)'
  for (let i = 0; i < 55; i++) {
    ctx.fillRect((i * 137.5 + frame * 0.04) % W, (i * 79.3) % (H - GH - 10), 1, 1)
  }

  // Clouds
  clouds.forEach(c => {
    ctx.fillStyle = `rgba(88,166,255,${c.a})`
    ctx.beginPath()
    ctx.ellipse(c.x + c.w * 0.3, c.y, c.w * 0.28, 13, 0, 0, Math.PI * 2)
    ctx.ellipse(c.x + c.w * 0.58, c.y - 5, c.w * 0.22, 10, 0, 0, Math.PI * 2)
    ctx.ellipse(c.x + c.w * 0.72, c.y + 2, c.w * 0.18, 9, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  // Pipes
  pipes.forEach(p => {
    // Pipe colour gradient (left to right)
    const pg = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0)
    pg.addColorStop(0,   '#162616'); pg.addColorStop(0.4, '#234823'); pg.addColorStop(1, '#0e1a0e')

    // Top pipe
    ctx.fillStyle = pg; ctx.fillRect(p.x, 0, PIPE_W, p.tH)
    ctx.fillStyle = '#3fb950'; ctx.fillRect(p.x - 5, p.tH - 14, PIPE_W + 10, 14)
    ctx.fillStyle = 'rgba(63,185,80,0.4)'; ctx.fillRect(p.x, 0, 3, p.tH - 14)
    ctx.fillStyle = 'rgba(63,185,80,0.15)'; ctx.fillRect(p.x + PIPE_W - 3, 0, 3, p.tH - 14)

    // Bottom pipe
    const bT = p.tH + PIPE_GAP
    ctx.fillStyle = pg; ctx.fillRect(p.x, bT, PIPE_W, H - GH - bT)
    ctx.fillStyle = '#3fb950'; ctx.fillRect(p.x - 5, bT, PIPE_W + 10, 14)
    ctx.fillStyle = 'rgba(63,185,80,0.4)'; ctx.fillRect(p.x, bT + 14, 3, H - GH - bT - 14)
    ctx.fillStyle = 'rgba(63,185,80,0.15)'; ctx.fillRect(p.x + PIPE_W - 3, bT + 14, 3, H - GH - bT - 14)
  })

  // Ground
  const gg = ctx.createLinearGradient(0, H - GH, 0, H)
  gg.addColorStop(0, '#1a2a12'); gg.addColorStop(1, '#0e1a08')
  ctx.fillStyle = gg; ctx.fillRect(0, H - GH, W, GH)
  ctx.fillStyle = '#3fb950'; ctx.fillRect(0, H - GH, W, 3)
  ctx.fillStyle = 'rgba(63,185,80,0.18)'; ctx.fillRect(0, H - GH + 3, W, 4)

  // Ground stripes scrolling
  ctx.strokeStyle = 'rgba(63,185,80,0.08)'; ctx.lineWidth = 1
  const go = (frame * 0.9) % 40
  for (let gx = -go; gx < W; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx, H - GH + 3); ctx.lineTo(gx, H); ctx.stroke()
  }

  // Plane (only when alive)
  if (phase.value === 'playing') drawPlane(px(), py, vy)

  // Mid-game score watermark
  if (phase.value === 'playing') {
    ctx.fillStyle = 'rgba(255,255,255,0.09)'
    ctx.font = `bold ${Math.min(W * 0.13, 50)}px Orbitron, monospace`
    ctx.textAlign = 'center'
    ctx.fillText(score.value, W / 2, 54)
    ctx.textAlign = 'left'
  }

  // Sparks
  sparks.forEach(s => {
    ctx.globalAlpha = Math.max(0, s.life / 48)
    ctx.fillStyle = s.c
    ctx.fillRect(s.x - 2.5, s.y - 2.5, 5, 5)
  })
  ctx.globalAlpha = 1

  // Pause banner
  if (paused && phase.value === 'playing') {
    ctx.fillStyle = 'rgba(7,10,14,0.7)'; ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Orbitron, monospace'
    ctx.textAlign = 'center'; ctx.fillText('PAUSED — P to resume', W / 2, H / 2)
    ctx.textAlign = 'left'
  }
}

function drawPlane(x, y, vel) {
  ctx.save()
  const tilt = Math.max(-0.42, Math.min(0.52, vel * 0.044))
  ctx.translate(x + PW / 2, y + PH / 2)
  ctx.rotate(tilt)

  // Engine trail
  const tr = ctx.createLinearGradient(-PW / 2 - 22, 0, -PW / 2, 0)
  tr.addColorStop(0, 'rgba(88,166,255,0)'); tr.addColorStop(1, 'rgba(88,166,255,0.3)')
  ctx.fillStyle = tr; ctx.fillRect(-PW / 2 - 24, -4, 24, 8)

  // Fuselage
  ctx.fillStyle = '#dce8f8'
  ctx.beginPath(); ctx.ellipse(0, 0, PW / 2, PH / 2 - 3, 0, 0, Math.PI * 2); ctx.fill()

  // Cockpit
  ctx.fillStyle = '#58a6ff'
  ctx.beginPath(); ctx.ellipse(PW / 2 - 10, -1, 8, 5, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.beginPath(); ctx.ellipse(PW / 2 - 11, -3, 3, 1.8, -0.3, 0, Math.PI * 2); ctx.fill()

  // Top wing
  ctx.fillStyle = '#b8ccec'
  ctx.beginPath(); ctx.moveTo(-2, -3); ctx.lineTo(10, -17); ctx.lineTo(16, -14); ctx.lineTo(6, -3); ctx.closePath(); ctx.fill()

  // Bottom wing
  ctx.fillStyle = '#a0b8d8'
  ctx.beginPath(); ctx.moveTo(-2, 3); ctx.lineTo(6, 14); ctx.lineTo(12, 12); ctx.lineTo(6, 3); ctx.closePath(); ctx.fill()

  // Tail fin
  ctx.fillStyle = '#b8ccec'
  ctx.beginPath(); ctx.moveTo(-PW / 2 + 4, -1); ctx.lineTo(-PW / 2 + 4, -12); ctx.lineTo(-PW / 2 + 13, -3); ctx.closePath(); ctx.fill()

  // Engine pod
  ctx.fillStyle = '#2c3440'
  ctx.beginPath(); ctx.ellipse(-PW / 2 + 4, 0, 7, 4.5, 0, 0, Math.PI * 2); ctx.fill()

  // Engine glow
  const eg = ctx.createRadialGradient(-PW / 2 + 4, 0, 0, -PW / 2 + 4, 0, 9)
  eg.addColorStop(0, 'rgba(88,166,255,0.8)'); eg.addColorStop(1, 'rgba(88,166,255,0)')
  ctx.fillStyle = eg
  ctx.beginPath(); ctx.ellipse(-PW / 2 + 4, 0, 9, 7, 0, 0, Math.PI * 2); ctx.fill()

  ctx.restore()
}

// ─── INPUT ─────────────────────────────────────────────────────
function onTap() {
  if (phase.value === 'playing') { vy = FLAP_VEL; held = true; setTimeout(() => { held = false }, 140) }
}

function onKD(e) {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && phase.value === 'playing') {
    e.preventDefault(); vy = FLAP_VEL; held = true
  }
  if (e.code === 'KeyP' && phase.value === 'playing') paused = !paused
}
function onKU(e) {
  if (e.code === 'Space' || e.code === 'ArrowUp') held = false
}

// ─── START ─────────────────────────────────────────────────────
function startGame() {
  const canvas = canvasEl.value, wrap = wrapEl.value
  if (!canvas || !wrap) return
  W = canvas.width  = wrap.clientWidth
  H = canvas.height = wrap.clientHeight
  ctx = canvas.getContext('2d')
  reset()
  phase.value = 'playing'
  if (rafId) cancelAnimationFrame(rafId)
  loop()
}

// ─── LIFECYCLE ─────────────────────────────────────────────────
watch(() => props.active, a => { if (!a && rafId) { cancelAnimationFrame(rafId); rafId = null } })

document.addEventListener('keydown', onKD)
document.addEventListener('keyup',   onKU)
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  document.removeEventListener('keydown', onKD)
  document.removeEventListener('keyup',   onKU)
})
</script>

<style scoped>
:root { --cp-muted: #8b949e; }

.game-body {
  display: flex; flex-direction: column; height: 100%;
  background: #06080e; font-family: 'Rajdhani', sans-serif;
}

.cp-wrap {
  flex: 1; position: relative; overflow: hidden; cursor: pointer;
}

.cp-canvas {
  display: block; width: 100%; height: 100%;
  touch-action: none;
}

.cp-hint {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px; color: #4a5568;
  text-align: center; padding: 6px 0;
  flex-shrink: 0;
}

.game-overlay {
  position: absolute; inset: 0;
  background: rgba(4,6,14,0.9);
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
}

.go-inner {
  display: flex; flex-direction: column;
  align-items: center; gap: 11px;
  text-align: center; padding: 24px 32px;
}

.go-plane-anim {
  font-size: 42px; line-height: 1;
  animation: planeBob 1.8s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 14px rgba(88,166,255,0.55));
}
@keyframes planeBob {
  from { transform: translateY(-5px) rotate(-5deg); }
  to   { transform: translateY(5px)  rotate(5deg); }
}

.go-title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(16px, 4vw, 28px); font-weight: 900;
  letter-spacing: 5px; color: #fff;
}

.go-tagline { font-size: 12px; color: #8b949e; letter-spacing: 0.5px; }
.go-record { font-family: 'Share Tech Mono', monospace; font-size: 12px; color: #8b949e; }
.go-record strong { color: #ffd700; }

.go-scores { display: flex; gap: 28px; margin: 2px 0; }
.go-score-col { text-align: center; }
.go-score-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px; color: #4a5568; letter-spacing: 2px; margin-bottom: 3px;
}
.go-score-val {
  font-family: 'Orbitron', monospace; font-size: 22px; font-weight: 700; color: #fff;
}

.go-btn {
  margin-top: 4px; padding: 11px 34px;
  font-family: 'Orbitron', sans-serif; font-size: 12px;
  font-weight: 700; letter-spacing: 4px;
  background: #58a6ff; color: #000; border: none; border-radius: 6px;
  cursor: pointer; transition: all 0.18s ease;
  box-shadow: 0 0 22px rgba(88,166,255,0.35);
}
.go-btn:hover { background: #7bbcff; transform: scale(1.04); }

.go-hint {
  font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #4a5568;
}
</style>
