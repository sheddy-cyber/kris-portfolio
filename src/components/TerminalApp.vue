<template>
  <div class="terminal-container" @click="focusInput">
    <!-- Terminal Header Bar -->
    <div class="term-status-line">
      <div class="term-status-left">
        <span class="term-badge term-shell-badge">ZSH 5.9</span>
        <span class="term-badge term-host-badge">HOST: KRIS-PORTFOLIO-OS</span>
        <span class="term-badge term-green">● LIVE</span>
      </div>
      <div class="term-status-right">
        <span>Type 'help' for commands</span>
      </div>
    </div>

    <!-- Terminal Scrollable Output Area -->
    <div class="term-output" ref="outputEl">
      <div v-for="(item, idx) in history" :key="idx" class="term-entry">
        <!-- User Command Line -->
        <div v-if="item.type === 'cmd'" class="term-cmd-line">
          <span class="term-prompt"><span class="tp-user">kris</span><span class="tp-at">@</span><span class="tp-host">os</span>:<span class="tp-path">~</span>$</span>
          <span class="term-cmd-text">{{ item.text }}</span>
        </div>

        <!-- System Response (Formatted or Preformatted ASCII) -->
        <div v-else-if="item.type === 'raw'" class="term-response raw-text" v-html="item.text"></div>
        <div v-else-if="item.type === 'error'" class="term-response err-text">{{ item.text }}</div>
        <div v-else-if="item.type === 'banner'" class="term-banner" v-html="item.text"></div>
      </div>

      <!-- Active Interactive Command Line -->
      <div class="term-input-row">
        <span class="term-prompt"><span class="tp-user">kris</span><span class="tp-at">@</span><span class="tp-host">os</span>:<span class="tp-path">~</span>$</span>
        <input
          ref="inputEl"
          v-model="currentInput"
          class="term-input"
          type="text"
          autofocus
          spellcheck="false"
          autocomplete="off"
          @keydown="handleKeyDown"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { soundFx } from '../audio/soundFx'
import { synthRadio } from '../audio/synthMusic'

const emit = defineEmits(['set-theme', 'open-app', 'notify'])

const outputEl = ref(null)
const inputEl = ref(null)
const currentInput = ref('')
const history = ref([])
const cmdHistory = ref([])
const historyIndex = ref(-1)

const COMMANDS = [
  'help', 'about', 'skills', 'projects', 'neofetch',
  'theme', 'matrix', 'music', 'ping', 'contact',
  'hire', 'clear', 'sudo', 'date', 'whoami', 'weather'
]

function focusInput() {
  if (inputEl.value) inputEl.value.focus()
}

function scrollToBottom() {
  nextTick(() => {
    if (outputEl.value) {
      outputEl.value.scrollTop = outputEl.value.scrollHeight
    }
  })
}

function handleKeyDown(e) {
  soundFx.playTypeKey()

  if (e.key === 'Enter') {
    executeCommand(currentInput.value)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (cmdHistory.value.length === 0) return
    if (historyIndex.value === -1) historyIndex.value = cmdHistory.value.length - 1
    else historyIndex.value = Math.max(0, historyIndex.value - 1)
    currentInput.value = cmdHistory.value[historyIndex.value] || ''
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (cmdHistory.value.length === 0 || historyIndex.value === -1) return
    historyIndex.value++
    if (historyIndex.value >= cmdHistory.value.length) {
      historyIndex.value = -1
      currentInput.value = ''
    } else {
      currentInput.value = cmdHistory.value[historyIndex.value] || ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const input = currentInput.value.trim().toLowerCase()
    if (!input) return
    const match = COMMANDS.find(c => c.startsWith(input))
    if (match) currentInput.value = match
  }
}

function executeCommand(raw) {
  const trimmed = raw.trim()
  currentInput.value = ''
  historyIndex.value = -1

  if (trimmed) {
    cmdHistory.value.push(trimmed)
    history.value.push({ type: 'cmd', text: raw })
  } else {
    history.value.push({ type: 'cmd', text: '' })
    scrollToBottom()
    return
  }

  const parts = trimmed.split(' ')
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)

  switch (cmd) {
    case 'help':
      history.value.push({
        type: 'raw',
        text: `
<div class="t-table">
  <div class="t-row"><span class="t-cmd">neofetch</span><span class="t-desc">Display system specs, avatar & tech environment</span></div>
  <div class="t-row"><span class="t-cmd">about</span><span class="t-desc">Print engineer overview and core focus areas</span></div>
  <div class="t-row"><span class="t-cmd">skills</span><span class="t-desc">Output full-stack & mobile capability matrix</span></div>
  <div class="t-row"><span class="t-cmd">projects</span><span class="t-desc">List highlighted production applications [args: --filter web|mobile]</span></div>
  <div class="t-row"><span class="t-cmd">theme &lt;name&gt;</span><span class="t-desc">Change UI palette [twitter | tokyo | matrix | solar | daylight]</span></div>
  <div class="t-row"><span class="t-cmd">music &lt;play|stop|next&gt;</span><span class="t-desc">Control procedural ambient synthwave generator</span></div>
  <div class="t-row"><span class="t-cmd">matrix</span><span class="t-desc">Run digital rain phosphor stream simulation</span></div>
  <div class="t-row"><span class="t-cmd">ping &lt;host&gt;</span><span class="t-desc">Test network latency packets to server</span></div>
  <div class="t-row"><span class="t-cmd">contact</span><span class="t-desc">Show open communication channels & social handles</span></div>
  <div class="t-row"><span class="t-cmd">hire</span><span class="t-desc">Direct inquiry & collaboration options</span></div>
  <div class="t-row"><span class="t-cmd">clear</span><span class="t-desc">Clear the terminal screen</span></div>
  <div class="t-row"><span class="t-cmd">whoami</span><span class="t-desc">Display active user session</span></div>
  <div class="t-row"><span class="t-cmd">date</span><span class="t-desc">Display system UTC timestamp</span></div>
</div>`
      })
      break

    case 'about':
      history.value.push({
        type: 'raw',
        text: `
<div class="t-box">
  <div class="t-box-title">KRIS SHEDRACH // FULL-STACK WEB & MOBILE ARCHITECT</div>
  <p>I craft ultra-responsive web applications, cross-platform mobile apps, and scalable cloud APIs with high aesthetic precision and fault-tolerant architecture.</p>
  <div class="t-meta-grid">
    <div><strong>Base:</strong> Lagos, Nigeria (UTC+1) / Remote Worldwide</div>
    <div><strong>Experience:</strong> 5+ Years Full-Stack & Mobile Architecture</div>
    <div><strong>Specialties:</strong> Next.js, React Native, Vue 3, Node.js, PostgreSQL</div>
    <div><strong>Status:</strong> <span class="t-green">AVAILABLE FOR SELECT PROJECTS</span></div>
  </div>
</div>`
      })
      break

    case 'skills':
      history.value.push({
        type: 'raw',
        text: `
<div class="t-box">
  <div class="t-box-title">STACK & PROFICIENCY MATRIX</div>
  <div class="t-skill-group"><strong>[FRONTEND / UI]</strong> React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Framer Motion, Zod</div>
  <div class="t-skill-group"><strong>[BACKEND / API]</strong> Node.js, Express, Python (FastAPI/Django), PostgreSQL, MongoDB, Redis, JWT/OAuth</div>
  <div class="t-skill-group"><strong>[MOBILE / APPS]</strong> React Native, Expo, Android Studio, Kotlin, Paystack API, Cloudinary</div>
  <div class="t-skill-group"><strong>[UI/UX & WEB3]</strong> Figma, Adobe Photoshop, CorelDRAW, Blockchain Basics, Solidity, Ethers.js, Hardhat, Foundry</div>
</div>`
      })
      break

    case 'projects':
      const filter = args.find(a => a.startsWith('--filter='))?.replace('--filter=', '') || args[0] || 'all'
      history.value.push({
        type: 'raw',
        text: `
<div class="t-table">
  <div class="t-row-head"><span>PROJECT</span><span>CATEGORY</span><span>STACK</span></div>
  <div class="t-row"><span class="t-cyan">RUGAN NGO Platform</span><span>Web</span><span>React · TypeScript · Tailwind · Node</span></div>
  <div class="t-row"><span class="t-cyan">Kyrios Family Church</span><span>Web</span><span>React · TypeScript · Tailwind · Media Player</span></div>
  <div class="t-row"><span class="t-cyan">The Watchtower News</span><span>Web</span><span>React 18 · Node · PostgreSQL · Prisma</span></div>
  <div class="t-row"><span class="t-cyan">The 24 Log</span><span>Web / PWA</span><span>Vanilla JS (ES6+) · HTML5 · CSS3 · PWA · State Machine</span></div>
  <div class="t-row"><span class="t-green">Record Am</span><span>Mobile</span><span>React Native 0.81 · Expo 54 · Supabase · Zustand</span></div>
  <div class="t-row"><span class="t-cyan">Modem Computer Tech</span><span>Web</span><span>Next.js 14 · TypeScript · Tailwind · Nodemailer</span></div>
  <div class="t-row"><span class="t-green">SplitPay P2P</span><span>Mobile</span><span>React Native · Firebase · Express</span></div>
  <div class="t-row"><span class="t-green">Kora Health</span><span>Mobile</span><span>React Native · Expo · HealthKit</span></div>
</div>
<div style="margin-top:6px;font-size:11px;color:var(--text-2)">Tip: Double-click 'works.dir' on the desktop or run 'open works' for full visual showcase.</div>`
      })
      break

    case 'neofetch':
      history.value.push({
        type: 'banner',
        text: `
<div class="neofetch-wrap">
<pre class="neofetch-art">
   ███████╗███████╗
   ██╔════╝██╔════╝
   ███████╗███████╗
   ╚════██║╚════██║
   ███████║███████║
   ╚══════╝╚══════╝
   PORTFOLIO OS
</pre>
<div class="neofetch-info">
  <div class="nf-title"><span class="t-cyan">kris</span>@<span class="t-cyan">portfolio-os</span></div>
  <div class="nf-div">-------------------------</div>
  <div><span class="nf-label">OS:</span> Kris Shedrach OS v2.4.0 x86_64</div>
  <div><span class="nf-label">Host:</span> Quantum Cyber Workstation</div>
  <div><span class="nf-label">Kernel:</span> 6.10.8-antigravity-vue</div>
  <div><span class="nf-label">Uptime:</span> 99.98% High Availability</div>
  <div><span class="nf-label">Packages:</span> 42 (vite, vue3, web-audio)</div>
  <div><span class="nf-label">Shell:</span> zsh 5.9 (x86_64-antigravity)</div>
  <div><span class="nf-label">Resolution:</span> Dynamic Viewport Retina</div>
  <div><span class="nf-label">Theme:</span> Twitter Obsidian Glass</div>
  <div><span class="nf-label">Memory:</span> 482MB / 16384MB</div>
  <div class="nf-colors">
    <span style="background:#f43f5e"></span>
    <span style="background:#1d9bf0"></span>
    <span style="background:#10b981"></span>
    <span style="background:#f59e0b"></span>
    <span style="background:#818cf8"></span>
    <span style="background:#ffffff"></span>
  </div>
</div>
</div>`
      })
      break

    case 'theme':
      const themeArg = (args[0] || '').toLowerCase()
      const themeMap = {
        'twitter': 'twitter',
        'x': 'twitter',
        'titanium': 'twitter',
        'stealth': 'twitter',
        'tokyo': 'neo-tokyo',
        'matrix': 'matrix',
        'solar': 'obsidian-gold',
        'gold': 'obsidian-gold',
        'daylight': 'daylight',
        'light': 'daylight',
        'cyan': 'daylight',
      }
      if (themeMap[themeArg]) {
        emit('set-theme', themeMap[themeArg])
        history.value.push({ type: 'raw', text: `<span class="t-green">✓ Switched system theme to: <strong>${themeMap[themeArg]}</strong></span>` })
      } else {
        history.value.push({
          type: 'error',
          text: `Usage: theme [twitter | tokyo | matrix | solar | daylight]\nCurrent options: twitter (Twitter Dark), tokyo (Neo Tokyo), matrix (Phosphor Green), solar (Obsidian Gold), daylight (Daylight Light Mode)`
        })
      }
      break

    case 'matrix':
      history.value.push({
        type: 'raw',
        text: `
<div class="matrix-rain-sim">
  01001011 01010010 01001001 01010011 00100000 01010011 01001000<br/>
  10110010 11010010 01010011 11001010 10010011 01010101 11010101<br/>
  SYSTEM OVERRIDE: MATRIX STREAM PROTOCOL ENGAGED.<br/>
  Wake up, agent... The portfolio has you.
</div>`
      })
      break

    case 'music':
      const action = (args[0] || 'play').toLowerCase()
      if (action === 'play') {
        synthRadio.play()
        history.value.push({ type: 'raw', text: `<span class="t-cyan">▶ Procedural Synth Radio playing: <strong>${synthRadio.currentTrack.title}</strong></span>` })
      } else if (action === 'stop' || action === 'pause') {
        synthRadio.stop()
        history.value.push({ type: 'raw', text: `<span class="t-amber">⏸ Synth Radio paused.</span>` })
      } else if (action === 'next') {
        const next = synthRadio.nextTrack()
        history.value.push({ type: 'raw', text: `<span class="t-cyan">⏭ Skipped to: <strong>${next.title}</strong> (${next.genre})</span>` })
      } else {
        history.value.push({ type: 'error', text: `Usage: music [play | stop | next]` })
      }
      break

    case 'ping':
      const host = args[0] || 'kris-portfolio.dev'
      history.value.push({
        type: 'raw',
        text: `
<div>PING ${host} (127.0.0.1): 56 data bytes</div>
<div>64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.421 ms</div>
<div>64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.389 ms</div>
<div>64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.452 ms</div>
<div class="t-green">--- ${host} ping statistics: 0.0% packet loss, RTT avg = 0.420ms ---</div>`
      })
      break

    case 'contact':
      history.value.push({
        type: 'raw',
        text: `
<div class="t-box">
  <div class="t-box-title">COMMUNICATION CHANNELS</div>
  <div>📧 <strong>Email:</strong> <a href="mailto:christophershedrach61@gmail.com" style="color:var(--accent)">christophershedrach61@gmail.com</a></div>
  <div>🐙 <strong>GitHub:</strong> <a href="https://github.com/sheddy-cyber" target="_blank" style="color:var(--accent)">github.com/sheddy-cyber</a></div>
  <div>💼 <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/krisshedrach" target="_blank" style="color:var(--accent)">linkedin.com/in/krisshedrach</a></div>
  <div>🐦 <strong>Twitter / X:</strong> <a href="https://twitter.com/krisshedrach" target="_blank" style="color:var(--accent)">@krisshedrach</a></div>
</div>`
      })
      break

    case 'hire':
      history.value.push({
        type: 'raw',
        text: `
<div class="t-box" style="border-color:var(--green)">
  <div class="t-box-title" style="color:var(--green)">COLLABORATION & OPPORTUNITIES</div>
  <p>Looking for a full-stack web engineer or mobile app architect?</p>
  <p>I am actively open to full-time engineering roles, contract projects, and high-impact web & app builds.</p>
  <div style="margin-top:8px;"><span class="t-green">✓ Inquire directly at: christophershedrach61@gmail.com</span></div>
</div>`
      })
      break

    case 'clear':
      history.value = []
      break

    case 'whoami':
      history.value.push({ type: 'raw', text: `guest@kris-portfolio-os (Privilege: Developer Guest / VIP Explorer)` })
      break

    case 'date':
      history.value.push({ type: 'raw', text: new Date().toUTCString() })
      break

    case 'weather':
      history.value.push({
        type: 'raw',
        text: `Lagos, Nigeria: 29°C Partly Cloudy · Wind: 12 km/h · Dev Environment: Optimal [STATUS: ONLINE]`
      })
      break

    case 'sudo':
      if (args.join(' ').includes('rm -rf')) {
        soundFx.playExplosion()
        history.value.push({
          type: 'error',
          text: `[ALERT] SECURITY SYSTEM TRIGGERED: Self-defense subroutines activated! KrisOS kernel is immutable. Nice try, agent.`
        })
      } else {
        history.value.push({ type: 'error', text: `sudo: guest is not in the sudoers file. This incident will be reported to Kris.` })
      }
      break

    default:
      history.value.push({
        type: 'error',
        text: `command not found: '${cmd}'. Type 'help' to see list of available commands.`
      })
      break
  }

  scrollToBottom()
}

onMounted(() => {
  // Initial welcoming banner
  history.value.push({
    type: 'banner',
    text: `
<div class="term-welcome">
  <div class="tw-logo">KRIS SHEDRACH TERMINAL [v2.4.0]</div>
  <div class="tw-sub">Type <span class="t-cyan">'help'</span> for command listing or <span class="t-green">'neofetch'</span> for system specs.</div>
</div>`
  })
  focusInput()
})
</script>

<style scoped>
.terminal-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
  background: var(--bg-1);
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  font-size: 12px;
  color: var(--text-0);
  padding: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.term-status-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--text-2);
  flex-shrink: 0;
  min-width: 0;
}

.term-status-left {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.term-status-right {
  margin-left: auto;
  padding-left: 12px;
  white-space: nowrap;
  color: var(--accent);
  opacity: 0.85;
}

.term-badge {
  background: var(--bg-2);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid var(--border);
}

.term-green {
  color: var(--green);
  border-color: rgba(16, 185, 129, 0.3);
}

@media (max-width: 600px) {
  .term-status-line {
    gap: 8px;
  }
  .term-host-badge {
    display: none;
  }
  .term-status-right {
    font-size: 9.5px;
    padding-left: 8px;
  }
}

.term-output {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}

.term-cmd-line {
  display: flex;
  gap: 8px;
  align-items: baseline;
  word-break: break-all;
}

.term-prompt {
  font-weight: 700;
  white-space: nowrap;
  user-select: none;
}
.tp-user { color: var(--accent); }
.tp-at { color: var(--text-2); }
.tp-host { color: var(--green); }
.tp-path { color: var(--amber); }

.term-cmd-text {
  color: var(--text-0);
  font-weight: 600;
}

.term-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-shrink: 0;
}

.term-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  color: var(--text-0);
  caret-color: var(--accent);
  padding: 0;
}

:deep(.t-table) {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 6px 0;
}
:deep(.t-row), :deep(.t-row-head) {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
}
:deep(.t-row-head) {
  font-weight: 700;
  color: var(--text-2);
  border-bottom: 1px dashed var(--border);
  padding-bottom: 4px;
}
:deep(.t-cmd) {
  color: var(--accent);
  font-weight: 600;
}
:deep(.t-desc) {
  color: var(--text-1);
}
:deep(.t-box) {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  padding: 10px 14px;
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
:deep(.t-box-title) {
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--accent);
  font-size: 11px;
}
:deep(.t-cyan) { color: var(--accent); }
:deep(.t-green) { color: var(--green); }
:deep(.t-amber) { color: var(--amber); }
:deep(.t-purple) { color: var(--purple); }

:deep(.neofetch-wrap) {
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 8px 0;
}
:deep(.neofetch-art) {
  color: var(--accent);
  font-size: 10px;
  line-height: 1.1;
  user-select: none;
  text-shadow: 0 0 10px var(--accent-glow);
}
:deep(.neofetch-info) {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
}
:deep(.nf-title) {
  font-weight: 700;
}
:deep(.nf-div) {
  color: var(--text-2);
}
:deep(.nf-label) {
  color: var(--accent);
  font-weight: 600;
  display: inline-block;
  width: 90px;
}
:deep(.nf-colors) {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
:deep(.nf-colors span) {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  display: inline-block;
}

:deep(.matrix-rain-sim) {
  color: #00ff66;
  font-family: monospace;
  letter-spacing: 3px;
  line-height: 1.6;
  text-shadow: 0 0 8px #00ff66;
  padding: 8px;
}

:deep(.err-text) {
  color: var(--red);
}

:deep(.term-welcome) {
  margin-bottom: 8px;
}
:deep(.tw-logo) {
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--accent);
}
:deep(.tw-sub) {
  color: var(--text-2);
  font-size: 11px;
}
</style>
