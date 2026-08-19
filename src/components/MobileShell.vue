<template>
  <div class="mobile-os-shell">
    <!-- Top Cyber Dynamic Island & Status Bar -->
    <div class="mob-status-bar">
      <div class="msb-left">
        <span class="msb-carrier">KRIS.OS 5G</span>
        <span class="msb-theme-tag">{{ currentTheme.toUpperCase() }}</span>
      </div>

      <!-- Center Dynamic Island -->
      <div class="dynamic-island" @click="openApp('terminal')" title="Launch Hacker Terminal">
        <span class="di-dot" :class="{ live: isRadioPlaying }"></span>
        <span class="di-text">{{ isRadioPlaying ? `▶ ${currentTrack.title}` : 'KRIS SHEDRACH' }}</span>
      </div>

      <div class="msb-right">
        <span class="msb-clock">{{ clock }}</span>
        <span class="msb-battery"><svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" style="display:inline-block;vertical-align:middle;margin-right:2px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>98%</span>
      </div>
    </div>

    <!-- Mobile Screen Viewport -->
    <div class="mob-viewport">
      <!-- 1: Profile -->
      <div v-show="activeApp === 'about'" class="mob-app-screen">
        <AboutApp @open-app="openApp" @notify="$emit('notify', $event)" />
      </div>

      <!-- 2: Works -->
      <div v-show="activeApp === 'works'" class="mob-app-screen">
        <WorksApp @notify="$emit('notify', $event)" />
      </div>

      <!-- 3: Services -->
      <div v-show="activeApp === 'services'" class="mob-app-screen">
        <ServicesApp @open-app="openApp" @prefill-contact="$emit('prefill-contact', $event)" />
      </div>

      <!-- 4: Contact -->
      <div v-show="activeApp === 'contact'" class="mob-app-screen">
        <ContactApp :initialService="contactPrefill" @notify="$emit('notify', $event)" />
      </div>

      <!-- 5: Game -->
      <div v-show="activeApp === 'game'" class="mob-app-screen">
        <GameApp :active="activeApp === 'game'" />
      </div>

      <!-- Background / Island apps -->
      <div v-show="activeApp === 'radio'" class="mob-app-screen">
        <SynthRadioApp />
      </div>
      <div v-show="activeApp === 'terminal'" class="mob-app-screen">
        <TerminalApp @set-theme="$emit('select-theme', $event)" @open-app="openApp" @notify="$emit('notify', $event)" />
      </div>
      <div v-show="activeApp === 'sysmon'" class="mob-app-screen">
        <SysMonApp :openWindows="[]" />
      </div>
    </div>

    <!-- Mobile Settings Bottom Sheet Modal Overlay -->
    <Transition name="mob-sheet">
      <div v-if="mobileSettingsOpen" class="mob-settings-overlay" @click="mobileSettingsOpen = false">
        <div
          class="mob-settings-modal"
          :style="isDragging ? { transform: `translateY(${dragOffset}px)`, transition: 'none' } : {}"
          @click.stop
        >
          <!-- Pull-down Handle Section -->
          <div
            class="mob-sheet-handle"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          >
            <div class="mob-sheet-bar-wrap">
              <div class="mob-sheet-bar"></div>
            </div>
            <button class="mob-sheet-close" @click="mobileSettingsOpen = false" title="Close Settings">✕</button>
          </div>
          <QuickSettings
            isMobileView
            :currentTheme="currentTheme"
            :currentWallpaper="currentWallpaper"
            :scanlinesEnabled="scanlinesEnabled"
            @select-theme="$emit('select-theme', $event)"
            @select-wallpaper="$emit('select-wallpaper', $event)"
            @toggle-scanlines="$emit('toggle-scanlines')"
          />
        </div>
      </div>
    </Transition>

    <!-- Bottom Cyber Dock -->
    <nav class="mob-cyber-dock">
      <button
        v-for="app in dockApps"
        :key="app.id"
        class="mob-dock-item"
        :class="{ active: app.id === 'settings' ? mobileSettingsOpen : (activeApp === app.id && !mobileSettingsOpen) }"
        @click="openApp(app.id)"
      >
        <div class="mdi-icon" v-html="app.icon"></div>
        <span class="mdi-label">{{ app.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { soundFx } from '../audio/soundFx'
import { synthRadio } from '../audio/synthMusic'
import AboutApp from './AboutApp.vue'
import WorksApp from './WorksApp.vue'
import ServicesApp from './ServicesApp.vue'
import ContactApp from './ContactApp.vue'
import GameApp from './GameApp.vue'
import QuickSettings from './QuickSettings.vue'
import TerminalApp from './TerminalApp.vue'
import SysMonApp from './SysMonApp.vue'
import SynthRadioApp from './SynthRadioApp.vue'

const props = defineProps({
  clock: { type: String, default: '12:00' },
  currentTheme: { type: String, default: 'twitter' },
  currentWallpaper: { type: String, default: 'none' },
  scanlinesEnabled: { type: Boolean, default: false },
  contactPrefill: { type: String, default: '' },
})

const emit = defineEmits(['notify', 'select-theme', 'select-wallpaper', 'toggle-scanlines', 'prefill-contact'])

const activeApp = ref('about')
const mobileSettingsOpen = ref(false)
const isRadioPlaying = computed(() => synthRadio.isPlaying)
const currentTrack = computed(() => synthRadio.currentTrack)

// Pull down to dismiss gesture state
const dragOffset = ref(0)
const isDragging = ref(false)
let startY = 0

function onTouchStart(e) {
  if (!e.touches || e.touches.length === 0) return
  startY = e.touches[0].clientY
  isDragging.value = true
  dragOffset.value = 0
}

function onTouchMove(e) {
  if (!isDragging.value || !e.touches || e.touches.length === 0) return
  const currentY = e.touches[0].clientY
  const delta = currentY - startY
  if (delta > 0) {
    dragOffset.value = delta
  } else {
    dragOffset.value = 0
  }
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (dragOffset.value > 60) {
    soundFx.playClick()
    mobileSettingsOpen.value = false
  }
  dragOffset.value = 0
}

const dockApps = [
  {
    id: 'about',
    label: 'Profile',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>`
  },
  {
    id: 'works',
    label: 'Works',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
  },
  {
    id: 'services',
    label: 'Services',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  },
  {
    id: 'game',
    label: 'Game',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="14" r="1" fill="currentColor"/></svg>`
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
  },
]

function openApp(id) {
  soundFx.playClick()
  if (id === 'settings') {
    mobileSettingsOpen.value = !mobileSettingsOpen.value
    return
  }
  mobileSettingsOpen.value = false
  activeApp.value = id
}
</script>

<style scoped>
.mobile-os-shell {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-0);
  font-family: 'JetBrains Mono', 'Rajdhani', sans-serif;
  overflow: hidden;
  z-index: 1000;
}

.mob-status-bar {
  height: 44px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  flex-shrink: 0;
  z-index: 20;
}

.msb-left, .msb-right {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--text-1);
}

.msb-theme-tag {
  font-size: 8px;
  background: var(--bg-3);
  color: var(--accent);
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid var(--border);
}

.dynamic-island {
  background: #000;
  border: 1px solid var(--border-2);
  border-radius: 20px;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  max-width: 140px;
  overflow: hidden;
}

.di-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.di-dot.live {
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
  animation: pulse 1s infinite alternate;
}

.di-text {
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mob-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.mob-app-screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mob-cyber-dock {
  height: 64px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 6px;
  padding-bottom: env(safe-area-inset-bottom, 4px);
  flex-shrink: 0;
  z-index: 20;
}

.mob-settings-screen {
  overflow-y: auto;
}

.mob-dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 5px 2px;
  border-radius: 8px;
  transition: all 0.15s;
  flex: 1;
  min-width: 0;
}

.mob-dock-item.active {
  color: var(--accent);
  background: var(--accent-dim);
}

.mdi-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mdi-label {
  font-size: 8.5px;
  font-weight: 600;
  white-space: nowrap;
}

/* Mobile Settings Modal Overlay (Rests directly on top of the bottom dock) */
.mob-settings-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: calc(64px + env(safe-area-inset-bottom, 4px));
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  z-index: 18;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.mob-settings-modal {
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--border-2);
  border-bottom: 1px solid var(--border-2);
  border-radius: 18px 18px 0 0;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 -10px 36px rgba(0, 0, 0, 0.75), 0 0 0 1px var(--border-glow);
  padding-bottom: 12px;
}

.mob-sheet-handle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 2px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(24px);
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
}

.mob-sheet-bar-wrap {
  flex: 1;
  display: flex;
  justify-content: center;
  padding-left: 26px;
}

.mob-sheet-bar {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: var(--text-2);
  opacity: 0.5;
}

.mob-sheet-close {
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-1);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.mob-sheet-close:hover {
  background: var(--bg-3);
  color: var(--accent);
  border-color: var(--accent);
}

/* Modal Bottom-Sheet Transition */
.mob-sheet-enter-active,
.mob-sheet-leave-active {
  transition: opacity 0.22s ease;
}

.mob-sheet-enter-from,
.mob-sheet-leave-to {
  opacity: 0;
}

.mob-sheet-enter-active .mob-settings-modal,
.mob-sheet-leave-active .mob-settings-modal {
  transition: transform 0.25s cubic-bezier(0.32, 1, 0.23, 1);
}

.mob-sheet-enter-from .mob-settings-modal,
.mob-sheet-leave-to .mob-settings-modal {
  transform: translateY(100%);
}

:deep(.ws-tip) {
  display: none !important;
}
</style>
