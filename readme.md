# Image Carousel

A minimal, responsive image carousel built with **Vue 3** + **TypeScript** + **SCSS**.  
Images are fetched from [picsum.photos](https://picsum.photos).

---

## Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
---

## Features

- Infinite scroll — prev / next buttons
- Responsive — multiple images on desktop, one full-width on mobile
- Swipe support — touch & mouse drag
- Image selection — click to select, list of URLs shown below
- Skeleton loader — while images are fetching
- Preload — first 5 images preloaded natively

---

## Project Structure

```
src/
├── main.ts
├── App.vue
├── components/
│   ├── Carousel.vue        # carousel UI + slide logic
│   └── SelectedList.vue    # selected images panel
├── composables/
│   ├── useImages.ts        # fetch from picsum API
│   ├── useSelection.ts     # selected IDs state
│   └── useSwipe.ts         # touch & mouse swipe
├── constants/
│   └── carousel.ts         # IMG_W, GAP, MOBILE_BP ...
├── types/
│   └── image.ts            # GalleryImage, PicsumItem
└── assets/
    └── main.scss
```

---

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

---

## API

Images are fetched from:
```
GET https://picsum.photos/v2/list?limit=24&page=2
```