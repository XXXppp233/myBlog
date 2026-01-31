<script setup>
import { useRoute } from 'vue-router'
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { useNotes } from '../composables/useNotes'

const route = useRoute()
const { getNoteBySlug, fetchNoteContent, isLoading, notes } = useNotes()

const noteSlug = computed(() => route.params.slug)
const slugStr = computed(() => Array.isArray(noteSlug.value) ? noteSlug.value.join('/') : noteSlug.value)
const note = computed(() => getNoteBySlug(slugStr.value))

// Sidebar: Related notes in same category
const relatedNotes = computed(() => {
  if (!note.value) return []
  return notes.value.filter(n => n.category === note.value.category)
})

const activeId = ref('')
const handleScroll = () => {
  const sections = toc.value.map(item => document.getElementById(item.id))
  const scrollPos = window.scrollY + 100

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section && scrollPos >= section.offsetTop) {
      activeId.value = toc.value[i].id
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// TOC Generation
const toc = ref([])
const generateToc = () => {
  if (!note.value || !note.value.content) return
  // Strip frontmatter
  const content = (note.value.content || '').replace(/^---[\s\S]*?---\n/, '')
  // Match headers, but exclude the first H1 if it's there
  const lines = content.split('\n')
  const headers = []
  let foundFirstH1 = false
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (!foundFirstH1) {
        foundFirstH1 = true
        continue
      }
    }
    const match = line.match(/^(#{2,3})\s+(.*)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      headers.push({ level, text, id })
    }
  }
  
  toc.value = headers
}

watch(note, async (newNote) => {
  if (newNote) {
    if (!newNote.content) {
      await fetchNoteContent(newNote)
    }
    generateToc()
  }
}, { immediate: true })

const scrollToHeader = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    history.pushState(null, null, `#${id}`)
  }
}

const readingTime = computed(() => {
  if (!note.value?.content) return 1
  const words = note.value.content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
})
</script>

<template>
  <div class="note-page" v-if="note">
    <!-- Main Docs Grid -->
    <div class="docs-grid">
      
      <!-- Left Navigation -->
      <aside class="left-nav">
        <nav class="nav-tree">
          <router-link to="/notes" class="nav-root">All Notes</router-link>
          <div class="nav-category">
            <div class="category-header">{{ note.category }}</div>
            <ul class="nav-list">
              <li v-for="n in relatedNotes" :key="n.id">
                <router-link 
                  :to="'/notes/' + n.slug" 
                  class="nav-item"
                  active-class="active"
                >
                  {{ n.title }}
                </router-link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <!-- Content Area -->
      <main class="content-area">
        <nav class="breadcrumbs">
          <router-link to="/">Home</router-link>
          <span class="sep">/</span>
          <router-link to="/notes">Notes</router-link>
          <span class="sep">/</span>
          <span class="current">{{ note.category }}</span>
        </nav>

        <article class="doc-body">
          <header class="doc-header">
            <h1 class="doc-title">{{ note.title }}</h1>
            <div class="doc-meta">
              <span class="meta-item">Article</span>
              <span class="dot">•</span>
              <span class="meta-item">{{ note.date }}</span>
              <span class="dot">•</span>
              <span class="meta-item">{{ readingTime }} min to read</span>
            </div>
          </header>

          <div class="doc-content">
            <div v-if="isLoading && !note.content" class="loading-state">
              <div class="spinner"></div>
              <span>Loading article...</span>
            </div>
            <MarkdownRenderer v-else :content="note.content" />
          </div>
        </article>
      </main>

      <!-- Right TOC -->
      <aside class="right-toc">
        <div class="toc-wrapper">
          <h3 class="toc-title">In this article</h3>
          <ul class="toc-list" v-if="toc.length">
            <li v-for="item in toc" :key="item.id" 
                :class="['toc-item', `level-${item.level}`, { active: activeId === item.id }]">
              <a href="#" @click.prevent="scrollToHeader(item.id)">{{ item.text }}</a>
            </li>
          </ul>
        </div>
      </aside>

    </div>
  </div>
  <div v-else-if="!isLoading" class="not-found">
    <h2>Article not found</h2>
    <p>We're sorry, we couldn't find the page you're looking for.</p>
    <router-link to="/notes" class="cf-btn">Browse all documentation</router-link>
  </div>
</template>

<style scoped>
/* Cloudflare Docs Layout */
.note-page {
  background-color: #fff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #000;
}

.docs-grid {
  display: grid;
  grid-template-columns: 280px 1fr 280px;
  width: 100%; /* Full width */
  margin: 0;   /* Stick to edges */
  gap: 0;
}

@media (max-width: 1200px) {
  .docs-grid {
    grid-template-columns: 240px 1fr;
  }
  .right-toc {
    display: none;
  }
}

@media (max-width: 800px) {
  .docs-grid {
    grid-template-columns: 1fr;
  }
  .left-nav {
    display: none;
  }
}

/* Right TOC */
.right-toc {
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  padding: 32px 24px;
}

.toc-wrapper {
  border-left: 1px solid #edebe9;
  padding-left: 16px;
}

.toc-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  color: #242424;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin-bottom: 8px;
  line-height: 1.4;
}

.toc-item.level-3 {
  padding-left: 16px;
}

.toc-item a {
  color: #605e5c;
  text-decoration: none;
  font-size: 14px;
}

.toc-item a:hover {
  color: #0067b8;
  text-decoration: underline;
}

/* Left Nav Styles */
.left-nav {
  border-right: 1px solid #edebe9;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  overflow-y: auto;
  padding: 32px 24px;
}

.nav-root {
  display: block;
  font-weight: 600;
  color: #242424;
  text-decoration: none;
  margin-bottom: 24px;
  font-size: 14px;
}

.category-header {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: #605e5c;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: block;
  padding: 6px 12px;
  font-size: 14px;
  color: #242424;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 2px;
}

.nav-item:hover {
  background-color: #f3f2f1;
}

.nav-item.active {
  background-color: transparent; /* No background box */
  color: #0051C3;
  font-weight: 600;
}

/* Main Content Area */
.content-area {
  padding: 48px 64px 80px 64px;
  max-width: 860px;
  justify-self: center;
  width: 100%;
}

@media (max-width: 1000px) {
  .content-area {
    padding: 32px 24px;
  }
}

.breadcrumbs {
  font-size: 14px;
  color: #595959;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumbs a {
  color: #0051C3;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.sep {
  color: #d9d9d9;
}

/* Article Header */
.doc-header {
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
  padding-bottom: 24px;
}

.doc-title {
  font-size: 44px;
  font-weight: 700;
  color: #000;
  margin: 0 0 16px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #605e5c;
}

.dot {
  font-size: 8px;
}

/* Right TOC Area */
.right-toc {
  padding: 32px 24px;
  position: sticky;
  top: 48px;
  height: calc(100vh - 48px);
}

.toc-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #242424;
  margin-bottom: 16px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 1px solid #edebe9;
}

.toc-item {
  padding: 4px 0;
}

.toc-item a {
  display: block;
  font-size: 13px;
  color: #605e5c;
  text-decoration: none;
  padding-left: 16px;
  border-left: 2px solid transparent;
  margin-left: -1px;
}

.toc-item a:hover {
  color: #0051C3;
}

.toc-item.active a {
  color: #0051C3;
  border-left-color: #0051C3;
  font-weight: 600;
}

.level-3 {
  padding-left: 12px;
}

/* Loading/Error */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #605e5c;
  gap: 16px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #edebe9;
  border-top-color: #0078d4;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cf-btn {
  display: inline-block;
  background-color: #0051C3;
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 20px;
}

.cf-btn:hover {
  background-color: #003681;
}
</style>
