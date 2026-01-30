<script setup>
import IpInfoCard from '../components/IpInfoCard.vue'
</script>

<template>
  <div class="home-container">
    <div class="welcome-banner">
      <h1>Good morning, Developer</h1>
      <p>Here's what's happening today in your workspace.</p>
    </div>

    <div class="cards-grid">
      <!-- IP Info Card Component -->
      <IpInfoCard />

      <div class="ms-card">
        <div class="card-header">
          <h3>Quick Access</h3>
        </div>
        <div class="card-content">
          <ul class="quick-links">
            <li><span class="icon">📝</span> Recent Note 1</li>
            <li><span class="icon">📅</span> Project Plan</li>
            <li><span class="icon">📧</span> Inbox</li>
          </ul>
        </div>
      </div>

      <div class="ms-card">
        <div class="card-header">
          <h3>About Me</h3>
        </div>
        <div class="card-content">
          <p>
            Full-stack developer passionate about Vue.js, Node.js, and Cloud Architecture. Currently
            building a personal knowledge base.
          </p>
        </div>
      </div>

      <div class="ms-card">
        <div class="card-header">
          <h3>Stats</h3>
        </div>
        <div class="card-content">
          <div class="stat-item">
            <span class="stat-value">12</span>
            <span class="stat-label">Notes</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">5</span>
            <span class="stat-label">Projects</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 32px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-banner {
  margin-bottom: 32px;
  padding: 0 20px;
}

.welcome-banner h1 {
  font-size: 32px;
  font-weight: 600;
  color: #323130;
  margin-bottom: 8px;
}

.welcome-banner p {
  color: #605e5c;
  font-size: 16px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 0 20px;
}

.ms-card {
  background: white;
  box-shadow:
    0 1.6px 3.6px rgba(0, 0, 0, 0.13),
    0 0.3px 0.9px rgba(0, 0, 0, 0.11);
  border-radius: 4px;
  padding: 20px;
  transition: box-shadow 0.2s;
}

.ms-card:hover {
  box-shadow:
    0 6.4px 14.4px rgba(0, 0, 0, 0.13),
    0 1.2px 3.6px rgba(0, 0, 0, 0.11);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #201f1e;
}

.quick-links {
  list-style: none;
  padding: 0;
}

.quick-links li {
  padding: 12px 0;
  border-bottom: 1px solid #edebe9;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #323130;
}

.quick-links li:last-child {
  border-bottom: none;
}

.quick-links li:hover {
  background-color: #f3f2f1; /* subtle hover background */
  padding-left: 8px; /* slight indent on hover */
  transition: all 0.2s;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #edebe9;
}

.stat-value {
  font-weight: bold;
  color: #0078d4;
}
</style>
