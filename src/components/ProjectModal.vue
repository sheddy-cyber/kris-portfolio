<template>
  <div v-if="project" class="project-modal-backdrop" @click.self="$emit('close')">
    <div class="project-modal-card">
      <!-- Modal Header -->
      <div class="pm-header">
        <div class="pm-title-area">
          <span class="pm-cat-badge" :class="'cat-' + project.cat">{{ project.cat.toUpperCase() }}</span>
          <h2 class="pm-title">{{ project.name }}</h2>
          <span class="pm-tagline">{{ project.desc }}</span>
        </div>
        <button class="pm-close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Modal Body -->
      <div class="pm-body">
        <!-- Visual Preview Banner -->
        <div class="pm-preview-wrap">
          <img :src="project.thumbnail || '/projects/project-placeholder.jpg'" :alt="project.name" class="pm-preview-img" />
          <div class="pm-preview-overlay">
            <span class="pm-status-pill">● PRODUCTION DEPLOYED</span>
          </div>
        </div>

        <!-- Metric Highlight Cards -->
        <div class="pm-metrics-grid">
          <div v-for="m in project.metrics" :key="m.label" class="pm-metric-box">
            <span class="pm-metric-val">{{ m.val }}</span>
            <span class="pm-metric-lbl">{{ m.label }}</span>
          </div>
        </div>

        <!-- Case Study Sections -->
        <div class="pm-content-section">
          <h3 class="pm-sec-h">// 01. ARCHITECTURE & SYSTEM DESIGN</h3>
          <p class="pm-sec-p">{{ project.architecture }}</p>
        </div>

        <div class="pm-content-section">
          <h3 class="pm-sec-h">// 02. KEY ENGINEERING CHALLENGES</h3>
          <ul class="pm-challenges-list">
            <li v-for="(ch, idx) in project.challenges" :key="idx">
              <strong>{{ ch.title }}:</strong> {{ ch.desc }}
            </li>
          </ul>
        </div>

        <!-- Full Stack Tags -->
        <div class="pm-content-section">
          <h3 class="pm-sec-h">// 03. FULL ARSENAL & TOOLING</h3>
          <div class="pm-tech-grid">
            <span v-for="t in project.stack" :key="t" class="pm-tech-pill">{{ t }}</span>
          </div>
        </div>

        <!-- Action Links -->
        <div class="pm-actions-footer">
          <a :href="project.demoUrl || '#'" target="_blank" class="pm-btn-primary" @click.prevent="openDemo">
            <span>LAUNCH LIVE DEMO</span>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
          </a>
          <a :href="project.repoUrl || '#'" target="_blank" class="pm-btn-secondary" @click.prevent="openRepo">
            <span>VIEW SOURCE ON GITHUB</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { soundFx } from '../audio/soundFx'

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'notify'])

function openDemo() {
  soundFx.playClick()
  emit('notify', `Connecting to live instance of ${props.project.name}...`)
}

function openRepo() {
  soundFx.playClick()
  emit('notify', `Opening GitHub repository for ${props.project.name}...`)
}
</script>

<style scoped>
.project-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 12, 0.85);
  backdrop-filter: blur(14px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.project-modal-card {
  width: 100%;
  max-width: 760px;
  max-height: 90vh;
  background: var(--surface-glass-heavy);
  border: 1px solid var(--border-2);
  border-radius: 12px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--border-glow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pm-header {
  padding: 18px 24px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pm-title-area {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pm-cat-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  font-weight: 700;
  display: inline-block;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 3px;
}

.cat-web { background: rgba(56, 189, 248, 0.15); color: var(--accent); border: 1px solid var(--accent); }
.cat-mobile { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
.cat-ai, .cat-backend { background: var(--purple-dim, rgba(129, 140, 248, 0.2)); color: var(--purple, #818cf8); border: 1px solid var(--purple, #818cf8); }

.pm-title {
  font-family: 'Orbitron', 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-0);
}

.pm-tagline {
  font-size: 13px;
  color: var(--text-1);
}

.pm-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-3);
  border: 1px solid var(--border);
  color: var(--text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
}
.pm-close-btn:hover {
  background: var(--red-dim);
  color: var(--red);
  border-color: var(--red);
}

.pm-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pm-preview-wrap {
  height: 200px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border);
}

.pm-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pm-preview-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.pm-status-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  background: rgba(11, 16, 23, 0.85);
  color: var(--green);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 4px 10px;
  border-radius: 20px;
}

.pm-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.pm-metric-box {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pm-metric-val {
  font-family: 'Orbitron', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}

.pm-metric-lbl {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: var(--text-2);
  letter-spacing: 1px;
}

.pm-content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pm-sec-h {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: var(--accent);
  border-bottom: 1px solid var(--border);
  padding-bottom: 4px;
}

.pm-sec-p {
  font-size: 13px;
  color: var(--text-0);
  line-height: 1.7;
}

.pm-challenges-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 18px;
  font-size: 13px;
  color: var(--text-1);
  line-height: 1.6;
}
.pm-challenges-list strong {
  color: var(--text-0);
}

.pm-tech-grid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pm-tech-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  color: var(--text-0);
}

.pm-actions-footer {
  display: flex;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.pm-btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--accent);
  color: #000;
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  border-radius: 6px;
  transition: all 0.2s;
  box-shadow: 0 0 20px var(--accent-glow);
}
.pm-btn-primary:hover {
  background: #7bbcff;
  transform: translateY(-1px);
}

.pm-btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  color: var(--text-0);
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  border-radius: 6px;
  transition: all 0.2s;
}
.pm-btn-secondary:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 600px) {
  .pm-metrics-grid {
    grid-template-columns: 1fr;
  }
  .pm-actions-footer {
    flex-direction: column;
  }
}
</style>
