<template>
  <div class="cf-turnstile-container">
    <div class="cf-turnstile-box">
      <div class="cf-checkbox-wrapper">
        <div class="cf-spinner" v-if="verifying"></div>
        <div class="cf-success" v-else>✔</div>
      </div>
      <div class="cf-text-content">
        <div class="cf-challenge-text">{{ verifying ? 'Verifying...' : 'Success!' }}</div>
        <div class="cf-brand-text">{{ verifying ? 'This needs a little time.' : 'You are a real human!' }}</div>
      </div>
      <div class="cf-logo">
        <img src="/favicon.ico" class="cf-logo-icon" alt="Logo" />
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
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.cf-turnstile-box {
  width: 100%;
  height: 80px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.cf-checkbox-wrapper {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.cf-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #F38020;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.cf-success {
  color: #00A96E;
  font-size: 32px;
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
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.cf-brand-text {
  font-size: 14px;
  color: #757575;
}

.cf-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.9;
}

.cf-logo-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin-bottom: 2px;
}

.cf-logo-text {
  font-size: 10px;
  font-weight: 700;
  color: #444;
  margin-top: 2px;
}
</style>
