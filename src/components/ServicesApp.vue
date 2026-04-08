<template>
  <div class="services-body">
    <div class="sh-label">// WHAT_I_DO</div>
    <div class="services-grid">
      <div v-for="s in services" :key="s.num" class="svc-card">
        <div class="svc-num">{{ s.num }}</div>
        <div class="svc-icon" v-html="s.icon"></div>
        <div class="svc-name">{{ s.name }}</div>
        <div class="svc-desc">{{ s.desc }}</div>
        <div class="svc-tags">
          <span v-for="t in s.tags" :key="t">{{ t }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const services = [
  {
    num: '01',
    icon: `<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 22l-6 5 6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M32 22l6 5-6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M26 17l-4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    name: 'Web Design & Development',
    desc: 'Blazing fast, visually striking websites and web apps with modern frameworks and motion design.',
    tags: ['Next.js', 'GSAP', 'Tailwind', 'Figma'],
  },
  {
    num: '02',
    icon: `<svg viewBox="0 0 48 48"><rect x="14" y="4" width="20" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="38" r="2" fill="currentColor"/><path d="M19 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    name: 'Mobile App Development',
    desc: 'Cross-platform iOS & Android apps that feel genuinely native. Smooth, performant, and polished.',
    tags: ['React Native', 'Expo', 'Firebase'],
  },
  {
    num: '03',
    icon: `<svg viewBox="0 0 48 48"><path d="M24 6l16 9v18L24 42 8 33V15z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M24 6v36M8 15l16 9 16-9" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    name: 'Blockchain Development',
    desc: 'Smart contracts, DeFi protocols, NFT platforms, and Web3 integrations. Audited and gas-optimized.',
    tags: ['Solidity', 'Hardhat', 'Ethers.js'],
  },
  {
    num: '04',
    icon: `<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="2"/><path d="M24 8v16l10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    name: 'Consulting & Code Audits',
    desc: 'Architecture reviews, security audits, and strategic tech consulting for startups to enterprises.',
    tags: ['Audit', 'Strategy', 'Architecture'],
  },
]
</script>
