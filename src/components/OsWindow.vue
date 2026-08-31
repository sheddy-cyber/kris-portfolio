<template>
  <div
    class="os-window"
    :class="{
      'is-focused': isFocused,
      'is-minimized': win.minimized,
      'is-maximized': win.maximized,
      'is-snapped-left': win.snapped === 'left',
      'is-snapped-right': win.snapped === 'right'
    }"
    :style="windowStyle"
    @mousedown.self="$emit('focus')"
  >
    <!-- Title Bar -->
    <div class="win-titlebar" @mousedown="startDrag" @dblclick="toggleMax">
      <div class="win-dots">
        <button
          class="win-dot close"
          title="Close"
          aria-label="Close"
          @mousedown.stop
          @click.stop="$emit('close')"
          @mouseenter="showTip('Close Window', $event)"
          @mouseleave="hideTip"
        ></button>
        <button
          class="win-dot min"
          title="Minimize"
          aria-label="Minimize"
          @mousedown.stop
          @click.stop="$emit('minimize')"
          @mouseenter="showTip('Minimize to Taskbar', $event)"
          @mouseleave="hideTip"
        ></button>
        <button
          class="win-dot max"
          title="Maximize"
          aria-label="Maximize"
          @mousedown.stop
          @click.stop="toggleMax"
          @mouseenter="showTip('Maximize / Restore', $event)"
          @mouseleave="hideTip"
        ></button>
      </div>

      <div class="win-title">
        <span class="win-title-dot"></span>
        {{ win.title }}
      </div>

      <div class="win-badge">{{ win.badge }}</div>
    </div>

    <!-- Window Body Content -->
    <div class="win-body" @mousedown="$emit('focus')">
      <slot />
    </div>

    <!-- Resize handle -->
    <div v-if="!win.maximized && !win.snapped" class="win-resize" @mousedown.stop="startResize"></div>
  </div>

  <!-- Dot tooltip teleported to body -->
  <Teleport to="body">
    <div v-if="tip.visible" class="dot-tooltip" :style="{ left: tip.x + 'px', top: tip.y + 'px' }">
      {{ tip.label }}
    </div>
  </Teleport>
</template>

<script setup>
import { computed, reactive, onUnmounted } from 'vue'

const props = defineProps({
  win: { type: Object, required: true },
  isFocused: { type: Boolean, default: false },
})

const emit = defineEmits(['focus', 'close', 'minimize', 'maximize', 'drag', 'resize', 'snap'])

const windowStyle = computed(() => {
  if (props.win.maximized) {
    return {
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%',
      zIndex: props.win.z,
      borderRadius: '0px'
    }
  }
  if (props.win.snapped === 'left') {
    return {
      left: '0px',
      top: '0px',
      width: '50%',
      height: '100%',
      zIndex: props.win.z,
      borderRadius: '0px'
    }
  }
  if (props.win.snapped === 'right') {
    return {
      left: '50%',
      top: '0px',
      width: '50%',
      height: '100%',
      zIndex: props.win.z,
      borderRadius: '0px'
    }
  }
  return {
    left: props.win.x + 'px',
    top: props.win.y + 'px',
    width: props.win.w + 'px',
    height: props.win.h + 'px',
    zIndex: props.win.z,
  }
})

function toggleMax() {
  emit('maximize')
}

// ── DOT TOOLTIP ────────────────────────────────────
const tip = reactive({ visible: false, label: '', x: 0, y: 0 })
let tipTimer = null

function showTip(label, e) {
  clearTimeout(tipTimer)
  const r = e.target.getBoundingClientRect()
  tip.label = label
  tip.x = r.left + r.width / 2
  tip.y = r.top - 8
  tip.visible = true
}

function hideTip() {
  tipTimer = setTimeout(() => { tip.visible = false }, 60)
}

// ── DRAG & SNAP ────────────────────────────────────
let dragState = null

function startDrag(e) {
  if (e.target.classList.contains('win-dot')) return
  emit('focus')
  dragState = { sx: e.clientX, sy: e.clientY }
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  e.preventDefault()
}

function onDragMove(e) {
  if (!dragState) return
  const dx = e.clientX - dragState.sx
  const dy = e.clientY - dragState.sy
  dragState.sx = e.clientX
  dragState.sy = e.clientY
  emit('drag', { dx, dy, clientX: e.clientX, clientY: e.clientY })
}

function onDragEnd(e) {
  dragState = null
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}

// ── RESIZE ─────────────────────────────────────────
let resizeState = null

function startResize(e) {
  emit('focus')
  resizeState = { sx: e.clientX, sy: e.clientY }
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
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
  window.removeEventListener('mouseup', onResizeEnd)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
  clearTimeout(tipTimer)
})
</script>

<style scoped>
.os-window {
  position: absolute;
  min-width: 360px;
  min-height: 220px;
  background: var(--surface-glass);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05);
  pointer-events: all;
  overflow: hidden;
  animation: windowOpen 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: border-color 0.2s, box-shadow 0.2s;
}

@keyframes windowOpen {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.os-window.is-focused {
  border-color: var(--border-glow);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75), 0 0 20px var(--accent-glow);
}

.os-window.is-minimized {
  display: none;
}

.os-window.is-maximized {
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 0 !important;
  border: none !important;
}

.win-titlebar {
  height: 38px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--bg-3) 0%, var(--bg-2) 100%);
  border-bottom: 1px solid var(--border-2);
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
  cursor: grab;
  user-select: none;
}

.win-titlebar:active {
  cursor: grabbing;
}

.win-dots {
  display: flex;
  gap: 7px;
  align-items: center;
}

.win-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer !important;
  transition: transform 0.15s, filter 0.15s;
}

.win-dot:hover {
  transform: scale(1.18);
  filter: brightness(1.25);
}

.win-dot.close { background: #ff5f57; }
.win-dot.min { background: #febc2e; }
.win-dot.max { background: #28c840; }

.win-title {
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-1);
  margin-left: 6px;
  flex: 1;
  letter-spacing: 1px;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 6px;
}

.win-title-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}

.is-focused .win-title {
  color: var(--text-0);
}

.win-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 20px;
  background: var(--accent-dim);
  color: var(--accent);
  border: 1px solid var(--border);
  pointer-events: none;
}

.win-body {
  flex: 1;
  min-height: 0;
  height: calc(100% - 38px);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.win-resize {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 18px;
  height: 18px;
  cursor: se-resize !important;
  z-index: 10;
  opacity: 0.4;
  transition: opacity 0.15s;
}

.win-resize::after {
  content: '';
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-bottom: 2px solid var(--accent);
  border-right: 2px solid var(--accent);
}

.os-window:hover .win-resize {
  opacity: 0.9;
}
</style>
