<template>
  <div class="works-body">
    <div class="works-topbar">
      <div class="works-filter">
        <button
          v-for="f in filters" :key="f.value"
          class="wf-btn" :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
        >{{ f.label }}</button>
      </div>
      <div class="works-count">{{ visibleCount }} PROJECT{{ visibleCount !== 1 ? 'S' : '' }}</div>
    </div>

    <div class="works-grid">
      <div
        v-for="p in filteredProjects" :key="p.name"
        class="work-card"
      >
        <div class="wc-thumb">
          <svg :viewBox="p.viewBox" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" v-html="p.svgContent"></svg>
          <div class="wc-overlay"><span>VIEW PROJECT</span></div>
        </div>
        <div class="wc-info">
          <div class="wc-cat" :class="'cat-' + p.cat">{{ p.cat.toUpperCase() }}</div>
          <div class="wc-name">{{ p.name }}</div>
          <div class="wc-desc">{{ p.desc }}</div>
          <div class="wc-stack"><span v-for="t in p.stack" :key="t">{{ t }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = [
  { label: 'ALL',        value: 'all' },
  { label: 'WEB',        value: 'web' },
  { label: 'MOBILE',     value: 'mobile' },
  { label: 'BLOCKCHAIN', value: 'blockchain' },
]
const activeFilter = ref('all')

const projects = [
  {
    cat: 'web', name: 'NexaBank Dashboard', viewBox: '0 0 280 160',
    desc: 'Full-featured fintech web app with real-time analytics, custom charts, and dark mode.',
    stack: ['Next.js', 'Tailwind', 'Chart.js'],
    svgContent: `<rect width="280" height="160" fill="#0a0e14"/><rect x="0" y="0" width="280" height="32" fill="#111620"/><rect x="12" y="10" width="60" height="12" rx="3" fill="#58a6ff" opacity="0.5"/><rect x="200" y="10" width="68" height="12" rx="6" fill="#58a6ff" opacity="0.25"/><rect x="12" y="44" width="120" height="80" rx="4" fill="#161b22"/><rect x="12" y="44" width="120" height="10" rx="2" fill="#1e3a5f"/><rect x="18" y="60" width="80" height="5" rx="2" fill="#30363d"/><rect x="18" y="70" width="60" height="5" rx="2" fill="#30363d"/><rect x="18" y="80" width="70" height="5" rx="2" fill="#30363d"/><rect x="18" y="93" width="40" height="14" rx="3" fill="#58a6ff" opacity="0.7"/><rect x="140" y="44" width="128" height="38" rx="4" fill="#161b22"/><rect x="140" y="44" width="128" height="8" rx="2" fill="#1a2a1a"/><rect x="146" y="56" width="80" height="5" rx="2" fill="#30363d"/><rect x="146" y="65" width="60" height="5" rx="2" fill="#30363d"/><rect x="140" y="86" width="62" height="38" rx="4" fill="#161b22"/><rect x="207" y="86" width="61" height="38" rx="4" fill="#161b22"/><rect x="144" y="90" width="50" height="5" rx="2" fill="#30363d"/><rect x="144" y="99" width="40" height="5" rx="2" fill="#30363d"/><rect x="211" y="90" width="48" height="5" rx="2" fill="#58a6ff" opacity="0.4"/><rect x="12" y="130" width="256" height="20" rx="3" fill="#111620"/>`,
  },
  {
    cat: 'mobile', name: 'TrackrApp', viewBox: '0 0 280 160',
    desc: 'Cross-platform habit tracker with streak system, push notifications, and offline mode.',
    stack: ['React Native', 'Expo', 'SQLite'],
    svgContent: `<rect width="280" height="160" fill="#0a0e14"/><rect x="90" y="8" width="100" height="144" rx="12" fill="#161b22" stroke="#30363d" stroke-width="1.5"/><rect x="96" y="20" width="88" height="120" rx="6" fill="#0d1117"/><rect x="96" y="20" width="88" height="24" rx="6" fill="#1a3a5c"/><rect x="103" y="28" width="50" height="6" rx="3" fill="#58a6ff" opacity="0.8"/><rect x="103" y="52" width="36" height="32" rx="4" fill="#161b22"/><rect x="147" y="52" width="36" height="32" rx="4" fill="#161b22"/><rect x="103" y="54" width="36" height="14" rx="3" fill="#1e3a5f"/><rect x="147" y="54" width="36" height="14" rx="3" fill="#1e3a5f"/><rect x="107" y="72" width="28" height="4" rx="2" fill="#30363d"/><rect x="151" y="72" width="28" height="4" rx="2" fill="#30363d"/><rect x="107" y="79" width="20" height="4" rx="2" fill="#58a6ff" opacity="0.6"/><rect x="151" y="79" width="20" height="4" rx="2" fill="#58a6ff" opacity="0.6"/><rect x="103" y="92" width="80" height="6" rx="3" fill="#30363d"/><rect x="103" y="102" width="60" height="4" rx="2" fill="#1e2530"/><rect x="103" y="110" width="70" height="4" rx="2" fill="#1e2530"/><circle cx="140" cy="143" r="5" fill="#30363d"/>`,
  },
  {
    cat: 'blockchain', name: 'ChainVault DeFi', viewBox: '0 0 280 160',
    desc: 'Decentralized yield farming protocol with audited smart contracts and 99.9% uptime.',
    stack: ['Solidity', 'Hardhat', 'Web3.js'],
    svgContent: `<rect width="280" height="160" fill="#061010"/><polygon points="140,20 162,32 162,56 140,68 118,56 118,32" fill="none" stroke="#3fb950" stroke-width="2" opacity="0.9"/><polygon points="80,65 96,74 96,92 80,101 64,92 64,74" fill="none" stroke="#3fb950" stroke-width="1.5" opacity="0.6"/><polygon points="200,65 216,74 216,92 200,101 184,92 184,74" fill="none" stroke="#3fb950" stroke-width="1.5" opacity="0.6"/><polygon points="100,108 112,115 112,129 100,136 88,129 88,115" fill="none" stroke="#3fb950" stroke-width="1" opacity="0.4"/><polygon points="180,108 192,115 192,129 180,136 168,129 168,115" fill="none" stroke="#3fb950" stroke-width="1" opacity="0.4"/><line x1="118" y1="50" x2="96" y2="72" stroke="#3fb950" stroke-width="1" opacity="0.4"/><line x1="162" y1="50" x2="184" y2="72" stroke="#3fb950" stroke-width="1" opacity="0.4"/><line x1="80" y1="101" x2="96" y2="110" stroke="#3fb950" stroke-width="0.8" opacity="0.3"/><line x1="200" y1="101" x2="185" y2="110" stroke="#3fb950" stroke-width="0.8" opacity="0.3"/><circle cx="140" cy="44" r="12" fill="#3fb950" opacity="0.15"/><circle cx="140" cy="44" r="6" fill="#3fb950" opacity="0.5"/><circle cx="80" cy="83" r="4" fill="#3fb950" opacity="0.3"/><circle cx="200" cy="83" r="4" fill="#3fb950" opacity="0.3"/>`,
  },
  {
    cat: 'web', name: 'Luxe Commerce', viewBox: '0 0 280 160',
    desc: 'High-end e-commerce storefront with 3D product previews, cart animations, and Stripe checkout.',
    stack: ['Next.js', 'Three.js', 'Stripe'],
    svgContent: `<rect width="280" height="160" fill="#0a0a06"/><rect x="0" y="0" width="280" height="28" fill="#121208"/><rect x="12" y="8" width="32" height="12" rx="3" fill="#d29922" opacity="0.7"/><rect x="180" y="8" width="88" height="12" rx="3" fill="#1e1e10"/><rect x="12" y="36" width="80" height="100" rx="4" fill="#161610"/><rect x="98" y="36" width="80" height="100" rx="4" fill="#161610"/><rect x="184" y="36" width="84" height="100" rx="4" fill="#161610"/><rect x="15" y="39" width="74" height="52" rx="3" fill="#1e1e10"/><rect x="101" y="39" width="74" height="52" rx="3" fill="#1e1e10"/><rect x="187" y="39" width="78" height="52" rx="3" fill="#1e1e10"/><rect x="15" y="95" width="40" height="5" rx="2" fill="#d8d0c0" opacity="0.6"/><rect x="101" y="95" width="40" height="5" rx="2" fill="#d8d0c0" opacity="0.6"/><rect x="187" y="95" width="40" height="5" rx="2" fill="#d8d0c0" opacity="0.6"/><rect x="15" y="104" width="28" height="5" rx="2" fill="#d29922" opacity="0.9"/><rect x="101" y="104" width="28" height="5" rx="2" fill="#d29922" opacity="0.9"/><rect x="187" y="104" width="28" height="5" rx="2" fill="#d29922" opacity="0.9"/><rect x="15" y="116" width="60" height="14" rx="3" fill="#d29922" opacity="0.5"/>`,
  },
  {
    cat: 'mobile', name: 'SplitPay', viewBox: '0 0 280 160',
    desc: 'P2P payment app for splitting bills. Supports multiple currencies and real-time settlement.',
    stack: ['React Native', 'Firebase', 'Flutterwave'],
    svgContent: `<rect width="280" height="160" fill="#061208"/><rect x="65" y="8" width="66" height="116" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1.5"/><rect x="149" y="8" width="66" height="116" rx="10" fill="#161b22" stroke="#30363d" stroke-width="1.5"/><rect x="71" y="18" width="54" height="96" rx="5" fill="#0d1117"/><rect x="155" y="18" width="54" height="96" rx="5" fill="#0d1117"/><rect x="71" y="18" width="54" height="18" rx="5" fill="#0a1f10"/><rect x="155" y="18" width="54" height="18" rx="5" fill="#0a1f10"/><rect x="76" y="24" width="36" height="6" rx="3" fill="#3fb950" opacity="0.8"/><rect x="160" y="24" width="36" height="6" rx="3" fill="#3fb950" opacity="0.8"/><circle cx="98" cy="54" r="18" fill="#0d2a14" stroke="#3fb950" stroke-width="1.5" opacity="0.7"/><circle cx="182" cy="54" r="18" fill="#0d2a14" stroke="#3fb950" stroke-width="1.5" opacity="0.7"/><rect x="76" y="80" width="54" height="5" rx="2" fill="#30363d"/><rect x="160" y="80" width="54" height="5" rx="2" fill="#30363d"/><circle cx="98" cy="120" r="4" fill="#30363d"/><circle cx="182" cy="120" r="4" fill="#30363d"/>`,
  },
  {
    cat: 'blockchain', name: 'MintSpace NFT', viewBox: '0 0 280 160',
    desc: 'Full-stack NFT marketplace on Polygon. Lazy minting, royalties, and gas-optimized contracts.',
    stack: ['Solidity', 'Next.js', 'IPFS'],
    svgContent: `<rect width="280" height="160" fill="#06080e"/><rect x="0" y="0" width="280" height="24" fill="#0e1320"/><rect x="10" y="6" width="24" height="12" rx="3" fill="#58a6ff" opacity="0.6"/><rect x="220" y="6" width="48" height="12" rx="5" fill="#58a6ff" opacity="0.4"/><rect x="10" y="32" width="80" height="112" rx="6" fill="#111620"/><rect x="98" y="32" width="80" height="112" rx="6" fill="#111620"/><rect x="186" y="32" width="84" height="112" rx="6" fill="#111620"/><rect x="14" y="35" width="72" height="55" rx="4" fill="#161b22"/><rect x="102" y="35" width="72" height="55" rx="4" fill="#161b22"/><rect x="190" y="35" width="76" height="55" rx="4" fill="#161b22"/><ellipse cx="50" cy="62" rx="20" ry="20" fill="#58a6ff" opacity="0.1"/><ellipse cx="50" cy="62" rx="10" ry="10" fill="#58a6ff" opacity="0.3"/><ellipse cx="138" cy="62" rx="20" ry="20" fill="#58a6ff" opacity="0.1"/><ellipse cx="138" cy="62" rx="10" ry="10" fill="#58a6ff" opacity="0.3"/><ellipse cx="228" cy="62" rx="20" ry="20" fill="#58a6ff" opacity="0.1"/><ellipse cx="228" cy="62" rx="10" ry="10" fill="#58a6ff" opacity="0.3"/><rect x="14" y="96" width="40" height="5" rx="2" fill="#d8d0e8" opacity="0.6"/><rect x="102" y="96" width="40" height="5" rx="2" fill="#d8d0e8" opacity="0.6"/><rect x="190" y="96" width="40" height="5" rx="2" fill="#d8d0e8" opacity="0.6"/><rect x="14" y="106" width="28" height="5" rx="2" fill="#58a6ff" opacity="0.9"/><rect x="102" y="106" width="28" height="5" rx="2" fill="#58a6ff" opacity="0.9"/><rect x="190" y="106" width="28" height="5" rx="2" fill="#58a6ff" opacity="0.9"/>`,
  },
]

const filteredProjects = computed(() =>
  activeFilter.value === 'all' ? projects : projects.filter(p => p.cat === activeFilter.value)
)
const visibleCount = computed(() => filteredProjects.value.length)
</script>
