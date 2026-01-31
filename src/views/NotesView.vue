<script setup>
import { ref, computed } from 'vue'
import { useNotes } from '../composables/useNotes'
import LeftIndex from '../components/LeftIndex.vue'

const { categories, getNotesByCategory } = useNotes()
const selectedCategory = ref(null)

// Sorting state
const sortField = ref('date')
const sortDirection = ref('desc')

const sortNotes = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = field === 'date' ? 'desc' : 'asc'
  }
}

const displayedNotes = computed(() => {
  const notes = getNotesByCategory(selectedCategory.value)
  return [...notes].sort((a, b) => {
    let modifier = sortDirection.value === 'asc' ? 1 : -1
    // Handle date comparison specially if needed, but string comparison works for ISO dates
    if (a[sortField.value] < b[sortField.value]) return -1 * modifier
    if (a[sortField.value] > b[sortField.value]) return 1 * modifier
    return 0
  })
})

const selectCategory = (category) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="notes-page">
    <div class="docs-grid">
      <!-- Left Sidebar: Categories -->
      <LeftIndex header="Categories">
        <li class="nav-tree-item">
          <button
            class="nav-item"
            :class="{ active: selectedCategory === null }"
            @click="selectCategory(null)"
          >
            All Notes
          </button>
        </li>
        <li v-for="cat in categories" :key="cat" class="nav-tree-item">
          <button
            class="nav-item"
            :class="{ active: selectedCategory === cat }"
            @click="selectCategory(cat)"
          >
            {{ cat }}
          </button>
        </li>
      </LeftIndex>

      <!-- Main Content -->
      <main class="content-area">
        <div class="list-surface">
          <div class="list-header">
            <div
              class="col-title header-cell"
              :class="{ active: sortField === 'title' }"
              @click="sortNotes('title')"
            >
              Name
              <span class="sort-icon" v-if="sortField === 'title'">{{
                sortDirection === 'asc' ? '▲' : '▼'
              }}</span>
            </div>
            <div
              class="col-cat header-cell"
              :class="{ active: sortField === 'category' }"
              @click="sortNotes('category')"
            >
              Category
              <span class="sort-icon" v-if="sortField === 'category'">{{
                sortDirection === 'asc' ? '▲' : '▼'
              }}</span>
            </div>
            <div
              class="col-date header-cell"
              :class="{ active: sortField === 'date' }"
              @click="sortNotes('date')"
            >
              Date Modified
              <span class="sort-icon" v-if="sortField === 'date'">{{
                sortDirection === 'asc' ? '▲' : '▼'
              }}</span>
            </div>
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
            </router-link>

            <div v-if="displayedNotes.length === 0" class="empty-state">No notes found.</div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.notes-page {
  background-color: #fff;
  min-height: 100vh;
  /* Font handled by Global/App.vue */
  color: #242424;
}

.docs-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  max-width: 1400px;
  margin: 0 auto;
  gap: 0;
}

@media (max-width: 900px) {
  .docs-grid {
    grid-template-columns: 1fr;
  }
  .left-nav {
    display: none;
  }
}

.list-surface {
  background: white;
  border: 1px solid #edebe9;
  border-radius: 2px;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 12px 16px;
  border-bottom: 1px solid #edebe9;
  font-weight: 600;
  color: #605e5c;
  font-size: 14px;
}

.header-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}

.header-cell:hover {
  color: #323130;
}

.header-cell .sort-icon {
  font-size: 10px;
  visibility: hidden; /* Default hidden */
}

/* Show icon only when hovering active header */
.header-cell.active:hover .sort-icon {
  visibility: visible;
}

.list-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
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

.empty-state {
  padding: 32px;
  text-align: center;
  color: #605e5c;
}
</style>
