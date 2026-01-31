<script setup>
import { RouterView } from 'vue-router'
import CloudflareNav from './components/CloudflareNav.vue'
</script>

<template>
  <div class="app-layout">
    <CloudflareNav />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global Resets & Typography */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #fff; /* Docs are usually white bg */
  color: #36393a; /* Cloudflare dark grey */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Scrollbar styling for a tech feel */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex-grow: 1;
}
</style>
