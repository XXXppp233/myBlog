<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

const htmlContent = computed(() => {
  return marked(props.content)
})
</script>

<template>
  <div class="markdown-body" v-html="htmlContent"></div>
</template>

<style>
.markdown-body {
  font-family: 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #323130;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  color: #201f1e;
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
}

.markdown-body h1 {
  font-size: 28px;
}
.markdown-body h2 {
  font-size: 24px;
  border-bottom: 1px solid #edebe9;
  padding-bottom: 8px;
}

.markdown-body p {
  margin-bottom: 16px;
}

.markdown-body code {
  background-color: #f3f2f1;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: Consolas, monospace;
  font-size: 0.9em;
  color: #a4262c;
}

.markdown-body pre {
  background-color: #f3f2f1;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
  color: #323130;
}

.markdown-body blockquote {
  border-left: 4px solid #0078d4;
  margin: 0;
  padding-left: 16px;
  color: #605e5c;
}

.markdown-body a {
  color: inherit;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.2s ease-in-out;
}

.markdown-body a:hover {
  border-bottom-color: #0078d4;
}
</style>
