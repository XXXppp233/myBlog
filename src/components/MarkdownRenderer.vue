<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})

// Modernized Renderer and Extensions for marked v17
const embedExtension = {
  name: 'embed',
  level: 'block',
  start(src) { return src.match(/:{3,}\s*embed/)?.index; },
  tokenizer(src) {
    const rule = /^:{3,}\s*embed\s*([\s\S]*?)\n:{3,}/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'embed',
        raw: match[0],
        text: match[1].trim()
      };
    }
  },
  renderer(token) {
    return token.text;
  }
};

const alertExtension = {
  name: 'alert',
  level: 'block',
  start(src) { return src.match(/:{2,}\s*(note|important|warning|tip|alert)/i)?.index; },
  tokenizer(src) {
    const rule = /^:{2,}\s*(note|important|warning|tip|alert)\s*([\s\S]*?)\n:{2,}/i;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'alert',
        raw: match[0],
        variant: match[1].toLowerCase(),
        text: match[2].trim()
      };
    }
  },
  renderer(token) {
    const variantMap = {
      'note': { title: 'Note', icon: 'ⓘ' },
      'tip': { title: 'Tip', icon: '💡' },
      'important': { title: 'Important', icon: '★' },
      'warning': { title: 'Warning', icon: '⚠' },
      'alert': { title: 'Caution', icon: '✖' }
    };
    
    const config = variantMap[token.variant] || variantMap['note'];
    // Parse it simply to avoid recursion issues
    const content = marked.parse(token.text);
    
    return `<div class="cf-alert alert-${token.variant}">
      <div class="alert-icon-wrapper">${config.icon}</div>
      <div class="alert-content-wrapper">
        <p class="alert-title">${config.title}</p>
        <div class="alert-content">${content}</div>
      </div>
    </div>`;
  }
};

// Global Marked Configuration
marked.use({ 
  renderer: {
    heading(token) {
      const text = token.text;
      const depth = token.depth;
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
      // In v17+, token has tokens property for children, but we can use the text for basic headings
      return `<h${depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${depth}>`;
    },
    code(token) {
      const { text, lang } = token;
      const escaped = text.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));
      return `<div class="code-container"><p class="code-lang">${lang || 'Text'}</p><pre><code class="language-${lang || ''}">${escaped}</code></pre></div>`;
    }
  },
  extensions: [embedExtension, alertExtension],
  async: false,
  breaks: true,
  gfm: true
})

const htmlContent = computed(() => {
  if (!props.content) return ''
  
  // 1. Strip frontmatter first
  let content = props.content.replace(/^---[\s\S]*?---\n/, '')
  
  // 2. Remove the first H1 tag to avoid double titles
  content = content.replace(/^#\s+.*(?:\n|$)/, '')

  try {
    return marked.parse(content)
  } catch (err) {
    console.error('Marked parsing error:', err)
    return '<p class="error">Error rendering markdown</p>'
  }
})
</script>

<template>
  <div class="markdown-body" v-html="htmlContent"></div>
</template>

<style>
.markdown-body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #242424;
  font-size: 16px;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  color: #242424;
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h2 {
  font-size: 30px;
  margin-top: 48px;
}

.markdown-body h3 {
  font-size: 24px;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body a {
  color: #0067b8;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 24px;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 4px;
}

/* Cloudflare Alerts */
.cf-alert {
  margin: 24px 0;
  padding: 16px 20px;
  border-left: 4px solid #f38020;
  background-color: #fff4eb;
  color: #313131;
  display: flex;
  gap: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.alert-icon-wrapper {
  font-size: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
}

.alert-content-wrapper {
  flex-grow: 1;
}

.alert-title {
  display: block;
  font-weight: 700;
  font-size: 15px;
  margin: 0 0 4px 0 !important;
  color: inherit;
}

.alert-note { 
  border-left-color: #0051ad; 
  background-color: #e8f2ff; 
}
.alert-important { 
  border-left-color: #0051ad; 
  background-color: #e8f2ff; 
}
.alert-warning, .alert-alert { 
  border-left-color: #f38020; 
  background-color: #fff4eb; 
}
.alert-tip { 
  border-left-color: #059669; 
  background-color: #ecfdf5; 
}

.alert-content {
  font-size: 15px;
  line-height: 1.5;
}

.alert-content p:last-child {
  margin-bottom: 0;
}

/* Code Blocks */
.code-container {
  margin: 24px 0;
  background-color: #f3f2f1;
  border-radius: 4px;
  overflow: hidden;
}

.code-lang {
  font-size: 11px;
  text-transform: uppercase;
  color: #605e5c;
  padding: 8px 16px 4px 16px;
  margin: 0;
  font-weight: 600;
}

.markdown-body pre {
  margin: 0;
  padding: 8px 16px 16px 16px;
  overflow-x: auto;
}

.markdown-body code {
  font-family: 'Cascadia Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  font-size: 14px;
  background-color: transparent;
  padding: 0;
  color: #242424;
}

/* Inline code */
:not(pre) > code {
  background-color: #f3f2f1;
  padding: 2px 4px;
  border-radius: 3px;
  color: #242424;
  font-size: 14px;
  font-family: inherit; /* MS Learn often keeps font consistent for inline */
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.markdown-body th, .markdown-body td {
  border: 1px solid #edebe9;
  padding: 12px;
  text-align: left;
}

.markdown-body th {
  background-color: #f3f2f1;
  font-weight: 600;
}
</style>
