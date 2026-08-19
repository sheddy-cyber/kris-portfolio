<template>
  <div class="services-container">
    <div class="services-topbar">
      <div>
        <div class="sh-label">// SERVICES & CAPABILITIES</div>
        <h2 class="sh-heading">High-Performance Web & Mobile Engineering</h2>
      </div>
      <button class="quote-all-btn" @click="$emit('open-app', 'contact')">
        <span>BOOK A CALL / QUOTE</span>
        <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
      </button>
    </div>

    <div class="services-grid">
      <div v-for="s in services" :key="s.num" class="svc-card">
        <div class="svc-head">
          <span class="svc-num">{{ s.num }}</span>
          <div class="svc-icon" v-html="s.icon"></div>
        </div>

        <h3 class="svc-name">{{ s.name }}</h3>
        <p class="svc-desc">{{ s.desc }}</p>

        <!-- Deliverables List -->
        <div class="svc-deliverables">
          <div class="sd-label">DELIVERABLES:</div>
          <ul>
            <li v-for="d in s.deliverables" :key="d">
              <span class="sd-bullet">◈</span> {{ d }}
            </li>
          </ul>
        </div>

        <!-- Tech Stack Badges -->
        <div class="svc-tags">
          <span v-for="t in s.tags" :key="t">{{ t }}</span>
        </div>

        <button class="svc-action-btn" @click="requestService(s.name)">
          <span>INQUIRE ABOUT THIS SERVICE →</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { soundFx } from '../audio/soundFx'

const emit = defineEmits(['open-app', 'prefill-contact'])

function requestService(serviceName) {
  soundFx.playClick()
  emit('prefill-contact', serviceName)
  emit('open-app', 'contact')
}

const services = [
  {
    num: '01',
    icon: `<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 22l-6 5 6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M32 22l6 5-6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M26 17l-4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    name: 'Full-Stack Web Engineering',
    desc: 'Blazing fast, visually striking web applications with reactive architecture, zero layout shifts, and polished micro-interactions.',
    deliverables: [
      'Next.js 14 / Vue 3 Server-Side Rendered Applications',
      'High-throughput GraphQL / REST API Backend Microservices',
      '3D Interactive WebGL / Canvas / Motion UI Experiences',
      'Stripe / Multi-Currency Payment Gateway Integration'
    ],
    tags: ['Next.js', 'Vue 3', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
  },
  {
    num: '02',
    icon: `<svg viewBox="0 0 48 48"><rect x="14" y="4" width="20" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="38" r="2" fill="currentColor"/><path d="M19 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    name: 'Cross-Platform Mobile Apps',
    desc: 'Native-grade iOS & Android applications built with fluid 60fps animations, offline data persistence, and clean state management.',
    deliverables: [
      'Cross-Platform React Native & Expo Production Builds',
      'Offline-First SQLite / Local Storage Synchronization',
      'Push Notification Infrastructure & Real-Time WebSockets',
      'App Store & Google Play Console Submission Guidance'
    ],
    tags: ['React Native', 'Expo', 'SQLite', 'Firebase', 'Zustand', 'iOS / Android'],
  },
  {
    num: '03',
    icon: `<svg viewBox="0 0 48 48"><path d="M12 16h24M12 24h24M12 32h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="6" y="8" width="36" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    name: 'Cloud Backends & Real-Time APIs',
    desc: 'Fault-tolerant distributed backends, WebSocket event pipelines, automated database migrations, and microservice orchestrations.',
    deliverables: [
      'Scalable Node.js / Express / NestJS Microservices',
      'PostgreSQL & Prisma Database Schema Modeling & Indexing',
      'Redis Caching & Real-Time WebSocket Pub/Sub Pipelines',
      'JWT / OAuth2 Secure Authentication & Rate Limiting'
    ],
    tags: ['Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'WebSockets', 'Docker'],
  },
  {
    num: '04',
    icon: `<svg viewBox="0 0 48 48"><rect x="6" y="8" width="36" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 16h36M16 26l6 6 10-10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M18 40h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    name: 'Website Reviews, Upgrades & CMS Optimization',
    desc: 'Comprehensive technical reviews, redesigns, and feature modernization for your existing site. Whether custom-built or running on Shopify, WordPress, Webflow, or Squarespace — I am up for anything web-related.',
    deliverables: [
      'Full Website Technical Audits (Speed, SEO, Responsiveness & UX)',
      'Shopify, WordPress, Webflow & CMS Platform Customizations & Fixes',
      'Legacy Site Modernization, Rebranding & Mobile-First Redesigns',
      'Performance Optimization, Bug Resolution & Feature Expansions'
    ],
    tags: ['Website Audit', 'Shopify', 'WordPress', 'Webflow', 'Performance', 'Modernization'],
  },
]
</script>

<style scoped>
.services-container {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  flex: 1;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
}

.services-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.sh-label {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 4px;
}

.sh-heading {
  font-family: 'Orbitron', 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-0);
}

.quote-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  background: var(--accent);
  color: #000;
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 16px var(--accent-glow);
  transition: all 0.15s;
  white-space: nowrap;
}
.quote-all-btn:hover {
  background: #7bbcff;
  transform: translateY(-1px);
}

.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.svc-card {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.svc-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.svc-card:hover {
  border-color: var(--border-glow);
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 16px var(--accent-glow);
}

.svc-card:hover::before {
  opacity: 1;
}

.svc-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.svc-num {
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 1px;
}

.svc-icon {
  width: 32px;
  height: 32px;
  color: var(--accent);
}
.svc-icon svg {
  width: 100%;
  height: 100%;
}

.svc-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-0);
}

.svc-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-1);
}

.svc-deliverables {
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sd-label {
  font-size: 9px;
  letter-spacing: 1px;
  color: var(--text-2);
  font-weight: 700;
}

.svc-deliverables ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.svc-deliverables li {
  font-size: 11px;
  color: var(--text-0);
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.sd-bullet {
  color: var(--accent);
  font-size: 9px;
}

.svc-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: auto;
}

.svc-tags span {
  font-size: 9px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 2px 7px;
  color: var(--text-2);
}

.svc-action-btn {
  margin-top: 6px;
  padding: 8px;
  background: transparent;
  border: 1px dashed var(--border-2);
  border-radius: 6px;
  color: var(--accent);
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}
.svc-action-btn:hover {
  background: var(--accent-dim);
  border-style: solid;
  border-color: var(--accent);
}

@media (max-width: 680px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  .services-topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
