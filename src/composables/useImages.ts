// ─── composables/useImages.ts ──────────────────────────────────────────────
// Encapsulates all data-fetching logic for the gallery.
// Returns reactive `images`, `loading`, and `error` state.

import { ref, onMounted } from 'vue'
import type { GalleryImage, PicsumItem } from '@/types/image'
import { TOTAL, PAGE } from '@/constants/carousel'

const API_URL = `https://picsum.photos/v2/list?limit=${TOTAL}&page=${PAGE}`

function mapItem(item: PicsumItem): GalleryImage {
  return {
    id:     item.id,
    author: item.author,
    url:    `https://picsum.photos/id/${item.id}/560/380`,
    thumb:  `https://picsum.photos/id/${item.id}/108/76`,
  }
}

function buildFallback(): GalleryImage[] {
  return Array.from({ length: TOTAL }, (_, i) => {
    const id = String(i + 10)
    
    return { id, author: '', url: `https://picsum.photos/id/${id}/560/380`, thumb: `https://picsum.photos/id/${id}/108/76` }
  })
}

export function useImages() {
  const images  = ref<GalleryImage[]>([])
  const loading = ref(true)
  const error   = ref<string | null>(null)

  onMounted(async () => {
    try {
      const res = await fetch(API_URL)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const data: PicsumItem[] = await res.json()
      
      images.value = data.map(mapItem)
    } catch (e) {
      error.value  = (e as Error).message
      images.value = buildFallback()
    } finally {
      setTimeout(() => loading.value = false, 1500)
    }
  })

  return { images, loading, error }
}
