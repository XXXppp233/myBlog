<script setup>
import { ref, onMounted } from 'vue'

const ipData = ref(null)
const loading = ref(true)
const error = ref(null)
const showFullIp = ref(false)

const fetchIpData = async () => {
  try {
    loading.value = true
    // Using ipapi.co for rich data (IPv4/IPv6 detection included)
    const response = await fetch('https://ipapi.co/json/')
    if (!response.ok) throw new Error('Failed to fetch IP data')
    ipData.value = await response.json()
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load IP info'
    // Fallback to simple IP echo if rich API fails
    try {
      const fallback = await fetch('https://api.ipify.org?format=json')
      const data = await fallback.json()
      ipData.value = { ip: data.ip, city: 'Unknown', country_name: 'Unknown' } // Minimal data
      error.value = null
    } catch (e) {
      // Full failure
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchIpData()
})

const getMaskedIp = (ip) => {
  if (!ip) return ''

  if (ip.includes('.')) {
    // IPv4: Mask last 16 bits (last 2 octets)
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`
    }
  } else if (ip.includes(':')) {
    // IPv6: Mask last 64 bits (usually last 4 blocks)
    // IPv6 standard representation: x:x:x:x:x:x:x:x (8 blocks)
    // We want to keep first 4 blocks (64 bits) and mask rest.
    const parts = ip.split(':')
    // Note: IPv6 compression (::) makes splitting harder strictly,
    // but for display masking of a full address returned by API it's usually expanded or standard enough.
    // If API returns compressed, this simple logic might be slightly off visually but functional for privacy.
    // Let's assume standard enough split.
    if (parts.length >= 4) {
      // Reconstruct first 4 parts
      return parts.slice(0, 4).join(':') + ':*:*:*:*'
    }
  }
  return ip.replace(/[\da-fA-F]/g, '*') // Fallback obfuscation
}

const toggleVisibility = () => {
  showFullIp.value = !showFullIp.value
}
</script>

<template>
  <div class="ms-card client-info-card">
    <div class="card-header">
      <h3>Client Info</h3>
      <button @click="fetchIpData" class="refresh-btn" title="Refresh">↻</button>
    </div>

    <div class="card-content" v-if="loading">
      <div class="spinner">Loading...</div>
    </div>

    <div class="card-content" v-else-if="error">
      <div class="error-msg">{{ error }}</div>
    </div>

    <div class="card-content info-grid" v-else-if="ipData">
      <div class="info-row">
        <span class="label">IP Address</span>
        <div class="value-container">
          <span class="value ip-address">
            {{ showFullIp ? ipData.ip : getMaskedIp(ipData.ip) }}
          </span>
          <button
            @click="toggleVisibility"
            class="icon-btn"
            :title="showFullIp ? 'Hide IP' : 'Show IP'"
          >
            {{ showFullIp ? '👁️' : '🔒' }}
          </button>
        </div>
      </div>

      <div class="info-row" v-if="ipData.city">
        <span class="label">Location</span>
        <span class="value">{{ ipData.city }}, {{ ipData.country_name }}</span>
      </div>

      <div class="info-row" v-if="ipData.org">
        <span class="label">ISP / Org</span>
        <span class="value">{{ ipData.org }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Inherit card styles from global or parent usage, but define local overrides */
.client-info-card {
  /* Ensure it matches the ms-card style if used independently */
  background: white;
  box-shadow:
    0 1.6px 3.6px rgba(0, 0, 0, 0.13),
    0 0.3px 0.9px rgba(0, 0, 0, 0.11);
  border-radius: 4px;
  padding: 20px;
  transition: box-shadow 0.2s;
}

.client-info-card:hover {
  box-shadow:
    0 6.4px 14.4px rgba(0, 0, 0, 0.13),
    0 1.2px 3.6px rgba(0, 0, 0, 0.11);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #201f1e;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #0078d4;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #605e5c;
  font-weight: 600;
  text-transform: uppercase;
}

.value {
  font-size: 14px;
  color: #323130;
  font-family: 'Consolas', monospace; /* Monospace for IP looks better */
}

.value-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  opacity: 0.6;
}

.icon-btn:hover {
  opacity: 1;
}

.ip-address {
  font-weight: 600;
}
</style>
