<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotes } from '../composables/useNotes'
import LeftIndex from '../components/LeftIndex.vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const { categories, getNotesByCategory, getNoteBySlug, fetchNoteContent, isLoading } = useNotes()
const route = useRoute()
const router = useRouter()

// --- State ---
const expandedCategories = ref(new Set())

const activeNoteSlug = computed(() => {
  if (route.params.slug) {
     return Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  }
  return null
})

const activeCategoryName = computed(() => route.query.category || null)

const viewMode = computed(() => {
  if (activeNoteSlug.value) {
      return 'detail'
  }
  if (activeCategoryName.value) return 'list'
  return 'readme'
})

// --- Data Resolution ---

const displayNote = computed(() => {
    if (viewMode.value === 'detail') {
        return getNoteBySlug(activeNoteSlug.value)
    }
    if (viewMode.value === 'readme') {
        return getNoteBySlug('README')
    }
    return null
})

const sortField = ref('date')
const sortDirection = ref('desc')
const displayedNotes = computed(() => {
  if (viewMode.value !== 'list') return []
  const notes = getNotesByCategory(activeCategoryName.value)
  return [...notes].sort((a, b) => {
    let modifier = sortDirection.value === 'asc' ? 1 : -1
    if (a[sortField.value] < b[sortField.value]) return -1 * modifier
    if (a[sortField.value] > b[sortField.value]) return 1 * modifier
    return 0
  })
})


// --- Side Effects ---

watch(displayNote, async (note) => {
  if (note && !note.content) {
    await fetchNoteContent(note)
  }
  if (note) generateToc(note)
}, { immediate: true })

// Requirements:
// 1. "Selecting note collapses old subfolder" -> Single Accordion Mode
watch(activeNoteSlug, (newSlug) => {
  if (newSlug) {
    const note = getNoteBySlug(newSlug)
    if (note && note.category) {
       // Force open THIS category, close OTHERS
       if (!expandedCategories.value.has(note.category)) {
           expandedCategories.value.clear()
           expandedCategories.value.add(note.category)
       }
    }
  }
}, { immediate: true })

// Refined Toggle Logic (Requirement: "Same time only one group expanded")
const toggleCategory = (cat) => {
    if (expandedCategories.value.has(cat)) {
        // If clicking open category -> close it
        expandedCategories.value.clear()
    } else {
        // If clicking closed category -> close others, open this one
        expandedCategories.value.clear()
        expandedCategories.value.add(cat)
    }
}

const navigateToCategory = (cat) => {
    router.push({ path: '/notes', query: { category: cat } })
}

// --- TOC Logic ---
const toc = ref([])
const activeId = ref('')

const generateToc = (note) => {
  toc.value = []
  if (!note || !note.content) return
  
  const content = (note.content || '').replace(/^---[\s\S]*?---\n/, '')
  const lines = content.split('\n')
  const headers = []
  let foundFirstH1 = false 
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      if (!foundFirstH1) { foundFirstH1 = true; continue; }
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

const handleScroll = () => {
    if (toc.value.length === 0) return
    const scrollPos = window.scrollY + 100
    for (let i = toc.value.length - 1; i >= 0; i--) {
        const id = toc.value[i].id
        const el = document.getElementById(id)
        if (el && scrollPos >= el.offsetTop) {
            activeId.value = id
            return
        }
    }
    if (window.scrollY < 100) activeId.value = ''
}

const scrollToHeader = (id) => {
    const el = document.getElementById(id)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        history.pushState(null, null, `#${id}`)
        activeId.value = id
    }
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const readingTime = computed(() => {
    const content = displayNote.value?.content
    if (!content) return 0
    const words = content.split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
})
</script>

<template>
<div class="notes-page">
    <div class="docs-grid">
        
        <!-- SIDEBAR -->
        <LeftIndex>
            <div class="sidebar-content">
                <!-- ROOT LINK (Introduction) -->
                <!-- Requirement: Remove old bold/bg styles, keep simple -->
                <router-link to="/notes/README" 
                             class="sidebar-link root-link" 
                             :class="{ 'router-link-active': viewMode === 'readme' || (activeNoteSlug === 'README') }">
                    Introduction
                </router-link>
                
                <!-- CATEGORY GROUPS -->
                <div v-for="cat in categories" :key="cat" class="sidebar-group">
                    <!-- Requirement: Increase height, Split Click Areas (80% / 20%) -->
                    <div class="group-header">
                        
                        <!-- Left 80%: Text -> Navigates -->
                        <div class="header-main" 
                             :class="{ 'active-text': activeCategoryName === cat }"
                             @click="navigateToCategory(cat)">
                            {{ cat }}
                        </div>
                        
                        <!-- Right 20%: Arrow -> Toggles Accordion -->
                        <div class="header-toggle" @click.stop="toggleCategory(cat)">
                             <!-- Requirement: Arrow instead of triangle -->
                             <svg 
                                class="arrow-icon" 
                                :class="{ rotated: expandedCategories.has(cat) }"
                                viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="9 18 15 12 9 6"></polyline>
                             </svg>
                        </div>
                    </div>
                    
                    <!-- SUB ITEMS -->
                    <div class="group-items" :class="{ expanded: expandedCategories.has(cat) }">
                        <router-link 
                            v-for="note in getNotesByCategory(cat)" 
                            :key="note.id"
                            :to="`/notes/${note.slug}`"
                            class="sidebar-link sub-link"
                        >
                            {{ note.title }}
                        </router-link>
                    </div>
                </div>
            </div>
        </LeftIndex>

        <!-- MAIN CONTENT -->
        <main class="content-area">
            
            <!-- A. LIST VIEW -->
            <div v-if="viewMode === 'list'" class="view-list">
                 <h1 class="page-title">{{ activeCategoryName }}</h1>
                 <p class="page-subtitle">Browse all documentation in this section.</p>
                 
                 <div class="card-grid">
                     <div v-for="note in displayedNotes" :key="note.id" 
                          class="doc-card" @click="router.push(`/notes/${note.slug}`)">
                         <div class="card-body">
                             <h3 class="card-title">{{ note.title }}</h3>
                             <div class="card-meta">{{ note.date }}</div>
                         </div>
                         <div class="card-arrow">→</div>
                     </div>
                 </div>
                 <div v-if="displayedNotes.length === 0">No documents found.</div>
            </div>

            <!-- B. DOCUMENT VIEW -->
            <div v-else class="view-doc">
                <article v-if="displayNote" class="markdown-article">
                    <header class="article-header">
                        <h1>{{ displayNote.title }}</h1>
                        <div class="meta-row">
                             <span>{{ displayNote.date }}</span>
                             <span class="sep">•</span>
                             <span>{{ readingTime }} min read</span>
                        </div>
                    </header>
                    
                    <MarkdownRenderer :content="displayNote.content || ''" />
                    
                    <div v-if="!displayNote.content" class="shimmer-loader">
                        Loading content...
                    </div>
                </article>
                <div v-else class="start-state">
                    Loading...
                </div>
            </div>

        </main>
        
        <!-- RIGHT TOC -->
        <aside class="right-sidebar" v-if="toc.length > 0 && viewMode !== 'list'">
            <div class="on-this-page">
                <h3>On this page</h3>
                <ul>
                    <li v-for="item in toc" :key="item.id" :class="`toc-level-${item.level}`">
                        <a :href="`#${item.id}`" 
                           :class="{ active: activeId === item.id }"
                           @click.prevent="scrollToHeader(item.id)">
                            {{ item.text }}
                        </a>
                    </li>
                </ul>
            </div>
        </aside>

    </div>
</div>
</template>

<style scoped>
/* Global Layout */
.notes-page {
    background: #fff;
    min-height: calc(100vh - 64px); /* Subtract header height to prevent generic scroll */
}
.docs-grid {
    display: flex;
    max-width: 1600px;
    align-items: flex-start;
}
.content-area {
    flex: 1;
    min-width: 0;
    padding: 2rem 4rem;
}
.right-sidebar {
    width: 240px;
    flex-shrink: 0;
    position: sticky;
    top: 64px;
    height: calc(100vh - 64px);
    overflow-y: auto;
    padding: 2rem 1.5rem;
    border-left: 1px solid #f1f1f1;
    display: none;
}
@media (min-width: 1200px) {
    .right-sidebar { display: block; }
}

/* Sidebar Specifics */
.sidebar-content {
    padding-top: 1rem;
    padding-bottom: 2rem;
    font-size: 0.95rem; /* Base font size */
}

/* Common Link Style */
.sidebar-link {
    display: block;
    color: #404040;
    text-decoration: none;
    transition: color 0.1s;
}
.sidebar-link:hover {
    color: #0045cb;
}

/* Root Link (Introduction) */
.root-link {
    font-weight: 500;
    padding: 0.5rem 1.5rem;
    /* Requirement: Removed background and border styles */
}
.root-link.router-link-active {
    color: #0045cb;
    /* Requirement: Removed font-weight: 600 */
}

/* Category Group Header */


.group-header {
    display: flex;
    align-items: stretch;
    height: 48px; /* Requirement: Increased Height */
    cursor: default;
    user-select: none;
}

/* Left 80% approx (Flex Grow) */
.header-main {
    flex-grow: 1;
    display: flex;
    align-items: center;
    padding-left: 1.5rem;
    font-weight: 500;
    color: #404040;
    cursor: pointer;
    transition: color 0.1s;
}
.header-main:hover {
    color: #0045cb; /* Requirement check: Left area corresponds to old text click */
}
.header-main.active-text {
    color: #0045cb;
}

/* Right ~20% (Fixed Width) */
.header-toggle {
    width: 48px; /* Square touch target */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #767676;
    transition: background-color 0.1s;
}
.header-toggle:hover {
    color: #333;
}

/* Arrow Animation */
.arrow-icon {
    transition: transform 0.2s ease;
}
/* Requirement: Rotate 90 degrees */
.arrow-icon.rotated {
    transform: rotate(90deg);
}

/* Sub Items */
.group-items {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    margin-left: 1.5rem;
    border-left: 1px solid #e0e0e0;
}
.group-items.expanded {
    max-height: 1000px;
    opacity: 1;
}

.sub-link {
    padding: 0.4rem 0 0.4rem 1rem;
    font-size: 0.9rem;
    color: #666;
    /* Requirement: No bold font */
}
.sub-link.router-link-active {
    color: #0045cb; /* Only color change */
    /* Requirement: Removed background */
}

/* Content Styles */
.page-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #1a1a1a; }
.page-subtitle { font-size: 1.1rem; color: #666; margin-bottom: 2rem; }

/* Card Grid */
.card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.doc-card { border: 1px solid #e5e5e5; border-radius: 8px; padding: 1.5rem; background: white; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
.doc-card:hover { border-color: #0045cb; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-2px); }
.card-title { margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #333; }
.card-meta { font-size: 0.85rem; color: #888; }
.card-arrow { color: #0045cb; opacity: 0; transform: translateX(-10px); transition: all 0.2s; }
.doc-card:hover .card-arrow { opacity: 1; transform: translateX(0); }

/* Article & TOC */
.article-header { margin-bottom: 2.5rem; border-bottom: 1px solid #eee; padding-bottom: 1.5rem; }
.article-header h1 { font-size: 2.5rem; line-height: 1.2; margin-bottom: 1rem; color: #1a1a1a; }
.meta-row { color: #666; font-size: 0.9rem; display: flex; gap: 0.5rem; align-items: center; }
.on-this-page h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; color: #1a1a1a; }
.on-this-page ul { list-style: none; padding: 0; margin: 0; }
.on-this-page li { margin-bottom: 0; }
.on-this-page a { color: #404040; text-decoration: none; font-size: 0.9rem; display: block; padding: 0.35rem 0;  transition: color 0.1s; }
.on-this-page a:hover { color: #0045cb; }
.on-this-page a.active { color: #0045cb; font-weight: 600; }
.toc-level-3 a { padding-left: 1rem; }
</style>
