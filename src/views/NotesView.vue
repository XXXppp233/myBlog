<script setup>
import { computed, ref } from 'vue'
import { useNotes } from '../composables/useNotes'

const { notes, categories } = useNotes()
const selectedCategory = ref('All')

const filteredNotes = computed(() => {
  if (selectedCategory.value === 'All') return notes.value
  return notes.value.filter(n => n.category === selectedCategory.value)
})

const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date)
}
</script>

<template>
  <div class="notes-container">
    <aside class="sidebar">
      <div class="sidebar-content">
        <div class="sidebar-header">Categories</div>
        <ul class="nav-list">
          <li 
            :class="{ active: selectedCategory === 'All' }"
            @click="selectedCategory = 'All'"
            class="nav-item"
          >
            All Notes
          </li>
          <li 
            v-for="cat in categories" 
            :key="cat"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
            class="nav-item"
          >
            {{ cat }}
          </li>
        </ul>
      </div>
    </aside>

    <main class="notes-main">
      <div class="notes-list">
        <div v-for="note in filteredNotes" :key="note.path" class="note-card">
          <router-link :to="'/notes/' + note.slug" class="note-link">
            <div class="note-content">
              <h4 class="note-title">{{ note.title }}</h4>
            </div>
            <div class="note-meta-column">
              <div class="meta-top">
                <span v-if="selectedCategory === 'All'" class="category-tag">{{ note.category }}</span>
              </div>
              <div class="meta-bottom">
                <span class="date-text" v-if="note.mtime">{{ formatDate(note.mtime) }}</span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.notes-container {
  display: flex;
  width: 100%;
  min-height: calc(100vh - 64px); /* Subtract header height */
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid #ebebeb;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  overflow-y: auto;
  padding: 32px 0 32px 24px; /* Left padding matching nav logo */
}

.sidebar-header {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #595959;
  margin-bottom: 8px;
  padding-left: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #36393a;
  border-left: 1px solid transparent;
  margin-left: -1px; /* Overlap border */
}

.nav-item:hover {
  color: #0051C3;
}

.nav-item.active {
  color: #0051C3;
  font-weight: 600;
}

.notes-main {
  flex-grow: 1;
  padding: 40px 64px;
  max-width: 960px; /* Constrain width of list itself so cards aren't huge */
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.note-card {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.2s;
  height: 80px; /* Fixed height for consistency */
}

.note-card:hover {
  border-color: #b3b3b3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.note-link {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0 24px;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.note-content {
  display: flex;
  align-items: center;
}

.note-title {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: 600;
}

.note-meta-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  min-width: 120px;
}

.meta-top {
  height: 20px; /* Reserve space */
  display: flex;
  align-items: center;
}

.meta-bottom {
  height: 20px;
  display: flex;
  align-items: center;
}

.category-tag {
  font-size: 12px;
  background-color: #f2f8ff;
  color: #0051C3;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.date-text {
  font-size: 13px;
  color: #595959;
}
</style>
