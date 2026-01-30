<script setup>
import { RouterView } from 'vue-router'
import MicrosoftNav from './components/MicrosoftNav.vue'
</script>

<template>
  <div class="app-layout">
    <header>
      <MicrosoftNav />
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global Styles */
body {
  margin: 0;
  padding: 0;
  font-family:
    'Segoe UI',
    'Segoe UI Web (West European)',
    'Segoe UI',
    -apple-system,
    BlinkMacSystemFont,
    Roboto,
    'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  background-color: #faf9f8; /* Microsoft Fabric neutral lighter alt */
  color: #323130;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

a {
  text-decoration: none;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
