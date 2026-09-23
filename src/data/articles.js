/**
 * Technical Articles & Engineering Publications Store
 * 
 * To add a new article:
 * 1. Add an object to the `articles` array below.
 * 2. Specify the title, platform ('Dev.to' | 'Medium' | 'Hashnode' | 'Substack' | 'LinkedIn' | 'Custom'),
 *    url (link to your live post), date, readTime, tags, summary, and optional takeaways.
 */

export const PLATFORMS = {
  'Dev.to': {
    name: 'Dev.to',
    color: '#0a0a0a',
    accent: '#3b82f6',
    icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H5.32v4.36h1.26c.38 0 .66-.08.84-.23.18-.16.27-.42.27-.79v-2.32c0-.37-.09-.63-.27-.79zm-4.42-3.05h4.42c1.07 0 1.9.29 2.5 8.7.6.58.9 1.4.9 2.45v2.36c0 1.05-.3 1.87-.9 2.45-.6.58-1.43.87-2.5.87H3V7zm9.64 0h2.64l1.64 5.92 1.64-5.92h2.64l-2.82 8.7h-2.92l-2.82-8.7zm10.78 0h-4.42v8.7h4.42v-1.74h-2.68v-1.74h2.24v-1.74h-2.24V8.74h2.68V7z"/></svg>`
  },
  'Medium': {
    name: 'Medium',
    color: '#00ab6c',
    accent: '#10b981',
    icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>`
  },
  'Hashnode': {
    name: 'Hashnode',
    color: '#2962ff',
    accent: '#3b82f6',
    icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.351 8.019l-6.37-6.37a5.163 5.163 0 00-7.302 0L2.308 8.02a5.163 5.163 0 000 7.301l6.371 6.37a5.163 5.163 0 007.302 0l6.37-6.37a5.164 5.164 0 000-7.302zm-10.35 6.64a2.658 2.658 0 110-5.317 2.658 2.658 0 010 5.317z"/></svg>`
  },
  'Substack': {
    name: 'Substack',
    color: '#ff6719',
    accent: '#f97316',
    icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>`
  },
  'LinkedIn': {
    name: 'LinkedIn',
    color: '#0077b5',
    accent: '#0284c7',
    icon: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
  }
}

export const articles = [
  {
    id: 'rn-perf-architecture',
    title: 'Architecting Ultra-Responsive React Native Apps: Memory & Render Optimization',
    platform: 'Dev.to',
    url: 'https://dev.to',
    date: 'Aug 2026',
    readTime: '6 min read',
    tags: ['React Native', 'Mobile', 'Performance', 'Zustand'],
    featured: true,
    summary: 'A deep-dive into eliminating unnecessary JS re-renders, managing unmounted component memory leaks, and profiling Hermes engine garbage collection spikes on low-end Android hardware.',
    takeaways: [
      'Isolating heavy state listeners using selective Zustand selectors rather than global Context providers.',
      'Optimizing FlatList with getItemLayout, maxToRenderPerBatch, and FlashList migrations.',
      'Preventing bridge traffic bottlenecks by running gestures directly on the UI thread with React Native Reanimated.'
    ]
  },
  {
    id: 'nextjs-supabase-scaling',
    title: 'Scaling Full-Stack Applications with Next.js 14 and Supabase: Production Lessons',
    platform: 'Medium',
    url: 'https://medium.com',
    date: 'Jul 2026',
    readTime: '8 min read',
    tags: ['Next.js', 'Supabase', 'PostgreSQL', 'Architecture'],
    featured: true,
    summary: 'Practical strategies for caching, Row Level Security (RLS) query optimization, and real-time subscription pooling in high-traffic SaaS and platform architectures.',
    takeaways: [
      'Structuring PostgreSQL indexes specifically to satisfy multi-tenant RLS policy evaluations without full table scans.',
      'Using Next.js Server Components for heavy initial queries while deferring real-time mutations to edge-cached routes.',
      'Managing WebSocket connection lifecycle in browser tabs to prevent socket starvation on Supabase databases.'
    ]
  },
  {
    id: 'postgres-prisma-throughput',
    title: 'Demystifying High-Throughput PostgreSQL Schemas with Prisma ORM',
    platform: 'Hashnode',
    url: 'https://hashnode.com',
    date: 'May 2026',
    readTime: '7 min read',
    tags: ['PostgreSQL', 'Prisma', 'Backend', 'Database'],
    featured: false,
    summary: 'How to avoid common N+1 query pitfalls, tune pgBouncer connection pooling, and design relational schemas that scale seamlessly from day one.',
    takeaways: [
      'Diagnosing Prisma query latency with query metrics logging and EXPLAIN ANALYZE on Postgres.',
      'Configuring transaction timeouts and connection pool parameters under concurrent load spikes.',
      'Strategic foreign key indexing and composite unique constraints for lightning-fast lookups.'
    ]
  },
  {
    id: 'state-machines-frontend',
    title: 'The State Machine Pattern in Modern Frontends: Eliminating Impossible UI States',
    platform: 'Substack',
    url: 'https://substack.com',
    date: 'Apr 2026',
    readTime: '5 min read',
    tags: ['Architecture', 'JavaScript', 'Vue 3', 'State Management'],
    featured: false,
    summary: 'Why boolean soup (`isLoading`, `hasError`, `isSuccess`) leads to buggy user experiences, and how deterministic state transitions create resilient user interfaces.',
    takeaways: [
      'Mapping out finite states before writing UI component markup.',
      'Guaranteeing that mutually exclusive states (e.g. submitting vs. error recovery) can never collide.',
      'Applying declarative finite state patterns to audio players, checkout flows, and window managers.'
    ]
  },
  {
    id: 'offline-first-mobile',
    title: 'Building Resilient Offline-First Mobile Architectures with Local SQLite & Cloud Sync',
    platform: 'Dev.to',
    url: 'https://dev.to',
    date: 'Feb 2026',
    readTime: '9 min read',
    tags: ['React Native', 'SQLite', 'Offline First', 'Sync'],
    featured: true,
    summary: 'A comprehensive guide to building apps that function flawlessly with zero connectivity, queuing mutations reliably, and resolving conflict resolution on reconnect.',
    takeaways: [
      'Implementing optimistic local writes immediately with instant UI feedback.',
      'Architecting an idempotent background sync queue with retry backoff and telemetry.',
      'Handling multi-device conflict resolution strategies (Last-Write-Wins vs. Vector Clocks).'
    ]
  },
  {
    id: 'web3-fullstack-perspective',
    title: 'From Web2 to Decentralized Protocols: A Pragmatic Full-Stack Engineer’s Perspective',
    platform: 'Medium',
    url: 'https://medium.com',
    date: 'Dec 2025',
    readTime: '6 min read',
    tags: ['Web3', 'Blockchain', 'Smart Contracts', 'Ethers.js'],
    featured: false,
    summary: 'Breaking past the hype: analyzing real-world smart contract interactions, gas fee considerations, and how to seamlessly bridge web2 APIs with on-chain data.',
    takeaways: [
      'Bridging RPC provider latency with local optimistic caching.',
      'Writing secure frontend interactions that handle rejected wallet signatures gracefully.',
      'Balancing on-chain immutability with off-chain metadata storage on decentralized networks.'
    ]
  }
]
