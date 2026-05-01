// ─── Shared types ─────────────────────────────────────────────────────────

export interface PicsumItem {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

export interface GalleryImage {
  id: string
  author: string
  url: string
  thumb: string
}
