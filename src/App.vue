<template>
  <!-- Interactive Custom Reticle Cursor -->
  <CustomCursor />

  <!-- CRT Scanlines Overlay Toggle -->
  <div v-if="scanlinesEnabled" class="scanlines-overlay"></div>

  <!-- ══════════════════════════════════════ BOOT SEQUENCE SCREEN -->
  <Transition name="boot-fade" @after-leave="desktopVisible = true">
    <div v-if="booting" class="boot-screen">
      <div class="boot-content">
        <div class="boot-logo-wrap">
          <div class="boot-logo-ring"></div>
          <span class="boot-logo-text">KS</span>
        </div>
        <div class="boot-name">KRIS SHEDRACH</div>
        <div class="boot-version">PORTFOLIO OS v2.4.0 [QUANTUM CORE]</div>
        <div class="boot-bar-wrap">
          <div class="boot-bar" :style="{ width: bootPct + '%' }"></div>
        </div>
        <div class="boot-status">{{ bootStatus }}</div>
        <div class="boot-log" ref="bootLogEl">
          <div v-for="(l, i) in bootLines" :key="i">{{ l }}</div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- ══════════════════════════════════════ MOBILE CYBERPHONE OS -->
  <MobileShell
    v-if="desktopVisible && isMobile"
    :clock="clock"
    :currentTheme="currentTheme"
    :currentWallpaper="currentWallpaper"
    :scanlinesEnabled="scanlinesEnabled"
    :contactPrefill="contactPrefill"
    @select-theme="setTheme"
    @select-wallpaper="setWallpaper"
    @toggle-scanlines="scanlinesEnabled = !scanlinesEnabled"
    @notify="addNotification"
    @prefill-contact="contactPrefill = $event"
  />

  <!-- ══════════════════════════════════════ DESKTOP WORKSTATION OS -->
  <div v-if="desktopVisible && !isMobile" class="desktop" :data-theme="currentTheme">
    <!-- Ambient Canvas Wallpaper Engine -->
    <canvas ref="ambientCanvas" class="desktop-ambient-canvas"></canvas>
    <div class="desktop-ambient-glow"></div>

    <!-- Desktop Icons Grid -->
    <div class="desk-icons" @click="selectedIconId = null">
      <div
        v-for="app in appOrder"
        :key="app.id"
        class="desk-icon"
        :class="{ 'is-selected': selectedIconId === app.id }"
        :style="app.iconPos"
        @click.stop="onIconClick(app.id, $event)"
        @dblclick="onIconDblClick(app.id)"
      >
        <div class="di-icon" v-html="app.iconSvg"></div>
        <span class="di-label">{{ app.iconLabel }}</span>

        <!-- Small side tooltip on single click -->
        <Transition name="hint-pop">
          <div v-if="selectedIconId === app.id" class="desk-icon-hint">
            <span>double-click to open</span>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Desktop Windows Layer -->
    <div class="windows-layer">
      <OsWindow
        v-for="win in openWindows"
        :key="win.id"
        :win="win"
        :isFocused="focusedId === win.id"
        @focus="focusWindow(win.id)"
        @close="closeApp(win.id)"
        @minimize="minimize(win.id)"
        @maximize="toggleMaximize(win.id)"
        @drag="onDrag(win.id, $event)"
        @resize="onResize(win.id, $event)"
      >
        <AboutApp
          v-if="win.id === 'about'"
          @open-app="openApp"
          @notify="addNotification"
        />
        <ServicesApp
          v-if="win.id === 'services'"
          @open-app="openApp"
          @prefill-contact="contactPrefill = $event"
        />
        <WorksApp
          v-if="win.id === 'works'"
          @notify="addNotification"
        />
        <TerminalApp
          v-if="win.id === 'terminal'"
          @set-theme="setTheme"
          @open-app="openApp"
          @notify="addNotification"
        />
        <SysMonApp
          v-if="win.id === 'sysmon'"
          :openWindows="openWindows"
          @focus-app="focusWindow"
          @close-app="closeApp"
        />
        <SynthRadioApp
          v-if="win.id === 'radio'"
        />
        <GameApp
          v-if="win.id === 'game'"
          :active="focusedId === win.id && !win.minimized"
        />
        <ContactApp
          v-if="win.id === 'contact'"
          :initialService="contactPrefill"
          @notify="addNotification"
        />
      </OsWindow>
    </div>

    <!-- Desktop Taskbar -->
    <div class="taskbar">
      <!-- Start Button -->
      <button class="tb-start-btn" :class="{ active: startMenuOpen }" @click.stop="toggleStartMenu">
        <span>◈</span> KS.OS
      </button>

      <div class="tb-divider"></div>

      <!-- Open Windows App Tabs -->
      <div class="tb-apps">
        <div
          v-for="win in openWindows"
          :key="win.id"
          class="tb-app-tab"
          :class="{ 'is-active': focusedId === win.id, 'is-minimized': win.minimized }"
          @click="onTaskbarClick(win.id)"
        >
          <span class="tb-dot"></span>
          {{ win.title }}
          <button class="tb-tab-close" @click.stop="closeApp(win.id)">✕</button>
        </div>
      </div>

      <!-- System Tray (Right) -->
      <div class="tb-system-tray">
        <button class="tray-btn" @click="openApp('radio')" title="Synthwave.FM Radio">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.4M12 12h.01"/></svg>
          {{ isRadioPlaying ? currentTrack.title : 'RADIO' }}
        </button>
        <button class="tray-btn" @click="openApp('sysmon')" title="System Monitor">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
          CPU: {{ cpuVal }}%
        </button>
        <button class="tray-btn" @click.stop="toggleQuickSettings" title="Control Center">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
        <span class="tray-clock" @click.stop="toggleCalendar" title="Calendar / Time">{{ clock }}</span>
      </div>
    </div>

    <!-- Start Menu Flyout -->
    <div v-if="startMenuOpen" class="start-menu-panel" @click.stop>
      <div class="sm-header">
        <div class="sm-avatar-circle">
          <img src="/kris-avatar.jpg" alt="Kris Shedrach" />
        </div>
        <div>
          <div class="sm-title">KRIS SHEDRACH</div>
          <div class="sm-status">● PORTFOLIO OS ONLINE</div>
        </div>
      </div>
      <div class="sm-list">
        <div
          v-for="app in appOrder"
          :key="app.id"
          class="sm-item"
          @click="openApp(app.id); startMenuOpen = false"
        >
          <span class="sm-icon">◈</span>
          <span>{{ app.menuLabel }}</span>
        </div>
      </div>
      <div class="sm-footer">
        <span>KRIS SHEDRACH © 2025</span>
        <span>LAGOS // UTC+1</span>
      </div>
    </div>

    <!-- Calendar Flyout -->
    <div v-if="calendarOpen" class="calendar-flyout" @click.stop>
      <div class="cal-header">{{ currentDateString }}</div>
      <div class="cal-sub">{{ currentDayTime }}</div>
      <div class="cal-info">
        <div style="display:flex;align-items:center;gap:6px;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> Timezone: West Africa Time (UTC+1)</div>
        <div style="display:flex;align-items:center;gap:6px;"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="var(--green)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Working Hours: 09:00 - 18:00 WAT</div>
      </div>
    </div>

    <!-- Quick Settings Panel -->
    <QuickSettings
      v-if="quickSettingsOpen"
      :currentTheme="currentTheme"
      :currentWallpaper="currentWallpaper"
      :scanlinesEnabled="scanlinesEnabled"
      @select-theme="setTheme"
      @select-wallpaper="setWallpaper"
      @toggle-scanlines="scanlinesEnabled = !scanlinesEnabled"
    />

    <!-- Desktop Context Menu (Right Click) -->
    <div
      v-if="ctxMenu.visible"
      class="context-menu"
      :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }"
      @click.stop
    >
      <div v-for="item in ctxItems" :key="item.label ?? 'sep'">
        <div v-if="item.sep" class="ctx-sep"></div>
        <div v-else class="ctx-item" @click="item.action(); ctxMenu.visible = false">
          <span>◈</span> {{ item.label }}
        </div>
      </div>
    </div>

    <!-- Toast Notification Stack -->
    <div class="notifications-stack">
      <div v-for="n in notifications" :key="n.id" class="notification-toast">
        <span class="toast-icon">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        </span>
        <span>{{ n.msg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { soundFx } from './audio/soundFx'
import { synthRadio } from './audio/synthMusic'
import CustomCursor from './components/CustomCursor.vue'
import OsWindow from './components/OsWindow.vue'
import QuickSettings from './components/QuickSettings.vue'
import AboutApp from './components/AboutApp.vue'
import ServicesApp from './components/ServicesApp.vue'
import WorksApp from './components/WorksApp.vue'
import TerminalApp from './components/TerminalApp.vue'
import SysMonApp from './components/SysMonApp.vue'
import SynthRadioApp from './components/SynthRadioApp.vue'
import GameApp from './components/GameApp.vue'
import ContactApp from './components/ContactApp.vue'
import MobileShell from './components/MobileShell.vue'

// ── DEVICE DETECTION ───────────────────────────────
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

// ── THEME & VISUAL PREFERENCES ────────────────────
const currentTheme = ref('twitter')
const currentWallpaper = ref('none')
const scanlinesEnabled = ref(false)
const contactPrefill = ref('')

function setTheme(t) {
  soundFx.playClick()
  currentTheme.value = t
  document.documentElement.setAttribute('data-theme', t)
  addNotification(`Theme switched to: ${t.toUpperCase()}`)
}

function setWallpaper(w) {
  soundFx.playClick()
  currentWallpaper.value = w
}

// ── NOTIFICATIONS STACK ───────────────────────────
const notifications = ref([])
let notifId = 0
function addNotification(msg) {
  soundFx.playNotification()
  const id = ++notifId
  notifications.value.push({ id, msg })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }, 4000)
}

// ── APPLICATION DEFINITIONS ───────────────────────
const appOrder = [
  {
    id: 'about',
    title: 'about.exe',
    badge: 'PROFILE',
    menuLabel: 'About Me & Experience',
    iconLabel: 'about.exe',
    width: 760,
    height: 520,
    iconPos: 'left:36px;top:36px',
    iconSvg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  {
    id: 'services',
    title: 'services.app',
    badge: 'OFFERINGS',
    menuLabel: 'Services & Capabilities',
    iconLabel: 'services.app',
    width: 720,
    height: 500,
    iconPos: 'left:36px;top:136px',
    iconSvg: `<svg viewBox="0 0 40 40"><path d="M20 4l3.5 7 7.5 1-5.5 5.5 1.3 7.5L20 22l-6.8 3 1.3-7.5L9 12l7.5-1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`
  },
  {
    id: 'works',
    title: 'works.dir',
    badge: 'PORTFOLIO',
    menuLabel: 'Works & Case Studies',
    iconLabel: 'works.dir',
    width: 820,
    height: 560,
    iconPos: 'left:36px;top:236px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="8" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="8" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="23" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="23" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`
  },
  {
    id: 'contact',
    title: 'contact.msg',
    badge: 'MAILTO',
    menuLabel: 'Encrypted Message Comm',
    iconLabel: 'contact.msg',
    width: 780,
    height: 530,
    iconPos: 'left:36px;top:336px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="10" width="32" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 14l16 11 16-11" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`
  },
  {
    id: 'sysmon',
    title: 'sysmon.exe',
    badge: 'MONITOR',
    menuLabel: 'System Monitor & Tasks',
    iconLabel: 'sysmon.exe',
    width: 660,
    height: 480,
    iconPos: 'left:136px;top:36px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="8 24 14 16 20 26 26 14 32 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  {
    id: 'radio',
    title: 'synthwave.fm',
    badge: 'AUDIO DSP',
    menuLabel: 'Synthwave Radio & Vis',
    iconLabel: 'radio.app',
    width: 480,
    height: 440,
    iconPos: 'left:136px;top:136px',
    iconSvg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="20" cy="20" r="4" fill="currentColor"/><path d="M20 6v3M20 31v3M6 20h3M31 20h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
  {
    id: 'game',
    title: 'game.exe',
    badge: 'PILOT',
    menuLabel: 'Beat My Score (Flight)',
    iconLabel: 'game.exe',
    width: 660,
    height: 520,
    iconPos: 'left:136px;top:236px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 21v-3M14 21v3M12 21h2M16 21h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="26" cy="19" r="1.5" fill="currentColor"/><circle cx="30" cy="23" r="1.5" fill="currentColor"/></svg>`
  },
  {
    id: 'terminal',
    title: 'terminal.sh',
    badge: 'ZSH CLI',
    menuLabel: 'Hacker Terminal Shell',
    iconLabel: 'terminal.sh',
    width: 680,
    height: 460,
    iconPos: 'left:136px;top:336px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="10 16 16 20 10 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18" y1="24" x2="26" y2="24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
]

function getAppDef(id) {
  return appOrder.find(a => a.id === id)
}

// ── BOOT SEQUENCE ──────────────────────────────────
const booting = ref(true)
const desktopVisible = ref(false)
const bootPct = ref(0)
const bootStatus = ref('INITIALIZING QUANTUM KERNEL...')
const bootLines = ref([])
const bootLogEl = ref(null)

const BOOT_STEPS = [
  'QUANTUM BIOS v2.4.0 ... OK',
  'Initializing Web Audio DSP Synthesizer ... OK',
  'Loading high-performance portfolio registry ... DONE',
  'Mounting Aero Snap Window Manager ... OK',
  'Spawning Twitter Obsidian Workstation ... DONE',
  'Welcome to Kris Shedrach OS.'
]

function runBoot() {
  let step = 0
  const tick = () => {
    if (step >= BOOT_STEPS.length) {
      soundFx.playBootChime()
      setTimeout(() => { booting.value = false }, 350)
      return
    }
    const pct = Math.round(((step + 1) / BOOT_STEPS.length) * 100)
    bootPct.value = pct
    bootStatus.value = step === BOOT_STEPS.length - 1 ? 'SYSTEM READY' : `LOADING COMPONENTS... ${pct}%`
    bootLines.value.push(`> ${BOOT_STEPS[step]}`)
    nextTick(() => {
      if (bootLogEl.value) bootLogEl.value.scrollTop = bootLogEl.value.scrollHeight
    })
    step++
    setTimeout(tick, 180 + Math.random() * 120)
  }
  setTimeout(tick, 300)
}

// ── WINDOW MANAGEMENT ──────────────────────────────
const windows = ref({})
const focusedId = ref(null)
let zCounter = 20

const openWindows = computed(() => Object.values(windows.value))

function openApp(id) {
  startMenuOpen.value = false
  calendarOpen.value = false
  quickSettingsOpen.value = false

  if (windows.value[id]) {
    if (windows.value[id].minimized) unminimize(id)
    else focusWindow(id)
    return
  }

  soundFx.playWindowOpen()
  const app = getAppDef(id)
  const vw = window.innerWidth
  const vh = window.innerHeight - 48
  const cx = Math.floor(vw / 2 - app.width / 2)
  const cy = Math.floor(vh / 2 - app.height / 2)
  const offX = (Math.random() - 0.5) * 80
  const offY = (Math.random() - 0.5) * 60

  windows.value[id] = {
    id,
    title: app.title,
    badge: app.badge,
    x: Math.max(20, Math.min(cx + offX, vw - app.width - 20)),
    y: Math.max(20, Math.min(cy + offY, vh - app.height - 20)),
    w: Math.min(app.width, vw - 40),
    h: Math.min(app.height, vh - 40),
    minimized: false,
    maximized: false,
    snapped: null,
    z: ++zCounter,
  }
  focusedId.value = id
}

function focusWindow(id) {
  if (!windows.value[id]) return
  focusedId.value = id
  windows.value[id].z = ++zCounter
}

function closeApp(id) {
  soundFx.playWindowClose()
  const wins = { ...windows.value }
  delete wins[id]
  windows.value = wins
  if (focusedId.value === id) focusedId.value = null
}

function minimize(id) {
  soundFx.playClick()
  if (windows.value[id]) {
    windows.value[id].minimized = true
    if (focusedId.value === id) focusedId.value = null
  }
}

function unminimize(id) {
  soundFx.playClick()
  if (windows.value[id]) {
    windows.value[id].minimized = false
    focusWindow(id)
  }
}

function toggleMaximize(id) {
  soundFx.playClick()
  if (windows.value[id]) {
    windows.value[id].maximized = !windows.value[id].maximized
    windows.value[id].snapped = null
  }
}

function onTaskbarClick(id) {
  const win = windows.value[id]
  if (!win) return
  if (win.minimized) unminimize(id)
  else if (focusedId.value === id) minimize(id)
  else focusWindow(id)
}

function onDrag(id, { dx, dy, clientX, clientY }) {
  const win = windows.value[id]
  if (!win || win.maximized) return
  const vw = window.innerWidth
  const vh = window.innerHeight - 48

  win.x = Math.max(0, Math.min(win.x + dx, vw - win.w - 4))
  win.y = Math.max(0, Math.min(win.y + dy, vh - win.h - 4))

  // Aero Snap Edge Detection
  if (clientY < 10) {
    win.maximized = true
    win.snapped = null
  } else if (clientX < 15) {
    win.snapped = 'left'
    win.maximized = false
  } else if (clientX > vw - 15) {
    win.snapped = 'right'
    win.maximized = false
  } else if (win.snapped) {
    win.snapped = null
  }
}

function onResize(id, { dw, dh }) {
  const win = windows.value[id]
  if (!win) return
  win.w = Math.max(360, win.w + dw)
  win.h = Math.max(240, win.h + dh)
}

// ── DESKTOP ICONS CLICK ────────────────────────────
const selectedIconId = ref(null)
let singleClickTimer = null
let hintAutoDismissTimer = null

function onIconClick(id) {
  soundFx.playClick()
  clearTimeout(singleClickTimer)
  clearTimeout(hintAutoDismissTimer)

  // Delay tooltip slightly (240ms) so rapid double-clicks launch app without showing tooltip
  singleClickTimer = setTimeout(() => {
    selectedIconId.value = id

    // Auto-dismiss tooltip after a short period (2.5s)
    hintAutoDismissTimer = setTimeout(() => {
      if (selectedIconId.value === id) {
        selectedIconId.value = null
      }
    }, 2500)
  }, 240)
}

function onIconDblClick(id) {
  // Cancel pending single-click hint immediately on rapid double click
  clearTimeout(singleClickTimer)
  clearTimeout(hintAutoDismissTimer)
  selectedIconId.value = null
  openApp(id)
}

// ── START MENU, CALENDAR & QUICK SETTINGS ──────────
const startMenuOpen = ref(false)
const calendarOpen = ref(false)
const quickSettingsOpen = ref(false)

function toggleStartMenu() {
  soundFx.playClick()
  startMenuOpen.value = !startMenuOpen.value
  calendarOpen.value = false
  quickSettingsOpen.value = false
}

function toggleCalendar() {
  soundFx.playClick()
  calendarOpen.value = !calendarOpen.value
  startMenuOpen.value = false
  quickSettingsOpen.value = false
}

function toggleQuickSettings() {
  soundFx.playClick()
  quickSettingsOpen.value = !quickSettingsOpen.value
  startMenuOpen.value = false
  calendarOpen.value = false
}

// ── SYSTEM STATS & CLOCK ───────────────────────────
const clock = ref('12:00')
const currentDateString = ref('')
const currentDayTime = ref('')
const cpuVal = ref(8)
const isRadioPlaying = computed(() => synthRadio.isPlaying)
const currentTrack = computed(() => synthRadio.currentTrack)

function tickClock() {
  const n = new Date()
  clock.value = [n.getHours(), n.getMinutes()].map(v => String(v).padStart(2, '0')).join(':')
  currentDateString.value = n.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  currentDayTime.value = n.toLocaleTimeString()
}

function tickCpu() {
  cpuVal.value = Math.min(98, 6 + Object.keys(windows.value).length * 6 + Math.floor(Math.random() * 8))
}

// ── CONTEXT MENU ───────────────────────────────────
const ctxMenu = ref({ visible: false, x: 0, y: 0 })
const ctxItems = [
  { label: 'Terminal Shell', action: () => openApp('terminal') },
  { label: 'Works & Case Studies', action: () => openApp('works') },
  { label: 'System Monitor', action: () => openApp('sysmon') },
  { label: 'Synthwave Radio', action: () => openApp('radio') },
  { sep: true },
  { label: 'Control Center Settings', action: () => { quickSettingsOpen.value = true } },
  { label: 'About Developer', action: () => openApp('about') },
  { sep: true },
  { label: 'Refresh System Canvas', action: () => { initAmbientCanvas() } },
]

// ── AMBIENT WALLPAPER CANVAS ENGINE ────────────────
const ambientCanvas = ref(null)
let ambientRaf = null

function initAmbientCanvas() {
  if (!ambientCanvas.value) return
  const canvas = ambientCanvas.value
  const ctx = canvas.getContext('2d')
  let w = (canvas.width = window.innerWidth)
  let h = (canvas.height = window.innerHeight)

  // 1. Constellation Particles
  const nodes = Array.from({ length: 48 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.75,
    vy: (Math.random() - 0.5) * 0.75,
    r: Math.random() * 2 + 1
  }))

  // 2. Cyber Grid
  let gridOffset = 0

  // 3. 3D Warp Starfield
  const starCount = 220
  const stars = Array.from({ length: starCount }, () => ({
    x: (Math.random() - 0.5) * w * 2,
    y: (Math.random() - 0.5) * h * 2,
    z: Math.random() * w,
    pz: Math.random() * w,
    speed: 1.0 + Math.random() * 0.6
  }))

  window.addEventListener('resize', () => {
    if (!ambientCanvas.value) return
    w = canvas.width = window.innerWidth
    h = canvas.height = window.innerHeight
  })

  // Theme Accent Palette Resolver
  const THEME_ACCENTS = {
    'twitter': { rgb: [29, 155, 240], hex: '#1d9bf0', isLight: false },
    'titanium': { rgb: [29, 155, 240], hex: '#1d9bf0', isLight: false },
    'neo-tokyo': { rgb: [244, 63, 94], hex: '#f43f5e', isLight: false },
    'tokyo': { rgb: [244, 63, 94], hex: '#f43f5e', isLight: false },
    'matrix': { rgb: [34, 197, 94], hex: '#22c55e', isLight: false },
    'obsidian-gold': { rgb: [245, 158, 11], hex: '#f59e0b', isLight: false },
    'solar': { rgb: [245, 158, 11], hex: '#f59e0b', isLight: false },
    'daylight': { rgb: [2, 132, 199], hex: '#0284c7', isLight: true },
    'cyber-cyan': { rgb: [2, 132, 199], hex: '#0284c7', isLight: true },
    'light': { rgb: [2, 132, 199], hex: '#0284c7', isLight: true },
  }

  function render() {
    ambientRaf = requestAnimationFrame(render)
    w = canvas.width
    h = canvas.height

    if (currentWallpaper.value === 'none') {
      ctx.clearRect(0, 0, w, h)
      return
    }

    const themeCfg = THEME_ACCENTS[currentTheme.value] || THEME_ACCENTS['twitter']
    const [r, g, b] = themeCfg.rgb
    const isLight = themeCfg.isLight

    if (currentWallpaper.value === 'particles') {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i]
        p1.x += p1.vx
        p1.y += p1.vy

        if (p1.x < 0 || p1.x > w) p1.vx *= -1
        if (p1.y < 0 || p1.y > h) p1.vy *= -1

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${isLight ? 0.65 : 0.6})`
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j]
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
          if (dist < 135) {
            const alpha = (1 - dist / 135) * (isLight ? 0.28 : 0.22)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
    } else if (currentWallpaper.value === 'grid') {
      ctx.clearRect(0, 0, w, h)
      gridOffset = (gridOffset + 0.3) % 40
      ctx.strokeStyle = isLight ? `rgba(${r}, ${g}, ${b}, 0.12)` : `rgba(${r}, ${g}, ${b}, 0.16)`
      ctx.lineWidth = 1

      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = gridOffset; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
    } else if (currentWallpaper.value === 'starfield') {
      // Smooth Hyperspace Drift
      ctx.fillStyle = isLight ? 'rgba(237, 243, 248, 0.22)' : 'rgba(2, 4, 6, 0.20)'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2

      const isTwitterTheme = currentTheme.value === 'twitter' || currentTheme.value === 'titanium'
      const starRgb = isTwitterTheme ? [255, 255, 255] : [r, g, b]

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.pz = s.z
        s.z -= s.speed

        if (s.z <= 0) {
          s.z = w
          s.pz = w
          s.x = (Math.random() - 0.5) * w * 2
          s.y = (Math.random() - 0.5) * h * 2
        }

        const k = 160 / s.z
        const px = s.x * k + cx
        const py = s.y * k + cy

        const pk = 160 / s.pz
        const prevX = s.x * pk + cx
        const prevY = s.y * pk + cy

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const alpha = Math.min(1, (1 - s.z / w) * 1.4)
          const size = Math.max(1, (1 - s.z / w) * 2.5)

          ctx.strokeStyle = `rgba(${starRgb[0]}, ${starRgb[1]}, ${starRgb[2]}, ${alpha})`
          ctx.fillStyle = `rgba(${starRgb[0]}, ${starRgb[1]}, ${starRgb[2]}, ${alpha})`

          ctx.lineWidth = size
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(px, py)
          ctx.stroke()
        }
      }
    }
  }

  render()
}

// ── MOUNT & GLOBAL LISTENERS ───────────────────────
onMounted(() => {
  document.documentElement.setAttribute('data-theme', currentTheme.value)
  checkMobile()
  window.addEventListener('resize', () => {
    checkMobile()
    if (ambientCanvas.value) {
      ambientCanvas.value.width = window.innerWidth
      ambientCanvas.value.height = window.innerHeight
    }
  })

  runBoot()

  const waitDesktop = setInterval(() => {
    if (desktopVisible.value) {
      clearInterval(waitDesktop)
      nextTick(() => {
        tickClock()
        setInterval(tickClock, 1000)
        setInterval(tickCpu, 2000)
        initAmbientCanvas()
        // Open initial flagship window
        setTimeout(() => { openApp('about') }, 400)
      })
    }
  }, 100)

  document.addEventListener('click', () => {
    clearTimeout(singleClickTimer)
    clearTimeout(hintAutoDismissTimer)
    selectedIconId.value = null
    startMenuOpen.value = false
    calendarOpen.value = false
    quickSettingsOpen.value = false
    ctxMenu.value.visible = false
  })

  document.addEventListener('contextmenu', e => {
    if (e.target.closest('.os-window') || e.target.closest('.taskbar') || isMobile.value) return
    e.preventDefault()
    soundFx.playClick()
    ctxMenu.value = {
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 240),
    }
  })

  // Global Hotkeys
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key.toLowerCase() === 't') { e.preventDefault(); openApp('terminal') }
    if (e.altKey && e.key.toLowerCase() === 'a') { e.preventDefault(); openApp('about') }
    if (e.altKey && e.key.toLowerCase() === 'w') { e.preventDefault(); openApp('works') }
    if (e.altKey && e.key.toLowerCase() === 'g') { e.preventDefault(); openApp('game') }
    if (e.altKey && e.key.toLowerCase() === 'm') { e.preventDefault(); openApp('radio') }
    if (e.altKey && e.key.toLowerCase() === 's') { e.preventDefault(); openApp('sysmon') }
    if (e.altKey && e.key.toLowerCase() === 'c') { e.preventDefault(); openApp('contact') }
    if (e.key === 'Escape') {
      startMenuOpen.value = false
      calendarOpen.value = false
      quickSettingsOpen.value = false
      ctxMenu.value.visible = false
    }
  })
})

onUnmounted(() => {
  if (ambientRaf) cancelAnimationFrame(ambientRaf)
})
</script>
