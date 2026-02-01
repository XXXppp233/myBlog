import { ref, computed } from "vue";

const notes = ref([]);
const isLoaded = ref(false);
const isLoading = ref(false);

export function useNotes() {
  const initNotes = async () => {
    if (isLoaded.value || isLoading.value) return;
    isLoading.value = true;
    try {
      // Using 'change' branch as the source of truth for blog.xml as established
      const response = await fetch(
        "https://raw.githubusercontent.com/XXXppp233/myBlog/refs/heads/master/blog.xml",
      );
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const noteNodes = xmlDoc.getElementsByTagName("note");

      const fetchedNotes = Array.from(noteNodes).map((node) => {
        const path = node.querySelector("path")?.textContent || "";
        const title = node.querySelector("title")?.textContent || "";
        const category = node.querySelector("category")?.textContent || "";
        const mtime = node.querySelector("mtime")?.textContent || "";
        const url = node.querySelector("url")?.textContent || "";

        // Slug generation: strip .md extension from path
        // e.g. "git/collaborate.md" -> "git/collaborate"
        const slug = path.replace(/\.md$/i, "");

        return {
          id: slug, // Map slug to id for compatibility
          slug,
          title,
          category,
          date: mtime
            ? new Date(parseFloat(mtime) * 1000).toISOString().split("T")[0]
            : "", // Convert Unix timestamp to YYYY-MM-DD
          url,
          path,
          content: null, // loaded lazily
        };
      });
      notes.value = fetchedNotes;
      isLoaded.value = true;
    } catch (error) {
      console.error("Failed to load blog.xml:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Trigger load if not already loaded
  if (!isLoaded.value && !isLoading.value) {
    initNotes();
  }

  const getNoteBySlug = (slug) => {
    // Azure view called it getNoteById, passing slug now
    return notes.value.find((n) => n.slug === slug);
  };

  const getNotesByCategory = (category) => {
    // Filter notes by category
    if (!category) return notes.value;
    return notes.value.filter((n) => n.category === category);
  };

  const fetchNoteContent = async (note) => {
    if (!note || note.content) return;
    try {
      const res = await fetch(note.url);
      if (res.ok) {
        note.content = await res.text();
      }
    } catch (e) {
      console.error("Failed to fetch note content:", e);
    }
  };

  const categories = computed(() => {
    const cats = new Set(notes.value.map((n) => n.category).filter((c) => c));
    return Array.from(cats).sort();
  });

  return {
    notes,
    categories,
    getNoteBySlug,
    // Alias for backward compatibility if needed, though unused
    getNoteById: getNoteBySlug,
    getNotesByCategory,
    fetchNoteContent,
    isLoading,
  };
}
