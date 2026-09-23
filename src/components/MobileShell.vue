<template>
  <div class="mobile-os-shell">
    <!-- Top Cyber Status Bar: Centered Pill -->
    <div class="mob-status-bar">
      <button
        class="dynamic-island"
        :class="{ active: mobileSettingsOpen }"
        @click="toggleSettings"
        title="Control Center"
      >
        <span class="di-text">◈ KS.CONTROL</span>
      </button>
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
      <div v-show="activeApp === 'blog'" class="mob-app-screen">
        <BlogApp @notify="$emit('notify', $event)" />
      </div>
    </div>

    <!-- Mobile Settings Top-Down HUD Dropdown Overlay -->
    <Transition name="mob-settings-dropdown">
      <div v-if="mobileSettingsOpen" class="mob-settings-overlay" @click="closeSettings">
        <div class="mob-settings-modal" @click.stop>
          <div class="mob-dropdown-header">
            <div class="mob-dropdown-indicator">
              <span class="mdi-hud-dot"></span>
              <span class="mdi-hud-label">KS.OS // CONTROL PANEL</span>
            </div>
            <button class="mob-dropdown-close" @click="closeSettings" title="Close Settings">✕</button>
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
        :class="{ active: activeApp === app.id && !mobileSettingsOpen }"
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
import BlogApp from './BlogApp.vue'
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

function toggleSettings() {
  soundFx.playClick()
  mobileSettingsOpen.value = !mobileSettingsOpen.value
}

function closeSettings() {
  soundFx.playClick()
  mobileSettingsOpen.value = false
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
    id: 'blog',
    label: 'Articles',
    icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
  },
]

function openApp(id) {
  soundFx.playClick()
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
  font-family: 'IBM Plex Mono', 'Rajdhani', sans-serif;
  overflow: hidden;
  z-index: 1000;
}

.mob-status-bar {
  height: 48px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  flex-shrink: 0;
  z-index: 20;
}

.dynamic-island {
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  border-radius: 20px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
  font-family: inherit;
  transition: all 0.2s ease;
}

.dynamic-island:hover,
.dynamic-island:active,
.dynamic-island.active {
  border-color: var(--accent);
  background: var(--bg-3);
  box-shadow: 0 0 16px var(--accent-glow);
}


.di-text {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--text-0);
  white-space: nowrap;
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
  padding: 10px 4px;
  min-height: 44px;
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

/* Mobile Settings Top-Down HUD Dropdown Overlay */
.mob-settings-overlay {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  bottom: calc(64px + env(safe-area-inset-bottom, 4px));
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 12px 14px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mob-settings-modal {
  width: 100%;
  max-width: 440px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid var(--border-2);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--border-glow), 0 0 24px var(--accent-glow);
  padding-bottom: 10px;
  transform-origin: top center;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.mob-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.mob-dropdown-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mdi-hud-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
}

.mdi-hud-label {
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--text-2);
}

.mob-dropdown-close {
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-1);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mob-dropdown-close:hover,
.mob-dropdown-close:active {
  background: var(--bg-3);
  color: var(--accent);
  border-color: var(--accent);
  transform: scale(1.05);
}

/* Modal Top-Down Dropdown Animation */
.mob-settings-dropdown-enter-active,
.mob-settings-dropdown-leave-active {
  transition: opacity 0.25s ease;
}

.mob-settings-dropdown-enter-from,
.mob-settings-dropdown-leave-to {
  opacity: 0;
}

.mob-settings-dropdown-enter-active .mob-settings-modal {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.25s ease;
}

.mob-settings-dropdown-leave-active .mob-settings-modal {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.18s ease,
              filter 0.18s ease;
}

.mob-settings-dropdown-enter-from .mob-settings-modal {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
  filter: blur(4px);
}

.mob-settings-dropdown-leave-to .mob-settings-modal {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
  filter: blur(2px);
}

:deep(.ws-tip) {
  display: none !important;
}
</style>
