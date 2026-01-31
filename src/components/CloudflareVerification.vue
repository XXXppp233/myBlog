<template>
  <div class="cf-turnstile-container">
    <div class="cf-turnstile-box">
      <div class="cf-checkbox-wrapper">
        <div class="cf-spinner" v-if="verifying"></div>
        <div class="cf-success" v-else>✔</div>
      </div>
      <div class="cf-text-content">
        <div class="cf-challenge-text">Success!</div>
        <div class="cf-brand-text">Challenge passed</div>
      </div>
      <div class="cf-logo">
        <div class="cf-logo-icon">☁️</div>
        <div class="cf-logo-text">Cloudflare</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const verifying = ref(true)

onMounted(() => {
  setTimeout(() => {
    verifying.value = false
  }, 1500)
})
</script>

<style scoped>
.cf-turnstile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.cf-turnstile-box {
  width: 300px;
  height: 65px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  position: relative;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.cf-checkbox-wrapper {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.cf-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #F38020;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.cf-success {
  color: #00A96E;
  font-size: 24px;
  line-height: 1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cf-text-content {
  flex-grow: 1;
}

.cf-challenge-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.cf-brand-text {
  font-size: 12px;
  color: #757575;
}

.cf-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.7;
}

.cf-logo-icon {
  font-size: 18px;
  color: #757575;
  line-height: 1;
}

.cf-logo-text {
  font-size: 9px;
  color: #757575;
  margin-top: 2px;
}
</style>
