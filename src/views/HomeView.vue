<script setup>
import IpInfoCard from '../components/IpInfoCard.vue'
import CloudflareVerification from '../components/CloudflareVerification.vue'
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <div class="hero-content">
        <h1>Building a Better Blog</h1>
        <p class="subtitle">Secure, fast, and reliable knowledge sharing.</p>
        <div class="cta-group">
          <router-link to="/notes" class="btn btn-primary">Start Reading</router-link>
          <router-link to="/notes/cloudflare/deploy-pages" class="btn btn-secondary">Documentation</router-link>
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="feature-card ip-card-container">
        <h3>Your IP Info</h3>
        <IpInfoCard />
      </div>
      <div class="feature-card">
        <h3>Quick Start</h3>
        <p>Get up and running in seconds with our optimized templates and guides.</p>
        <div class="quick-links">
          <router-link to="/notes" class="link-arrow">Browse Notes &rarr;</router-link>
        </div>
      </div>
      <div class="feature-card">
        <h3>Verification</h3>
        <p>Cloudflare believes you are human. Access granted with zero friction.</p>
        <div class="verification-wrapper">
          <CloudflareVerification />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 0;
}

h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.subtitle {
  font-size: 20px;
  color: #595959;
  margin-bottom: 32px;
}

.cta-group {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  padding: 10px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #F38020;
  color: white;
}

.btn-primary:hover {
  background-color: #d96d15;
}

.btn-secondary {
  background-color: white;
  color: #F38020;
  border: 1px solid #F38020;
}

.btn-secondary:hover {
  background-color: #FFF0E0;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 60px;
}

.feature-card {
  padding: 24px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: #F38020;
}

h3 {
  margin-top: 0;
  color: #333;
}

.verification-wrapper {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.quick-links {
  margin-top: auto;
  padding-top: 16px;
}

.link-arrow {
  color: #F38020;
  text-decoration: none;
  font-weight: 600;
}

.link-arrow:hover {
  text-decoration: underline;
}

/* Adjust IP Card styles within the grid */
:deep(.ms-card) {
  box-shadow: none !important;
  padding: 0 !important;
}
:deep(.card-header h3) {
  display: none; /* Hide internal title as we have outer title */
}
</style>
