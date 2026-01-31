<script setup>
import { ref, onMounted } from 'vue'
import IpInfoCard from '../components/IpInfoCard.vue'
import CloudflareVerification from '../components/CloudflareVerification.vue'
</script>

<template>
  <div class="home-container">
    <div class="content-wrapper">
      <section class="hero-section">
        <div class="hero-icon-wrapper">
          <svg viewBox="0 0 48 48" height="64" width="64" class="product-icon"><path d="M33.6,18.9c-1.3-4.1-5-7.1-9.5-7.1c-4.4,0-8.2,3-9.5,7.1c-1.6,0.3-3,1.3-3.7,2.8c-2,0.4-3.5,2.1-3.5,4.2c0,2.4,1.8,4.3,4.2,4.3h24.8c2.4,0,4.2-1.9,4.2-4.3c0-2-1.5-3.8-3.5-4.2C36.6,20.2,35.2,19.2,33.6,18.9z" fill="#F38020"></path></svg>
        </div>
        <h1 class="product-title">XXXppp233's blog in Cloudflare Style</h1>
        <p class="product-description">
          Connect, protect, and build everywhere
        </p>
        <div class="hero-actions">
          <router-link to="/notes" class="btn btn-primary">Start reading</router-link>
          <a href="https://github.com/XXXppp233/myBlog" target="_blank" class="btn btn-secondary">View on GitHub</a>
        </div>
      </section>
      
      <section class="grid-section">
        <h2 class="section-title">Features</h2>
        <div class="card-grid">
          <!-- IP Info Card - Custom Interactive Component -->
          <div class="doc-card interactive-card">
            <h3 class="card-title">Client Identification</h3>
            <p class="card-desc">Identify and verify client connection details securely.</p>
            <div class="card-slot">
              <IpInfoCard />
            </div>
          </div>

          <!-- Quick Start Card -->
          <router-link to="/notes" class="doc-card link-card">
            <h3 class="card-title">Docs & Notes</h3>
            <p class="card-desc">Browse through categorized markdown notes and technical documentation.</p>
            <span class="card-link-text">Browse notes &rarr;</span>
          </router-link>

          <!-- Verification Card -->
          <div class="doc-card interactive-card">
            <h3 class="card-title">Security Check</h3>
            <p class="card-desc">Turnstile-inspired verification challenge.</p>
            <div class="card-slot center-slot">
              <CloudflareVerification />
            </div>
          </div>

           <!-- Deploy Guide -->
           <router-link to="/notes/cloudflare/deploy/deploy-pages" class="doc-card link-card">
            <h3 class="card-title">Deployment Guide</h3>
            <p class="card-desc">Learn how to deploy this blog to Cloudflare Pages.</p>
            <span class="card-link-text">Read guide &rarr;</span>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #fff;
}

.content-wrapper {
  max-width: 1024px;
  margin: 0 auto;
  padding: 64px 24px;
}

/* Hero Section */
.hero-section {
  margin-bottom: 64px;
}

.hero-icon-wrapper {
  margin-bottom: 24px;
}

.product-title {
  font-size: 48px;
  line-height: 1.1;
  font-weight: 700;
  color: #000000;
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
}

.product-description {
  font-size: 20px;
  line-height: 1.5;
  color: #36393a;
  margin: 0 0 32px 0;
  max-width: 700px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s, border-color 0.2s;
  height: 40px;
}

.btn-primary {
  background-color: #0051C3; /* Cloudflare Docs Blue */
  color: white;
  border: 1px solid transparent;
}

.btn-primary:hover {
  background-color: #003681;
}

.btn-secondary {
  background-color: white;
  color: #0051C3;
  border: 1px solid #0051C3;
}

.btn-secondary:hover {
  background-color: #f2f8ff;
}

/* Grid Section */
.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin: 0 0 24px 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); /* Wider cards */
  gap: 24px;
}

.doc-card {
  border: 1px solid #d9d9d9;
  border-radius: 4px; /* Slightly sharper corners */
  padding: 24px;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.doc-card:hover {
  border-color: #b3b3b3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08); /* Generic shadow */
}

.link-card {
  text-decoration: none;
  cursor: pointer;
}

.link-card:hover {
  border-color: #0051C3; /* Hover blue border */
}

.link-card:hover .card-link-text {
  text-decoration: underline;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #36393a;
  margin: 0 0 8px 0;
}

.link-card .card-title {
  color: #0051C3; /* Blue titles for links */
}

.card-desc {
  font-size: 14px;
  color: #595959;
  line-height: 1.5;
  margin: 0 0 16px 0;
  flex-grow: 1;
}

.card-link-text {
  font-size: 14px;
  color: #0051C3;
  font-weight: 600;
  margin-top: auto;
}

.card-slot {
  margin-top: 16px;
  padding: 8px 0;
  border-radius: 4px;
}

.center-slot {
  display: flex;
  justify-content: center;
}
</style>
