import { ref, computed } from 'vue'

// Use Vite's import.meta.glob to load all markdown files in the content directory
const modules = import.meta.glob('../content/notes/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseNote(path, content) {
  // Simple frontmatter parser
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/
  const match = content.match(frontmatterRegex)

  let metadata = {}
  let body = content

  if (match) {
    const yaml = match[1]
    body = content.replace(match[0], '').trim()

    // Simple YAML-like parsing (key: value)
    yaml.split('\n').forEach((line) => {
      const parts = line.split(':')
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const value = parts.slice(1).join(':').trim()
        metadata[key] = value
      }
    })
  }

  // Extract category from path (e.g., ../content/notes/azure/app-service.md -> azure)
  const pathParts = path.split('/')
  // Assuming structure ../content/notes/<category>/<filename>
  // pathParts will be ['.', '.', 'content', 'notes', 'category', 'filename']
  // We need to be careful about the split.
  // Let's use a safer relative path approach.
  const category = pathParts[pathParts.length - 2]
  const filename = pathParts[pathParts.length - 1]
  const id = filename.replace('.md', '')

  return {
    id: `${category}-${id}`, // unique id
    slug: id,
    category,
    path,
    title: metadata.title || filename,
    date: metadata.date || new Date().toISOString().split('T')[0],
    preview: metadata.preview || body.substring(0, 100) + '...',
    content: body,
  }
}

const allNotes = Object.keys(modules).map((path) => {
  return parseNote(path, modules[path])
})

export function useNotes() {
  const notes = ref(allNotes)

  const getNoteById = (id) => {
    return notes.value.find((n) => n.id === id)
  }

  const categories = computed(() => {
    return [...new Set(notes.value.map((n) => n.category))]
  })

  const getNotesByCategory = (category) => {
    if (!category) return notes.value
    return notes.value.filter((n) => n.category === category)
  }

  return {
    notes,
    categories,
    getNoteById,
    getNotesByCategory,
  }
}
