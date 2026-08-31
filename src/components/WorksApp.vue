<template>
  <div class="works-container">
    <!-- IN-WINDOW CASE STUDY VIEW -->
    <div v-if="selectedProject" class="case-study-view">
      <!-- Top Navigation Subbar -->
      <div class="cs-top-bar">
        <button class="cs-back-btn" @click="closeCaseStudy">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          <span>BACK TO WORKS</span>
        </button>
        <div class="cs-top-meta">
          <span class="wc-cat-badge" :class="'cat-' + selectedProject.cat">{{ selectedProject.cat.toUpperCase() }}</span>
          <span class="cs-year">{{ selectedProject.year }}</span>
        </div>
      </div>

      <!-- Case Study Scrollable Content -->
      <div class="cs-scroll-body">
        <!-- Visual Preview Banner -->
        <div class="cs-preview-wrap">
          <img :src="selectedProject.thumbnail || '/projects/project-placeholder.jpg'" :alt="selectedProject.name" class="cs-preview-img" />
          <div class="cs-preview-overlay">
            <span class="cs-status-pill">● PRODUCTION DEPLOYED</span>
          </div>
        </div>

        <!-- Title & Tagline -->
        <div class="cs-title-header">
          <h2 class="cs-main-title">{{ selectedProject.name }}</h2>
          <p class="cs-main-desc">{{ selectedProject.desc }}</p>
        </div>

        <!-- Metric Highlight Cards -->
        <div class="cs-metrics-grid">
          <div v-for="m in selectedProject.metrics" :key="m.label" class="cs-metric-box">
            <span class="cs-metric-val">{{ m.val }}</span>
            <span class="cs-metric-lbl">{{ m.label }}</span>
          </div>
        </div>

        <!-- Section 1: Architecture -->
        <div class="cs-content-section">
          <h3 class="cs-sec-h">// 01. ARCHITECTURE & SYSTEM DESIGN</h3>
          <p class="cs-sec-p">{{ selectedProject.architecture }}</p>
        </div>

        <!-- Section 2: Challenges -->
        <div class="cs-content-section">
          <h3 class="cs-sec-h">// 02. KEY ENGINEERING CHALLENGES</h3>
          <ul class="cs-challenges-list">
            <li v-for="(ch, idx) in selectedProject.challenges" :key="idx">
              <strong>{{ ch.title }}:</strong> {{ ch.desc }}
            </li>
          </ul>
        </div>

        <!-- Section 3: Stack -->
        <div class="cs-content-section">
          <h3 class="cs-sec-h">// 03. FULL ARSENAL & TOOLING</h3>
          <div class="cs-tech-grid">
            <span v-for="t in selectedProject.stack" :key="t" class="cs-tech-pill">{{ t }}</span>
          </div>
        </div>

        <!-- Action Links -->
        <div class="cs-actions-footer">
          <button class="cs-btn-primary" @click="openDemo">
            <span>LAUNCH LIVE DEMO</span>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>
          </button>
          <button class="cs-btn-secondary" @click="openRepo">
            <span>VIEW SOURCE ON GITHUB</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- CATALOG VIEW (Default) -->
    <template v-else>
      <!-- Top Control Bar -->
      <div class="works-control-bar">
        <!-- Filter Buttons -->
        <div class="works-filter-pills">
          <button
            v-for="f in filters"
            :key="f.value"
            class="wf-pill-btn"
            :class="{ active: activeFilter === f.value }"
            @click="selectFilter(f.value)"
          >
            {{ f.label }}
          </button>
        </div>

        <!-- View Toggle -->
        <div class="works-view-toggles">
          <button class="vt-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" title="Grid View">⊞</button>
          <button class="vt-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" title="List View">☰</button>
        </div>
      </div>

      <!-- Status Subbar -->
      <div class="works-subbar">
        <span class="ws-count">// SHOWING {{ filteredProjects.length }} OF {{ projects.length }} FLAGSHIP PRODUCTIONS</span>
        <span class="ws-tip">CLICK ANY CARD FOR ARCHITECTURAL CASE STUDY</span>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="works-grid-layout">
        <div
          v-for="p in filteredProjects"
          :key="p.name"
          class="work-card"
          @click="openCaseStudy(p)"
        >
          <div class="wc-thumb">
            <img :src="p.thumbnail" :alt="p.name" class="wc-thumb-img" />
            <div class="wc-overlay">
              <span>INSPECT CASE STUDY ◈</span>
            </div>
            <span class="wc-cat-badge" :class="'cat-' + p.cat">{{ p.cat.toUpperCase() }}</span>
          </div>

          <div class="wc-info">
            <div class="wc-title-row">
              <h4 class="wc-name">{{ p.name }}</h4>
              <span class="wc-year">{{ p.year }}</span>
            </div>
            <p class="wc-desc">{{ p.desc }}</p>

            <div class="wc-stack-row">
              <span v-for="t in p.stack.slice(0, 4)" :key="t">{{ t }}</span>
              <span v-if="p.stack.length > 4" class="wc-more-pill">+{{ p.stack.length - 4 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="works-list-layout">
        <div
          v-for="p in filteredProjects"
          :key="p.name"
          class="work-list-item"
          @click="openCaseStudy(p)"
        >
          <div class="wli-left">
            <span class="wc-cat-badge" :class="'cat-' + p.cat">{{ p.cat.toUpperCase() }}</span>
            <span class="wli-name">{{ p.name }}</span>
            <span class="wli-desc">{{ p.desc }}</span>
          </div>
          <div class="wli-right">
            <div class="wli-stack">
              <span v-for="t in p.stack.slice(0, 3)" :key="t">{{ t }}</span>
            </div>
            <button class="wli-btn">CASE STUDY →</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { soundFx } from '../audio/soundFx'

const emit = defineEmits(['notify'])

const activeFilter = ref('all')
const viewMode = ref('grid')
const selectedProject = ref(null)

const filters = [
  { label: 'ALL', value: 'all' },
  { label: 'WEB APPS', value: 'web' },
  { label: 'MOBILE APPS', value: 'mobile' },
]

function selectFilter(val) {
  soundFx.playClick()
  activeFilter.value = val
}

function openCaseStudy(p) {
  soundFx.playWindowOpen()
  selectedProject.value = p
}

function closeCaseStudy() {
  soundFx.playClick()
  selectedProject.value = null
}

function openDemo() {
  soundFx.playClick()
  const p = selectedProject.value
  if (p?.liveUrl) {
    emit('notify', `Connecting to live instance of ${p.name}...`)
    window.open(p.liveUrl, '_blank', 'noopener,noreferrer')
  } else {
    emit('notify', `Live instance deployment requested for ${p?.name || 'project'}...`)
  }
}

function openRepo() {
  soundFx.playClick()
  const p = selectedProject.value
  if (p?.githubUrl) {
    emit('notify', `Opening GitHub repository for ${p.name}...`)
    window.open(p.githubUrl, '_blank', 'noopener,noreferrer')
  } else {
    emit('notify', `Opening source code repository for ${p?.name || 'project'}...`)
  }
}

const projects = [
  {
    cat: 'web',
    name: 'RUGAN NGO Platform',
    thumbnail: '/projects/rugan.png',
    liveUrl: 'https://www.rugan.org/',
    githubUrl: 'https://github.com/rugan-nigeria/rugan',
    year: '2026',
    viewBox: '0 0 280 160',
    desc: 'Responsive web platform and content management system for The Rural Girl Child Advancement Network, featuring Paystack donation processing, community blog, and volunteer management.',
    architecture: 'Engineered with React, TypeScript, and Tailwind CSS frontend paired with a Node.js/Express backend. Integrated Paystack payment gateway with server-side webhook verification, Brevo automated email dispatch, Cloudinary CDN asset pipelines, and Zod runtime schema validation.',
    metrics: [
      { val: '100%', label: 'Mobile Responsive' },
      { val: '<1.2s', label: 'Page Load' },
      { val: '99.9%', label: 'Uptime SLA' }
    ],
    challenges: [
      { title: 'Paystack Integration & Donation Monitoring', desc: 'Integrated Paystack checkout API with secure server-side webhook verification and built administrative workflows to track incoming donations, transaction statuses, and donor records in real time.' },
      { title: 'Automated Confirmation & Notification Emails', desc: 'Integrated Brevo and transactional email dispatch to automatically deliver instant branded confirmation emails for donations, newsletter signups, and volunteer registrations.' },
      { title: 'Dynamic Media & Content Publishing', desc: 'Built an intuitive CMS for field staff to publish impact stories and photo galleries with Cloudinary media transformations.' }
    ],
    stack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Paystack API', 'Node.js', 'Express.js', 'Brevo', 'Cloudinary', 'Zod', 'JWT'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'web',
    name: 'Kyrios Family Church',
    thumbnail: '/projects/kyrios.png',
    liveUrl: 'https://krisshedrachportfolio.netlify.app',
    githubUrl: 'https://github.com/sheddy-cyber/kyrios-family-church',
    year: '2026',
    viewBox: '0 0 280 160',
    desc: 'Modern, responsive community web platform for Kyrios Family Church featuring sermon media streaming, event management, visitor onboarding, and online giving workflows.',
    architecture: 'Engineered with React, TypeScript, and modern CSS/Tailwind CSS with responsive multimedia delivery pipelines. Features sermon audio/video archives with multi-filter tagging, real-time announcements marquee, interactive visit planner, direct WhatsApp concierge integration, and secure online giving workflows.',
    metrics: [
      { val: '100%', label: 'Mobile Responsive' },
      { val: '<1.0s', label: 'Page Load' },
      { val: '99.9%', label: 'Uptime SLA' }
    ],
    challenges: [
      { title: 'Multimedia Sermon & Media Streaming', desc: 'Engineered dynamic video and audio sermon archives with topical filtration, optimized for high-fidelity playback across mobile networks.' },
      { title: 'Real-Time Announcements & Event Calendar', desc: 'Built an interactive marquee ticker and event management system for weekly services, conferences, and building projects.' },
      { title: 'Seamless Giving & Visitor Concierge', desc: 'Integrated streamlined digital giving workflows alongside instant WhatsApp concierge routing for first-time visitors and community engagement.' }
    ],
    stack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Multimedia Player', 'WhatsApp API', 'SEO & OpenGraph', 'Netlify'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'web',
    name: 'The Watchtower News',
    thumbnail: '/projects/watchtower.png',
    liveUrl: 'https://thewatchtowernews.vercel.app/',
    githubUrl: 'https://github.com/sheddy-cyber/The-Watchtower-News',
    year: '2025',
    viewBox: '0 0 280 160',
    desc: 'Full-stack editorial journalism platform featuring multi-desk news feeds, real-time trending ticker, user authentication, reader bookmarks, interactive daily puzzles, and full-text search.',
    architecture: 'Engineered with React 18 + Vite frontend and a robust Node.js + Express backend. Backed by PostgreSQL with Prisma ORM, JWT access & refresh token rotation with bcrypt password hashing, Nodemailer transactional email delivery, and production security controls (Helmet, CORS, IP rate limiting, CSRF protection, and input sanitisation).',
    metrics: [
      { val: '100%', label: 'Lighthouse SEO' },
      { val: '<450ms', label: 'API Response' },
      { val: 'A+ Rated', label: 'Security Grade' }
    ],
    challenges: [
      { title: 'Dual-Token JWT Auth & bcrypt Encryption', desc: 'Engineered secure user authentication utilizing short-lived JWT access tokens paired with HttpOnly refresh token rotation and salted bcrypt password hashing.' },
      { title: 'Comprehensive Backend Hardening & Sanitisation', desc: 'Implemented defensive middleware pipelines with Helmet HTTP security headers, strict CORS, express-rate-limit request throttling, CSRF mitigation, and rigorous input sanitisation.' },
      { title: 'Relational Data Modeling with Prisma ORM', desc: 'Designed high-throughput PostgreSQL schemas with Prisma ORM for efficient article queries, bookmarks, and desk categorisation (World, Tech, Business, Health, Sports).' }
    ],
    stack: ['React 18', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'JWT (Access/Refresh)', 'bcrypt', 'Nodemailer', 'Helmet & Security'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'web',
    name: 'The 24 Log',
    thumbnail: '/projects/the24log.png',
    liveUrl: 'https://the24log.vercel.app',
    githubUrl: 'https://github.com/sheddy-cyber/The24Log',
    year: '2025',
    viewBox: '0 0 280 160',
    desc: 'Privacy-first daily time-accounting ledger and Progressive Web Application (PWA) built on a zero-dependency reactive architecture with discrete 24-hour block logging.',
    architecture: 'Engineered with Vanilla ES6+ JavaScript, Semantic HTML5, and CSS3 on a zero-dependency architecture. Powered by a unidirectional reactive state machine with transactional localStorage synchronization, dynamic multi-personality typography engine, 3D tactile extrusion system, and a Service Worker cache invalidation pipeline for full offline data sovereignty.',
    metrics: [
      { val: '0 Deps', label: 'Zero Dependencies' },
      { val: '100%', label: 'Offline Sovereignty' },
      { val: '<0.3s', label: 'Instant Launch' }
    ],
    challenges: [
      { title: 'Zero-Dependency Reactive State Architecture', desc: 'Developed a lightweight unidirectional state architecture where user actions dispatch to centralized state mutators, trigger transactional localStorage synchronization, and perform efficient DOM reconciliations with zero external libraries.' },
      { title: 'Mobile-First Multi-Tiered Responsive Grid', desc: 'Engineered an adaptive CSS Grid layout with explicit breakpoint overrides that restructures the inline logging timeline into a comfortable 3-tier mobile stack with side-by-side tagging and action controls, eliminating horizontal overflow across all viewports.' },
      { title: 'Tactile 3D Extrusion & Dual-Theme Contrast', desc: 'Designed a mathematical lighting and box-shadow depth-ridge extrusion system using high-luminance active base tones (terracotta, emerald, slate) to preserve physical tactile feedback across both light canvas and dark modes.' },
      { title: 'Dynamic Typography & Voice Switcher', desc: 'Parameterized typographic scale tokens in CSS custom properties and dynamic root dataset attributes, enabling seamless multi-font class switching (Serif, Sans, Script) without layout shifts or repaints.' },
      { title: 'PWA Lifecycle & Cache Invalidation Pipeline', desc: 'Implemented an automated cache versioning protocol in the build pipeline that synchronizes cache identifiers across the Service Worker, markup, and dist output to ensure instant asset updates.' }
    ],
    stack: ['Vanilla JS (ES6+)', 'Semantic HTML5', 'Modern CSS3', 'Service Worker (PWA)', 'State Machine', 'localStorage Engine', 'Dynamic Typography', '3D Tactile Design'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'mobile',
    name: 'Record Am',
    thumbnail: '/projects/record-am.png',
    liveUrl: 'https://record-am.vercel.app/',
    githubUrl: 'https://github.com/sheddy-cyber/record-am',
    year: '2026',
    viewBox: '0 0 280 160',
    desc: 'Offline-first mobile bookkeeping and Point-of-Sale (POS) application for merchants to record sales, track inventory movements, manage customer/supplier debts, perform daily cash reconciliations, and generate P&L analytics.',
    architecture: 'Engineered with React Native 0.81 & Expo SDK 54 using Expo Router for typed navigation. Powered by Supabase (PostgreSQL, Auth, RPCs, Row-Level Security) with Zustand state management. Features an offline-first transaction queue syncing automatically on network reconnect, @shopify/flash-list for 60fps inventory rendering, NativeWind styling, and native hardware integrations for biometrics and receipt printing.',
    metrics: [
      { val: '0ms', label: 'Offline Latency' },
      { val: '100%', label: 'Supabase RLS Isolation' },
      { val: '60 FPS', label: 'FlashList Scrolling' }
    ],
    challenges: [
      { title: 'Offline-First Transaction Queue & NetInfo Background Sync', desc: 'Engineered an offline-first local queue with Zustand that logs cart checkouts, inventory restocks, and debt installments with zero network latency, automatically resolving and syncing mutations to Supabase upon network reconnection.' },
      { title: 'Cash Drawer Reconciliation & Real-Time P&L Telemetry', desc: 'Built end-of-day cash reconciliation with automated surplus/shortage discrepancy detection and on-device calculations for gross profit, net profit, COGS, and revenue trends.' },
      { title: 'Enterprise RBAC, Supabase RLS & Biometric Security', desc: 'Implemented granular Role-Based Access Control (Owner, Manager, Cashier, Auditor) with business ID onboarding, strict PostgreSQL Row-Level Security (RLS) multi-tenant policies, and biometric app lock gates (Fingerprint, Face ID, PIN) via expo-local-authentication.' },
      { title: 'Native Hardware APIs, Thermal Receipts & WhatsApp Dispatch', desc: 'Integrated expo-print, expo-sharing, and expo-notifications to generate instant 58mm/80mm thermal-style PDF receipts, send one-tap WhatsApp payment reminders, and trigger automated low-stock push alerts.' }
    ],
    stack: ['React Native 0.81', 'Expo SDK 54', 'Expo Router', 'Supabase (PostgreSQL)', 'Row-Level Security (RLS)', 'Zustand', 'NativeWind', '@shopify/flash-list', 'expo-local-auth', 'expo-print / sharing', 'expo-notifications'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'mobile',
    name: 'grab — Social Video Extractor',
    thumbnail: '/projects/grab.png',
    liveUrl: 'https://grabsocialvideos.vercel.app/',
    githubUrl: 'https://github.com/sheddy-cyber/grab',
    year: '2026',
    viewBox: '0 0 280 160',
    desc: 'Full-stack mobile application and backend extraction microservice engineered to extract, proxy, and download social video streams (YouTube, Instagram, X, Facebook) directly to native mobile galleries.',
    architecture: 'Engineered with a native Android (Kotlin) mobile application interface connected to a Python/Flask & Gunicorn microservice. Integrates yt-dlp, FFmpeg muxing, and a lightweight 64MB Node.js cryptographic PO-token provider to bypass datacenter IP bans. Features generator-based chunked HTTP streaming within strict 512MB RAM constraints, automatic H.264 codec normalization, and multi-tier self-healing Cobalt API fallbacks.',
    metrics: [
      { val: '<512MB', label: 'RAM Footprint' },
      { val: '100%', label: 'H.264 Playability' },
      { val: '0s Delay', label: 'PO Token Gen' }
    ],
    challenges: [
      { title: 'Memory-Safe Generator Chunked Streaming', desc: 'Engineered a generator-based disk-to-client streaming pipeline (stream_and_cleanup()) with reconstructed Content-Disposition and Date headers, streaming 200MB+ DASH multiplexed MP4s without exceeding 512MB cloud RAM limits or corrupting camera roll chronological sorting.' },
      { title: 'Autonomous Bot-Detection Bypass & Warmup', desc: 'Built a staggered background Node.js service capped at 64MB RAM with JIT warmup synchronization in shell, generating cryptographic Proof of Origin (PO) tokens on the fly to bypass YouTube datacenter IP bans with zero latency.' },
      { title: 'Strict H.264 Codec Normalization', desc: 'Overrode default greedy stream selectors with custom format sorting (vcodec:h264), filtering out fragmented HEVC/AV1 streams to guarantee 100% video playback across older Android devices and WhatsApp sharing.' },
      { title: 'Resilient Self-Healing Fallback Routing', desc: 'Architected a multi-tiered extractor pipeline that queries fast Cobalt API endpoints first, dynamically failing over to the modified internal yt-dlp/FFmpeg engine upon Cloudflare blocks or rate limits.' }
    ],
    stack: ['Android (Kotlin)', 'Python (Flask)', 'yt-dlp', 'FFmpeg', 'Node.js (PO Tokens)', 'Gunicorn', 'Bash Scripting', 'Chunked HTTP Streaming'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'web',
    name: 'Modem Computer Technology',
    thumbnail: '/projects/modem.png',
    liveUrl: 'https://modemcomputertechnology.netlify.app/',
    githubUrl: 'https://github.com/sheddy-cyber/modem-nextjs',
    year: '2025',
    viewBox: '0 0 280 160',
    desc: 'Commercial web platform for Modem Computer Technology showcasing computer training certifications, IT hardware/accessory sales, and technical repair services.',
    architecture: 'Converted from legacy vanilla stack into a high-performance Next.js 14 App Router application with TypeScript and Tailwind CSS. Features Schema.org JSON-LD structured data (EducationalOrganization & Store), automated sitemaps/robots generation, zero-CLS Google Fonts, Nodemailer enquiry dispatch, and automatic WebP/AVIF image optimization.',
    metrics: [
      { val: '100/100', label: 'Lighthouse SEO' },
      { val: '0 CLS', label: 'Font Stability' },
      { val: '<500ms', label: 'FCP Speed' }
    ],
    challenges: [
      { title: 'Legacy Modernization to Next.js 14 App Router', desc: 'Refactored a legacy multi-page vanilla HTML/CSS/JS site into modular TypeScript components and a clean Tailwind CSS design system.' },
      { title: 'Comprehensive Schema.org JSON-LD & Dynamic SEO', desc: 'Engineered dual Schema.org structured metadata for EducationalOrganization and Store, paired with auto-generated app/sitemap.ts and app/robots.ts for search indexing.' },
      { title: 'Nodemailer Gmail Dispatch & Asset Optimization', desc: 'Implemented server-side enquiry delivery via Nodemailer with Gmail App Passwords, alongside next/image automated WebP/AVIF conversions for fast load times.' }
    ],
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Lucide React', 'Nodemailer', 'Schema.org JSON-LD', 'Netlify'],
    svgContent: `<rect width="280" height="160" fill="#06090e"/>`
  },
  {
    cat: 'mobile',
    name: 'SplitPay Cross-Border',
    thumbnail: '/projects/project-placeholder.jpg',
    year: '2023',
    viewBox: '0 0 280 160',
    desc: 'Peer-to-peer split payment & social escrow app supporting multi-currency conversions and instant settlement.',
    architecture: 'React Native, Node.js microservices, Flutterwave & Paystack APIs, biometric security, and end-to-end encrypted transaction receipts.',
    metrics: [
      { val: '85k+', label: 'Transactions' },
      { val: '12', label: 'Currencies' },
      { val: '99.9%', label: 'Settlement' }
    ],
    challenges: [
      { title: 'Concurrent Multi-Currency Ledger', desc: 'Devised transactional isolation locks ensuring zero balance mismatch during simultaneous settlement.' }
    ],
    stack: ['React Native', 'Firebase', 'Flutterwave API', 'Express', 'PostgreSQL'],
    svgContent: `<rect width="280" height="160" fill="#040c06"/><rect x="65" y="8" width="66" height="116" rx="10" fill="#121924" stroke="#243347" stroke-width="1.5"/><rect x="149" y="8" width="66" height="116" rx="10" fill="#121924" stroke="#243347" stroke-width="1.5"/><rect x="71" y="18" width="54" height="96" rx="5" fill="#0b1017"/><rect x="155" y="18" width="54" height="96" rx="5" fill="#0b1017"/><circle cx="98" cy="54" r="18" fill="#0d2a14" stroke="#10b981" stroke-width="1.5" opacity="0.7"/><circle cx="182" cy="54" r="18" fill="#0d2a14" stroke="#10b981" stroke-width="1.5" opacity="0.7"/><rect x="76" y="80" width="54" height="5" rx="2" fill="#243347"/><rect x="160" y="80" width="54" height="5" rx="2" fill="#243347"/>`
  },
  {
    cat: 'mobile',
    name: 'Kora Health & Wellness Suite',
    thumbnail: '/projects/project-placeholder.jpg',
    year: '2024',
    viewBox: '0 0 280 160',
    desc: 'Cross-platform biometric tracking suite with telemetry charts, Apple Health / Google Fit sync, and workout interval timers.',
    architecture: 'React Native, Expo SDK, HealthKit & Google Fit integration, SQLite local cache, and Node.js analytics backend.',
    metrics: [
      { val: '48k+', label: 'Workouts Logged' },
      { val: '60 FPS', label: 'Graph Render' },
      { val: '4.8 / 5.0', label: 'User Score' }
    ],
    challenges: [
      { title: 'Wearable Sensor Ingestion', desc: 'Filtered irregular heart rate & pedometer sensor data with low-pass Kalman filter algorithms in JavaScript.' }
    ],
    stack: ['React Native', 'Expo', 'HealthKit', 'Node.js', 'PostgreSQL', 'Chart.js'],
    svgContent: `<rect width="280" height="160" fill="#080614"/><rect x="90" y="8" width="100" height="144" rx="12" fill="#121924" stroke="#a855f7" stroke-width="1.5"/><circle cx="140" cy="65" r="28" fill="none" stroke="#a855f7" stroke-width="4" stroke-dasharray="120,40"/><text x="140" y="70" text-anchor="middle" fill="#fff" font-size="12" font-family="sans-serif" font-weight="bold">8.4k</text><rect x="105" y="105" width="70" height="6" rx="3" fill="#38bdf8"/><rect x="105" y="118" width="50" height="6" rx="3" fill="#10b981"/>`
  }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects
  return projects.filter(p => p.cat === activeFilter.value)
})
</script>

<style scoped>
.works-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
  padding: 16px;
  gap: 12px;
  overflow: hidden;
  box-sizing: border-box;
  font-family: 'JetBrains Mono', 'Share Tech Mono', monospace;
  color: var(--text-0);
}

.works-control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.works-filter-pills {
  display: flex;
  gap: 4px;
}

.wf-pill-btn {
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 1px;
  padding: 6px 12px;
  border-radius: 4px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-2);
  cursor: pointer;
  transition: all 0.15s;
}

.wf-pill-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.wf-pill-btn.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 700;
}

.works-view-toggles {
  display: flex;
  gap: 2px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px;
}

.vt-btn {
  background: transparent;
  border: none;
  color: var(--text-2);
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
}

.vt-btn.active {
  background: var(--accent-dim);
  color: var(--accent);
}

.works-subbar {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--text-2);
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.ws-tip {
  color: var(--accent);
}

.works-grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(295px, 1fr));
  gap: 18px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding: 8px 6px 16px 2px;
}

.work-card {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 380px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  animation: cardFadeUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes cardFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.work-card:nth-child(1) { animation-delay: 0s; }
.work-card:nth-child(2) { animation-delay: 0.06s; }
.work-card:nth-child(3) { animation-delay: 0.12s; }
.work-card:nth-child(4) { animation-delay: 0.18s; }
.work-card:nth-child(5) { animation-delay: 0.24s; }
.work-card:nth-child(6) { animation-delay: 0.3s; }
.work-card:nth-child(7) { animation-delay: 0.36s; }
.work-card:nth-child(8) { animation-delay: 0.42s; }
.work-card:nth-child(9) { animation-delay: 0.48s; }

.work-card:hover {
  border-color: var(--border-glow);
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6), 0 0 16px var(--accent-glow);
}

.wc-thumb {
  position: relative;
  height: 185px;
  background: linear-gradient(90deg, var(--bg-2) 25%, var(--bg-3) 50%, var(--bg-2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  overflow: hidden;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wc-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.work-card:hover .wc-thumb-img {
  transform: scale(1.05);
}

.wc-overlay {
  position: absolute;
  inset: 0;
  background: var(--surface-glass-heavy);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.wc-overlay span {
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 6px 14px;
  border-radius: 4px;
  background: var(--accent-dim);
}

.work-card:hover .wc-overlay {
  opacity: 1;
}

.wc-cat-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 2px 6px;
  border-radius: 3px;
}

.cat-web { background: rgba(56, 189, 248, 0.2); color: var(--accent); border: 1px solid var(--accent); }
.cat-mobile { background: var(--green-dim); color: var(--green); border: 1px solid var(--green); }
.cat-ai, .cat-backend { background: var(--purple-dim, rgba(129, 140, 248, 0.2)); color: var(--purple, #818cf8); border: 1px solid var(--purple, #818cf8); }

.wc-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.wc-title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.wc-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-0);
  line-height: 1.3;
}

.wc-year {
  font-size: 11px;
  color: var(--text-2);
  flex-shrink: 0;
}

.wc-desc {
  font-size: 12px;
  color: var(--text-1);
  line-height: 1.55;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.wc-stack-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.wc-stack-row span {
  font-size: 9.5px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--text-1);
  font-weight: 500;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.wc-stack-row .wc-more-pill {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: rgba(0, 242, 254, 0.4);
  font-weight: 700;
}

/* List Layout */
.works-list-layout {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  padding: 8px 4px 16px 2px;
}

.work-list-item {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.15s;
}

.work-list-item:hover {
  border-color: var(--accent);
  background: var(--bg-3);
  transform: translateX(4px);
}

.wli-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wli-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-0);
}

.wli-desc {
  font-size: 11px;
  color: var(--text-2);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wli-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wli-stack {
  display: flex;
  gap: 4px;
}
.wli-stack span {
  font-size: 8px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--text-2);
}

.wli-btn {
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

/* ===================================================
   IN-WINDOW CASE STUDY VIEW
   =================================================== */
.case-study-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  animation: csFadeIn 0.2s ease;
  margin: -16px; /* Fill full window area */
}

@keyframes csFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.cs-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--surface-glass-heavy);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.cs-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  color: var(--accent);
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 7px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cs-back-btn:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  transform: translateX(-2px);
}

.cs-top-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cs-year {
  font-size: 11px;
  color: var(--text-2);
  font-weight: 600;
}

.cs-scroll-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 28px 40px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cs-preview-wrap {
  height: 240px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border);
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.cs-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cs-preview-overlay {
  position: absolute;
  top: 14px;
  right: 14px;
}

.cs-status-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  background: var(--surface-glass-heavy);
  backdrop-filter: blur(8px);
  color: var(--green);
  border: 1px solid rgba(16, 185, 129, 0.4);
  padding: 5px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.cs-title-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cs-main-title {
  font-family: 'Orbitron', 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-0);
  letter-spacing: 0.5px;
  margin: 0;
}

.cs-main-desc {
  font-size: 13px;
  color: var(--text-1);
  line-height: 1.65;
  margin: 0;
}

.cs-metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.cs-metric-box {
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cs-metric-val {
  font-family: 'Orbitron', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}

.cs-metric-lbl {
  font-size: 10px;
  color: var(--text-2);
  letter-spacing: 0.5px;
}

.cs-content-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cs-sec-h {
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 1.5px;
  font-weight: 700;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin: 0;
}

.cs-sec-p {
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-1);
  margin: 0;
}

.cs-challenges-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cs-challenges-list li {
  font-size: 12px;
  line-height: 1.65;
  color: var(--text-1);
  background: var(--surface-glass-card);
  border-left: 3px solid var(--accent);
  border-top: 1px solid var(--border);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
  border-radius: 0 6px 6px 0;
}

.cs-challenges-list li strong {
  color: var(--text-0);
}

.cs-tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cs-tech-pill {
  font-size: 10.5px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  color: var(--text-0);
  padding: 5px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.cs-actions-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.cs-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #000;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cs-btn-primary:hover {
  background: #fff;
  box-shadow: 0 0 16px var(--accent-glow);
}

.cs-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-2);
  color: var(--text-1);
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 10px 20px;
  border-radius: 4px;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s ease;
}

.cs-btn-secondary:hover {
  border-color: var(--accent);
  color: var(--text-0);
}

@media (max-width: 768px) {
  .ws-tip {
    display: none !important;
  }
}
</style>
