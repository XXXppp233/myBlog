<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useNotes } from '../composables/useNotes'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const route = useRoute()
const { getNoteBySlug, notes } = useNotes()

const note = computed(() => {
  const slug = route.params.slug
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug
  return getNoteBySlug(slugStr)
})

// Sidebar: Related notes in same category
const relatedNotes = computed(() => {
  if (!note.value) return []
  return notes.value.filter(n => n.category === note.value.category)
})

// TOC Generation
const toc = ref([])
const generateToc = () => {
  if (!note.value) return
  // Parse markdown for headers (simple regex approach for this purpose)
  // Remove frontmatter first
  const content = (note.value.content || '').replace(/^---[\s\S]*?---\n/, '')
  const headers = content.match(/^#{2,3}\s+(.*)$/gm) || []
  
  toc.value = headers.map(h => {
    const level = h.match(/^#+/)[0].length
    const text = h.replace(/^#+\s+/, '')
    const id = text.toLowerCase().replace(/[^\w]+/g, '-')
    return { level, text, id }
  })
}

// Watch note to regenerate TOC
watch(note, () => {
  generateToc()
}, { immediate: true })

// Helper to scroll to anchor (since we render MD dynamically)
const scrollToHeader = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    // Update URL hash without reload
    history.pushState(null, null, `#${id}`)
  }
}
</script>

<template>
  <div class="docs-layout" v-if="note">
    <!-- Left Sidebar: Context/Category Nav -->
    <aside class="left-sidebar">
      <div class="sidebar-group">
        <h3 class="sidebar-title">{{ note.category }}</h3>
        <ul class="sidebar-list">
          <li v-for="n in relatedNotes" :key="n.slug">
            <router-link 
              :to="'/notes/' + n.slug" 
              class="sidebar-link"
              active-class="active"
            >
              {{ n.title }}
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-group">
        <router-link to="/notes" class="back-link">
          ← All Categories
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="docs-content">
      <div class="note-header">
        <h1>{{ note.title }}</h1>
        <div class="meta">
          <span class="date" v-if="note.date">{{ new Date(note.date).toLocaleDateString() }}</span>
        </div>
      </div>
      <div class="note-body">
        <MarkdownRenderer :content="note.content" />
      </div>
    </main>

    <!-- Right Sidebar: On this page (TOC) -->
    <aside class="right-sidebar">
      <div class="toc-container">
        <h4 class="toc-title">On this page</h4>
        <ul class="toc-list" v-if="toc.length">
          <li 
            v-for="(item, index) in toc" 
            :key="index"
            :class="['toc-item', `level-${item.level}`]"
          >
            <a href="#" @click.prevent="scrollToHeader(item.id)">{{ item.text }}</a>
          </li>
        </ul>
        <p v-else class="no-toc">No subheadings</p>
      </div>
    </aside>
  </div>
  
  <div v-else class="not-found">
    <h2>Note not found</h2>
    <router-link to="/notes">Browse all notes</router-link>
  </div>
</template>

<style scoped>
/* Layout */
.docs-layout {
  display: flex;
  width: 100%; /* Full width */
  margin: 0;
  padding: 0;
}

.left-sidebar {
  width: 280px; /* Standard sidebar width */
  flex-shrink: 0;
  position: sticky;
  top: 64px; /* Matches Header Height */
  height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 32px 24px;
  border-right: 1px solid #ebebeb;
  background-color: #fff;
}

.right-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  padding-top: 32px;
  padding-right: 24px;
  display: none;
}

.docs-content {
  flex-grow: 1;
  max-width: 860px; /* Content max-width */
  margin: 0 auto; /* Center content in the middle area */
  padding: 40px 48px 64px 48px;
}

@media (min-width: 1024px) {
  .right-sidebar {
    display: block;
  }
}

/* Left Sidebar Styles */
.sidebar-group {
  margin-bottom: 32px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #36393a;
  margin-bottom: 12px;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-link {
  display: block;
  padding: 6px 0;
  font-size: 14px;
  color: #595959;
  text-decoration: none;
  transition: color 0.1s;
  border-left: 2px solid transparent;
  padding-left: 12px;
  margin-left: -14px;
}

.sidebar-link:hover {
  color: #0051C3;
  text-decoration: none;
}

.sidebar-link.active {
  color: #0051C3;
  font-weight: 600;
  border-left-color: #0051C3;
}

.back-link {
  font-size: 13px;
  color: #595959;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

/* Right Sidebar (TOC) Styles */
.toc-title {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  color: #36393a;
  margin: 0 0 12px 0;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-left: 1px solid #ebebeb;
}

.toc-item {
  margin-bottom: 8px;
  position: relative;
}

.toc-item a {
  display: block;
  font-size: 13px;
  color: #595959;
  text-decoration: none;
  padding-left: 16px;
  line-height: 1.4;
}

.toc-item a:hover {
  color: #0051C3;
}

/* Indent levels */
.level-3 {
  padding-left: 12px;
}

.no-toc {
  font-size: 13px;
  color: #999;
}

/* Main Content Styles */
.note-header {
  margin-bottom: 32px;
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 16px;
}

h1 {
  font-size: 36px;
  font-weight: 700;
  color: #36393a;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.meta {
  font-size: 14px;
  color: #767676;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .docs-layout {
    flex-direction: column;
    padding: 0 16px;
  }
  
  .left-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
    border-right: none;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebebeb;
  }
  
  .docs-content {
    padding-top: 24px;
  }
}
</style>
