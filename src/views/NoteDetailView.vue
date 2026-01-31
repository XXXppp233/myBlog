<script setup>
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import { useNotes } from '../composables/useNotes'

const route = useRoute()
const { getNoteById, fetchNoteContent, isLoading } = useNotes() // using getNoteById which now expects slug

const noteSlug = route.params.slug
// Handle array slug
const slugStr = Array.isArray(noteSlug) ? noteSlug.join('/') : noteSlug
const note = computed(() => getNoteById(slugStr))

watch(note, async (newNote) => {
  if (newNote && !newNote.content) {
    await fetchNoteContent(newNote)
  }
}, { immediate: true })
</script>

<template>
  <div class="note-detail-container" v-if="note">
    <div class="detail-header">
      <router-link to="/notes" class="back-link">← Back to Notes</router-link>
      <div class="meta-top">
        <span class="category-pill">{{ note.category }}</span>
      </div>
      <h1 class="note-title">{{ note.title }}</h1>
      <div class="meta-info">Last edited on {{ note.date }}</div>
    </div>

    <div class="paper-surface">
      <div v-if="isLoading && !note.content" class="loading-indicator">Loading content...</div>
      <MarkdownRenderer v-else :content="note.content" />
    </div>
  </div>
  <div v-else class="not-found">
    <h2>Note not found</h2>
    <router-link to="/notes">Return to list</router-link>
  </div>
</template>

<style scoped>
.category-pill {
  font-size: 12px;
  background: #eff6fc;
  color: #0078d4;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
  margin-bottom: 8px;
  display: inline-block;
}

.not-found {
  padding: 50px;
  text-align: center;
}

.note-detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px;
}

.detail-header {
  margin-bottom: 32px;
}

.back-link {
  color: #0078d4;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  display: inline-block;
}

.back-link:hover {
  text-decoration: underline;
}

.note-title {
  font-size: 32px;
  font-weight: 600;
  color: #201f1e;
  margin-bottom: 8px;
}

.meta-info {
  color: #605e5c;
  font-size: 12px;
}

.paper-surface {
  background: white;
  padding: 48px;
  min-height: 500px;
  box-shadow:
    0 0.3px 0.9px rgba(0, 0, 0, 0.11),
    0 1.6px 3.6px rgba(0, 0, 0, 0.13);
  border-radius: 2px;
}
</style>
