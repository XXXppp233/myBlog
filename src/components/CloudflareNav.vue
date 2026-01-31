<template>
  <nav class="cf-nav">
    <div class="cf-nav-top-bar"></div>
    <div class="cf-nav-container">
      <div class="cf-brand">
        <span class="cf-logo-icon">☁️</span>
        ChenMLD233
      </div>
      <div class="cf-links">
        <router-link to="/" class="cf-link" active-class="active">Home</router-link>
        <router-link to="/notes" class="cf-link" active-class="active">Notes</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.cf-nav {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  height: 64px;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.cf-nav-top-bar {
  height: 4px;
  background: linear-gradient(90deg, #F38020 0%, #FAAE40 100%);
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.cf-nav-container {
  max-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cf-brand {
  font-weight: 700;
  font-size: 18px;
  color: #36393a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cf-logo-icon {
  color: #F38020;
  font-size: 20px;
}

.cf-links {
  display: flex;
  gap: 32px;
  flex-grow: 1;
  margin-left: 48px;
}

.cf-link {
  color: #4a4a4a;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
  padding: 8px 0;
  position: relative;
}

.cf-link:hover {
  color: #F38020;
}

.cf-link.active {
  color: #F38020;
}

.cf-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #F38020;
}

.cf-btn {
  background-color: white;
  color: #F38020;
  border: 1px solid #F38020;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cf-btn:hover {
  background-color: #FFF0E0;
}
</style>
