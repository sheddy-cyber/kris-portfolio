<template>
  <div class="sysmon-container">
    <!-- Top System Overview Cards -->
    <div class="sysmon-top-grid">
      <!-- CPU Metric Card -->
      <div class="sm-metric-card">
        <div class="sm-card-head">
          <span class="sm-card-title">CPU UTILIZATION</span>
          <span class="sm-card-val" :style="{ color: cpuPercent > 80 ? 'var(--red)' : 'var(--accent)' }">{{ cpuPercent }}%</span>
        </div>
        <div class="sm-canvas-wrap">
          <canvas ref="cpuCanvas" class="sm-graph-canvas"></canvas>
        </div>
        <div class="sm-card-sub">12 CORES · 3.8 GHz · QUANTUM CHIP</div>
      </div>

      <!-- RAM / Memory Card -->
      <div class="sm-metric-card">
        <div class="sm-card-head">
          <span class="sm-card-title">MEMORY (RAM)</span>
          <span class="sm-card-val">{{ (usedRam / 1024).toFixed(2) }} GB / 16 GB</span>
        </div>
        <div class="sm-ram-meter">
          <div class="sm-ram-bar">
            <div class="sm-ram-fill" :style="{ width: (usedRam / 16384 * 100) + '%' }"></div>
          </div>
          <div class="sm-ram-legend">
            <span>Kernel: 1.2 GB</span>
            <span>Vue Virtual DOM: 0.8 GB</span>
            <span>Vite Cache: 0.5 GB</span>
          </div>
        </div>
        <div class="sm-card-sub">SWAP USAGE: 128 MB · BUFFER: 98% OK</div>
      </div>
    </div>

    <!-- Middle Stats Row -->
    <div class="sysmon-stats-row">
      <div class="sm-stat-box">
        <span class="sm-sb-lbl">SYSTEM UPTIME</span>
        <span class="sm-sb-val">{{ uptimeString }}</span>
      </div>
      <div class="sm-stat-box">
        <span class="sm-sb-lbl">NETWORK RX / TX</span>
        <span class="sm-sb-val sm-green">48.2 MB/s ↑ · 112.4 MB/s ↓</span>
      </div>
      <div class="sm-stat-box">
        <span class="sm-sb-lbl">RENDER FPS</span>
        <span class="sm-sb-val sm-cyan">{{ currentFps }} FPS</span>
      </div>
      <div class="sm-stat-box">
        <span class="sm-sb-lbl">STORAGE AVAILABLE</span>
        <span class="sm-sb-val">482 GB / 1 TB NVMe</span>
      </div>
    </div>

    <!-- Process Manager Table -->
    <div class="sysmon-process-section">
      <div class="sm-section-header">
        <span class="sm-sec-title">ACTIVE PROCESSES (TASK MANAGER)</span>
        <span class="sm-sec-count">{{ activeProcesses.length }} PROCESSES RUNNING</span>
      </div>

      <div class="sm-table-wrap">
        <table class="sm-proc-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>PROCESS NAME</th>
              <th>STATUS</th>
              <th>CPU %</th>
              <th>RAM</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proc in activeProcesses" :key="proc.pid">
              <td class="proc-pid">{{ proc.pid }}</td>
              <td class="proc-name">
                <span class="proc-dot"></span>
                {{ proc.name }}
              </td>
              <td><span class="proc-status-badge">RUNNING</span></td>
              <td class="proc-cpu">{{ proc.cpu }}%</td>
              <td class="proc-ram">{{ proc.ram }} MB</td>
              <td class="proc-actions">
                <button class="proc-btn focus" @click="$emit('focus-app', proc.id)">FOCUS</button>
                <button v-if="proc.id !== 'sysmon'" class="proc-btn kill" @click="$emit('close-app', proc.id)">KILL</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  openWindows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['focus-app', 'close-app'])

const cpuCanvas = ref(null)
const cpuPercent = ref(12)
const usedRam = ref(2450)
const currentFps = ref(60)
const uptimeSeconds = ref(4320)

let cpuHistory = Array(30).fill(12)
let intervalId = null
let animationFrameId = null

const uptimeString = computed(() => {
  const h = Math.floor(uptimeSeconds.value / 3600)
  const m = Math.floor((uptimeSeconds.value % 3600) / 60)
  const s = uptimeSeconds.value % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const activeProcesses = computed(() => {
  const base = [
    { pid: 104, id: 'kernel', name: 'kris-os-kernel.daemon', cpu: '1.2', ram: '240' },
    { pid: 218, id: 'audio', name: 'web-audio-dsp.service', cpu: '0.8', ram: '84' },
    { pid: 312, id: 'compositor', name: 'gpu-compositor-retina', cpu: '2.4', ram: '310' },
  ]

  const winProcs = props.openWindows.map((win, idx) => ({
    pid: 1000 + idx * 42 + 7,
    id: win.id,
    name: `${win.title || win.id}.exe`,
    cpu: (Math.random() * 5 + 1.5).toFixed(1),
    ram: Math.floor(Math.random() * 80 + 120),
  }))

  return [...winProcs, ...base]
})

function drawCpuGraph() {
  if (!cpuCanvas.value) return
  const canvas = cpuCanvas.value
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  // Background Grid Lines
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)'
  ctx.lineWidth = 1
  for (let y = 0; y < h; y += h / 4) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  // Draw Area Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, 'rgba(0, 242, 254, 0.35)')
  grad.addColorStop(1, 'rgba(0, 242, 254, 0.01)')

  ctx.beginPath()
  const step = w / (cpuHistory.length - 1)
  ctx.moveTo(0, h)

  cpuHistory.forEach((val, i) => {
    const x = i * step
    const y = h - (val / 100) * (h - 8) - 4
    if (i === 0) ctx.lineTo(x, y)
    else {
      const prevX = (i - 1) * step
      const prevY = h - (cpuHistory[i - 1] / 100) * (h - 8) - 4
      const cx = (prevX + x) / 2
      ctx.bezierCurveTo(cx, prevY, cx, y, x, y)
    }
  })

  ctx.lineTo(w, h)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()

  // Draw Stroke Line
  ctx.beginPath()
  cpuHistory.forEach((val, i) => {
    const x = i * step
    const y = h - (val / 100) * (h - 8) - 4
    if (i === 0) ctx.moveTo(x, y)
    else {
      const prevX = (i - 1) * step
      const prevY = h - (cpuHistory[i - 1] / 100) * (h - 8) - 4
      const cx = (prevX + x) / 2
      ctx.bezierCurveTo(cx, prevY, cx, y, x, y)
    }
  })
  ctx.strokeStyle = '#00f2fe'
  ctx.lineWidth = 2
  ctx.stroke()
}

onMounted(() => {
  if (cpuCanvas.value) {
    cpuCanvas.value.width = cpuCanvas.value.parentElement.clientWidth || 300
    cpuCanvas.value.height = 70
  }

  intervalId = setInterval(() => {
    uptimeSeconds.value++
    const delta = (Math.random() - 0.5) * 8
    const baseCpu = 8 + props.openWindows.length * 4
    const newCpu = Math.max(5, Math.min(95, Math.round(baseCpu + delta)))
    cpuPercent.value = newCpu
    cpuHistory.shift()
    cpuHistory.push(newCpu)

    usedRam.value = 2100 + props.openWindows.length * 180 + Math.floor(Math.random() * 50)
    currentFps.value = 59 + Math.floor(Math.random() * 2)

    drawCpuGraph()
  }, 1000)

  drawCpuGraph()
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style scoped>
.sysmon-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
}

.sysmon-top-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.sm-metric-card {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sm-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sm-card-title {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--text-2);
  font-weight: 700;
}

.sm-card-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.sm-canvas-wrap {
  height: 70px;
  width: 100%;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.sm-graph-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.sm-card-sub {
  font-size: 9px;
  color: var(--text-2);
  letter-spacing: 0.5px;
}

.sm-ram-meter {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0;
}

.sm-ram-bar {
  height: 10px;
  background: var(--bg-3);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.sm-ram-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--green));
  border-radius: 5px;
  transition: width 0.5s ease;
}

.sm-ram-legend {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--text-1);
}

.sysmon-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.sm-stat-box {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sm-sb-lbl {
  font-size: 8px;
  color: var(--text-2);
  letter-spacing: 1px;
}

.sm-sb-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-0);
}
.sm-green { color: var(--green); }
.sm-cyan { color: var(--accent); }

.sysmon-process-section {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.sm-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
}

.sm-sec-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 1px;
}

.sm-sec-count {
  font-size: 9px;
  color: var(--text-2);
}

.sm-table-wrap {
  overflow-x: auto;
}

.sm-proc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.sm-proc-table th {
  text-align: left;
  font-size: 9px;
  color: var(--text-2);
  letter-spacing: 1px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--border);
}

.sm-proc-table td {
  padding: 7px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.proc-pid {
  color: var(--text-2);
  font-size: 10px;
}

.proc-name {
  color: var(--text-0);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.proc-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
}

.proc-status-badge {
  font-size: 8px;
  padding: 1px 6px;
  border-radius: 3px;
  background: var(--green-dim);
  color: var(--green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.proc-cpu {
  color: var(--accent);
  font-weight: 600;
}

.proc-ram {
  color: var(--text-1);
}

.proc-actions {
  display: flex;
  gap: 6px;
}

.proc-btn {
  font-size: 9px;
  font-family: inherit;
  padding: 3px 8px;
  border-radius: 3px;
  border: 1px solid var(--border);
  cursor: pointer;
  background: transparent;
  color: var(--text-1);
  transition: all 0.15s;
}

.proc-btn.focus:hover {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: var(--accent);
}

.proc-btn.kill:hover {
  background: var(--red-dim);
  color: var(--red);
  border-color: var(--red);
}

@media (max-width: 600px) {
  .sysmon-top-grid {
    grid-template-columns: 1fr;
  }
  .sysmon-stats-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
