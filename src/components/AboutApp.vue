<template>
  <div class="about-body">
    <div class="about-left">
      <div class="about-avatar">
        <div class="avatar-ring"></div>
        <div class="avatar-ring-2"></div>
        <div class="avatar-pic">
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
        <div class="avatar-status">● AVAILABLE FOR HIRE</div>
      </div>
      <div class="about-name">
        <span>KRIS</span>
        <span>SHEDRACH</span>
      </div>
      <div class="about-title">your go-to engineer for anything web</div>
      <div class="about-tags">
        <span class="a-tag">Web Design</span>
        <span class="a-tag">Mobile Dev</span>
        <span class="a-tag">Blockchain</span>
      </div>
    </div>

    <div class="about-right">
      <div class="about-section">
        <div class="section-label">// PROFILE</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-key">NAME</span>  <span class="info-val">Kris Shedrach</span></div>
          <div class="info-row"><span class="info-key">ROLE</span>  <span class="info-val">Full-Stack Digital Architect</span></div>
          <div class="info-row"><span class="info-key">FOCUS</span> <span class="info-val">Web · Mobile · Blockchain</span></div>
          <div class="info-row"><span class="info-key">STATUS</span><span class="info-val tag-green">AVAILABLE FOR HIRE</span></div>
          <div class="info-row"><span class="info-key">BASE</span>  <span class="info-val">Lagos, Nigeria 🇳🇬</span></div>
        </div>
      </div>

      <div class="about-section">
        <div class="section-label">// SKILL_MATRIX</div>
        <div class="stack-bars">
          <div v-for="skill in skills" :key="skill.name" class="sbar">
            <span class="sbar-name">{{ skill.name }}</span>
            <div class="bar-track"><div class="bar-fill" :style="{ width: skill.pct + '%' }"></div></div>
            <span class="sbar-pct">{{ skill.pct }}%</span>
          </div>
        </div>
      </div>

      <div class="about-bio">
        I craft digital experiences that merge <em>aesthetic precision</em> with engineering depth.
        From pixel-perfect interfaces and cross-platform apps to battle-tested smart contracts —
        I build things that last and <em>turn heads</em>.
      </div>
    </div>
  </div>
</template>

<script setup>
const skills = [
  { name: 'UI/UX Design',   pct: 97 },
  { name: 'React / Next.js', pct: 95 },
  { name: 'Node.js / APIs',  pct: 93 },
  { name: 'React Native',    pct: 91 },
  { name: 'Solidity / Web3', pct: 90 },
]
</script>
