<template>
  <div class="quick-settings-panel" @click.stop>
    <!-- Panel Header -->
    <div class="qs-header">
      <div class="qs-title">CONTROL CENTER</div>
      <div class="qs-badge">PORTFOLIO OS // SYSTEM CONFIG</div>
    </div>

    <!-- Master Quick Toggles Grid -->
    <div class="qs-toggles-grid">
      <!-- Audio FX Toggle -->
      <button class="qs-toggle-tile" :class="{ active: !isMuted }" @click="toggleMute">
        <div class="qt-icon">
          <svg v-if="isMuted" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </div>
        <div class="qt-text">
          <span class="qt-name">UI SOUNDS</span>
          <span class="qt-status">{{ isMuted ? 'MUTED' : 'ACTIVE' }}</span>
        </div>
      </button>

      <!-- Synth Radio Quick Toggle -->
      <button class="qs-toggle-tile" :class="{ active: isRadioPlaying }" @click="toggleRadio">
        <div class="qt-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
        </div>
        <div class="qt-text">
          <span class="qt-name">SYNTH RADIO</span>
          <span class="qt-status">{{ isRadioPlaying ? 'PLAYING' : 'OFF' }}</span>
        </div>
      </button>

      <!-- Scanlines FX Toggle -->
      <button class="qs-toggle-tile" :class="{ active: scanlinesEnabled }" @click="$emit('toggle-scanlines')">
        <div class="qt-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="6" y1="7" x2="18" y2="7"/><line x1="6" y1="10" x2="18" y2="10"/><line x1="6" y1="13" x2="18" y2="13"/></svg>
        </div>
        <div class="qt-text">
          <span class="qt-name">SCANLINES</span>
          <span class="qt-status">{{ scanlinesEnabled ? 'ENABLED' : 'OFF' }}</span>
        </div>
      </button>

      <!-- Fullscreen Toggle -->
      <button class="qs-toggle-tile" :class="{ active: isFullscreen }" @click="toggleFullscreen">
        <div class="qt-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </div>
        <div class="qt-text">
          <span class="qt-name">FULLSCREEN</span>
          <span class="qt-status">{{ isFullscreen ? 'ON' : 'OFF' }}</span>
        </div>
      </button>
    </div>

    <!-- Sliders Section -->
    <div class="qs-section">
      <div class="qs-slider-group">
        <div class="qs-slider-head">
          <span>MASTER VOLUME</span>
          <span>{{ Math.round(masterVolume * 100) }}%</span>
        </div>
        <input
          v-model.number="masterVolume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="qs-range"
          @input="onMasterVolumeChange"
        />
      </div>
    </div>

    <!-- Theme Palette Selector -->
    <div class="qs-section">
      <div class="qs-sec-label">SYSTEM THEME PALETTE</div>
      <div class="qs-themes-row">
        <button
          v-for="t in themes"
          :key="t.id"
          class="qs-theme-btn"
          :class="{ active: currentTheme === t.id }"
          @click="$emit('select-theme', t.id)"
        >
          <span class="theme-swatch" :style="{ background: t.color }"></span>
          <span>{{ t.name }}</span>
        </button>
      </div>
    </div>

    <!-- Wallpaper Interactive Mode Selector -->
    <div class="qs-section">
      <div class="qs-sec-label">AMBIENT BACKGROUND ENGINE</div>
      <div class="qs-wallpaper-row">
        <button
          v-for="w in wallpapers"
          :key="w.id"
          class="qs-wall-btn"
          :class="{ active: currentWallpaper === w.id }"
          @click="$emit('select-wallpaper', w.id)"
        >
          {{ w.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { soundFx } from '../audio/soundFx'
import { synthRadio } from '../audio/synthMusic'

const props = defineProps({
  currentTheme: { type: String, default: 'twitter' },
  currentWallpaper: { type: String, default: 'none' },
  scanlinesEnabled: { type: Boolean, default: false },
})

const emit = defineEmits(['select-theme', 'select-wallpaper', 'toggle-scanlines'])

const isMuted = ref(soundFx.muted)
const masterVolume = ref(soundFx.volume)
const isRadioPlaying = ref(synthRadio.isPlaying)
const isFullscreen = ref(false)

const themes = [
  { id: 'twitter', name: 'Twitter', color: '#1d9bf0' },
  { id: 'neo-tokyo', name: 'Tokyo', color: '#f43f5e' },
  { id: 'matrix', name: 'Matrix', color: '#22c55e' },
  { id: 'obsidian-gold', name: 'Solar', color: '#f59e0b' },
  { id: 'daylight', name: 'Daylight', color: '#0284c7' },
]

const wallpapers = [
  { id: 'none', label: '✕ None' },
  { id: 'particles', label: '✦ Particles' },
  { id: 'grid', label: '▦ Cyber Grid' },
  { id: 'starfield', label: '★ Starfield' },
]

function toggleMute() {
  isMuted.value = !isMuted.value
  soundFx.setMuted(isMuted.value)
  if (!isMuted.value) soundFx.playClick()
}

function toggleRadio() {
  soundFx.playClick()
  isRadioPlaying.value = synthRadio.togglePlay()
}

function onMasterVolumeChange() {
  soundFx.setVolume(masterVolume.value)
  synthRadio.setVolume(masterVolume.value)
}

function toggleFullscreen() {
  soundFx.playClick()
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {})
    isFullscreen.value = true
  } else {
    document.exitFullscreen().catch(() => {})
    isFullscreen.value = false
  }
}
</script>

<style scoped>
.quick-settings-panel {
  position: fixed;
  bottom: calc(var(--taskbar-h) + 10px);
  right: 16px;
  width: 320px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-2);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--border-glow);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 99990;
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
  animation: slideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.qs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}

.qs-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--accent);
}

.qs-badge {
  font-size: 8px;
  color: var(--text-2);
  letter-spacing: 0.5px;
}

.qs-toggles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.qs-toggle-tile {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text-1);
  text-align: left;
}

.qs-toggle-tile:hover {
  background: var(--bg-3);
  border-color: var(--accent);
}

.qs-toggle-tile.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.qt-icon {
  font-size: 18px;
}

.qt-text {
  display: flex;
  flex-direction: column;
}

.qt-name {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-0);
}

.qt-status {
  font-size: 8px;
  color: var(--text-2);
}

.qs-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.qs-sec-label {
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--text-2);
  font-weight: 700;
}

.qs-slider-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.qs-slider-head {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--text-1);
}

.qs-range {
  width: 100%;
  height: 4px;
  accent-color: var(--accent);
  cursor: pointer;
}

.qs-themes-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}

.qs-theme-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 2px;
  cursor: pointer;
  color: var(--text-2);
  font-family: inherit;
  font-size: 8px;
  transition: all 0.15s;
}

.qs-theme-btn:hover,
.qs-theme-btn.active {
  border-color: var(--accent);
  color: var(--text-0);
  background: var(--bg-3);
}

.theme-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

.qs-wallpaper-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.qs-wall-btn {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 5px 2px;
  font-family: inherit;
  font-size: 8px;
  color: var(--text-1);
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.qs-wall-btn:hover,
.qs-wall-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}
</style>
