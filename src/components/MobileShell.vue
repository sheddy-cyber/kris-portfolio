<template>
  <div class="mobile-os-shell">
    <!-- Top Cyber Dynamic Island & Status Bar -->
    <div class="mob-status-bar">
      <div class="msb-left">
        <span class="msb-carrier">KRIS.OS 5G</span>
        <span class="msb-theme-tag">{{ currentTheme.toUpperCase() }}</span>
      </div>

      <!-- Center Dynamic Island -->
      <div class="dynamic-island" @click="activeApp = 'radio'">
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
      <!-- App 1: About Me -->
      <div v-show="activeApp === 'about'" class="mob-app-screen">
        <AboutApp @open-app="openApp" @notify="$emit('notify', $event)" />
      </div>

      <!-- App 2: Services -->
      <div v-show="activeApp === 'services'" class="mob-app-screen">
        <ServicesApp @open-app="openApp" @prefill-contact="$emit('prefill-contact', $event)" />
      </div>

      <!-- App 3: Works / Portfolio -->
      <div v-show="activeApp === 'works'" class="mob-app-screen">
        <WorksApp @notify="$emit('notify', $event)" />
      </div>

      <!-- App 4: Interactive Terminal -->
      <div v-show="activeApp === 'terminal'" class="mob-app-screen">
        <TerminalApp @set-theme="$emit('select-theme', $event)" @open-app="openApp" @notify="$emit('notify', $event)" />
      </div>

      <!-- App 5: System Monitor -->
      <div v-show="activeApp === 'sysmon'" class="mob-app-screen">
        <SysMonApp :openWindows="[]" />
      </div>

      <!-- App 6: Synth Radio -->
      <div v-show="activeApp === 'radio'" class="mob-app-screen">
        <SynthRadioApp />
      </div>

      <!-- App 7: Space Game -->
      <div v-show="activeApp === 'game'" class="mob-app-screen">
        <GameApp :active="activeApp === 'game'" />
      </div>

      <!-- App 8: Contact -->
      <div v-show="activeApp === 'contact'" class="mob-app-screen">
        <ContactApp :initialService="contactPrefill" @notify="$emit('notify', $event)" />
      </div>
    </div>

    <!-- Bottom Cyber Dock -->
    <nav class="mob-cyber-dock">
      <button
        v-for="app in dockApps"
        :key="app.id"
        class="mob-dock-item"
        :class="{ active: activeApp === app.id }"
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
import ServicesApp from './ServicesApp.vue'
import WorksApp from './WorksApp.vue'
import TerminalApp from './TerminalApp.vue'
import SysMonApp from './SysMonApp.vue'
import SynthRadioApp from './SynthRadioApp.vue'
import GameApp from './GameApp.vue'
import ContactApp from './ContactApp.vue'

const props = defineProps({
  clock: { type: String, default: '12:00' },
  currentTheme: { type: String, default: 'twitter' },
  contactPrefill: { type: String, default: '' },
})

const emit = defineEmits(['notify', 'select-theme', 'prefill-contact'])

const activeApp = ref('about')
const isRadioPlaying = computed(() => synthRadio.isPlaying)
const currentTrack = computed(() => synthRadio.currentTrack)

const dockApps = [
  { id: 'about', label: 'Profile', icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>` },
  { id: 'works', label: 'Works', icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>` },
  { id: 'terminal', label: 'Terminal', icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>` },
  { id: 'radio', label: 'Radio', icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3"/></svg>` },
  { id: 'game', label: 'Game', icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="14" r="1" fill="currentColor"/></svg>` },
  { id: 'contact', label: 'Contact', icon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
]

function openApp(id) {
  soundFx.playClick()
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
  color: var(--text-0);
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

.mob-dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.15s;
  flex: 1;
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
  font-size: 9px;
  font-weight: 600;
}
</style>
