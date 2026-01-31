<script setup>
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const html = computed(() => {
  return marked(props.content || '')
})
</script>

<template>
  <div class="markdown-body" v-html="html"></div>
</template>

<style>
.markdown-body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
}

.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 { font-size: 2em; padding-bottom: 0.3em; border-bottom: 1px solid #eaecef; }
.markdown-body h2 { font-size: 1.5em; padding-bottom: 0.3em; border-bottom: 1px solid #eaecef; }

.markdown-body p { margin-top: 0; margin-bottom: 16px; }

.markdown-body a { color: #F38020; text-decoration: none; }
.markdown-body a:hover { text-decoration: underline; }

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

.markdown-body pre code {
  padding: 0;
  background-color: transparent;
}
</style>
