<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotes } from '../composables/useNotes'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter()
const { getNoteBySlug } = useNotes()

// Determine slug from route params
// Route is likely /notes/:category?/:slug* or just /notes/:slug+
// Let's assume the router passes the full path slug
const note = computed(() => {
  // If we have category and id params
  const slug = route.params.slug
  if (Array.isArray(slug)) return getNoteBySlug(slug.join('/'))
  return getNoteBySlug(slug)
})
</script>

<template>
  <div class="note-detail-container" v-if="note">
    <div class="note-header">
      <router-link to="/notes" class="back-link">← Back to Notes</router-link>
      <h1>{{ note.title }}</h1>
      <div class="meta">
        <span class="category">{{ note.category }}</span>
      </div>
    </div>
    <div class="note-content">
      <MarkdownRenderer :content="note.content" />
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Note not found</h2>
    <router-link to="/notes">Browse all notes</router-link>
  </div>
</template>

<style scoped>
.note-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.back-link {
  color: #F38020;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 24px;
}

.back-link:hover {
  text-decoration: underline;
}

.note-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eaeaea;
}

h1 {
  font-size: 32px;
  margin: 0 0 16px 0;
  color: #1a1a1a;
}

.category {
  background-color: #FFF0E0;
  color: #F38020;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
}

.not-found {
  text-align: center;
  padding: 60px;
}
</style>
