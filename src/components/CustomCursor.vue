<template>
  <Teleport to="body">
    <template v-if="!isTouch">
      <!-- Main Crosshair Dot -->
      <div class="cursor-dot" :class="{ clicking }" :style="dotStyle"></div>
      
      <!-- Outer Dynamic Reticle Ring -->
      <div class="cursor-ring" :class="{ clicking, hovering }" :style="ringStyle">
        <div class="reticle-line top"></div>
        <div class="reticle-line bottom"></div>
        <div class="reticle-line left"></div>
        <div class="reticle-line right"></div>
      </div>

      <!-- Particle Trail -->
      <div
        v-for="p in trail"
        :key="p.id"
        class="cursor-trail"
        :style="{
          left: p.x + 'px',
          top: p.y + 'px',
          opacity: p.life / TRAIL_MAX_LIFE,
          transform: `translate(-50%, -50%) scale(${p.life / TRAIL_MAX_LIFE})`,
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`
        }"
      ></div>
    </template>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const isTouch = ref(false)
const TRAIL_MAX_LIFE = 18
const TRAIL_INTERVAL = 2
const TRAIL_COLORS = ['#00f2fe', '#38bdf8', '#818cf8', '#10b981', '#ffffff']

const mx = ref(-200)
const my = ref(-200)
const rx = ref(-200)
const ry = ref(-200)
const clicking = ref(false)
const hovering = ref(false)
const trail = reactive([])

let moveCount = 0
let trailId = 0
let rafId = null

const dotStyle = computed(() => ({
  left: mx.value + 'px',
  top: my.value + 'px',
  transform: `translate(-50%, -50%) scale(${clicking.value ? 0.6 : (hovering.value ? 1.4 : 1)})`,
}))

const ringStyle = computed(() => ({
  left: rx.value + 'px',
  top: ry.value + 'px',
  transform: `translate(-50%, -50%) scale(${clicking.value ? 1.4 : (hovering.value ? 1.6 : 1)}) rotate(${moveCount * 2}deg)`,
}))

function onMouseMove(e) {
  mx.value = e.clientX
  my.value = e.clientY
  moveCount++

  if (moveCount % TRAIL_INTERVAL === 0) {
    trail.push({
      id: trailId++,
      x: e.clientX,
      y: e.clientY,
      life: TRAIL_MAX_LIFE,
      color: TRAIL_COLORS[trailId % TRAIL_COLORS.length],
    })
    if (trail.length > 30) trail.splice(0, trail.length - 30)
  }

  // Detect hover on interactive controls
  const target = e.target
  if (target && (
    target.tagName === 'BUTTON' ||
    target.tagName === 'A' ||
    target.tagName === 'INPUT' ||
    target.tagName === 'SELECT' ||
    target.tagName === 'TEXTAREA' ||
    target.closest('.desk-icon') ||
    target.closest('.tb-app') ||
    target.closest('.work-card') ||
    target.closest('.svc-card') ||
    target.closest('.comm-card') ||
    target.closest('.win-dot')
  )) {
    hovering.value = true
  } else {
    hovering.value = false
  }
}

function onMouseDown() { clicking.value = true }
function onMouseUp() { clicking.value = false }

function tick() {
  rx.value += (mx.value - rx.value) * 0.22
  ry.value += (my.value - ry.value) * 0.22
  for (let i = trail.length - 1; i >= 0; i--) {
    trail[i].life--
    if (trail[i].life <= 0) trail.splice(i, 1)
  }
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  isTouch.value = window.matchMedia('(pointer: coarse)').matches
  if (isTouch.value) return
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
:global(*) { cursor: none !important; }
@media (pointer: coarse) {
  :global(*) { cursor: auto !important; }
}

.cursor-dot {
  position: fixed;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 8px var(--accent), 0 0 16px var(--accent);
  pointer-events: none;
  z-index: 2147483647;
  transition: transform 0.08s ease;
  will-change: transform, left, top;
}

.cursor-ring {
  position: fixed;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1.2px solid var(--accent);
  pointer-events: none;
  z-index: 2147483646;
  transition: transform 0.12s ease, border-color 0.2s;
  will-change: transform, left, top;
  box-shadow: 0 0 12px var(--accent-glow);
}

.cursor-ring.hovering {
  border-color: #ffffff;
  box-shadow: 0 0 16px #ffffff;
}

.reticle-line {
  position: absolute;
  background: var(--accent);
}
.reticle-line.top { top: -6px; left: 50%; width: 1.5px; height: 4px; transform: translateX(-50%); }
.reticle-line.bottom { bottom: -6px; left: 50%; width: 1.5px; height: 4px; transform: translateX(-50%); }
.reticle-line.left { left: -6px; top: 50%; width: 4px; height: 1.5px; transform: translateY(-50%); }
.reticle-line.right { right: -6px; top: 50%; width: 4px; height: 1.5px; transform: translateY(-50%); }

.cursor-trail {
  position: fixed;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 2147483645;
  will-change: opacity, transform;
}
</style>
