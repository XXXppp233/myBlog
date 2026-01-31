<template>
  <aside class="left-nav">
    <nav class="nav-tree">
      <router-link to="/notes" class="nav-root">All Documents</router-link>
      <div class="nav-category">
        <div class="category-header">{{ header }}</div>
        <ul class="nav-list">
          <slot></slot>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  header: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
/* Sidebar Styles */
.left-nav {
  border-right: 1px solid #edebe9;
  height: calc(100vh - 64px); /* Cloudflare Header 64px */
  position: sticky;
  top: 64px;
  overflow-y: auto;
  padding: 16px 24px;
}

.nav-root {
  display: block;
  font-weight: 700;
  color: #242424;
  text-decoration: none;
  margin-bottom: 24px;
  font-size: 14px;
  padding: 0;
}

.nav-root.router-link-active {
  color: #242424; /* Ensure it stays dark even if active */
}

.nav-root:hover {
   color: #2e69ff;
   text-decoration: underline;
}

.category-header {
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  color: #605e5c;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
  padding-left: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Deep selection for slotted items */
:deep(.nav-item) {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 6px 12px;
  font-size: 14px;
  color: #242424;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
  font-family: inherit;
  text-decoration: none;
}

:deep(.nav-item:hover) {
  background-color: #f3f2f1;
}

:deep(.nav-item.active) {
  background-color: transparent;
  color: #2e69ff; /* Cloudflare Blue */

}
</style>
