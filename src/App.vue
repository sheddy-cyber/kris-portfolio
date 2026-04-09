<template>
  <CustomCursor />

  <!-- ══════════════════════════════════════ BOOT SCREEN (shared) -->
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

  <!-- ══════════════════════════════════════ MOBILE SHELL -->
  <div v-if="desktopVisible && isMobile" class="mobile-shell">

    <!-- Status bar -->
    <div class="mob-status-bar">
      <span class="mob-sb-name">KRIS SHEDRACH</span>
      <span class="mob-sb-right">{{ clock }}</span>
    </div>

    <!-- Page content (swipeable screens) -->
    <div class="mob-pages">

      <!-- ABOUT page -->
      <div v-show="mobilePage === 'about'" class="mob-page">
        <div class="mob-page-scroll">
          <!-- Hero -->
          <div class="mob-hero">
            <div class="mob-avatar-wrap">
              <div class="mob-avatar-ring"></div>
              <div class="mob-avatar-ring-2"></div>
              <div class="mob-avatar-pic">
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="58" fill="#161b22" stroke="#30363d" stroke-width="1"/>
                  <ellipse cx="60" cy="108" rx="36" ry="20" fill="#1a3a5c"/>
                  <path d="M48 88 Q60 96 72 88 L75 108 Q60 112 45 108Z" fill="#0d2137"/>
                  <polygon points="60,90 64,95 60,113 56,95" fill="#58a6ff" opacity="0.9"/>
                  <rect x="53" y="76" width="14" height="16" rx="4" fill="#c8a882"/>
                  <ellipse cx="60" cy="60" rx="26" ry="28" fill="#c8a882"/>
                  <ellipse cx="60" cy="36" rx="26" ry="12" fill="#1a1007"/>
                  <rect x="34" y="36" width="52" height="10" fill="#1a1007" rx="2"/>
                  <ellipse cx="38" cy="46" rx="6" ry="8" fill="#1a1007"/>
                  <ellipse cx="82" cy="46" rx="6" ry="8" fill="#1a1007"/>
                  <ellipse cx="34" cy="60" rx="5" ry="7" fill="#c8a882"/>
                  <ellipse cx="86" cy="60" rx="5" ry="7" fill="#c8a882"/>
                  <ellipse cx="34" cy="60" rx="3" ry="5" fill="#b8967a"/>
                  <ellipse cx="86" cy="60" rx="3" ry="5" fill="#b8967a"/>
                  <ellipse cx="50" cy="58" rx="6" ry="7" fill="#fff"/>
                  <ellipse cx="70" cy="58" rx="6" ry="7" fill="#fff"/>
                  <circle cx="51" cy="59" r="4" fill="#2a1a0a"/>
                  <circle cx="71" cy="59" r="4" fill="#2a1a0a"/>
                  <circle cx="52" cy="57" r="1.5" fill="#fff"/>
                  <circle cx="72" cy="57" r="1.5" fill="#fff"/>
                  <path d="M44 51 Q50 48 56 51" stroke="#1a1007" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <path d="M64 51 Q70 48 76 51" stroke="#1a1007" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <ellipse cx="60" cy="67" rx="3" ry="2" fill="#b8967a"/>
                  <path d="M50 74 Q60 82 70 74" stroke="#8a5a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <rect x="43" y="53" width="15" height="11" rx="5" fill="none" stroke="#58a6ff" stroke-width="1.5" opacity="0.7"/>
                  <rect x="62" y="53" width="15" height="11" rx="5" fill="none" stroke="#58a6ff" stroke-width="1.5" opacity="0.7"/>
                  <line x1="58" y1="58" x2="62" y2="58" stroke="#58a6ff" stroke-width="1.5" opacity="0.7"/>
                  <line x1="43" y1="58" x2="38" y2="57" stroke="#58a6ff" stroke-width="1.5" opacity="0.7"/>
                  <line x1="77" y1="58" x2="82" y2="57" stroke="#58a6ff" stroke-width="1.5" opacity="0.7"/>
                </svg>
              </div>
              <div class="mob-avatar-status">● AVAILABLE FOR HIRE</div>
            </div>
            <div class="mob-hero-name">
              <span>KRIS</span>
              <span>SHEDRACH</span>
            </div>
            <div class="mob-hero-tagline">your go-to engineer for anything web</div>
            <div class="mob-hero-tags">
              <span>Web Design</span>
              <span>Mobile Dev</span>
              <span>Blockchain</span>
            </div>
          </div>

          <!-- Info cards -->
          <div class="mob-section-label">// PROFILE</div>
          <div class="mob-info-cards">
            <div class="mob-info-row"><span class="mik">ROLE</span><span class="miv">Full-Stack Digital Architect</span></div>
            <div class="mob-info-row"><span class="mik">FOCUS</span><span class="miv">Web · Mobile · Blockchain</span></div>
            <div class="mob-info-row"><span class="mik">STATUS</span><span class="miv mob-green">AVAILABLE FOR HIRE</span></div>
            <div class="mob-info-row"><span class="mik">BASE</span><span class="miv">Lagos, Nigeria 🇳🇬</span></div>
          </div>

          <!-- Skills -->
          <div class="mob-section-label">// SKILL_MATRIX</div>
          <div class="mob-skills">
            <div v-for="s in skills" :key="s.name" class="mob-skill-row">
              <div class="mob-skill-top">
                <span class="mob-skill-name">{{ s.name }}</span>
                <span class="mob-skill-pct">{{ s.pct }}%</span>
              </div>
              <div class="mob-skill-track"><div class="mob-skill-fill" :style="{ width: s.pct + '%' }"></div></div>
            </div>
          </div>

          <!-- Bio -->
          <div class="mob-bio">
            I craft digital experiences that merge <em>aesthetic precision</em> with engineering depth.
            From pixel-perfect interfaces and cross-platform apps to battle-tested smart contracts —
            I build things that last and <em>turn heads</em>.
          </div>
        </div>
      </div>

      <!-- SERVICES page -->
      <div v-show="mobilePage === 'services'" class="mob-page">
        <div class="mob-page-scroll">
          <div class="mob-page-title">What I Do</div>
          <div class="mob-svc-list">
            <div v-for="s in services" :key="s.num" class="mob-svc-card">
              <div class="mob-svc-header">
                <span class="mob-svc-num">{{ s.num }}</span>
                <span class="mob-svc-name">{{ s.name }}</span>
              </div>
              <p class="mob-svc-desc">{{ s.desc }}</p>
              <div class="mob-svc-tags">
                <span v-for="t in s.tags" :key="t">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WORKS page -->
      <div v-show="mobilePage === 'works'" class="mob-page">
        <div class="mob-page-scroll">
          <div class="mob-page-title">My Works</div>
          <div class="mob-filter-row">
            <button v-for="f in filters" :key="f.v" class="mob-filter-btn"
              :class="{ active: worksFilter === f.v }" @click="worksFilter = f.v">{{ f.l }}</button>
          </div>
          <div class="mob-works-list">
            <div v-for="p in filteredWorks" :key="p.name" class="mob-work-card">
              <div class="mob-work-thumb">
                <svg :viewBox="p.viewBox" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" v-html="p.svgContent"></svg>
                <div class="mob-work-cat" :class="'cat-' + p.cat">{{ p.cat.toUpperCase() }}</div>
              </div>
              <div class="mob-work-info">
                <div class="mob-work-name">{{ p.name }}</div>
                <div class="mob-work-desc">{{ p.desc }}</div>
                <div class="mob-work-tags">
                  <span v-for="t in p.stack" :key="t">{{ t }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- GAME page -->
      <div v-show="mobilePage === 'game'" class="mob-page mob-game-page">
        <GameApp :active="mobilePage === 'game'" />
      </div>

      <!-- CONTACT page -->
      <div v-show="mobilePage === 'contact'" class="mob-page">
        <div class="mob-page-scroll">
          <div class="mob-page-title">Get In Touch</div>
          <div class="mob-contact-hero">
            <p>Let's build something remarkable.</p>
            <p class="mob-contact-sub">I respond within 24 hours.</p>
          </div>
          <div class="mob-links">
            <a class="mob-link" href="mailto:kris@krisshedrach.dev"><span>◈</span> kris@krisshedrach.dev</a>
            <a class="mob-link" href="https://github.com/krisshedrach" target="_blank"><span>◈</span> github.com/krisshedrach</a>
            <a class="mob-link" href="https://twitter.com/krisshedrach" target="_blank"><span>◈</span> twitter.com/krisshedrach</a>
          </div>
          <div class="mob-form">
            <div class="mob-cf-group"><label>NAME</label><input v-model="contactForm.name" type="text" placeholder="Your name" /></div>
            <div class="mob-cf-group"><label>EMAIL / PHONE</label><input v-model="contactForm.email" type="text" placeholder="your@email.com or +234 800 000 0000" /></div>
            <div class="mob-cf-group">
              <label>SERVICE</label>
              <select v-model="contactForm.service">
                <option value="">SELECT A SERVICE</option>
                <option>Web Design & Development</option>
                <option>Mobile App Development</option>
                <option>Blockchain Development</option>
                <option>Consulting & Code Audits</option>
                <option>Other</option>
              </select>
            </div>
            <div class="mob-cf-group"><label>MESSAGE</label><textarea v-model="contactForm.message" placeholder="Tell me about your project..."></textarea></div>
            <button class="mob-send-btn" :disabled="contactSending" @click="sendContact">
              {{ contactSending ? 'SENDING...' : 'SEND MESSAGE ◈' }}
            </button>
            <div v-if="contactSent" class="mob-sent-msg">✓ Sent! I'll be in touch soon.</div>
          </div>
        </div>
      </div>

    </div><!-- /mob-pages -->

    <!-- Bottom Navigation -->
    <nav class="mob-nav">
      <button v-for="app in appOrder" :key="app.id"
        class="mob-nav-btn" :class="{ active: mobilePage === app.id }"
        @click="mobilePage = app.id">
        <div class="mob-nav-icon" v-html="app.iconSvg"></div>
        <span>{{ app.navLabel }}</span>
      </button>
    </nav>

  </div><!-- /mobile-shell -->

  <!-- ══════════════════════════════════════ DESKTOP SHELL -->
  <div v-if="desktopVisible && !isMobile" class="desktop">
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
          <button class="tb-app-close" @click.stop="closeApp(win.id)">✕</button>
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
          <div v-for="app in appOrder" :key="app.id" class="sm-item"
            @click="openApp(app.id); startMenuOpen = false">
            <span class="sm-icon">◈</span> {{ app.menuLabel }}
          </div>
        </div>
        <div class="sm-footer">KRIS SHEDRACH © 2025</div>
      </div>
    </Transition>

    <!-- Single-click bubble -->
    <Transition name="notif">
      <div v-if="singleClick.msg" class="icon-hint-bubble"
        :style="{ left: singleClick.x + 'px', top: singleClick.y + 'px' }">
        {{ singleClick.msg }}
      </div>
    </Transition>

    <!-- Context Menu -->
    <div v-if="ctxMenu.visible" class="context-menu"
      :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }">
      <div v-for="item in ctxItems" :key="item.label ?? 'sep'">
        <div v-if="item.sep" class="ctx-sep"></div>
        <div v-else class="ctx-item" @click="item.action(); ctxMenu.visible = false">
          <span>◈</span> {{ item.label }}
        </div>
      </div>
    </div>
  </div><!-- /desktop -->

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import OsWindow     from './components/OsWindow.vue'
import AboutApp     from './components/AboutApp.vue'
import ServicesApp  from './components/ServicesApp.vue'
import WorksApp     from './components/WorksApp.vue'
import GameApp      from './components/GameApp.vue'
import ContactApp   from './components/ContactApp.vue'
import CustomCursor from './components/CustomCursor.vue'

// ── MOBILE DETECTION ──────────────────────────────
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

// ── SHARED DATA ───────────────────────────────────
const appOrder = [
  {
    id: 'about', title: 'about.exe', badge: 'PROFILE',
    menuLabel: 'About Me', navLabel: 'About',
    iconLabel: 'about.exe', width: 700, height: 500,
    iconPos: 'left:40px;top:40px',
    iconSvg: `<svg viewBox="0 0 40 40"><circle cx="20" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'services', title: 'services.app', badge: 'SERVICES',
    menuLabel: 'Services', navLabel: 'Services',
    iconLabel: 'services.app', width: 620, height: 480,
    iconPos: 'left:40px;top:140px',
    iconSvg: `<svg viewBox="0 0 40 40"><path d="M20 4l3.5 7 7.5 1-5.5 5.5 1.3 7.5L20 22l-6.8 3 1.3-7.5L9 12l7.5-1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 30l-6 6M30 30l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'works', title: 'works.dir', badge: 'PORTFOLIO',
    menuLabel: 'My Works', navLabel: 'Works',
    iconLabel: 'works.dir', width: 760, height: 540,
    iconPos: 'left:40px;top:240px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="8" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="8" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="23" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="23" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  },
  {
    id: 'game', title: 'game.exe', badge: 'PLAY',
    menuLabel: 'Beat My Score', navLabel: 'Game',
    iconLabel: 'game.exe', width: 620, height: 520,
    iconPos: 'left:40px;top:340px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 21v-3M14 21v3M12 21h2M16 21h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="26" cy="19" r="1.5" fill="currentColor"/><circle cx="30" cy="23" r="1.5" fill="currentColor"/></svg>`,
  },
  {
    id: 'contact', title: 'contact.msg', badge: 'MAILTO',
    menuLabel: 'Contact', navLabel: 'Contact',
    iconLabel: 'contact.msg', width: 640, height: 520,
    iconPos: 'left:40px;top:440px',
    iconSvg: `<svg viewBox="0 0 40 40"><rect x="4" y="10" width="32" height="22" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 14l16 11 16-11" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  },
]

// ── MOBILE STATE ──────────────────────────────────
const mobilePage = ref('about')

const skills = [
  { name: 'UI/UX Design',    pct: 97 },
  { name: 'React / Next.js', pct: 95 },
  { name: 'Node.js / APIs',  pct: 93 },
  { name: 'React Native',    pct: 91 },
  { name: 'Solidity / Web3', pct: 90 },
]

const services = [
  { num: '01', name: 'Web Design & Development', desc: 'Blazing fast, visually striking websites and web apps with modern frameworks and motion design.', tags: ['Next.js', 'GSAP', 'Tailwind', 'Figma'] },
  { num: '02', name: 'Mobile App Development',   desc: 'Cross-platform iOS & Android apps that feel genuinely native. Smooth, performant, and polished.', tags: ['React Native', 'Expo', 'Firebase'] },
  { num: '03', name: 'Blockchain Development',   desc: 'Smart contracts, DeFi protocols, NFT platforms, and Web3 integrations. Audited and gas-optimized.', tags: ['Solidity', 'Hardhat', 'Ethers.js'] },
  { num: '04', name: 'Consulting & Code Audits', desc: 'Architecture reviews, security audits, and strategic tech consulting for startups to enterprises.', tags: ['Audit', 'Strategy', 'Architecture'] },
]

const filters = [
  { l: 'ALL', v: 'all' }, { l: 'WEB', v: 'web' },
  { l: 'MOBILE', v: 'mobile' }, { l: 'BLOCKCHAIN', v: 'blockchain' },
]
const worksFilter = ref('all')

const projects = [
  { cat: 'web',        name: 'NexaBank Dashboard', viewBox: '0 0 280 160', desc: 'Fintech web app with real-time analytics, custom charts, and dark mode.', stack: ['Next.js', 'Tailwind', 'Chart.js'], svgContent: `<rect width="280" height="160" fill="#0a0e14"/><rect x="0" y="0" width="280" height="32" fill="#111620"/><rect x="12" y="10" width="60" height="12" rx="3" fill="#58a6ff" opacity="0.5"/><rect x="12" y="44" width="120" height="80" rx="4" fill="#161b22"/><rect x="12" y="44" width="120" height="10" rx="2" fill="#1e3a5f"/><rect x="18" y="60" width="80" height="5" rx="2" fill="#30363d"/><rect x="18" y="70" width="60" height="5" rx="2" fill="#30363d"/><rect x="18" y="93" width="40" height="14" rx="3" fill="#58a6ff" opacity="0.7"/><rect x="140" y="44" width="128" height="38" rx="4" fill="#161b22"/><rect x="146" y="56" width="80" height="5" rx="2" fill="#30363d"/><rect x="146" y="65" width="60" height="5" rx="2" fill="#30363d"/>` },
  { cat: 'mobile',     name: 'TrackrApp',           viewBox: '0 0 280 160', desc: 'Cross-platform habit tracker with streak system and offline mode.', stack: ['React Native', 'Expo', 'SQLite'], svgContent: `<rect width="280" height="160" fill="#0a0e14"/><rect x="90" y="8" width="100" height="144" rx="12" fill="#161b22" stroke="#30363d" stroke-width="1.5"/><rect x="96" y="20" width="88" height="120" rx="6" fill="#0d1117"/><rect x="96" y="20" width="88" height="24" rx="6" fill="#1a3a5c"/><rect x="103" y="28" width="50" height="6" rx="3" fill="#58a6ff" opacity="0.8"/><rect x="103" y="52" width="36" height="32" rx="4" fill="#161b22"/><rect x="147" y="52" width="36" height="32" rx="4" fill="#161b22"/>` },
  { cat: 'blockchain', name: 'ChainVault DeFi',     viewBox: '0 0 280 160', desc: 'Decentralized yield farming protocol with audited smart contracts.', stack: ['Solidity', 'Hardhat', 'Web3.js'], svgContent: `<rect width="280" height="160" fill="#061010"/><polygon points="140,20 162,32 162,56 140,68 118,56 118,32" fill="none" stroke="#3fb950" stroke-width="2" opacity="0.9"/><polygon points="80,65 96,74 96,92 80,101 64,92 64,74" fill="none" stroke="#3fb950" stroke-width="1.5" opacity="0.6"/><polygon points="200,65 216,74 216,92 200,101 184,92 184,74" fill="none" stroke="#3fb950" stroke-width="1.5" opacity="0.6"/><circle cx="140" cy="44" r="12" fill="#3fb950" opacity="0.15"/><circle cx="140" cy="44" r="6" fill="#3fb950" opacity="0.5"/>` },
  { cat: 'web',        name: 'Luxe Commerce',       viewBox: '0 0 280 160', desc: 'High-end e-commerce storefront with 3D previews and Stripe checkout.', stack: ['Next.js', 'Three.js', 'Stripe'], svgContent: `<rect width="280" height="160" fill="#0a0a06"/><rect x="0" y="0" width="280" height="28" fill="#121208"/><rect x="12" y="8" width="32" height="12" rx="3" fill="#d29922" opacity="0.7"/><rect x="12" y="36" width="80" height="100" rx="4" fill="#161610"/><rect x="98" y="36" width="80" height="100" rx="4" fill="#161610"/><rect x="184" y="36" width="84" height="100" rx="4" fill="#161610"/>` },
  { cat: 'mobile',     name: 'SplitPay',            viewBox: '0 0 280 160', desc: 'P2P payment app for splitting bills with multi-currency support.', stack: ['React Native', 'Firebase', 'Flutterwave'], svgContent: `<rect width="280" height="160" fill="#061208"/><rect x="65" y="8" width="66" height="116" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1.5"/><rect x="149" y="8" width="66" height="116" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1.5"/><rect x="71" y="18" width="54" height="96" rx="5" fill="#0d1117"/><rect x="155" y="18" width="54" height="96" rx="5" fill="#0d1117"/>` },
  { cat: 'blockchain', name: 'MintSpace NFT',       viewBox: '0 0 280 160', desc: 'Full-stack NFT marketplace on Polygon with lazy minting & royalties.', stack: ['Solidity', 'Next.js', 'IPFS'], svgContent: `<rect width="280" height="160" fill="#06080e"/><rect x="0" y="0" width="280" height="24" fill="#0e1320"/><rect x="10" y="6" width="24" height="12" rx="3" fill="#58a6ff" opacity="0.6"/><rect x="10" y="32" width="80" height="112" rx="6" fill="#111620"/><rect x="98" y="32" width="80" height="112" rx="6" fill="#111620"/><rect x="186" y="32" width="84" height="112" rx="6" fill="#111620"/>` },
]

const filteredWorks = computed(() =>
  worksFilter.value === 'all' ? projects : projects.filter(p => p.cat === worksFilter.value)
)

const contactForm = ref({ name: '', email: '', service: '', message: '' })
const contactSending = ref(false)
const contactSent = ref(false)
function sendContact() {
  contactSending.value = true
  setTimeout(() => { contactSending.value = false; contactSent.value = true }, 1200)
}

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
    if (step >= BOOT_STEPS.length) { setTimeout(() => { booting.value = false }, 400); return }
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

// ── DESKTOP WINDOWS ───────────────────────────────
const windows = ref({})
const focusedId = ref(null)
let zCounter = 20
const openWindows = computed(() => Object.values(windows.value))
function getAppDef(id) { return appOrder.find(a => a.id === id) }

function openApp(id) {
  startMenuOpen.value = false
  if (windows.value[id]) {
    if (windows.value[id].minimized) unminimize(id); else focusWindow(id); return
  }
  const app = getAppDef(id)
  const vw = window.innerWidth, vh = window.innerHeight - 48
  const cx = Math.floor(vw / 2 - app.width / 2), cy = Math.floor(vh / 2 - app.height / 2)
  const offX = (Math.random() - 0.5) * 120, offY = (Math.random() - 0.5) * 80
  windows.value[id] = {
    id, title: app.title, badge: app.badge,
    x: Math.max(20, Math.min(cx + offX, vw - app.width - 20)),
    y: Math.max(20, Math.min(cy + offY, vh - app.height - 20)),
    w: Math.min(app.width, vw - 40), h: Math.min(app.height, vh - 40),
    minimized: false, maximized: false, z: ++zCounter,
  }
  focusedId.value = id
}

function focusWindow(id) {
  if (!windows.value[id]) return
  focusedId.value = id; windows.value[id].z = ++zCounter
}
function closeApp(id) {
  const wins = { ...windows.value }; delete wins[id]
  windows.value = wins; if (focusedId.value === id) focusedId.value = null
}
function minimize(id) { windows.value[id].minimized = true; if (focusedId.value === id) focusedId.value = null }
function unminimize(id) { windows.value[id].minimized = false; focusWindow(id) }
function toggleMaximize(id) { windows.value[id].maximized = !windows.value[id].maximized }
function onTaskbarClick(id) {
  const win = windows.value[id]; if (!win) return
  if (win.minimized) unminimize(id)
  else if (focusedId.value === id) minimize(id)
  else focusWindow(id)
}
function onDrag(id, { dx, dy }) {
  const win = windows.value[id]; if (!win || win.maximized) return
  const vw = window.innerWidth, vh = window.innerHeight - 48
  win.x = Math.max(0, Math.min(win.x + dx, vw - win.w - 4))
  win.y = Math.max(0, Math.min(win.y + dy, vh - win.h - 4))
}
function onResize(id, { dw, dh }) {
  const win = windows.value[id]; if (!win) return
  win.w = Math.max(360, win.w + dw); win.h = Math.max(220, win.h + dh)
}

// ── ICON SINGLE-CLICK HINT ────────────────────────
const singleClick = ref({ msg: '', x: 0, y: 0 })
let singleClickTimer = null, suppressNextHint = false

function onIconClick(id, e) {
  if (suppressNextHint) { suppressNextHint = false; return }
  const app = getAppDef(id)
  if (singleClickTimer) clearTimeout(singleClickTimer)
  singleClick.value = { msg: `Double-click to open ${app.menuLabel}`, x: e.clientX + 12, y: e.clientY - 42 }
  singleClickTimer = setTimeout(() => { singleClick.value = { msg: '', x: 0, y: 0 } }, 2200)
}
function onIconDblClick(id) {
  suppressNextHint = true
  if (singleClickTimer) { clearTimeout(singleClickTimer); singleClickTimer = null }
  singleClick.value = { msg: '', x: 0, y: 0 }
  openApp(id)
}

// ── TASKBAR / START MENU ──────────────────────────
const startMenuOpen = ref(false)
function toggleStartMenu() { startMenuOpen.value = !startMenuOpen.value }

// ── CLOCK ─────────────────────────────────────────
const clock = ref('--:--')
function tickClock() {
  const n = new Date()
  clock.value = [n.getHours(), n.getMinutes()].map(v => String(v).padStart(2,'0')).join(':')
}

// ── CPU SIM ───────────────────────────────────────
const cpuVal = ref(8)
function tickCpu() {
  cpuVal.value = Math.min(99, 6 + Object.keys(windows.value).length * 5 + Math.floor(Math.random() * 10))
}

// ── CONTEXT MENU ──────────────────────────────────
const ctxMenu = ref({ visible: false, x: 0, y: 0 })
const ctxItems = [
  { label: 'About Me',       action: () => openApp('about') },
  { label: 'My Works',       action: () => openApp('works') },
  { label: 'Beat My Score',  action: () => openApp('game') },
  { sep: true },
  { label: 'Contact',        action: () => openApp('contact') },
  { sep: true },
  { label: 'Refresh Desktop', action: () => {} },
]

// ── MOUNTED ───────────────────────────────────────
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  runBoot()

  const waitDesktop = setInterval(() => {
    if (desktopVisible.value) {
      clearInterval(waitDesktop)
      nextTick(() => {
        tickClock(); setInterval(tickClock, 1000)
        setInterval(tickCpu, 2000)
      })
    }
  }, 100)

  document.addEventListener('click', () => { startMenuOpen.value = false; ctxMenu.value.visible = false })

  document.addEventListener('contextmenu', e => {
    if (e.target.closest('.os-window') || e.target.closest('.taskbar') || isMobile.value) return
    e.preventDefault()
    ctxMenu.value = {
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 190),
      y: Math.min(e.clientY, window.innerHeight - 200),
    }
  })

  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 'a') { e.preventDefault(); openApp('about') }
    if (e.altKey && e.key === 'w') { e.preventDefault(); openApp('works') }
    if (e.altKey && e.key === 'g') { e.preventDefault(); openApp('game') }
    if (e.key === 'Escape') startMenuOpen.value = false
  })
})

onUnmounted(() => { window.removeEventListener('resize', checkMobile) })
</script>
