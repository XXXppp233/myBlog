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
    <div class="sidebar">
      <h3>Categories</h3>
      <ul>
        <li 
          :class="{ active: selectedCategory === 'All' }"
          @click="selectedCategory = 'All'"
        >
          All
        </li>
        <li 
          v-for="cat in categories" 
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </li>
      </ul>
    </div>

    <div class="notes-list">
      <div v-for="note in filteredNotes" :key="note.path" class="note-card">
        <router-link :to="'/notes/' + note.slug" class="note-link">
          <div class="note-header">
            <h4>{{ note.title }}</h4>
            <span class="category-tag">{{ note.category }}</span>
          </div>
          <div class="note-meta">
            <span v-if="note.date">{{ formatDate(note.date) }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notes-container {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 40px;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar h3 {
  font-size: 14px;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 16px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  color: #333;
  margin-bottom: 4px;
}

.sidebar li:hover {
  background-color: #f4f4f4;
}

.sidebar li.active {
  background-color: #FFF0E0;
  color: #F38020;
  font-weight: 600;
}

.notes-list {
  flex-grow: 1;
  display: grid;
  gap: 16px;
}

.note-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.2s;
}

.note-card:hover {
  border-color: #F38020;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.note-link {
  display: block;
  padding: 20px;
  text-decoration: none;
  color: inherit;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

h4 {
  margin: 0;
  font-size: 18px;
  color: #1a1a1a;
}

.category-tag {
  font-size: 12px;
  background-color: #f4f4f4;
  padding: 4px 8px;
  border-radius: 12px;
  color: #666;
}

.note-meta {
  font-size: 14px;
  color: #888;
}
</style>
