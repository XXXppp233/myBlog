import { ref, computed } from 'vue'

const modules = import.meta.glob('../content/notes/**/*.md', { as: 'raw', eager: true })

export function useNotes() {
  const notes = computed(() => {
    return Object.keys(modules).map((path) => {
      // path example: "../content/notes/git/collaborate.md"
      const content = modules[path]
      
      // Extract category and slug
      // Remove "../content/notes/" -> "git/collaborate.md"
      const relativePath = path.replace('../content/notes/', '')
      const parts = relativePath.split('/')
      
      let category = 'Uncategorized'
      let name = relativePath.replace('.md', '')
      
      if (parts.length > 1) {
        category = parts[0]
        name = parts.slice(1).join('/').replace('.md', '')
      }
      
      // Simple Frontmatter extraction (if present)
      // Assuming frontmatter is betwen --- and ---
      let title = name
      let date = null
      
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (fmMatch) {
        const fmString = fmMatch[1]
        fmString.split('\n').forEach(line => {
          const [key, ...val] = line.split(':')
          if (key && val) {
            const k = key.trim()
            const v = val.join(':').trim()
            if (k === 'title') title = v.replace(/^['"](.*)['"]$/, '$1')
            if (k === 'date') date = new Date(v)
          }
        })
      }

      return {
        path,
        slug: relativePath.replace('.md', ''),
        title: title || name,
        category,
        content,
        date
      }
    })
  })

  const getNoteBySlug = (slug) => {
    return notes.value.find(n => n.slug === slug)
  }

  const categories = computed(() => {
    const cats = new Set(notes.value.map(n => n.category))
    return Array.from(cats).sort()
  })

  return {
    notes,
    categories,
    getNoteBySlug
  }
}
