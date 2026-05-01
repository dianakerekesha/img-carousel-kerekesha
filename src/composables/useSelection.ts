// ─── composables/useSelection.ts ──────────────────────────────────────────
// Manages the Set of selected image IDs.
// Returns the reactive set and a toggle function.

import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { GalleryImage } from '@/types/image'

export function useSelection(images: Ref<GalleryImage[]>) {
  const selectedSet = ref<Set<string>>(new Set())

  // Toggle an id in/out of the set (immutable swap keeps Vue reactive)
  const toggleSelect = (id: string) => {
    const next = new Set(selectedSet.value)
    next.has(id) ? next.delete(id) : next.add(id)
    selectedSet.value = next
  }

  // Ordered list of selected GalleryImage objects
  const selectedImages = computed<GalleryImage[]>(() =>
    (images.value as GalleryImage[]).filter(img => selectedSet.value.has(img.id))
  )

  return { selectedSet, selectedImages, toggleSelect }
}
