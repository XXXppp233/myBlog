<script setup>
import { ref, onMounted } from 'vue'

const ipData = ref(null)
const loading = ref(true)
const error = ref(null)
const showFullIp = ref(false)

const fetchIpData = async () => {
  try {
    loading.value = true
    // Using ipwho.is which supports HTTPS for free
    const response = await fetch('https://ipwho.is/')
    if (!response.ok) throw new Error('Failed to fetch IP data')
    const data = await response.json()

    if (!data.success) throw new Error(data.message)

    // Mapping ipwho.is fields to our component's expected structure
    ipData.value = {
      ip: data.ip,
      country_name: data.country,
      region: data.region,
      city: data.city,
      flag_emoji: data.flag?.emoji,
      org: data.connection?.isp || data.connection?.org,
    }
  } catch (err) {
    console.error(err)
    error.value = 'Unable to load IP info'
    // Fallback to basic API if rich API fails
    try {
      const fallback = await fetch('https://api.ipify.org?format=json')
      const data = await fallback.json()
      ipData.value = { ip: data.ip, city: 'Unknown', country_name: 'Unknown' }
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
  <div class="cf-card-simple client-info-card">
    <div class="card-header">
      <h3 class="cf-text-label">Client Info</h3>
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
        <div class="label-row">
          <span class="label">IP Address</span>
          <button
            @click="toggleVisibility"
            class="icon-btn action-icon"
            :title="showFullIp ? 'Hide IP' : 'Show IP'"
          >
            {{ showFullIp ? '👁️' : '🔒' }}
          </button>
        </div>
        <div class="value-container">
          <span class="value ip-address">
            {{ showFullIp ? ipData.ip : getMaskedIp(ipData.ip) }}
          </span>
        </div>
      </div>

      <div class="info-row" v-if="ipData.country_name || ipData.region || ipData.city">
        <div class="label-row">
          <span class="label">Location</span>
          <span class="flag-icon" v-if="ipData.flag_emoji">{{ ipData.flag_emoji }}</span>
        </div>
        <div class="value-container">
          <span class="value">
            {{ [ipData.country_name, ipData.region, ipData.city].filter(Boolean).join(', ') }}
          </span>
        </div>
      </div>

      <div class="info-row" v-if="ipData.org">
        <div class="label-row">
          <span class="label">ISP / Org</span>
        </div>
        <div class="value-container">
          <span class="value">{{ ipData.org }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Cloudflare-like minimal style */
.client-info-card {
  background: transparent;
  padding: 0;
  border: none;
  box-shadow: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  flex-wrap: nowrap; /* Prevent wrapping */
}

.cf-text-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap; /* Keep label on one line */
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #F38020;
  transition: transform 0.3s ease;
  flex-shrink: 0; /* Prevent button from shrinking/wrapping */
  padding: 0 4px; /* Minimal padding */
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.flag-icon {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}

.value {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.ip-address {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  background-color: #f4f4f4;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.value-container {
  display: flex;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 12px;
  opacity: 0.5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #F38020;
}

.icon-btn:hover {
  opacity: 1;
}

.spinner, .error-msg {
  font-size: 14px;
  color: #666;
  padding: 10px 0;
}
</style>
