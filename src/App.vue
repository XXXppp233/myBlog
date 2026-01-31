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
  background-color: #fcfcfc;
  color: #333;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
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
