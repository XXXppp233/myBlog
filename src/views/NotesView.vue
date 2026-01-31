<script setup>
import { ref, computed } from 'vue'
import { useNotes } from '../composables/useNotes'
import LeftIndex from '../components/LeftIndex.vue'

const { categories, getNotesByCategory } = useNotes()
// Debug logging
console.log('useNotes initialized', { categories, getNotesByCategory })
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
            All Documents
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
          <!-- Header removed for Card Layout -->
          
          <div class="list-body">
            <router-link
              v-for="note in displayedNotes"
              :key="note.id"
              :to="`/notes/${note.id}`"
              class="list-row"
            >
              <div class="row-main">
                <div class="col-title"><span class="file-icon">📄</span> {{ note.title }}</div>
              </div>
              
              <div class="row-meta">
                <div class="meta-cat" v-if="!selectedCategory">
                  {{ note.category }}
                </div>
                <div class="meta-date">{{ note.date }}</div>
              </div>
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
  /* Font handled by Global/App.vue - Segoe UI removed */
  color: #242424;
}

.docs-grid {
  display: grid;
  grid-template-columns: 275px 1fr;
  max-width: 1400px;
  margin: 0;
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
  background: transparent;
  border: none;
}

.list-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 0; /* Add vertical padding to the list container */
}

.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px; /* Move padding to horizontal only */
  height: 96px;    /* Fixed height */
  margin: 0 24px;  /* Margin to separate from divider */
  background: white;
  border: 1px solid #ebebeb;
  border-radius: 8px; /* Large rounded corners */
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
}

.list-row:hover {
  border-color: #0051C3;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transform: translateY(-1px);
}

.col-title {
  font-size: 18px;
  font-weight: 600;
  color: #36393a;
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 20px;
}

.row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 120px;
}

.meta-cat {
  font-size: 12px;
  color: #0051C3;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f2f7fc;
  padding: 4px 8px;
  border-radius: 4px;
}

.meta-date {
  font-size: 14px;
  color: #767676;
}

.empty-state {
  padding: 32px;
  text-align: center;
  color: #605e5c;
}
</style>
