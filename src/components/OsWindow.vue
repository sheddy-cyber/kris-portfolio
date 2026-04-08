<template>
  <div
    class="os-window"
    :class="{ 'is-focused': isFocused, 'is-minimized': win.minimized, 'is-maximized': win.maximized }"
    :style="windowStyle"
    @mousedown.self="$emit('focus')"
  >
    <!-- Title Bar -->
    <div class="win-titlebar" @mousedown="startDrag">
      <div class="win-dots">
        <div
          class="win-dot close"
          @mousedown.stop
          @click.stop="$emit('close')"
          @mouseenter="showTip('Close', $event)"
          @mouseleave="hideTip"
        ></div>
        <div
          class="win-dot min"
          @mousedown.stop
          @click.stop="$emit('minimize')"
          @mouseenter="showTip('Minimise', $event)"
          @mouseleave="hideTip"
        ></div>
        <div
          class="win-dot max"
          @mousedown.stop
          @click.stop="$emit('maximize')"
          @mouseenter="showTip('Maximise', $event)"
          @mouseleave="hideTip"
        ></div>
      </div>
      <div class="win-title">{{ win.title }}</div>
      <div class="win-badge">{{ win.badge }}</div>
    </div>

    <!-- Content slot -->
    <div class="win-body" @mousedown="$emit('focus')">
      <slot />
    </div>

    <!-- Resize handle -->
    <div class="win-resize" @mousedown.stop="startResize"></div>
  </div>

  <!-- Dot tooltip teleported to body so it's never clipped by overflow:hidden -->
  <Teleport to="body">
    <div v-if="tip.visible" class="dot-tooltip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
      {{ tip.label }}
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive, onUnmounted } from 'vue'

const props = defineProps({
  win:       { type: Object, required: true },
  isFocused: { type: Boolean, default: false },
})

const emit = defineEmits(['focus', 'close', 'minimize', 'maximize', 'drag', 'resize'])

const windowStyle = computed(() => {
  if (props.win.maximized) return { zIndex: props.win.z }
  return {
    left:   props.win.x + 'px',
    top:    props.win.y + 'px',
    width:  props.win.w + 'px',
    height: props.win.h + 'px',
    zIndex: props.win.z,
  }
})

// ── DOT TOOLTIP (teleported to body) ─────────────
const tip = reactive({ visible: false, label: '', x: 0, y: 0 })
let tipTimer = null

function showTip(label, e) {
  clearTimeout(tipTimer)
  const r = e.target.getBoundingClientRect()
  tip.label   = label
  tip.x       = r.left + r.width / 2
  tip.y       = r.top - 10          // above the dot; CSS will translate up
  tip.visible = true
}
function hideTip() {
  tipTimer = setTimeout(() => { tip.visible = false }, 80)
}

// ── DRAG ─────────────────────────────────────────
let dragState = null

function startDrag(e) {
  if (e.target.classList.contains('win-dot')) return
  if (props.win.maximized) return
  emit('focus')
  dragState = { sx: e.clientX, sy: e.clientY }
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup',   onDragEnd)
  e.preventDefault()
}

function onDragMove(e) {
  if (!dragState) return
  const dx = e.clientX - dragState.sx
  const dy = e.clientY - dragState.sy
  dragState.sx = e.clientX
  dragState.sy = e.clientY
  emit('drag', { dx, dy })
}

function onDragEnd() {
  dragState = null
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup',   onDragEnd)
}

// ── RESIZE ───────────────────────────────────────
let resizeState = null

function startResize(e) {
  emit('focus')
  resizeState = { sx: e.clientX, sy: e.clientY }
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup',   onResizeEnd)
  e.preventDefault()
}

function onResizeMove(e) {
  if (!resizeState) return
  const dw = e.clientX - resizeState.sx
  const dh = e.clientY - resizeState.sy
  resizeState.sx = e.clientX
  resizeState.sy = e.clientY
  emit('resize', { dw, dh })
}

function onResizeEnd() {
  resizeState = null
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup',   onResizeEnd)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup',   onDragEnd)
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup',   onResizeEnd)
  clearTimeout(tipTimer)
})
</script>
