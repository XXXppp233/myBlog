<script setup>
import { computed, ref, onMounted } from 'vue'
import IpInfoCard from '../components/IpInfoCard.vue'
import { useNotes } from '../composables/useNotes'

const { notes } = useNotes()

const latestNotes = computed(() => {
  return [...notes.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
})

const holidays = ref([])
const fetchHolidays = async () => {
  try {
    let countryCode = localStorage.getItem('user_country_code')
    let url = 'https://date.nager.at/api/v3/NextPublicHolidaysWorldwide'
    
    if (countryCode) {
      // Try local holidays for the specific country
      url = `https://date.nager.at/api/v3/NextPublicHolidays/${countryCode}`
    }

    const res = await fetch(url)
    if (!res.ok && countryCode) {
      // Fallback to worldwide if country-specific fails
      const fallbackRes = await fetch('https://date.nager.at/api/v3/NextPublicHolidaysWorldwide')
      const data = await fallbackRes.json()
      holidays.value = data.slice(0, 8)
      return
    }
    
    const data = await res.json()
    holidays.value = data.slice(0, 8)
  } catch (e) {
    holidays.value = [{ name: 'Loading failed', date: '2026-01-01', countryCode: '??' }]
  }
}

onMounted(() => {
  fetchHolidays()
  // Listen for IP Info card to finish so we can get the country code
  window.addEventListener('country-code-ready', (e) => {
    fetchHolidays()
  })
})
</script>

<template>
  <div class="home-container">
    <div class="welcome-banner">
      <h1>Good morning, Sir</h1>
      <p>Cloud, Compute and Artificial intelligence.</p>
    </div>

    <div class="metro-grid">
      <!-- 1: IP Info -->
      <div class="grid-item item-ip">
        <IpInfoCard />
      </div>

      <!-- 2: Quick Access -->
      <div class="grid-item item-quick">
        <div class="ms-card h-full">
          <div class="card-header">
            <h3>Quick Access</h3>
          </div>
          <div class="card-content">
            <ul class="quick-links">
              <li v-for="note in latestNotes" :key="note.id">
                <router-link :to="`/notes/${note.id}`" class="link-item">
                  <span class="icon">📄</span>
                  <div class="link-text">
                    <span class="title">{{ note.title }}</span>
                    <span class="date">{{ note.date }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 3: Github -->
      <div class="grid-item item-github">
        <div class="ms-card h-full github-card">
          <div class="card-header">
            <h3>Project</h3>
          </div>
          <div class="card-content flex-center">
            <a href="https://github.com/XXXppp233/myBlog" target="_blank" class="github-btn">
              <span class="github-icon"></span>
              <span>GitHub Repository</span>
            </a>
            <p class="repo-desc">Open source personal blog template.</p>
            
            <!-- Moved Microsoft Style Badge here -->
            <div class="ms-style-badge mini">
              <span class="microsoft-logo">
                <span class="s1"></span><span class="s2"></span>
                <span class="s3"></span><span class="s4"></span>
              </span>
              Microsoft Style
            </div>
          </div>
        </div>
      </div>

      <!-- 4, 5, 7, 8: Windows Theme Pane (Seasons) -->
      <div class="grid-item item-seasons">
        <div class="seasons-pane">
          <div class="season-tile spring">
            <div class="season-content">
              <span class="season-icon">🌸</span>
              <span class="season-name">Spring</span>
            </div>
          </div>
          <div class="season-tile summer">
            <div class="season-content">
              <span class="season-icon">☀️</span>
              <span class="season-name">Summer</span>
            </div>
          </div>
          <div class="season-tile autumn">
            <div class="season-content">
              <span class="season-icon">🍂</span>
              <span class="season-name">Autumn</span>
            </div>
          </div>
          <div class="season-tile winter">
            <div class="season-content">
              <span class="season-icon">❄️</span>
              <span class="season-name">Winter</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 6, 9: Holiday Calendar -->
      <div class="grid-item item-calendar">
        <div class="ms-card h-full holiday-card">
          <div class="card-header">
            <h3>Global Holidays</h3>
          </div>
          <div class="holiday-list">
            <div v-for="h in holidays" :key="h.name + h.date" class="holiday-item">
              <div class="holiday-date">
                <span class="h-day">{{ h.date.split('-')[2] }}</span>
                <span class="h-month">{{ h.date.split('-')[1] }}</span>
              </div>
              <div class="holiday-info">
                <p class="h-name">{{ h.name }}</p>
                <p class="h-country">{{ h.countryCode }} · Public Holiday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 32px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-banner {
  margin-bottom: 32px;
  padding: 0 40px;
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

/* Metro Grid Implementation: 3 columns, auto rows */
.metro-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: 16px;
  padding: 0 40px;
}

@media (max-width: 1000px) {
  .metro-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
  .item-seasons, .item-calendar {
    grid-row: auto !important;
    grid-column: auto !important;
  }
}

.item-seasons {
  grid-column: 1 / 3; /* 4, 5 region */
  grid-row: 2 / 4;    /* 7, 8 region */
}

.item-calendar {
  grid-column: 3 / 4;
  grid-row: 2 / 4; /* 6, 9 region */
}

/* Base Card Style */
.ms-card {
  background: white;
  border: 1px solid #edebe9;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.2s;
}

.ms-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.h-full { height: 100%; }

.card-header h3 {
  font-size: 13px;
  font-weight: 600;
  color: #605e5c;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid #0078d4;
  line-height: 1;
}

/* Quick Access Styles */
.quick-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f2f1;
  color: #323130;
  text-decoration: none;
}

.link-item:hover { color: #0078d4; }
.link-text { display: flex; flex-direction: column; }
.link-text .title { font-weight: 600; font-size: 14px; }
.link-text .date { font-size: 11px; color: #605e5c; }

/* Github Card */
.github-card {
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
}

.github-btn {
  background: #24292e;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.repo-desc {
  font-size: 12px;
  color: #605e5c;
  text-align: center;
}

/* Season Pane (Microsoft Logo Style) */
.seasons-pane {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 100%;
  gap: 8px;
  position: relative;
}

.season-tile {
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  position: relative;
  overflow: hidden;
}

.season-tile:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1;
  filter: brightness(1.1);
}

.spring { background-color: #f35325; } 
.summer { background-color: #ffb900; } 
.autumn { background-color: #00a4ef; } 
.winter { background-color: #7fba00; } 

.season-content {
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  transform: translateY(20px);
}

.season-tile:hover .season-content {
  opacity: 1;
  transform: translateY(0);
}

.season-icon { font-size: 36px; display: block; margin-bottom: 8px; }
.season-name { font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; }

.ms-style-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #323130;
}

.ms-style-badge.mini {
  margin-top: 20px;
  font-size: 14px;
  opacity: 0.8;
}

.ms-style-badge.mini .microsoft-logo {
  width: 14px;
  height: 14px;
}

.ms-style-badge.mini .microsoft-logo span {
  width: 6px;
  height: 6px;
}

.microsoft-logo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  width: 20px;
  height: 20px;
}

.microsoft-logo span { width: 9px; height: 9px; }
.s1 { background: #f35325; }
.s2 { background: #81bc06; }
.s3 { background: #05a6f0; }
.s4 { background: #ffba08; }

/* Holiday Calendar */
.holiday-card {
  display: flex;
  flex-direction: column;
}

.holiday-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
}

.holiday-list::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.holiday-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f2f1;
}

.holiday-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f2f1;
  padding: 8px;
  border-radius: 4px;
  min-width: 45px;
}

.h-day { font-size: 18px; font-weight: 600; color: #0078d4; }
.h-month { font-size: 10px; color: #605e5c; font-weight: 700; }

.h-name { font-size: 13px; font-weight: 600; margin: 0; color: #323130; }
.h-country { font-size: 11px; margin: 2px 0 0; color: #605e5c; }
</style>
