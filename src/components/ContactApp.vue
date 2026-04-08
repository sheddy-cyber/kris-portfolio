<template>
  <div class="contact-body">
    <div class="contact-left">
      <div class="cl-avatar">
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" fill="#161b22" stroke="#30363d" stroke-width="1"/>
          <ellipse cx="40" cy="70" rx="24" ry="14" fill="#1a3a5c"/>
          <ellipse cx="40" cy="40" rx="17" ry="19" fill="#c8a882"/>
          <ellipse cx="40" cy="24" rx="17" ry="8" fill="#1a1007"/>
          <rect x="23" y="24" width="34" height="7" fill="#1a1007" rx="1"/>
          <ellipse cx="26" cy="30" rx="4" ry="5" fill="#1a1007"/>
          <ellipse cx="54" cy="30" rx="4" ry="5" fill="#1a1007"/>
          <ellipse cx="32" cy="40" rx="4" ry="4.5" fill="#fff"/>
          <ellipse cx="48" cy="40" rx="4" ry="4.5" fill="#fff"/>
          <circle cx="32.5" cy="40.5" r="2.5" fill="#2a1a0a"/>
          <circle cx="48.5" cy="40.5" r="2.5" fill="#2a1a0a"/>
          <rect x="28" y="36" width="9" height="7.5" rx="3.5" fill="none" stroke="#58a6ff" stroke-width="1.2" opacity="0.7"/>
          <rect x="43" y="36" width="9" height="7.5" rx="3.5" fill="none" stroke="#58a6ff" stroke-width="1.2" opacity="0.7"/>
          <line x1="37" y1="39.5" x2="43" y2="39.5" stroke="#58a6ff" stroke-width="1.2" opacity="0.7"/>
          <path d="M33 50 Q40 56 47 50" stroke="#8a5a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="cl-label">// OPEN_CHANNEL</div>
      <div class="cl-headline">Let's build something remarkable.</div>
      <div class="cl-sub">Drop a message. I respond within 24 hours.</div>
      <div class="contact-links">
        <div class="clink"><span class="cl-icon">◈</span><span>kris@krisshedrach.dev</span></div>
        <div class="clink"><span class="cl-icon">◈</span><span>github.com/krisshedrach</span></div>
        <div class="clink"><span class="cl-icon">◈</span><span>twitter.com/krisshedrach</span></div>
        <div class="clink"><span class="cl-icon">◈</span><span>LinkedIn: Kris Shedrach</span></div>
      </div>
    </div>

    <div class="contact-right">
      <div class="cf-group">
        <label>NAME</label>
        <input v-model="form.name" type="text" placeholder="Your name" />
      </div>
      <div class="cf-group">
        <label>EMAIL / PHONE</label>
        <input v-model="form.email" type="text" placeholder="your@email.com or +234 800 000 0000" />
      </div>
      <div class="cf-group">
        <label>SERVICE</label>
        <select v-model="form.service">
          <option value="">SELECT A SERVICE</option>
          <option>Web Design & Development</option>
          <option>Mobile App Development</option>
          <option>Blockchain Development</option>
          <option>Consulting & Code Audits</option>
          <option>Other</option>
        </select>
      </div>
      <div class="cf-group">
        <label>MESSAGE</label>
        <textarea v-model="form.message" placeholder="Tell me about your project..."></textarea>
      </div>
      <button class="send-btn" :disabled="sending" @click="send">
        <span>{{ sending ? 'SENDING...' : 'SEND MESSAGE' }}</span>
        <svg viewBox="0 0 20 20" width="14" height="14"><path d="M3 10L17 3l-7 7 7 7-14-7z" fill="currentColor"/></svg>
      </button>
      <div v-if="sent" class="send-confirm">✓ MESSAGE SENT — I'LL BE IN TOUCH!</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({ name: '', email: '', service: '', message: '' })
const sending = ref(false)
const sent    = ref(false)

function send() {
  sending.value = true
  setTimeout(() => {
    sending.value = false
    sent.value = true
  }, 1200)
}
</script>
