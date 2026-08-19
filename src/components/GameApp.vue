<template>
  <div class="game-body">
    <!-- Challenge Header Banner -->
    <div class="game-challenge-banner">
      <div class="gcb-trophy">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4a2 2 0 0 1-2-2V5h4v4zm12 0h2a2 2 0 0 0 2-2V5h-4v4z"/><path d="M6 5h12v6a6 6 0 0 1-12 0V5z"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>
      </div>
      <div class="gcb-text">
        <div class="gcb-title">QUANTUM PILOT</div>
        <div class="gcb-sub">
          <span class="gcb-sub-desktop">Kris's Developer Record: <strong>{{ KRIS_SCORE }} PTS</strong> — Think you can beat me?</span>
          <span class="gcb-sub-mobile">KRIS'S RECORD: <strong>{{ KRIS_SCORE }} PTS</strong></span>
        </div>
      </div>
    </div>

    <!-- Live Game HUD -->
    <div class="game-hud">
      <div class="hud-item">
        <div class="hud-label"><span class="desktop-only">YOUR </span>SCORE</div>
        <div class="hud-val" :class="{ 'beat-kris': score > KRIS_SCORE }">{{ score }}</div>
      </div>
      <div class="hud-item hud-center">
        <div class="hud-label">COMBO<span class="desktop-only"> MULTIPLIER</span></div>
        <div class="hud-val hud-combo">{{ combo }}x</div>
      </div>
      <div class="hud-item hud-center hud-item-rival">
        <div class="hud-label">KRIS'S RECORD</div>
        <div class="hud-val hud-rival">{{ KRIS_SCORE }}</div>
      </div>
      <div class="hud-item hud-right">
        <div class="hud-label"><span class="desktop-only">YOUR </span>BEST</div>
        <div class="hud-val" :style="{ color: playerBest > KRIS_SCORE ? 'var(--amber)' : 'var(--text-0)' }">{{ playerBest }}</div>
      </div>
    </div>

    <!-- Canvas Play Area -->
    <div class="cp-wrap" ref="wrapEl" @mousedown="onAreaClick" @touchstart="onAreaTouch">
      <canvas ref="canvasEl" class="cp-canvas"></canvas>

      <!-- Overlay States (Start / Game Over) -->
      <div v-if="phase !== 'playing'" class="game-overlay">
        <div class="go-inner">
          <template v-if="phase === 'start'">
            <div class="go-plane-anim">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 19 21 12 17 5 21 12 2"/></svg>
            </div>
            <div class="go-title">QUANTUM PILOT</div>
            <div class="go-tagline">Click/Tap to Fly & Blast Lasers · Dodge Cyber Towers</div>
            <div class="go-record">KRIS'S RECORD: <strong>{{ KRIS_SCORE }} PTS</strong></div>
            <button class="go-btn" @click.stop="startGame" @touchend.stop.prevent="startGame">▶ ENGAGE FLIGHT</button>
            <div class="go-hint">Left-Click/Tap = Thruster & Fire &nbsp;·&nbsp; Spacebar = Fire Laser &nbsp;·&nbsp; P = Pause</div>
          </template>

          <template v-if="phase === 'dead'">
            <div class="go-plane-anim" style="animation:none;">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="var(--red)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div class="go-title" :style="{ color: score > KRIS_SCORE ? 'var(--amber)' : 'var(--red)' }">
              {{ score > KRIS_SCORE ? 'RECORD SHATTERED!' : 'SYSTEM CRASHED!' }}
            </div>
            <div class="go-tagline">
              {{ score > KRIS_SCORE
                ? 'Incredible! You beat Kris Shedrach on his own operating system.'
                : 'Systems offline. Reroute backup power and try again.' }}
            </div>

            <div class="go-scores">
              <div class="go-score-col">
                <div class="go-score-label">FINAL SCORE</div>
                <div class="go-score-val" :style="{ color: score > KRIS_SCORE ? 'var(--amber)' : '#ffffff' }">{{ score }}</div>
              </div>
              <div class="go-score-col">
                <div class="go-score-label">KRIS'S RECORD</div>
                <div class="go-score-val" style="color:var(--amber)">{{ KRIS_SCORE }}</div>
              </div>
              <div class="go-score-col">
                <div class="go-score-label">YOUR BEST</div>
                <div class="go-score-val" style="color:#ffffff">{{ playerBest }}</div>
              </div>
            </div>

            <button class="go-btn" @click.stop="startGame" @touchend.stop.prevent="startGame">▶ RESTART MISSION</button>
          </template>
        </div>
      </div>
    </div>

    <!-- Controls Bar -->
    <div class="cp-hint">
      <span>CLICK / TAP / SPACE: THRUST & SHOOT</span>
      <span>|</span>
      <span>DESTROY DRONES FOR 5x COMBO</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { soundFx } from '../audio/soundFx'

const props = defineProps({
  active: { type: Boolean, default: true }
})

const KRIS_SCORE = 1560
const LS_KEY = 'kris_portfolio_best_score_v2'

const canvasEl = ref(null)
const wrapEl = ref(null)
const phase = ref('start')
const score = ref(0)
const combo = ref(1)
const playerBest = ref(0)

let ctx, W, H
let rafId = null
let py, vy, held
let pipes, lasers, drones, particles, frame
let paused = false

onMounted(() => {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved !== null) playerBest.value = parseInt(saved, 10) || 0
  } catch (_) {}

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('resize', onResize)

  nextTick(() => {
    initCanvas(true)
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('resize', onResize)
  if (rafId) cancelAnimationFrame(rafId)
})

function onResize() {
  initCanvas(false)
}

watch(() => props.active, val => {
  if (val) {
    nextTick(() => {
      initCanvas(false)
    })
  }
})

watch(playerBest, val => {
  try { localStorage.setItem(LS_KEY, String(val)) } catch (_) {}
})

function initCanvas(isGameReset = false) {
  if (!canvasEl.value || !wrapEl.value) return
  const newW = wrapEl.value.clientWidth || 580
  const newH = wrapEl.value.clientHeight || 340
  if (newW === 0 || newH === 0) return
  W = canvasEl.value.width = newW
  H = canvasEl.value.height = newH
  ctx = canvasEl.value.getContext('2d')
  if (isGameReset || phase.value !== 'playing') {
    reset()
    draw()
  }
}

const BASE_PIPE_SPEED = 2.4
const BASE_DRONE_SPEED = 3.0
const BASE_SPAWN_INTERVAL = 115

let nextPipeFrame = BASE_SPAWN_INTERVAL

function reset() {
  py = (H || 340) * 0.45
  vy = 0
  held = false
  pipes = []
  lasers = []
  drones = []
  particles = []
  frame = 0
  nextPipeFrame = BASE_SPAWN_INTERVAL
  score.value = 0
  combo.value = 1
}

function startGame() {
  soundFx.playClick()
  initCanvas(true)
  reset()
  phase.value = 'playing'
  if (!rafId) loop()
}

function onAreaClick(e) {
  if (phase.value !== 'playing') return
  onFlap()
}

function onAreaTouch(e) {
  if (phase.value !== 'playing') return
  if (e.cancelable) e.preventDefault()
  onFlap()
}

function onFlap() {
  vy = -5.6
  shootLaser()
}

function shootLaser() {
  soundFx.playLaser()
  const speedMult = 1 + Math.min(1.2, frame / 18000)
  lasers.push({
    x: W * 0.22 + 24,
    y: py + 10,
    vx: 8.5 + speedMult * 1.5
  })
}

function onKeyDown(e) {
  if (e.code === 'Space') {
    e.preventDefault()
    if (phase.value === 'playing') {
      vy = -5.6
      shootLaser()
    } else if (phase.value !== 'playing') {
      startGame()
    }
  } else if (e.code === 'KeyP') {
    paused = !paused
  }
}

function onKeyUp(e) {
  if (e.code === 'Space') held = false
}

function loop() {
  rafId = requestAnimationFrame(loop)
  if (paused || phase.value !== 'playing') {
    draw()
    return
  }

  frame++

  // Progressive slow speed scaling (gentle slope over extended survival time)
  const speedMult = 1 + Math.min(1.2, frame / 18000)
  const currentPipeSpeed = BASE_PIPE_SPEED * speedMult
  const currentDroneSpeed = BASE_DRONE_SPEED * speedMult

  // Physics
  vy += 0.24
  if (vy > 7.5) vy = 7.5
  py += vy

  // Spawn obstacles with spatial compensation
  if (frame >= nextPipeFrame) {
    const gap = Math.max(120, 138 - Math.min(16, Math.floor(frame / 6000) * 4))
    const minH = 40
    const maxH = H - gap - 60
    const topH = minH + Math.random() * (maxH - minH)
    pipes.push({ x: W + 10, topH, gap, passed: false })

    // Spawn rogue drone occasionally
    if (Math.random() > 0.35) {
      drones.push({
        x: W + 30,
        y: topH + gap / 2 + (Math.random() - 0.5) * 40,
        vx: currentDroneSpeed,
        alive: true
      })
    }

    const currentInterval = Math.max(68, Math.round(BASE_SPAWN_INTERVAL / speedMult))
    nextPipeFrame = frame + currentInterval
  }

  // Update Lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].x += lasers[i].vx
    if (lasers[i].x > W + 20) {
      lasers.splice(i, 1)
      continue
    }

    // Check drone hits
    for (let j = drones.length - 1; j >= 0; j--) {
      const d = drones[j]
      if (d.alive && Math.hypot(lasers[i]?.x - d.x, lasers[i]?.y - d.y) < 20) {
        d.alive = false
        soundFx.playExplosion()
        score.value += 3 * combo.value
        combo.value++
        createSparks(d.x, d.y, '#f59e0b', 16)
        lasers.splice(i, 1)
        break
      }
    }
  }

  // Update Drones
  for (let i = drones.length - 1; i >= 0; i--) {
    drones[i].x -= drones[i].vx
    if (drones[i].x < -30) {
      drones.splice(i, 1)
      continue
    }
    // Ship touching the ball collects/destroys it safely with bonus points instead of ending the game
    if (drones[i].alive && Math.hypot(W * 0.22 - drones[i].x, py - drones[i].y) < 24) {
      drones[i].alive = false
      soundFx.playExplosion()
      score.value += 2 * combo.value
      combo.value++
      createSparks(drones[i].x, drones[i].y, '#f59e0b', 14)
    }
  }

  // Update Pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i]
    p.x -= currentPipeSpeed

    if (!p.passed && p.x < W * 0.22) {
      p.passed = true
      score.value += 1 * combo.value
      if (score.value > playerBest.value) playerBest.value = score.value
    }

    if (p.x < -60) {
      pipes.splice(i, 1)
      continue
    }

    // Collision box
    const px = W * 0.22
    const pw = 34
    const ph = 20
    if (px + pw > p.x && px < p.x + 50) {
      if (py < p.topH || py + ph > p.topH + p.gap) {
        doCrash()
        return
      }
    }
  }

  // Ground / Sky Collision
  if (py <= 0 || py + 20 >= H) {
    doCrash()
    return
  }

  // Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const pt = particles[i]
    pt.x += pt.vx
    pt.y += pt.vy
    pt.life--
    if (pt.life <= 0) particles.splice(i, 1)
  }

  draw()
}

function createSparks(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const spd = Math.random() * 4 + 1
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 20 + Math.random() * 15,
      color: color || '#00f2fe'
    })
  }
}

function doCrash() {
  soundFx.playExplosion()
  createSparks(W * 0.22, py, '#f43f5e', 30)
  cancelAnimationFrame(rafId)
  rafId = null
  setTimeout(() => {
    phase.value = 'dead'
  }, 400)
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)

  // Background Nebula
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0, '#06090e')
  bg.addColorStop(1, '#0c1420')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Cyber Grid Lines (scrolling with current speed)
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)'
  ctx.lineWidth = 1
  const speedMult = 1 + Math.min(1.2, frame / 18000)
  const gridOffset = (frame * BASE_PIPE_SPEED * speedMult * 0.4) % 40
  for (let x = -gridOffset; x < W + 40; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }

  // Pipes / Neon Towers
  pipes.forEach(p => {
    ctx.fillStyle = '#121924'
    ctx.strokeStyle = '#00f2fe'
    ctx.lineWidth = 2

    // Top Tower
    ctx.fillRect(p.x, 0, 50, p.topH)
    ctx.strokeRect(p.x, 0, 50, p.topH)

    // Bottom Tower
    const botY = p.topH + p.gap
    const botH = H - botY
    ctx.fillRect(p.x, botY, 50, botH)
    ctx.strokeRect(p.x, botY, 50, botH)
  })

  // Drones
  drones.forEach(d => {
    if (!d.alive) return
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.arc(d.x, d.y, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.stroke()
  })

  // Lasers
  lasers.forEach(l => {
    ctx.fillStyle = '#00f2fe'
    ctx.shadowColor = '#00f2fe'
    ctx.shadowBlur = 10
    ctx.fillRect(l.x, l.y, 14, 3)
    ctx.shadowBlur = 0
  })

  // Player Ship
  const px = W * 0.22
  ctx.fillStyle = '#f8fafc'
  ctx.shadowColor = '#00f2fe'
  ctx.shadowBlur = 12
  ctx.beginPath()
  ctx.moveTo(px + 24, py + 10)
  ctx.lineTo(px, py)
  ctx.lineTo(px + 6, py + 10)
  ctx.lineTo(px, py + 20)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0

  // Particles
  particles.forEach(pt => {
    ctx.fillStyle = pt.color
    ctx.fillRect(pt.x, pt.y, 2, 2)
  })
}
</script>

<style scoped>
.game-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
  background: #06090e;
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
  overflow: hidden;
  box-sizing: border-box;
}

.game-challenge-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.gcb-trophy { font-size: 20px; }
.gcb-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--accent);
}
.gcb-sub {
  font-size: 10px;
  color: var(--text-1);
}
.gcb-sub strong { color: var(--amber); }

.game-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-glass-card);
  border-bottom: 1px solid var(--border);
  padding: 8px 16px;
  flex-shrink: 0;
}

.hud-item {
  display: flex;
  flex-direction: column;
}
.hud-center { align-items: center; }
.hud-right { align-items: flex-end; }

.hud-label {
  font-size: 8px;
  letter-spacing: 1px;
  color: var(--text-2);
}

.hud-val {
  font-family: 'Orbitron', monospace;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-0);
}
.hud-combo { color: var(--green); }
.hud-rival { color: var(--amber); }
.beat-kris { color: var(--amber); text-shadow: 0 0 10px var(--amber); }

.cp-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.cp-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.game-overlay {
  position: absolute;
  inset: 0;
  background: rgba(6, 9, 14, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.go-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 24px;
}

.go-plane-anim {
  font-size: 36px;
  color: #ffffff;
  animation: pulse 1s infinite alternate;
}

.go-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #ffffff;
}

.go-tagline {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.go-record {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}
.go-record strong { color: var(--amber); }

.go-btn {
  padding: 12px 32px;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 0 20px var(--accent-glow);
  transition: all 0.15s;
}
.go-btn:hover {
  background: #7bbcff;
  transform: scale(1.05);
}

.go-hint {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.55);
}

.go-scores {
  display: flex;
  gap: 20px;
  background: rgba(14, 20, 30, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 20px;
}

.go-score-col {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.go-score-label {
  font-size: 8px;
  color: rgba(255, 255, 255, 0.6);
}

.go-score-val {
  font-family: 'Orbitron', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.cp-hint {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 6px;
  font-size: 9px;
  color: var(--text-2);
  background: var(--bg-1);
  border-top: 1px solid var(--border);
}

.gcb-sub-mobile {
  display: none;
}

@media (max-width: 600px) {
  .game-challenge-banner {
    padding: 6px 12px;
    gap: 8px;
  }
  .gcb-title {
    font-size: 10px;
    letter-spacing: 1px;
  }
  .gcb-sub-desktop {
    display: none;
  }
  .gcb-sub-mobile {
    display: inline;
    font-size: 9px;
  }

  .game-hud {
    padding: 6px 12px;
  }
  .hud-item-rival {
    display: none; /* Avoid duplication with top challenge target */
  }
  .hud-val {
    font-size: 13px;
  }
  .hud-label {
    font-size: 7.5px;
  }
  .desktop-only {
    display: none;
  }

  .go-inner {
    padding: 16px;
    gap: 8px;
  }
  .go-plane-anim {
    font-size: 24px;
  }
  .go-plane-anim svg {
    width: 26px;
    height: 26px;
  }
  .go-title {
    font-size: 18px;
    letter-spacing: 2px;
  }
  .go-tagline {
    font-size: 10.5px;
    max-width: 270px;
  }
  .go-record {
    font-size: 10px;
  }
  .go-btn {
    padding: 10px 24px;
    font-size: 11px;
    letter-spacing: 1.5px;
  }
  .go-hint {
    display: none; /* Suppress keyboard instructions on mobile */
  }

  .go-scores {
    gap: 12px;
    padding: 8px 14px;
  }
  .go-score-label {
    font-size: 7px;
  }
  .go-score-val {
    font-size: 14px;
  }

  .cp-hint {
    display: none; /* Maximize vertical canvas height for mobile gaming */
  }
}
</style>
