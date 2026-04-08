<template>
  <Teleport to="body">
    <!-- Main crosshair cursor -->
    <div class="cursor-ring"     :style="ringStyle"></div>
    <div class="cursor-dot"      :style="dotStyle"></div>

    <!-- Trail particles -->
    <div
      v-for="p in trail"
      :key="p.id"
      class="cursor-trail"
      :style="{
        left:    p.x + 'px',
        top:     p.y + 'px',
        opacity: p.life / TRAIL_MAX_LIFE,
        transform: `translate(-50%, -50%) scale(${p.life / TRAIL_MAX_LIFE})`,
        background: p.color,
      }"
    ></div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// ── CONFIG ────────────────────────────────────────
const TRAIL_MAX_LIFE  = 22   // frames a trail dot lives
const TRAIL_INTERVAL  = 3    // spawn a trail dot every N mousemove events
const TRAIL_COLORS    = ['#58a6ff','#7bcfff','#3fb950','#58a6ff','#a5d6ff']

// ── STATE ─────────────────────────────────────────
const mx = ref(-200)         // mouse x (off-screen until first move)
const my = ref(-200)         // mouse y
const rx = ref(-200)         // ring x (lerped)
const ry = ref(-200)         // ring y (lerped)
const clicking = ref(false)
const trail    = reactive([])

let moveCount  = 0
let trailId    = 0
let rafId      = null

// ── COMPUTED STYLES ───────────────────────────────
const dotStyle = computed(() => ({
  left:      mx.value + 'px',
  top:       my.value + 'px',
  transform: `translate(-50%, -50%) scale(${clicking.value ? 0.5 : 1})`,
}))

const ringStyle = computed(() => ({
  left:      rx.value + 'px',
  top:       ry.value + 'px',
  transform: `translate(-50%, -50%) scale(${clicking.value ? 1.5 : 1})`,
}))

// ── MOUSE HANDLERS ────────────────────────────────
function onMouseMove(e) {
  mx.value = e.clientX
  my.value = e.clientY

  // Spawn trail particle every N moves
  moveCount++
  if (moveCount % TRAIL_INTERVAL === 0) {
    trail.push({
      id:    trailId++,
      x:     e.clientX,
      y:     e.clientY,
      life:  TRAIL_MAX_LIFE,
      color: TRAIL_COLORS[trailId % TRAIL_COLORS.length],
    })
    // Keep array lean
    if (trail.length > 40) trail.splice(0, trail.length - 40)
  }
}

function onMouseDown() { clicking.value = true  }
function onMouseUp()   { clicking.value = false }

// ── ANIMATION LOOP ────────────────────────────────
function tick() {
  // Lerp ring toward dot (smooth lag effect)
  rx.value += (mx.value - rx.value) * 0.18
  ry.value += (my.value - ry.value) * 0.18

  // Age trail particles
  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].life--
    if (trail[i].life <= 0) trail.splice(i, 1)
  }

  rafId = requestAnimationFrame(tick)
}

// ── LIFECYCLE ─────────────────────────────────────
onMounted(() => {
  window.addEventListener('mousemove',  onMouseMove, { passive: true })
  window.addEventListener('mousedown',  onMouseDown)
  window.addEventListener('mouseup',    onMouseUp)
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove',  onMouseMove)
  window.removeEventListener('mousedown',  onMouseDown)
  window.removeEventListener('mouseup',    onMouseUp)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* Hide the default system cursor globally when this component mounts */
:global(*) { cursor: none !important; }

/* ── Dot — sharp centre point ── */
.cursor-dot {
  position: fixed;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px #58a6ff, 0 0 12px rgba(88,166,255,0.5);
  pointer-events: none;
  z-index: 2147483647;
  transition: transform 0.08s ease;
  will-change: transform, left, top;
}

/* ── Ring — crosshair that lags behind ── */
.cursor-ring {
  position: fixed;
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(88,166,255,0.75);
  pointer-events: none;
  z-index: 2147483646;
  transition: transform 0.12s ease;
  will-change: transform, left, top;
  /* Crosshair tick marks */
  box-shadow:
    0   -10px 0 0 rgba(88,166,255,0.4),   /* top tick */
    0    10px 0 0 rgba(88,166,255,0.4),   /* bottom tick */
    -10px  0  0 0 rgba(88,166,255,0.4),   /* left tick */
    10px   0  0 0 rgba(88,166,255,0.4);   /* right tick */
}

/* ── Trail dots ── */
.cursor-trail {
  position: fixed;
  width: 5px; height: 5px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 2147483645;
  will-change: opacity, transform;
}
</style>
