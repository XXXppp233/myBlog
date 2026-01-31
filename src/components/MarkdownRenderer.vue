<script setup>
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// Custom renderer to add IDs to headings for TOC navigation
const renderer = new marked.Renderer()
renderer.heading = function({ tokens, depth, text }) {
  // marked 5.0+ changed to object parameter if not using old signature. 
  // Wait, marked 17.0.1 ? Let's check documentation or assume standard (text, level, raw) might still be supported or changed.
  // Actually, recent marked versions pass ({ tokens, depth, text, raw }) as object to this.heading.
  
  // Let's support both just in case, but prefer object destructuring if it comes as object
  let actualText = text;
  let actualLevel = depth;
  
  // Check if first arg is object and has 'depth' property
  if (typeof tokens === 'object' && tokens !== null && 'depth' in tokens) {
     actualText = tokens.text;
     actualLevel = tokens.depth;
  } else {
     // Fallback to old signature: (text, level, raw)
     actualText = tokens; // first arg is text
     actualLevel = depth; // second arg is level
  }
  
  const safeText = actualText || ''
  const id = String(safeText).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-') 
  return `<h${actualLevel} id="${id}">${actualText}</h${actualLevel}>`
}

const html = computed(() => {
  // Remove content between first --- and second ---
  const content = (props.content || '').replace(/^---[\s\S]*?---\n/, '')
  
  // Use the custom renderer
  marked.use({ renderer })
  return marked(content)
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
