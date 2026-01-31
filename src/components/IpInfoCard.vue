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

    // Store country code for other components to use (e.g., Holiday Calendar)
    if (data.country_code) {
      localStorage.setItem('user_country_code', data.country_code)
      window.dispatchEvent(new CustomEvent('country-code-ready', { detail: data.country_code }))
    }

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
  <div class="client-info-display h-full">
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
/* Inherit card styles from global or parent usage, but define local overrides */
.client-info-display {
  /* Ensure it matches the ms-card style if used independently */
  background: transparent;
  padding: 0;
  transition: box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1; /* Allow content to grow but card remains flex */
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label-row {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1;
}

.label {
  font-size: 14px;
  color: #36393a;
  font-weight: 700;
  text-transform: uppercase;
}

.flag-icon {
  font-size: 24px;
  display: inline-flex;
  align-items: center;
}

.value {
  font-size: 18px;
  color: #36393a;
  font-weight: 400;
  font-family: 'Consolas', monospace; /* Monospace for IP looks better */
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
  font-size: 14px;
  opacity: 0.6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0078d4;
}

.icon-btn:hover {
  opacity: 1;
}

.ip-address {
  font-weight: 700;
}
</style>
