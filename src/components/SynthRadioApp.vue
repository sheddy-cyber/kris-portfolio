<template>
  <div class="radio-container">
    <!-- Radio Player Header -->
    <div class="radio-header">
      <div class="rh-badge"><span class="rh-dot" :class="{ active: isPlaying }"></span> SYNTHWAVE.FM // PROCEDURAL AUDIO</div>
      <div class="rh-genre">{{ currentTrack.genre }}</div>
    </div>

    <!-- Live Spectrum Visualizer Canvas -->
    <div class="radio-vis-box">
      <canvas ref="visCanvas" class="vis-canvas"></canvas>
      <div v-if="!isPlaying" class="vis-placeholder">
        <span>CLICK PLAY TO ENGAGE PROCEDURAL AUDIO DSP</span>
      </div>
    </div>

    <!-- Track Metadata Card -->
    <div class="radio-track-card">
      <div class="rtc-left">
        <div class="rtc-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
        </div>
        <div>
          <div class="rtc-title">{{ currentTrack.title }}</div>
          <div class="rtc-artist">{{ currentTrack.artist }}</div>
        </div>
      </div>
      <div class="rtc-bpm">
        <span class="bpm-num">{{ currentTrack.bpm }}</span>
        <span class="bpm-lbl">BPM</span>
      </div>
    </div>

    <!-- Playback Controls -->
    <div class="radio-controls">
      <button class="rc-btn" @click="prevTrack" title="Previous Track">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
      </button>
      <button class="rc-btn play-btn" :class="{ playing: isPlaying }" @click="togglePlay" title="Play / Pause">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      </button>
      <button class="rc-btn" @click="nextTrack" title="Next Track">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>

    <!-- Volume & Playlist Section -->
    <div class="radio-bottom-row">
      <div class="vol-control">
        <span class="vol-icon">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </span>
        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          class="vol-slider"
          @input="onVolumeChange"
        />
      </div>

      <div class="playlist-quick">
        <button
          v-for="(t, idx) in tracks"
          :key="t.id"
          class="pl-btn"
          :class="{ active: currentTrackIndex === idx }"
          @click="selectTrack(idx)"
        >
          0{{ idx + 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { synthRadio } from '../audio/synthMusic'
import { soundFx } from '../audio/soundFx'

const visCanvas = ref(null)
const isPlaying = ref(synthRadio.isPlaying)
const volume = ref(synthRadio.volume)
const currentTrackIndex = ref(synthRadio.currentTrackIndex)
const tracks = synthRadio.tracks

const currentTrack = computed(() => tracks[currentTrackIndex.value])

let animId = null
const freqData = new Uint8Array(32)

function togglePlay() {
  soundFx.playClick()
  isPlaying.value = synthRadio.togglePlay()
}

function nextTrack() {
  soundFx.playClick()
  const t = synthRadio.nextTrack()
  currentTrackIndex.value = synthRadio.currentTrackIndex
}

function prevTrack() {
  soundFx.playClick()
  const t = synthRadio.prevTrack()
  currentTrackIndex.value = synthRadio.currentTrackIndex
}

function selectTrack(idx) {
  soundFx.playClick()
  synthRadio.currentTrackIndex = idx
  currentTrackIndex.value = idx
  if (!synthRadio.isPlaying) {
    isPlaying.value = synthRadio.togglePlay()
  }
}

function onVolumeChange() {
  synthRadio.setVolume(volume.value)
}

function renderVisualizer() {
  if (!visCanvas.value) return
  const canvas = visCanvas.value
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  if (synthRadio.isPlaying) {
    synthRadio.getFrequencyData(freqData)
  } else {
    freqData.fill(0)
  }

  const numBars = 24
  const barWidth = (w / numBars) - 3
  const grad = ctx.createLinearGradient(0, h, 0, 0)
  grad.addColorStop(0, '#00f2fe')
  grad.addColorStop(0.5, '#38bdf8')
  grad.addColorStop(1, '#818cf8')

  for (let i = 0; i < numBars; i++) {
    const rawVal = freqData[i] || 0
    // If not playing, draw subtle baseline
    const barHeight = isPlaying.value ? Math.max(4, (rawVal / 255) * (h - 10)) : 3
    const x = i * (barWidth + 3) + 2
    const y = h - barHeight

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0])
    ctx.fill()
  }

  animId = requestAnimationFrame(renderVisualizer)
}

onMounted(() => {
  if (visCanvas.value) {
    visCanvas.value.width = visCanvas.value.parentElement.clientWidth || 360
    visCanvas.value.height = 110
  }
  renderVisualizer()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
})
</script>

<style scoped>
.radio-container {
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
  background: var(--bg-1);
}

.radio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10px;
  color: var(--text-2);
}

.rh-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--accent);
}

.rh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-2);
}
.rh-dot.active {
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.6; }
  to { opacity: 1; }
}

.rh-genre {
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 3px;
  background: var(--bg-3);
  border: 1px solid var(--border);
  color: var(--text-1);
}

.radio-vis-box {
  height: 110px;
  background: var(--bg-0);
  border: 1px solid var(--border);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vis-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.vis-placeholder {
  position: absolute;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: var(--text-2);
  text-align: center;
  pointer-events: none;
}

.radio-track-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
}

.rtc-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rtc-icon {
  font-size: 24px;
}

.rtc-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-0);
  letter-spacing: 0.5px;
}

.rtc-artist {
  font-size: 10px;
  color: var(--accent);
  margin-top: 2px;
}

.rtc-bpm {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.bpm-num {
  font-size: 16px;
  font-weight: 700;
  color: var(--amber);
}

.bpm-lbl {
  font-size: 8px;
  color: var(--text-2);
  letter-spacing: 1px;
}

.radio-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.rc-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-0);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.rc-btn:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
  transform: scale(1.08);
}

.play-btn {
  width: 48px;
  height: 48px;
  background: var(--accent);
  color: #000;
  border: none;
  box-shadow: 0 0 16px var(--accent-glow);
}

.play-btn:hover {
  background: #7bbcff;
  color: #000;
  transform: scale(1.08);
}

.play-btn.playing {
  background: var(--green);
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
}

.radio-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 6px;
  border-top: 1px solid var(--border);
}

.vol-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vol-icon {
  font-size: 12px;
}

.vol-slider {
  width: 80px;
  height: 4px;
  accent-color: var(--accent);
  cursor: pointer;
}

.playlist-quick {
  display: flex;
  gap: 6px;
}

.pl-btn {
  padding: 4px 8px;
  font-size: 9px;
  font-family: inherit;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.15s;
}

.pl-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.pl-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 700;
}
</style>
