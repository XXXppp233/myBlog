<template>
  <nav class="ms-nav">
    <div class="ms-nav-container">
      <div class="ms-brand">XXXppp233</div>
      <div class="ms-links">
        <router-link to="/" class="ms-link">Home</router-link>
        <router-link to="/notes" class="ms-link">Notes</router-link>
      </div>
      <!-- <div class="ms-profile-icon">ME</div> -->
    </div>
  </nav>
</template>

<style scoped>
.ms-nav {
  background-color: #0078d4;
  color: white;
  height: 48px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.ms-nav-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ms-brand {
  font-weight: 600;
  font-size: 16px;
  margin-right: 32px;
  display: flex;
  align-items: center;
}

.ms-links {
  display: flex;
  gap: 20px;
  flex-grow: 1;
}

.ms-link {
  color: white;
  text-decoration: none;
  font-size: 14px;
  padding: 0 8px;
  height: 48px;
  line-height: 48px;
  transition: background-color 0.1s;
}

.ms-link:hover,
.ms-link.router-link-active {
  background-color: #005a9e;
}

/* .ms-profile-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
} */
</style>
