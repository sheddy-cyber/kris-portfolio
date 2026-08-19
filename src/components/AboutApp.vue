<template>
  <div class="about-container">
    <!-- About Navigation Tabs -->
    <div class="about-nav-tabs">
      <button
        v-for="t in tabs"
        :key="t.id"
        class="about-tab-btn"
        :class="{ active: activeTab === t.id }"
        @click="selectTab(t.id)"
      >
        <span>{{ t.badge }}</span>
        {{ t.label }}
      </button>
    </div>

    <!-- Tab 1: Overview & Bio -->
    <div v-show="activeTab === 'overview'" class="about-tab-pane">
      <div class="about-overview-grid">
        <!-- Left Avatar & Profile Card -->
        <div class="about-left-col">
          <div class="about-avatar-wrapper">
            <div class="avatar-halo"></div>
            <div class="avatar-inner">
              <img src="/kris-avatar.jpg" alt="Kris Shedrach" class="avatar-photo" />
            </div>
            <div class="avatar-status-pill">● AVAILABLE FOR HIRE</div>
          </div>

          <div class="about-hero-name">
            <span class="ahn-first">KRIS</span>
            <span class="ahn-last">SHEDRACH</span>
          </div>

          <div class="about-tagline">Full-Stack Web & Mobile App Architect</div>

          <div class="about-quick-actions">
            <button class="a-act-btn primary" @click="$emit('open-app', 'contact')">
              <span>HIRE KRIS</span>
              <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
            </button>
            <button class="a-act-btn secondary" @click="downloadCv">
              <span>DOWNLOAD CV</span>
              <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>

        <!-- Right Core Details -->
        <div class="about-right-col">
          <!-- Bio Statement -->
          <div class="about-bio-panel">
            <div class="abp-label">// MANIFESTO</div>
            <p class="abp-text">
              I build web applications, cross-platform mobile apps, and scalable cloud architectures that merge <em>aesthetic engineering</em> with bulletproof reliability.
              From microsecond-optimized frontends to robust distributed APIs, I bring ideas to life with ruthless attention to user experience and code quality. I am also enthusiastic about <em>Web3 & blockchain development</em>, actively exploring decentralized protocols and smart contract infrastructure.
            </p>
          </div>

          <!-- Spec Matrix Table -->
          <div class="about-spec-grid">
            <div class="spec-row">
              <span class="spec-k">ROLE:</span>
              <span class="spec-v">Full-Stack Web & Mobile App Architect</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">FOCUS:</span>
              <span class="spec-v">Full-Stack Web Applications · Mobile Apps · Cloud APIs · Web3 & Blockchain</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">LOCATION:</span>
              <span class="spec-v">Lagos, Nigeria 🇳🇬 (Remote Worldwide)</span>
            </div>
            <div class="spec-row">
              <span class="spec-k">STATUS:</span>
              <span class="spec-v tag-green">OPEN TO WORK (FULL-TIME & CONTRACT)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Experience & Milestones -->
    <div v-show="activeTab === 'experience'" class="about-tab-pane">
      <div class="timeline-wrap">
        <div v-for="job in experience" :key="job.title" class="timeline-item">
          <div class="tl-left">
            <span class="tl-period">{{ job.period }}</span>
            <span class="tl-company">{{ job.company }}</span>
          </div>
          <div class="tl-node"></div>
          <div class="tl-content">
            <div class="tl-title">{{ job.title }}</div>
            <p class="tl-desc">{{ job.desc }}</p>
            <div class="tl-stack">
              <span v-for="s in job.stack" :key="s">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Skill Matrix & Arsenal -->
    <div v-show="activeTab === 'skills'" class="about-tab-pane">
      <div class="skills-matrix-grid">
        <div v-for="cat in skillCategories" :key="cat.name" class="skill-category-card">
          <div class="scc-header">
            <span class="scc-icon" v-html="cat.icon"></span>
            <span class="scc-title">{{ cat.name }}</span>
          </div>
          <div class="scc-bars">
            <div v-for="sk in cat.skills" :key="sk.name" class="scc-row">
              <div class="scc-top">
                <span class="scc-skill-name">{{ sk.name }}</span>
                <span class="scc-skill-pct">{{ sk.pct }}%</span>
              </div>
              <div class="scc-track">
                <div class="scc-fill" :style="{ width: sk.pct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 4: Accolades & Testimonials -->
    <div v-show="activeTab === 'accolades'" class="about-tab-pane">
      <div class="testimonials-grid">
        <div v-for="t in testimonials" :key="t.author" class="testimonial-card">
          <div class="t-quote">“{{ t.quote }}”</div>
          <div class="t-author-row">
            <div class="t-avatar">{{ t.initials }}</div>
            <div>
              <div class="t-name">{{ t.author }}</div>
              <div class="t-role">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { soundFx } from '../audio/soundFx'

const emit = defineEmits(['open-app', 'notify'])

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', badge: '// 01', label: 'OVERVIEW' },
  { id: 'experience', badge: '// 02', label: 'EXPERIENCE' },
  { id: 'skills', badge: '// 03', label: 'SKILL MATRIX' },
  { id: 'accolades', badge: '// 04', label: 'TESTIMONIALS' },
]

function selectTab(id) {
  soundFx.playClick()
  activeTab.value = id
}

function downloadCv() {
  soundFx.playSuccess()
  emit('notify', 'Kris_Shedrach_Senior_FullStack_Engineer_CV.pdf downloaded successfully.')
}

const experience = [
  {
    period: 'JUL 2025 — PRESENT',
    company: 'PYTHRON',
    title: 'Web / Mobile App Developer',
    desc: "Founder and lead developer at PYTHRON. Here, I independently conceptualize, design, and build digital products that solve real life problems across multiple industries. Some of the projects I've shipped include a business management app for inventory, sales, and financial tracking; an edtech platform for vibecoding and developer learning; a news broadcasting platform; an NGO website with a CMS and blog; a mobile app for downloading social media videos directly through the android share menu; and a full-stack dApp for automating blockchain-based processes and digital transactions.",
    stack: ['React.js', 'Next.js', 'React Native', 'FastAPI', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'MongoDB', 'PostgreSQL', 'Redis', 'Express']
  },
  {
    period: 'MAR 2026 — JUN 2026',
    company: 'The Rural Girl Child Advancement Network (RUGAN)',
    title: 'Full-stack Developer',
    desc: "Developed and deployed the RUGAN website as a full-stack developer, translating a designer-provided Figma design into a fully responsive, production-ready platform. Built the complete backend infrastructure from scratch, implementing CMS-powered blog content management, email functionality, and secure Paystack payment integration — alongside all necessary third-party service integrations and deployment configuration to deliver a reliable, user-friendly web experience.",
    stack: ['React.js', 'Tailwind CSS', 'Node.js', 'Paystack API', 'CMS & Blog', 'Figma', 'Deployment']
  },
  {
    period: '2024 — 2025',
    company: 'CEDEC International Schools',
    title: 'Computer Science Teacher',
    desc: "Computer science teacher responsible for teaching core computing concepts including programming, algorithms, databases, networking, and digital literacy. Guided students through practical and theoretical learning, developed lesson materials, assisted with projects and problem-solving, and encouraged critical thinking and creativity through technology-focused education.",
    stack: ['Programming', 'Algorithms', 'Databases & SQL', 'Networking', 'Digital Literacy']
  },
  {
    period: '2018 — 2020',
    company: 'Modem Computer Technology',
    title: 'Graphic Designer',
    desc: "Graphic designer and desktop publisher responsible for creating visually compelling digital and print materials across branding, marketing, and communication projects. Designed layouts for documents, presentations, posters, social media content, and promotional materials while ensuring consistency with brand identity and visual standards. Worked with desktop publishing tools to format, edit, and prepare high-quality print-ready files, including brochures, flyers, newsletters, and reports.",
    stack: ['Adobe Photoshop', 'CorelDRAW', 'Graphic Design', 'Desktop Publishing', 'Prepress']
  }
]

const skillCategories = [
  {
    name: 'Frontend & Web Engineering',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    skills: [
      { name: 'React.js & Next.js', pct: 96 },
      { name: 'TypeScript & JavaScript', pct: 95 },
      { name: 'Tailwind CSS', pct: 98 },
      { name: 'Framer Motion (Animations)', pct: 92 },
      { name: 'Zod & Schema Validation', pct: 90 },
    ]
  },
  {
    name: 'Backend & Database Systems',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
    skills: [
      { name: 'Node.js & Express.js', pct: 95 },
      { name: 'Python (FastAPI & Django)', pct: 92 },
      { name: 'PostgreSQL & SQL Databases', pct: 94 },
      { name: 'MongoDB & Redis Caching', pct: 91 },
      { name: 'JWT & OAuth Authentication', pct: 93 },
    ]
  },
  {
    name: 'Mobile Engineering & Integrations',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    skills: [
      { name: 'React Native & Expo', pct: 95 },
      { name: 'Android Studio & Kotlin', pct: 88 },
      { name: 'Paystack Payment API', pct: 94 },
      { name: 'Nodemailer & Brevo Mail APIs', pct: 90 },
      { name: 'Cloudinary Media Pipelines', pct: 92 },
    ]
  },
  {
    name: 'UI/UX & Web3',
    icon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    skills: [
      { name: 'Figma & UI/UX Fundamentals', pct: 93 },
      { name: 'Adobe Photoshop / CorelDRAW', pct: 95 },
      { name: 'Blockchain Basics', pct: 90 },
      { name: 'Solidity / Ethers.js', pct: 88 },
      { name: 'Hardhat / Foundry', pct: 86 },
    ]
  }
]

const testimonials = [
  {
    quote: "Shedrach played a pivotal role in the successful development of our website, bringing a rare combination of technical expertise, strategic thinking, and execution excellence to the project. As a social impact organization, we required a platform that was not only visually engaging but also robust, secure, and capable of supporting our long-term goals. Shedrach delivered on all fronts.",
    author: "Cynthia Ugwu",
    role: "Co-founder & COO, RUGAN",
    initials: "CU"
  },
  {
    quote: "Shedrach built our official business website from the ground up, clearly showcasing our computer training programs, accessory sales, and repair services. He is hardworking, easy to communicate with, and delivered a clean, fast website that our customers find very easy to use. I highly recommend him to anyone looking for a reliable web developer.",
    author: "Chidiebere Success",
    role: "Manager, Modem Computer Technology",
    initials: "CS"
  }
]
</script>

<style scoped>
.about-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
}

.about-nav-tabs {
  display: flex;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  padding: 0 12px;
  gap: 4px;
  overflow-x: auto;
  flex-shrink: 0;
}

.about-tab-btn {
  padding: 10px 14px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-2);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.about-tab-btn span {
  font-size: 9px;
  color: var(--accent);
}

.about-tab-btn:hover {
  color: var(--text-0);
}

.about-tab-btn.active {
  color: var(--text-0);
  border-bottom-color: var(--accent);
  background: var(--accent-dim);
}

.about-tab-pane {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
}

.about-overview-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.about-left-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.about-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-halo {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: var(--accent);
  border-right-color: var(--accent);
  animation: spin 4s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--accent);
  box-shadow: 0 0 20px var(--accent-glow);
  background: #000000;
}

.avatar-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transform: translateY(7px) scale(0.93);
  display: block;
}

.avatar-status-pill {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  background: var(--bg-1);
  color: var(--green);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  font-weight: 700;
}

.about-hero-name {
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-0);
  letter-spacing: 2px;
  margin-top: 4px;
}

.about-tagline {
  font-size: 11px;
  color: var(--accent);
  line-height: 1.4;
}

.about-quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-top: 8px;
}

.a-act-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 6px;
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.15s;
}

.a-act-btn.primary {
  background: var(--accent);
  color: #000;
  border: none;
  box-shadow: 0 0 16px var(--accent-glow);
}
.a-act-btn.primary:hover {
  background: #7bbcff;
  transform: translateY(-1px);
}

.a-act-btn.secondary {
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  color: var(--text-0);
}
.a-act-btn.secondary:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.about-right-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.about-bio-panel {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 8px;
  padding: 16px;
}

.abp-label {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 6px;
}

.abp-text {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-0);
}
.abp-text em {
  color: var(--accent);
  font-style: normal;
  font-weight: 600;
}

.about-spec-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
}

.spec-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  padding-bottom: 6px;
}
.spec-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.spec-k {
  font-size: 10px;
  color: var(--text-2);
  width: 100px;
  flex-shrink: 0;
  letter-spacing: 1px;
}

.spec-v {
  color: var(--text-0);
}
.tag-green {
  color: var(--green);
  font-weight: 600;
}

/* Timeline Tab */
.timeline-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding-left: 10px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 140px 24px 1fr;
  gap: 14px;
}

.tl-left {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 2px;
}

.tl-period {
  font-size: 10px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 1px;
}

.tl-company {
  font-size: 11px;
  color: var(--text-2);
}

.tl-node {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  border: 2px solid var(--bg-0);
  box-shadow: 0 0 8px var(--accent);
  margin-top: 4px;
}

.tl-content {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tl-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-0);
}

.tl-desc {
  font-size: 12px;
  color: var(--text-1);
  line-height: 1.6;
}

.tl-stack {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.tl-stack span {
  font-size: 9px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--text-2);
}

/* Skills Matrix */
.skills-matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.skill-category-card {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}

.scc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.scc-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-0);
  letter-spacing: 0.5px;
}

.scc-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scc-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scc-top {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}
.scc-skill-name { color: var(--text-0); }
.scc-skill-pct { color: var(--accent); }

.scc-track {
  height: 4px;
  background: var(--bg-3);
  border-radius: 2px;
  overflow: hidden;
}

.scc-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--green));
  border-radius: 2px;
}

/* Testimonials */
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.testimonial-card {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
}

.t-quote {
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-1);
  font-style: italic;
}

.t-author-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.t-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-3);
  border: 1px solid var(--border-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
}

.t-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-0);
}
.t-role {
  font-size: 10px;
  color: var(--text-2);
}

@media (max-width: 680px) {
  .about-overview-grid {
    grid-template-columns: 1fr;
  }
  .skills-matrix-grid, .testimonials-grid {
    grid-template-columns: 1fr;
  }
  .timeline-item {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .tl-left {
    align-items: flex-start;
    text-align: left;
  }
  .tl-node {
    display: none;
  }
}
</style>
