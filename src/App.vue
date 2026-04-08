<template>
  <!-- BOOT SCREEN -->
  <CustomCursor />
  <Transition name="boot-fade" @after-leave="desktopVisible = true">
    <div v-if="booting" class="boot-screen">
      <div class="boot-scanlines"></div>
      <div class="boot-content">
        <div class="boot-logo">KS</div>
        <div class="boot-name">KRIS SHEDRACH</div>
        <div class="boot-version">PORTFOLIO OS v1.0.0</div>
        <div class="boot-bar-wrap">
          <div class="boot-bar" :style="{ width: bootPct + '%' }"></div>
        </div>
        <div class="boot-status">{{ bootStatus }}</div>
        <div class="boot-log" ref="bootLogEl">
          <div v-for="(l, i) in bootLines" :key="i">{{ l }}</div>
        </div>
      </div>
      <div class="boot-corner tl"></div>
      <div class="boot-corner tr"></div>
      <div class="boot-corner bl"></div>
      <div class="boot-corner br"></div>
    </div>
  </Transition>

  <!-- DESKTOP -->
  <div v-if="desktopVisible" class="desktop">
    <div class="desktop-grid"></div>

    <!-- Desktop Icons -->
    <div class="desk-icons">
      <div
        v-for="app in appOrder" :key="app.id"
        class="desk-icon"
        :style="app.iconPos"
        @click="onIconClick(app.id, $event)"
        @dblclick="onIconDblClick(app.id)"
      >
        <div class="di-icon" :class="'icon-' + app.id" v-html="app.iconSvg"></div>
        <span>{{ app.iconLabel }}</span>
      </div>
    </div>

    <!-- Windows Layer -->
    <div class="windows-layer">
      <OsWindow
        v-for="win in openWindows" :key="win.id"
        :win="win"
        :isFocused="focusedId === win.id"
        @focus="focusWindow(win.id)"
        @close="closeApp(win.id)"
        @minimize="minimize(win.id)"
        @maximize="toggleMaximize(win.id)"
        @drag="onDrag(win.id, $event)"
        @resize="onResize(win.id, $event)"
      >
        <AboutApp    v-if="win.id === 'about'" />
        <ServicesApp v-if="win.id === 'services'" />
        <WorksApp    v-if="win.id === 'works'" />
        <GameApp     v-if="win.id === 'game'" :active="focusedId === win.id && !win.minimized" />
        <ContactApp  v-if="win.id === 'contact'" />
      </OsWindow>
    </div>

    <!-- Taskbar -->
    <div class="taskbar">
      <div class="tb-logo" @click="toggleStartMenu">KS</div>
      <div class="tb-divider"></div>
      <div class="tb-apps">
        <div
          v-for="win in openWindows" :key="win.id"
          class="tb-app"
          :class="{ 'is-active': focusedId === win.id, 'is-minimized': win.minimized }"
          @click="onTaskbarClick(win.id)"
        >
          <span class="tb-app-dot"></span>
          {{ win.title }}
          <button class="tb-app-close" @click.stop="closeApp(win.id)" title="Close">✕</button>
        </div>
      </div>
      <div class="tb-right">
        <span class="tb-indicator">NET: ONLINE</span>
        <span class="tb-indicator">CPU: {{ cpuVal }}%</span>
        <span class="tb-clock">{{ clock }}</span>
      </div>
    </div>

    <!-- Start Menu -->
    <Transition name="menu-slide">
      <div v-if="startMenuOpen" class="start-menu" @click.stop>
        <div class="sm-header">
          <div class="sm-avatar">KS</div>
          <div>
            <div class="sm-logo">KRIS SHEDRACH</div>
            <div class="sm-sub">Portfolio OS v1.0.0</div>
          </div>
        </div>
        <div class="sm-items">
          <div v-for="app in appOrder" :key="app.id" class="sm-item" @click="openApp(app.id); startMenuOpen = false">
            <span class="sm-icon">◈</span> {{ app.menuLabel }}
          </div>
        </div>
        <div class="sm-footer">KRIS SHEDRACH © 2025</div>
      </div>
    </Transition>

    <!-- Single-click bubble (near icon) -->
    <Transition name="notif">
      <div
        v-if="singleClick.msg"
        class="icon-hint-bubble"
        :style="{ left: singleClick.x + 'px', top: singleClick.y + 'px' }"
      >{{ singleClick.msg }}</div>
    </Transition>

    <!-- Context Menu -->
    <div
      v-if="ctxMenu.visible"
      class="context-menu"
      :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }"
    >
      <div v-for="item in ctxItems" :key="item.label ?? item.sep">
        <div v-if="item.sep" class="ctx-sep"></div>
        <div v-else class="ctx-item" @click="item.action(); ctxMenu.visible = false">
          <span>◈</span> {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import OsWindow    from './components/OsWindow.vue'
import AboutApp    from './components/AboutApp.vue'
import ServicesApp from './components/ServicesApp.vue'
import WorksApp    from './components/WorksApp.vue'
import GameApp     from './components/GameApp.vue'
import ContactApp  from './components/ContactApp.vue'
import CustomCursor from './components/CustomCursor.vue'

// ── APP REGISTRY (services before works) ─────────
const appOrder = [
  {
    id: 'about', title: 'about.exe', badge: 'PROFILE', menuLabel: 'About Me',
    iconLabel: 'about.exe', width: 700, height: 500,
    iconPos: 'left:40px;top:40px',
    iconSvg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'services', title: 'services.app', badge: 'SERVICES', menuLabel: 'Services',
    iconLabel: 'services.app', width: 620, height: 480,
    iconPos: 'left:40px;top:140px',
    iconSvg: `<svg viewBox="0 0 40 40"><path d="M20 4l3.5 7 7.5 1-5.5 5.5 1.3 7.5L20 22l-6.8 3 1.3-7.5L9 12l7.5-1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 30l-6 6M30 30l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'works', title: 'works.dir', badge: 'PORTFOLIO', menuLabel: 'My Works',
    iconLabel: 'works.dir', width: 760, height: 540,
    iconPos: 'left:40px;top:240px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="8" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="8" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="23" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="23" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'game', title: 'game.exe', badge: 'PLAY', menuLabel: 'Beat My Score',
    iconLabel: 'game.exe', width: 620, height: 520,
    iconPos: 'left:40px;top:340px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 21v-3M14 21v3M12 21h2M16 21h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="26" cy="19" r="1.5" fill="currentColor"/><circle cx="30" cy="23" r="1.5" fill="currentColor"/></svg>`,
  },
  {
    id: 'contact', title: 'contact.msg', badge: 'MAILTO', menuLabel: 'Contact',
    iconLabel: 'contact.msg', width: 640, height: 520,
    iconPos: 'left:40px;top:440px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="10" width="32" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 14l16 11 16-11" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  },
]

// ── BOOT ─────────────────────────────────────────
const booting = ref(true)
const desktopVisible = ref(false)
const bootPct = ref(0)
const bootStatus = ref('INITIALIZING...')
const bootLines = ref([])
const bootLogEl = ref(null)

const BOOT_STEPS = [
  'BIOS v2.4.1 ... OK',
  'Mounting filesystem ... DONE',
  'Loading portfolio data ...',
  'Importing project manifests ...',
  'Starting window manager ...',
  'Spawning desktop environment ...',
  'Welcome, Kris Shedrach.',
]

function runBoot() {
  let step = 0
  const tick = () => {
    if (step >= BOOT_STEPS.length) {
      setTimeout(() => { booting.value = false }, 400)
      return
    }
    const pct = Math.round(((step + 1) / BOOT_STEPS.length) * 100)
    bootPct.value = pct
    bootStatus.value = step === BOOT_STEPS.length - 1 ? 'SYSTEM READY' : `LOADING... ${pct}%`
    bootLines.value.push('> ' + BOOT_STEPS[step])
    nextTick(() => { if (bootLogEl.value) bootLogEl.value.scrollTop = bootLogEl.value.scrollHeight })
    step++
    setTimeout(tick, 260 + Math.random() * 180)
  }
  setTimeout(tick, 500)
}

// ── WINDOWS STATE ─────────────────────────────────
const windows = ref({})   // id → { id, title, badge, x, y, w, h, minimized, maximized, savedStyle }
const focusedId = ref(null)
let zCounter = 20

const openWindows = computed(() => Object.values(windows.value))

function getAppDef(id) { return appOrder.find(a => a.id === id) }

function openApp(id) {
  startMenuOpen.value = false
  if (windows.value[id]) {
    if (windows.value[id].minimized) unminimize(id)
    else focusWindow(id)
    return
  }
  const app = getAppDef(id)
  const vw = window.innerWidth, vh = window.innerHeight - 48
  // Near-center with slight random offset
  const cx = Math.floor(vw / 2 - app.width / 2)
  const cy = Math.floor(vh / 2 - app.height / 2)
  const offX = (Math.random() - 0.5) * 120
  const offY = (Math.random() - 0.5) * 80
  const x = Math.max(20, Math.min(cx + offX, vw - app.width - 20))
  const y = Math.max(20, Math.min(cy + offY, vh - app.height - 20))

  windows.value[id] = {
    id, title: app.title, badge: app.badge,
    x, y,
    w: Math.min(app.width,  vw - 40),
    h: Math.min(app.height, vh - 40),
    minimized: false, maximized: false,
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
  const wins = { ...windows.value }
  delete wins[id]
  windows.value = wins
  if (focusedId.value === id) focusedId.value = null
}

function minimize(id) {
  windows.value[id].minimized = true
  if (focusedId.value === id) focusedId.value = null
}

function unminimize(id) {
  windows.value[id].minimized = false
  focusWindow(id)
}

function toggleMaximize(id) {
  windows.value[id].maximized = !windows.value[id].maximized
}

function onTaskbarClick(id) {
  const win = windows.value[id]
  if (!win) return
  if (win.minimized)       { unminimize(id) }
  else if (focusedId.value === id) { minimize(id) }
  else                     { focusWindow(id) }
}

function onDrag(id, { dx, dy }) {
  const win = windows.value[id]
  if (!win || win.maximized) return
  const vw = window.innerWidth, vh = window.innerHeight - 48
  win.x = Math.max(0, Math.min(win.x + dx, vw - win.w - 4))
  win.y = Math.max(0, Math.min(win.y + dy, vh - win.h - 4))
}

function onResize(id, { dw, dh }) {
  const win = windows.value[id]
  if (!win) return
  win.w = Math.max(360, win.w + dw)
  win.h = Math.max(220, win.h + dh)
}

// ── SINGLE-CLICK BUBBLE ───────────────────────────
const singleClick = ref({ msg: '', x: 0, y: 0 })
let singleClickTimer = null
let suppressNextHint = false   // set true when dblclick fires

function onIconClick(id, e) {
  // dblclick fires click twice first — suppress the hint on those
  if (suppressNextHint) { suppressNextHint = false; return }
  const app = getAppDef(id)
  if (singleClickTimer) clearTimeout(singleClickTimer)
  // Position bubble just above & right of icon
  singleClick.value = {
    msg: `Double-click to open ${app.menuLabel}`,
    x: e.clientX + 12,
    y: e.clientY - 42,
  }
  singleClickTimer = setTimeout(() => { singleClick.value = { msg: '', x: 0, y: 0 } }, 2200)
}

function onIconDblClick(id) {
  // Suppress the hint bubble — the click events already fired
  suppressNextHint = true
  if (singleClickTimer) { clearTimeout(singleClickTimer); singleClickTimer = null }
  singleClick.value = { msg: '', x: 0, y: 0 }
  openApp(id)
}

// ── TASKBAR / START MENU ──────────────────────────
const startMenuOpen = ref(false)
function toggleStartMenu() { startMenuOpen.value = !startMenuOpen.value }

// ── CLOCK ─────────────────────────────────────────
const clock = ref('--:--:--')
function tickClock() {
  const n = new Date()
  clock.value = [n.getHours(), n.getMinutes(), n.getSeconds()].map(v => String(v).padStart(2,'0')).join(':')
}

// ── CPU SIM ───────────────────────────────────────
const cpuVal = ref(8)
function tickCpu() {
  cpuVal.value = Math.min(99, 6 + Object.keys(windows.value).length * 5 + Math.floor(Math.random() * 10))
}

// ── CONTEXT MENU ──────────────────────────────────
const ctxMenu = ref({ visible: false, x: 0, y: 0 })
const ctxItems = [
  { label: 'About Me',      action: () => openApp('about') },
  { label: 'My Works',      action: () => openApp('works') },
  { label: 'Beat My Score', action: () => openApp('game') },
  { sep: true },
  { label: 'Contact',       action: () => openApp('contact') },
  { sep: true },
  { label: 'Refresh Desktop', action: () => {} },
]

// ── MOUNTED ───────────────────────────────────────
onMounted(() => {
  runBoot()

  const waitDesktop = setInterval(() => {
    if (desktopVisible.value) {
      clearInterval(waitDesktop)
      nextTick(() => {
        tickClock()
        setInterval(tickClock, 1000)
        setInterval(tickCpu, 2000)
      })
    }
  }, 100)

  // Close menus on outside click
  document.addEventListener('click', () => {
    startMenuOpen.value = false
    ctxMenu.value.visible = false
  })

  // Context menu on desktop
  document.addEventListener('contextmenu', e => {
    if (e.target.closest('.os-window') || e.target.closest('.taskbar')) return
    e.preventDefault()
    const x = Math.min(e.clientX, window.innerWidth - 190)
    const y = Math.min(e.clientY, window.innerHeight - 160)
    ctxMenu.value = { visible: true, x, y }
  })

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'a') { e.preventDefault(); openApp('about') }
    if (e.altKey && e.key === 'w') { e.preventDefault(); openApp('works') }
    if (e.altKey && e.key === 'g') { e.preventDefault(); openApp('game') }
    if (e.key === 'Escape') { startMenuOpen.value = false }
  })
})
</script>
