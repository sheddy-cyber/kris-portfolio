<template>
  <div class="game-body">
    <div class="game-challenge-banner">
      <div class="gcb-trophy">🏆</div>
      <div class="gcb-text">
        <div class="gcb-title">CAN YOU BEAT MY HIGH SCORE?</div>
        <div class="gcb-sub">My record: <strong>{{ KRIS_SCORE.toLocaleString() }} pts</strong> — Dare you try?</div>
      </div>
    </div>

    <div class="game-wrap">
      <div class="game-hud">
        <div class="hud-item">
          <div class="hud-label">YOUR SCORE</div>
          <div class="hud-val">{{ score.toLocaleString() }}</div>
        </div>
        <div class="hud-item hud-center">
          <div class="hud-label">MY HIGH SCORE</div>
          <div class="hud-val hud-rival">{{ KRIS_SCORE.toLocaleString() }}</div>
        </div>
        <div class="hud-item hud-right">
          <div class="hud-label">LEVEL</div>
          <div class="hud-val">{{ level }}</div>
        </div>
      </div>

      <canvas ref="canvasEl"></canvas>

      <div class="game-controls-hint">← → MOVE &nbsp;|&nbsp; SPACE SHOOT &nbsp;|&nbsp; P PAUSE</div>

      <!-- Overlay (start / game over) -->
      <div v-if="overlayVisible" class="game-overlay">
        <div class="go-inner">
          <div class="go-title">{{ overlayTitle }}</div>
          <div class="go-tagline">{{ overlayTagline }}</div>
          <div class="go-record">🏆 My record: <strong>{{ KRIS_SCORE.toLocaleString() }} pts</strong></div>

          <!-- score comparison after game over -->
          <div v-if="gameOverVisible" style="display:flex;gap:32px;justify-content:center;margin:4px 0;">
            <div style="text-align:center;">
              <div style="font-family:var(--font-mono);font-size:9px;color:var(--text-2);letter-spacing:2px;margin-bottom:4px;">YOUR SCORE</div>
              <div :style="`font-family:'Orbitron',monospace;font-size:26px;color:${beatKris?'#ffd700':'#fff'}`">{{ score.toLocaleString() }}</div>
            </div>
            <div style="text-align:center;">
              <div style="font-family:var(--font-mono);font-size:9px;color:var(--text-2);letter-spacing:2px;margin-bottom:4px;">MY BEST</div>
              <div style="font-family:'Orbitron',monospace;font-size:26px;color:#ffd700">{{ KRIS_SCORE.toLocaleString() }}</div>
            </div>
          </div>

          <button class="go-btn" @click="startGame">▶ {{ gameOverVisible ? 'PLAY AGAIN' : 'LAUNCH GAME' }}</button>
          <div class="go-controls">← → Move &nbsp;&nbsp; SPACE Shoot &nbsp;&nbsp; P Pause</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({ active: Boolean })

const KRIS_SCORE = 2847
const canvasEl = ref(null)
const score  = ref(0)
const level  = ref(1)
const overlayVisible  = ref(true)
const gameOverVisible = ref(false)
const beatKris = ref(false)
const overlayTitle   = ref('SPACE INVADERS')
const overlayTagline = ref('Defend Earth. Beat my score. Get famous.')

let animId = null
let stopFn = null

function startGame() {
  if (stopFn) stopFn()
  score.value = 0
  level.value = 1
  overlayVisible.value  = false
  gameOverVisible.value = false
  beatKris.value = false

  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')
  const wrap = canvas.parentElement
  canvas.width  = Math.min(560, wrap.clientWidth  - 24)
  canvas.height = Math.min(320, wrap.clientHeight - 160)
  const CW = canvas.width, CH = canvas.height

  const P = { w: 36, h: 18, x: CW/2 - 18, y: CH - 30, spd: 4 }
  let bullets = [], eBullets = [], particles = [], frameCount = 0
  let shootCD = 0, eMoveTimer = 0, eMoveInterval = 60, eShootTimer = 0
  let enemyDir = 1
  let lives = 3
  let running = true

  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * CW, y: Math.random() * CH,
    r: Math.random() * 1.2 + 0.3, spd: Math.random() * 0.4 + 0.1,
  }))

  function makeEnemies() {
    const list = []
    const cols = 9, rows = 3
    const xOff = (CW - cols * 32) / 2
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        list.push({ x: xOff + c*32, y: 32 + r*28, w: 20, h: 14, alive: true, row: r })
    return list
  }
  let enemies = makeEnemies()

  function explode(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2, s = Math.random() * 3 + 1
      particles.push({ x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 30, color })
    }
  }

  const keys = {}
  function onKey(e) {
    keys[e.code] = e.type === 'keydown'
    if (e.code === 'Space') e.preventDefault()
    if (e.code === 'KeyP' && e.type === 'keydown') paused = !paused
  }
  let paused = false
  document.addEventListener('keydown', onKey)
  document.addEventListener('keyup',   onKey)

  function endGame() {
    running = false
    cancelAnimationFrame(animId)
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('keyup',   onKey)
    beatKris.value = score.value > KRIS_SCORE
    overlayTitle.value   = beatKris.value ? '🏆 YOU BEAT ME!' : 'GAME OVER'
    overlayTagline.value = beatKris.value ? 'Unbelievable. You actually did it.' : "I'm still the champion... for now."
    overlayVisible.value  = true
    gameOverVisible.value = true
  }

  stopFn = () => {
    running = false
    cancelAnimationFrame(animId)
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('keyup',   onKey)
  }

  function update() {
    if (paused) return
    frameCount++
    if (keys['ArrowLeft'])  P.x = Math.max(0, P.x - P.spd)
    if (keys['ArrowRight']) P.x = Math.min(CW - P.w, P.x + P.spd)
    if (keys['Space'] && shootCD <= 0) { bullets.push({ x: P.x+P.w/2, y: P.y, spd: 7 }); shootCD = 18 }
    if (shootCD > 0) shootCD--

    bullets  = bullets.filter(b => { b.y -= b.spd; return b.y > 0 })
    eBullets = eBullets.filter(b => { b.y += b.spd; return b.y < CH })

    // Enemy move
    eMoveTimer++
    if (eMoveTimer >= eMoveInterval) {
      eMoveTimer = 0
      const alive = enemies.filter(e => e.alive)
      const rmost = alive.reduce((m,e) => Math.max(m, e.x+e.w), 0)
      const lmost = alive.reduce((m,e) => Math.min(m, e.x), CW)
      let drop = false
      if (enemyDir > 0 && rmost >= CW - 4) { enemyDir = -1; drop = true }
      if (enemyDir < 0 && lmost  <= 4)      { enemyDir =  1; drop = true }
      alive.forEach(e => { e.x += enemyDir * 16; if (drop) e.y += 14 })
      eMoveInterval = Math.max(8, 60 - level.value*5 - Math.floor((27 - alive.length)*1.5))
    }

    // Enemy shoot
    eShootTimer++
    const sRate = Math.max(40, 120 - level.value * 15)
    if (eShootTimer >= sRate) {
      eShootTimer = 0
      const alive = enemies.filter(e => e.alive)
      if (alive.length) {
        const s = alive[Math.floor(Math.random() * alive.length)]
        eBullets.push({ x: s.x + s.w/2, y: s.y + s.h, spd: 3 + level.value * 0.5 })
      }
    }

    // Bullet vs enemy
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi]
      for (let ei = 0; ei < enemies.length; ei++) {
        const e = enemies[ei]
        if (!e.alive) continue
        if (b.x > e.x && b.x < e.x+e.w && b.y > e.y && b.y < e.y+e.h) {
          e.alive = false; bullets.splice(bi, 1)
          score.value += (3 - e.row) * 10 + 10
          explode(e.x + e.w/2, e.y + e.h/2, e.row===0?'#f85149':e.row===1?'#d29922':'#3fb950')
          break
        }
      }
    }

    // Enemy bullet vs player
    for (let bi = eBullets.length - 1; bi >= 0; bi--) {
      const b = eBullets[bi]
      if (b.x > P.x && b.x < P.x+P.w && b.y > P.y && b.y < P.y+P.h) {
        eBullets.splice(bi, 1); lives--
        explode(P.x + P.w/2, P.y + P.h/2, '#58a6ff')
        if (lives <= 0) { endGame(); return }
      }
    }

    if (enemies.some(e => e.alive && e.y + e.h >= P.y)) { endGame(); return }

    if (!enemies.some(e => e.alive)) {
      level.value++
      enemies = makeEnemies()
      eMoveInterval = Math.max(8, 60 - level.value*5)
      bullets = []; eBullets = []
    }

    particles = particles.filter(p => { p.x+=p.vx; p.y+=p.vy; p.life--; return p.life>0 })
    stars.forEach(s => { s.y += s.spd; if (s.y > CH) s.y = 0 })
  }

  function draw() {
    ctx.clearRect(0, 0, CW, CH)

    stars.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
      ctx.fillStyle = `rgba(200,220,255,${s.r*0.4})`; ctx.fill()
    })

    ctx.strokeStyle = 'rgba(88,166,255,0.15)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, CH-18); ctx.lineTo(CW, CH-18); ctx.stroke()

    const ecols = ['#f85149','#d29922','#3fb950']
    enemies.forEach(e => {
      if (!e.alive) return
      ctx.fillStyle = ecols[e.row]; ctx.globalAlpha = 0.9
      ctx.fillRect(e.x+2, e.y+4, e.w-4, e.h-6)
      ctx.fillRect(e.x+6, e.y, e.w-12, 6)
      const t = Math.floor(frameCount/12) % 2
      if (t === 0) { ctx.fillRect(e.x, e.y+8, 4, 6); ctx.fillRect(e.x+e.w-4, e.y+8, 4, 6) }
      else         { ctx.fillRect(e.x+2, e.y+10, 4, 4); ctx.fillRect(e.x+e.w-6, e.y+10, 4, 4) }
      ctx.globalAlpha = 1
    })

    ctx.fillStyle = '#58a6ff'; ctx.globalAlpha = 0.95
    ctx.fillRect(P.x+2, P.y+8, P.w-4, P.h-8)
    ctx.fillRect(P.x+P.w/2-5, P.y, 10, 10)
    ctx.fillRect(P.x, P.y+12, 8, 6)
    ctx.fillRect(P.x+P.w-8, P.y+12, 8, 6)
    ctx.fillStyle = '#a5d6ff'
    ctx.fillRect(P.x+P.w/2-4, P.y+P.h-2 + Math.sin(frameCount*0.3)*2, 8, 3)
    ctx.globalAlpha = 1

    ctx.fillStyle = '#58a6ff'
    bullets.forEach(b => { ctx.shadowColor='#58a6ff'; ctx.shadowBlur=8; ctx.fillRect(b.x-1.5, b.y, 3, 10) })
    ctx.shadowBlur = 0

    ctx.fillStyle = '#f85149'
    eBullets.forEach(b => { ctx.shadowColor='#f85149'; ctx.shadowBlur=6; ctx.fillRect(b.x-1.5, b.y, 3, 8) })
    ctx.shadowBlur = 0

    particles.forEach(p => { ctx.globalAlpha = p.life/30; ctx.fillStyle = p.color; ctx.fillRect(p.x-2, p.y-2, 4, 4) })
    ctx.globalAlpha = 1

    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = '#58a6ff'; ctx.globalAlpha = 0.6
      ctx.fillRect(8 + i*16, CH-14, 12, 8)
    }
    ctx.globalAlpha = 1

    if (paused) {
      ctx.fillStyle = 'rgba(7,10,14,0.75)'; ctx.fillRect(0, 0, CW, CH)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Orbitron,monospace'; ctx.textAlign = 'center'
      ctx.fillText('PAUSED — press P to resume', CW/2, CH/2)
      ctx.textAlign = 'left'
    }
  }

  function loop() {
    if (!running) return
    update(); draw()
    animId = requestAnimationFrame(loop)
  }
  loop()
}

// Stop game when window loses focus / is closed
watch(() => props.active, active => { if (!active && stopFn) { stopFn(); stopFn = null } })
onUnmounted(() => { if (stopFn) stopFn() })
</script>
