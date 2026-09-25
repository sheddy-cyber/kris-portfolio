<template>
  <div
    class="contact-container"
    ref="containerRef"
    :class="{ 'is-dragging': isDragging }"
    :style="containerStyle"
  >
    <!-- Left Column: Communication Coordinates -->
    <div class="contact-left-pane">
      <div class="cl-header">
        <span class="cl-badge">// SECURE COMM CHANNEL</span>
        <h3 class="cl-title">Let's Engineer Something Remarkable</h3>
        <p class="cl-sub">Direct channel open for consulting, architecture leads, and full-stack contracts.</p>
      </div>

      <!-- Quick Communication Cards -->
      <div class="contact-cards-list">
        <div class="comm-card" @click="copyEmail">
          <div class="cc-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div class="cc-info">
            <span class="cc-label">DIRECT EMAIL</span>
            <span class="cc-val">christophershedrach61@gmail.com</span>
          </div>
          <span class="cc-action">{{ copied ? 'COPIED!' : 'COPY' }}</span>
        </div>

        <a href="https://github.com/sheddy-cyber" target="_blank" class="comm-card link">
          <div class="cc-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </div>
          <div class="cc-info">
            <span class="cc-label">SOURCE REPOSITORIES</span>
            <span class="cc-val">github.com/sheddy-cyber</span>
          </div>
          <span class="cc-arrow">↗</span>
        </a>

        <a href="https://linkedin.com/in/krisshedrach" target="_blank" class="comm-card link">
          <div class="cc-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </div>
          <div class="cc-info">
            <span class="cc-label">PROFESSIONAL NETWORK</span>
            <span class="cc-val">linkedin.com/in/krisshedrach</span>
          </div>
          <span class="cc-arrow">↗</span>
        </a>

        <a href="https://twitter.com/krisshedrach" target="_blank" class="comm-card link">
          <div class="cc-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
          <div class="cc-info">
            <span class="cc-label">TWITTER / X FEED</span>
            <span class="cc-val">@krisshedrach</span>
          </div>
          <span class="cc-arrow">↗</span>
        </a>
      </div>

      <!-- Timezone & Response Guarantee -->
      <div class="cl-response-box">
        <span class="cr-dot"></span>
        <span>Average Response Time: <strong>&lt; 12 Hours</strong> · Timezone: <strong>WAT (UTC+1)</strong></span>
      </div>
    </div>

    <!-- Demarcation Resizer Bar (Mobile View) -->
    <div
      class="contact-demarcation-bar"
      :class="{ dragging: isDragging }"
      @pointerdown="startDemarcationDrag"
      role="separator"
      aria-orientation="horizontal"
      aria-label="Adjust demarcation between contact coordinates and message form"
    >
      <div class="cd-grip-zone" @dblclick="onHandleDblClick">
        <span class="cd-grip-icon">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="cd-title">// DEMARCATION</span>
        <span class="cd-hint">DRAG TO ADJUST</span>
      </div>

      <div class="cd-presets" @pointerdown.stop>
        <button
          type="button"
          class="cd-pill"
          :class="{ active: currentSnap === 'compact' }"
          @click="snapTo('compact')"
          title="Minimize coordinates to maximize form space"
        >
          FORM
        </button>
        <button
          type="button"
          class="cd-pill"
          :class="{ active: currentSnap === 'split' }"
          @click="snapTo('split')"
          title="Balanced 50/50 view"
        >
          HALF
        </button>
        <button
          type="button"
          class="cd-pill"
          :class="{ active: currentSnap === 'expanded' }"
          @click="snapTo('expanded')"
          title="Expand contact coordinates & links"
        >
          CARDS
        </button>
      </div>
    </div>

    <!-- Right Column: Encrypted Message Dispatcher -->
    <div class="contact-right-pane">
      <div class="cr-header">
        <span class="cr-title">ENCRYPTED MESSAGE DISPATCHER</span>
      </div>

      <form class="contact-form" @submit.prevent="sendMessage">
        <div class="cf-row">
          <div class="cf-field">
            <label>YOUR NAME / ORGANIZATION *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Elena Rostova / Acme Corp"
              @keydown="onTyping"
            />
          </div>

          <div class="cf-field">
            <label>EMAIL / TELEGRAM HANDLE *</label>
            <input
              v-model="form.email"
              type="text"
              required
              placeholder="e.g. elena@acme.com or @elena_dev"
              @keydown="onTyping"
            />
          </div>
        </div>

        <div class="cf-field">
          <label>ENGAGEMENT TYPE</label>
          <select v-model="form.service" @change="onTyping">
            <option value="" disabled selected>-- Select an engagement type --</option>
            <option value="Full-Stack Web Engineering">Full-Stack Web Engineering</option>
            <option value="Cross-Platform Mobile App">Cross-Platform Mobile App</option>
            <option value="Cloud Backends & Real-Time APIs">Cloud Backends & Real-Time APIs</option>
            <option value="Website Reviews, Upgrades & CMS Optimization">Website Reviews, Upgrades & CMS Optimization</option>
            <option value="Shopify / WordPress / Webflow Customization">Shopify / WordPress / Webflow Customization</option>
            <option value="Full-Time / Contract Opportunities">Full-Time / Contract Opportunities</option>
            <option value="Other Inquiries">Other Inquiries</option>
          </select>
        </div>

        <div class="cf-field">
          <label>PROJECT SPECIFICATIONS & TIMELINE *</label>
          <textarea
            v-model="form.message"
            required
            placeholder="Tell me about your product requirements, tech stack preferences, timeline, and vision..."
            @keydown="onTyping"
          ></textarea>
        </div>

        <!-- Submit Button / Encryption Progress -->
        <div class="cf-submit-area">
          <button type="submit" class="cf-send-btn" :disabled="sending">
            <span v-if="!sending">DISPATCH ENCRYPTED PAYLOAD ◈</span>
            <span v-else>{{ encryptionStep }}</span>
          </button>
        </div>

        <!-- Success Banner -->
        <div v-if="sent" class="cf-success-banner">
          <span class="csb-icon">✓</span>
          <div class="csb-text">
            <strong>TRANSMISSION VERIFIED</strong>
            <span>Payload encrypted and dispatched to Kris. Expect a response shortly!</span>
          </div>
        </div>

        <!-- Error Banner -->
        <div v-if="formError" class="cf-error-banner">
          <span class="ceb-icon">✕</span>
          <span>{{ formError }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { soundFx } from '../audio/soundFx'
import emailjs from '@emailjs/browser'

// ── EmailJS Configuration ──────────────────────────
// Reads from Vite environment variables (VITE_EMAILJS_*) or falls back to direct values.
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_uhkcyme'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_3y9dw18'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'pnw-i82JKms0pbXu4'

const props = defineProps({
  initialService: { type: String, default: '' }
})

const emit = defineEmits(['notify'])

const form = ref({
  name: '',
  email: '',
  service: props.initialService || '',
  message: ''
})

watch(() => props.initialService, (val) => {
  if (val) form.value.service = val
})

const sending = ref(false)
const sent = ref(false)
const copied = ref(false)
const encryptionStep = ref('ENCRYPTING PAYLOAD...')

function onTyping() {
  soundFx.playTypeKey()
}

function copyEmail() {
  soundFx.playSuccess()
  navigator.clipboard.writeText('christophershedrach61@gmail.com').then(() => {
    copied.value = true
    emit('notify', 'Email address christophershedrach61@gmail.com copied to clipboard.')
    setTimeout(() => { copied.value = false }, 3000)
  })
}

const formError = ref('')

function validateForm() {
  formError.value = ''
  if (!form.value.name.trim()) {
    formError.value = 'Name / Organization is required.'
    return false
  }
  if (!form.value.email.trim()) {
    formError.value = 'Email or contact handle is required.'
    return false
  }
  if (!form.value.message.trim()) {
    formError.value = 'Project specifications are required.'
    return false
  }
  return true
}

async function sendMessage() {
  if (!validateForm()) return
  
  soundFx.playClick()
  sending.value = true
  sent.value = false
  formError.value = ''

  encryptionStep.value = 'ENCRYPTING PAYLOAD WITH RSA-4096...'
  
  await new Promise(r => setTimeout(r, 400))
  encryptionStep.value = 'COMPUTING SHA-256 INTEGRITY HASH...'
  
  await new Promise(r => setTimeout(r, 400))
  encryptionStep.value = 'TRANSMITTING VIA SECURE CHANNEL...'

  if (
    EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
    EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
    !EMAILJS_SERVICE_ID ||
    !EMAILJS_TEMPLATE_ID ||
    !EMAILJS_PUBLIC_KEY
  ) {
    sending.value = false
    formError.value = 'Email service not configured. Please set EmailJS credentials or email directly.'
    soundFx.playError?.()
    console.error('EmailJS credentials missing or set to placeholder defaults.')
    return
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: form.value.name,
        from_email: form.value.email,
        service_type: form.value.service || 'Not specified',
        message: form.value.message,
      },
      EMAILJS_PUBLIC_KEY
    )

    sending.value = false
    sent.value = true
    soundFx.playSuccess()
    emit('notify', 'Message transmitted successfully to Kris Shedrach.')
    form.value = { name: '', email: '', service: '', message: '' }
  } catch (error) {
    console.error('EmailJS transmission error:', error)
    sending.value = false
    formError.value = error?.text || 'Transmission failed. Please try again or email directly.'
    emit('notify', 'Message dispatch failed — please try emailing directly.')
  }
}

// ── Smooth Demarcation Resizing (Mobile View) ─────────────
const containerRef = ref(null)
const topPaneHeight = ref(210)
const isDragging = ref(false)
const currentSnap = ref('split') // 'compact' | 'split' | 'expanded' | 'custom'

const containerStyle = computed(() => ({
  '--top-pane-height': `${topPaneHeight.value}px`
}))

let startY = 0
let startHeight = 0
let rafId = null

function initDefaultHeight() {
  if (typeof window === 'undefined') return
  if (window.innerWidth <= 768 && containerRef.value) {
    const totalH = containerRef.value.getBoundingClientRect().height
    if (totalH > 320) {
      topPaneHeight.value = Math.round(totalH * 0.36)
    }
  }
}

function startDemarcationDrag(e) {
  if (e.button !== undefined && e.button !== 0) return
  isDragging.value = true
  startY = e.clientY
  startHeight = topPaneHeight.value
  currentSnap.value = 'custom'
  soundFx.playClick?.()

  if (e.cancelable) e.preventDefault()

  window.addEventListener('pointermove', onDemarcationMove, { passive: false })
  window.addEventListener('pointerup', endDemarcationDrag)
  window.addEventListener('pointercancel', endDemarcationDrag)
}

function onDemarcationMove(e) {
  if (!isDragging.value) return
  if (e.cancelable) e.preventDefault()

  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    const container = containerRef.value
    if (!container) return

    const rect = container.getBoundingClientRect()
    const containerHeight = rect.height
    const minHeight = 75
    const maxHeight = Math.max(minHeight, containerHeight - 140)

    const deltaY = e.clientY - startY
    const newHeight = Math.min(Math.max(startHeight + deltaY, minHeight), maxHeight)
    topPaneHeight.value = Math.round(newHeight)
  })
}

function endDemarcationDrag() {
  if (!isDragging.value) return
  isDragging.value = false
  if (rafId) cancelAnimationFrame(rafId)

  window.removeEventListener('pointermove', onDemarcationMove)
  window.removeEventListener('pointerup', endDemarcationDrag)
  window.removeEventListener('pointercancel', endDemarcationDrag)

  const container = containerRef.value
  if (container) {
    const totalH = container.getBoundingClientRect().height
    const ratio = topPaneHeight.value / totalH
    if (ratio < 0.22) currentSnap.value = 'compact'
    else if (ratio > 0.52) currentSnap.value = 'expanded'
    else currentSnap.value = 'split'
  }
}

function snapTo(preset) {
  soundFx.playTypeKey?.()
  currentSnap.value = preset
  const container = containerRef.value
  const totalH = container ? container.getBoundingClientRect().height : 550

  if (preset === 'compact') {
    topPaneHeight.value = 75
  } else if (preset === 'split') {
    topPaneHeight.value = Math.round(totalH * 0.36)
  } else if (preset === 'expanded') {
    topPaneHeight.value = Math.min(360, Math.round(totalH * 0.62))
  }
}

function onHandleDblClick() {
  if (topPaneHeight.value <= 100) {
    snapTo('split')
  } else {
    snapTo('compact')
  }
}

onMounted(() => {
  initDefaultHeight()
  window.addEventListener('resize', initDefaultHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', initDefaultHeight)
  window.removeEventListener('pointermove', onDemarcationMove)
  window.removeEventListener('pointerup', endDemarcationDrag)
  window.removeEventListener('pointercancel', endDemarcationDrag)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.contact-container {
  display: grid;
  grid-template-columns: 310px 1fr;
  height: 100%;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  font-family: 'IBM Plex Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
}

.contact-left-pane {
  background: var(--bg-2);
  border-right: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  min-height: 0;
}

.cl-badge {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--accent);
  font-weight: 700;
}

.cl-title {
  font-family: 'Orbitron', 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-0);
  margin-top: 4px;
  line-height: 1.3;
}

.cl-sub {
  font-size: 11px;
  color: var(--text-1);
  margin-top: 4px;
  line-height: 1.5;
}

.contact-cards-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comm-card {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: all 0.15s;
  min-width: 0;
}

.comm-card:hover {
  background: var(--bg-3);
  border-color: var(--accent);
  transform: translateX(3px);
}

.cc-icon {
  font-size: 18px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cc-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.cc-label {
  font-size: 8px;
  color: var(--text-2);
  letter-spacing: 1px;
  margin-bottom: 2px;
}

.cc-val {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--text-0);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cc-action {
  font-size: 9px;
  font-weight: 700;
  color: var(--accent);
  border: 1px solid var(--accent);
  background: var(--accent-dim);
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.cc-arrow {
  font-size: 14px;
  color: var(--accent);
  flex-shrink: 0;
}

.cl-response-box {
  margin-top: auto;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 9px;
  color: var(--text-1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.cr-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
}

.contact-right-pane {
  padding: 20px;
  overflow-y: auto;
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 10px;
}

.cr-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--accent);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.cf-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cf-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cf-field label {
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--text-2);
  font-weight: 700;
}

.cf-field input,
.cf-field select,
.cf-field textarea {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  color: var(--text-0);
  font-family: inherit;
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}

.cf-field input:focus,
.cf-field select:focus,
.cf-field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 10px var(--accent-dim);
}

.cf-field textarea {
  height: 90px;
  resize: vertical;
}

.cf-send-btn {
  width: 100%;
  padding: 14px;
  background: var(--accent);
  color: #000;
  border: none;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 0 20px var(--accent-glow);
  transition: all 0.2s;
}

.cf-send-btn:hover:not(:disabled) {
  background: #7bbcff;
  transform: translateY(-1px);
}

.cf-send-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.cf-success-banner {
  background: var(--green-dim);
  border: 1px solid var(--green);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: fadeIn 0.3s ease;
}

.csb-icon {
  font-size: 20px;
  color: var(--green);
}

.csb-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
}
.csb-text strong {
  color: var(--green);
  font-size: 11px;
  letter-spacing: 1px;
}
.csb-text span {
  color: var(--text-0);
}

.cf-error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--red-dim);
  border: 1px solid var(--red);
  border-radius: 6px;
  font-size: 11px;
  color: var(--red);
  margin-top: 8px;
}

.ceb-icon {
  font-size: 14px;
  font-weight: 700;
}

.contact-demarcation-bar {
  display: none;
}

@media (max-width: 768px) {
  .contact-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .contact-left-pane {
    width: 100%;
    height: var(--top-pane-height, 210px);
    flex-shrink: 0;
    border-right: none;
    border-bottom: none;
    overflow-y: auto;
    transition: height 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .contact-container.is-dragging .contact-left-pane {
    transition: none !important;
  }

  .cl-header,
  .comm-card,
  .cl-response-box {
    flex-shrink: 0;
  }

  .contact-demarcation-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 34px;
    padding: 0 12px;
    background: var(--bg-2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    cursor: ns-resize;
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    gap: 8px;
    transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  }

  .contact-demarcation-bar:hover,
  .contact-demarcation-bar.dragging {
    background: var(--bg-3);
    border-color: var(--accent);
    box-shadow: 0 0 12px var(--accent-glow);
  }

  .cd-grip-zone {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
    cursor: ns-resize;
  }

  .cd-grip-icon {
    display: flex;
    align-items: center;
    color: var(--accent);
    opacity: 0.85;
    flex-shrink: 0;
  }

  .contact-demarcation-bar.dragging .cd-grip-icon {
    opacity: 1;
    filter: drop-shadow(0 0 4px var(--accent));
  }

  .cd-title {
    font-family: 'Orbitron', monospace;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--accent);
    white-space: nowrap;
  }

  .cd-hint {
    font-size: 8px;
    color: var(--text-2);
    letter-spacing: 0.5px;
    white-space: nowrap;
    opacity: 0.7;
  }

  .cd-presets {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }

  .cd-pill {
    background: var(--surface-glass-card);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 3px 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.5px;
    font-weight: 600;
    color: var(--text-1);
    cursor: pointer;
    transition: all 0.15s ease;
    letter-spacing: 0.5px;
  }

  .cd-pill:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .cd-pill.active {
    background: var(--accent-dim);
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 6px var(--accent-glow);
  }

  .contact-right-pane {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .cf-row {
    grid-template-columns: 1fr;
  }
}
</style>
