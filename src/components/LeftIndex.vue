<template>
  <aside class="left-nav">
    <nav class="nav-tree">
      <slot></slot>
    </nav>
  </aside>
</template>

<script setup>
// Pure container component
</script>

<style scoped>
.left-nav {
  /* Fixed sidebar positioning */
  position: sticky;
  top: 64px; /* Matches CloudflareNav height */
  height: calc(100vh - 64px);
  overflow-y: auto;
  border-right: 1px solid #edebe9;
  background-color: #fff;
  padding: 16px 0;
  width: 280px; /* Fixed width */
  flex-shrink: 0;
}

.nav-tree {
  display: flex;
  flex-direction: column;
}

/* Hide scrollbar for the nav but keep functionality */
.left-nav::-webkit-scrollbar {
  display: none;
}
.left-nav {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
