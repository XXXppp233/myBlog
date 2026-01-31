<script setup>
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
</script>

<template>
  <nav class="cf-nav">
    <!-- Cloudflare Docs often don't have the top gradient bar, removing it for cleaner look -->
    <div class="cf-nav-container">
      <div class="cf-brand">
        <div class="cf-logo-wrapper" @click="uiStore.toggleSidebar">
          <svg viewBox="0 0 48 24" height="24" width="48" aria-hidden="true"><path d="M30.76 9.886c-1.127-5.02-5.918-8.544-11.025-7.76-4.996.766-8.625 5.09-8.47 10.125a6.43 6.43 0 0 0-6.176 6.357c-.12 3.737 2.822 6.837 6.556 6.906h21.077c5.15.22 9.516-3.79 9.736-8.94.21-4.887-3.525-9.065-8.38-9.378-.445-4.482-4.14-8.03-8.648-8.196-4.63-.166-8.61 3.208-9.2 7.794l-2 15.63H9.256l1.37-10.74c.956-6.49 6.89-10.926 13.38-10 6.634.946 11.336 6.878 10.655 13.444l-.77 6.002H35.5l1.09-8.532c.504-3.95 3.864-6.85 7.842-6.768 4.09.09 7.37 3.46 7.316 7.553-.06 4.38-3.76 7.83-8.16 7.643H22.6c-2.924.085-5.38-2.18-5.592-5.097-.22-2.923 1.933-5.503 4.846-5.815 1.763-.19 3.49.52 4.6 1.884l1.6-2.1c-1.74-2.14-4.52-3.21-7.25-2.8-4.463.7-7.665 4.805-7.26 9.28.406 4.47 4.326 7.74 8.817 7.42h22.25c6.512.28 12.01-4.7 12.29-11.213.29-6.905-5.01-12.825-11.91-13.303-.54-.04-.54 0 0 0z" fill="#F38020"></path></svg>
        </div>
        <span class="cf-divider">|</span>
        <span class="cf-product-name">Docs</span>
      </div>
      <div class="cf-links">
        <router-link to="/" class="cf-link" active-class="active">Home</router-link>
        <router-link to="/notes" class="cf-link" active-class="active">Notes</router-link>
      </div>
      <div class="cf-search">
         <div class="search-fake-input">
           <span class="search-icon">🔍</span>
           <span>Search...</span>
           <span class="search-key">Ctrl+K</span>
         </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.cf-nav {
  background-color: #ffffff;
  border-bottom: 1px solid #ebebeb;
  height: 64px;
  position: sticky; /* Sticky header like docs */
  top: 0;
  z-index: 100;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.cf-nav-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0; /* Remove padding here, move to children to align with full-width layout */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cf-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%; /* Fill height */
}

/* Logo wrapper matches Sidebar width on desktop */
.cf-logo-wrapper {
  display: flex;
  align-items: center;
  padding-left: 24px; /* Match sidebar padding */
  height: 100%;
  cursor: pointer; /* Clickable */
}

@media (min-width: 1024px) {
  .cf-logo-wrapper {
    width: 20vw; /* 20% of viewport width (aligned with sidebar) */
    border-right: 1px solid #ebebeb; /* Match sidebar border likely */
    box-sizing: border-box;
  }
}

.cf-logo-wrapper svg {
  height: 28px;
  width: auto;
}

/* Adjustments since padding was removed from container */
.cf-links, .cf-search {
  padding-right: 24px;
}

.cf-divider {
  color: #c6c6c6;
  font-size: 20px;
  font-weight: 300;
}

.cf-product-name {
  font-size: 16px;
  font-weight: 600;
  color: #36393a;
}

.cf-links {
  display: flex;
  gap: 24px;
  margin-left: 32px;
  flex-grow: 1;
}

.cf-link {
  color: #36393a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.cf-link:hover {
  color: #F38020;
}

.cf-link.active {
  color: #F38020;
}

.cf-search {
  display: none; /* Hidden on small screens */
}

@media (min-width: 768px) {
  .cf-search {
    display: block;
  }
}

.search-fake-input {
  background-color: #f2f2f2;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 6px 12px;
  width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #767676;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.search-fake-input:hover {
  background-color: #e6e6e6;
  border-color: #d6d6d6;
}

.search-icon {
  font-size: 12px;
  opacity: 0.7;
}

.search-key {
  margin-left: auto;
  font-size: 11px;
  border: 1px solid #d6d6d6;
  border-radius: 3px;
  padding: 1px 4px;
  color: #999;
}
</style>
