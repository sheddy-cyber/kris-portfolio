<template>
  <div class="blog-container">
    <!-- TOP CONTROL & SEARCH BAR -->
    <div class="blog-control-bar">
      <!-- Search Input -->
      <div class="blog-search-box">
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="8" cy="8" r="6" />
          <line x1="13" y1="13" x2="18" y2="18" stroke-linecap="round" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter by keyword, topic, or tech tag..."
          class="blog-search-input"
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>

      <!-- Platform Filter Pills -->
      <div class="blog-platform-filters">
        <button
          v-for="p in filterPlatforms"
          :key="p"
          class="bp-pill-btn"
          :class="{ active: activePlatform === p }"
          @click="selectPlatform(p)"
        >
          <span v-if="p !== 'All'" class="bp-pill-icon" v-html="getPlatformIcon(p)"></span>
          {{ p }}
        </button>
      </div>
    </div>

    <!-- SUB-BAR METRICS -->
    <div class="blog-subbar">
      <div class="bs-left">
        <span class="bs-indicator">●</span>
        <span class="bs-count">SHOWING {{ filteredArticles.length }} OF {{ articles.length }} ARTICLES</span>
      </div>
    </div>

    <!-- MAIN SCROLLABLE ARTICLE LIST / GRID -->
    <div class="blog-scroll-body">
      <!-- Empty State -->
      <div v-if="filteredArticles.length === 0" class="blog-empty-state">
        <div class="empty-icon">📂</div>
        <div class="empty-title">NO MATCHING ARTICLES FOUND</div>
        <p class="empty-desc">No publications match your filter criteria "{{ searchQuery }}".</p>
        <button class="reset-filters-btn" @click="resetFilters">RESET SEARCH & FILTERS</button>
      </div>

      <!-- Cards Grid -->
      <div v-else class="articles-grid">
        <article
          v-for="art in filteredArticles"
          :key="art.id"
          class="article-card"
        >
          <!-- Card Header / Platform & Time -->
          <div class="ac-top-meta">
            <span class="platform-badge" :class="'pf-' + art.platform.toLowerCase().replace('.', '')">
              <span class="pf-icon" v-html="getPlatformIcon(art.platform)"></span>
              {{ art.platform }}
            </span>
            <div class="ac-date-wrap">
              <span class="ac-date">{{ art.date }}</span>
              <span class="ac-meta-sep">/</span>
              <span class="ac-readtime">{{ art.readTime }}</span>
            </div>
          </div>

          <!-- Title -->
          <h3 class="ac-title">
            <a
              :href="art.url"
              target="_blank"
              rel="noopener noreferrer"
              class="ac-title-link"
              @click="onExternalClick(art.title)"
            >
              {{ art.title }}
            </a>
          </h3>

          <!-- Excerpt -->
          <p class="ac-summary">
            {{ art.summary }}
          </p>

          <!-- Tags -->
          <div class="ac-tags-wrap">
            <span
              v-for="tag in art.tags"
              :key="tag"
              class="ac-tag-pill"
              @click.stop="filterByTag(tag)"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Card Actions Footer -->
          <div class="ac-actions">
            <a
              :href="art.url"
              target="_blank"
              rel="noopener noreferrer"
              class="ac-btn-link"
              @click="onExternalClick(art.title)"
            >
              <span>READ ON {{ art.platform.toUpperCase() }}</span>
              <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { articles, PLATFORMS } from '../data/articles'
import { soundFx } from '../audio/soundFx'

const emit = defineEmits(['notify'])

const searchQuery = ref('')
const activePlatform = ref('All')

const filterPlatforms = ['All', 'Dev.to', 'Medium', 'Hashnode', 'Substack', 'LinkedIn']

function getPlatformIcon(platformName) {
  return PLATFORMS[platformName]?.icon || `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`
}

const filteredArticles = computed(() => {
  return articles.filter(art => {
    // Platform match
    if (activePlatform.value !== 'All' && art.platform !== activePlatform.value) {
      return false
    }
    // Search query match
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const titleMatch = art.title.toLowerCase().includes(q)
      const summaryMatch = art.summary.toLowerCase().includes(q)
      const tagMatch = art.tags.some(t => t.toLowerCase().includes(q))
      const platformMatch = art.platform.toLowerCase().includes(q)
      if (!titleMatch && !summaryMatch && !tagMatch && !platformMatch) {
        return false
      }
    }
    return true
  })
})

function selectPlatform(p) {
  soundFx.playClick()
  activePlatform.value = p
}

function filterByTag(tag) {
  soundFx.playClick()
  searchQuery.value = tag
}

function resetFilters() {
  soundFx.playClick()
  searchQuery.value = ''
  activePlatform.value = 'All'
}

function onExternalClick(title) {
  soundFx.playClick()
  emit('notify', {
    title: 'External Publication',
    message: `Opening "${title}" on external platform in a new tab.`,
    type: 'info'
  })
}
</script>

<style scoped>
.blog-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: var(--text-0);
  font-family: 'IBM Plex Mono', 'Share Tech Mono', monospace;
  position: relative;
  overflow: hidden;
}

/* ── TOP CONTROL & FILTER BAR ── */
.blog-control-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.blog-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 6px 12px;
  flex: 1;
  min-width: 220px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.blog-search-box:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-glow);
}

.search-icon {
  color: var(--text-2);
  flex-shrink: 0;
}

.blog-search-input {
  background: transparent;
  border: none;
  color: var(--text-0);
  font-family: inherit;
  font-size: 11px;
  outline: none;
  width: 100%;
}

.blog-search-input::placeholder {
  color: var(--text-2);
  opacity: 0.7;
}

.clear-search-btn {
  background: transparent;
  border: none;
  color: var(--text-2);
  cursor: pointer;
  font-size: 11px;
  padding: 0;
  display: flex;
  align-items: center;
}

.clear-search-btn:hover {
  color: var(--text-0);
}

/* ── PLATFORM PILLS ── */
.blog-platform-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;
  max-width: 100%;
}

.bp-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--bg-2);
  color: var(--text-2);
  font-family: inherit;
  font-size: 10px;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.bp-pill-icon {
  display: inline-flex;
  align-items: center;
}

.bp-pill-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.bp-pill-btn.active {
  border-color: var(--accent);
  background: var(--accent-dim);
  color: var(--accent);
  font-weight: 700;
}

/* ── SUB-BAR METRICS ── */
.blog-subbar {
  display: flex;
  align-items: center;
  padding: 6px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 9px;
  color: var(--text-2);
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.bs-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bs-indicator {
  color: var(--green);
  font-size: 8px;
}

/* ── SCROLL BODY ── */
.blog-scroll-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* ── EMPTY STATE ── */
.blog-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
  color: var(--text-2);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.empty-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}

.empty-desc {
  font-size: 11px;
  max-width: 320px;
  margin-bottom: 16px;
}

.reset-filters-btn {
  background: var(--surface-glass);
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 6px 14px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.reset-filters-btn:hover {
  background: var(--accent);
  color: #fff;
}

/* ── ARTICLES GRID ── */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* ── ARTICLE CARD ── */
.article-card {
  display: flex;
  flex-direction: column;
  background: var(--surface-glass-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  position: relative;
}

.article-card:hover {
  border-color: var(--border-bright);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  transform: translateY(-2px);
}

.ac-top-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 10px;
}

.platform-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
}

.pf-icon {
  display: inline-flex;
  align-items: center;
}

/* Platform-specific badge styling */
.pf-devto {
  border-color: rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.1);
}

.pf-medium {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
}

.pf-hashnode {
  border-color: rgba(41, 98, 255, 0.4);
  color: #818cf8;
  background: rgba(41, 98, 255, 0.1);
}

.pf-substack {
  border-color: rgba(249, 115, 22, 0.4);
  color: #fb923c;
  background: rgba(249, 115, 22, 0.1);
}

.pf-linkedin {
  border-color: rgba(2, 132, 199, 0.4);
  color: #38bdf8;
  background: rgba(2, 132, 199, 0.1);
}

.ac-date-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-2);
}

.ac-meta-sep {
  opacity: 0.5;
}

.ac-title {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-0);
  margin: 0 0 10px 0;
}

.ac-title-link {
  color: inherit;
  text-decoration: none;
  display: inline;
  transition: color 0.15s;
}

.ac-title-link:hover {
  color: var(--accent);
}

.ac-summary {
  font-size: 11px;
  line-height: 1.55;
  color: var(--text-1);
  margin: 0 0 14px 0;
  flex: 1;
}

.ac-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ac-tag-pill {
  font-size: 9px;
  color: var(--text-2);
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s;
}

.ac-tag-pill:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.ac-actions {
  display: flex;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.ac-btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 14px;
  border-radius: 4px;
  background: var(--accent);
  border: 1px solid var(--accent);
  color: #ffffff;
  font-family: inherit;
  font-size: 10.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s;
}

.ac-btn-link:hover {
  background: var(--accent-glow);
  box-shadow: 0 0 14px var(--accent-glow);
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .blog-control-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
