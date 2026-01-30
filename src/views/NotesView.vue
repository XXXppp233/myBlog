<script setup>
import { ref, computed } from 'vue'
import { useNotes } from '../composables/useNotes'

const { categories, getNotesByCategory } = useNotes()
const selectedCategory = ref(null)

const displayedNotes = computed(() => {
  return getNotesByCategory(selectedCategory.value)
})

const selectCategory = (category) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="notes-container">
    <div class="toolbar">
      <h2 class="page-title">My Notes</h2>
      <div class="filter-bar">
        <button
          class="filter-chip"
          :class="{ active: selectedCategory === null }"
          @click="selectCategory(null)"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-chip"
          :class="{ active: selectedCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="list-surface">
      <div class="list-header">
        <div class="col-title">Name</div>
        <div class="col-cat">Category</div>
        <div class="col-date">Date Modified</div>
        <div class="col-preview">Preview</div>
      </div>

      <div class="list-body">
        <router-link
          v-for="note in displayedNotes"
          :key="note.id"
          :to="`/notes/${note.id}`"
          class="list-row"
        >
          <div class="col-title"><span class="file-icon">📄</span> {{ note.title }}</div>
          <div class="col-cat">
            <span class="category-badge">{{ note.category }}</span>
          </div>
          <div class="col-date">{{ note.date }}</div>
          <div class="col-preview">{{ note.preview }}</div>
        </router-link>

        <div v-if="displayedNotes.length === 0" class="empty-state">No notes found.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notes-container {
  padding: 32px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #201f1e;
}

.filter-bar {
  display: flex;
  gap: 8px;
}

.filter-chip {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 16px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #605e5c;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: #f3f2f1;
  color: #201f1e;
}

.filter-chip.active {
  background: #e1dfdd;
  color: #201f1e;
  font-weight: 600;
}

.list-surface {
  background: white;
  border: 1px solid #edebe9;
  border-radius: 2px;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 3fr;
  padding: 12px 16px;
  border-bottom: 1px solid #edebe9;
  font-weight: 600;
  color: #605e5c;
  font-size: 14px;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 3fr;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f2f1;
  text-decoration: none;
  color: inherit;
  font-size: 14px;
  align-items: center;
  transition: background-color 0.1s;
}

.list-row:hover {
  background-color: #f3f2f1;
}

.col-title {
  font-weight: 600;
  color: #323130;
  display: flex;
  align-items: center;
  gap: 8px;
}

.col-cat {
  color: #605e5c;
}

.category-badge {
  background: #f3f2f1;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  text-transform: uppercase;
}

.col-date {
  color: #605e5c;
}

.col-preview {
  color: #605e5c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: #605e5c;
}
</style>
