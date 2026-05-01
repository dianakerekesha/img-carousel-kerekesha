<script setup lang="ts">
// ─── components/Carousel.vue ───────────────────────────────────────────────
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { GalleryImage } from '@/types/image'
import { IMG_W, IMG_H, MOBILE_IMG_H, GAP, MOBILE_BP } from '@/constants/carousel'

// ── Props & Emits ─────────────────────────────────────────────────────────
const props = defineProps<{
  images:      GalleryImage[]
  selectedIds: Set<string>
}>()

const emit = defineEmits<{
  (e: 'toggle-select', id: string): void
}>()

// ── Internal state ────────────────────────────────────────────────────────
const containerRef = ref<HTMLElement | null>(null)
const containerW   = ref(900)
const internalIdx  = ref(0)   // position within the middle clone
const animating    = ref(false)
const winW         = ref(window.innerWidth)
let   snapTimer: ReturnType<typeof setTimeout> | null = null
let   ro: ResizeObserver

// ── Responsive ────────────────────────────────────────────────────────────
const isMobile = computed(() => winW.value < MOBILE_BP)

// ── Triple-clone array for seamless infinite loop ─────────────────────────
const displayImages = computed(() => {
  if (!props.images.length) return []
  return [...props.images, ...props.images, ...props.images]
})

// The middle copy starts at index props.images.length
const baseOffset = computed(() => props.images.length)

// ── Track transform ───────────────────────────────────────────────────────
const trackStyle = computed(() => {
  const idx    = baseOffset.value + internalIdx.value
  const offset = isMobile.value
    ? idx * (containerW.value + GAP)
    : idx * (IMG_W + GAP)

  return {
    transform : `translateX(-${offset}px)`,
    transition: animating.value
      ? 'transform 0.52s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none',
  }
})

// ── Per-item size ─────────────────────────────────────────────────────────
const itemStyle = computed(() => ({
  width : isMobile.value ? `${containerW.value}px` : `${IMG_W}px`,
  height: isMobile.value ? `${MOBILE_IMG_H}px`     : `${IMG_H}px`,
}))

// ── Snap: after animation ends teleport back to the middle copy ───────────
const doSnap = () => {
  const n = props.images.length
  if (!n) return
  if (internalIdx.value >= n || internalIdx.value <= -n) {
    animating.value   = false
    internalIdx.value = ((internalIdx.value % n) + n) % n
    nextTick(() => { animating.value = true })
  }
}

const scheduleSnap = () => {
  if (snapTimer) clearTimeout(snapTimer)
  snapTimer = setTimeout(doSnap, 560)
}

// ── Navigation ────────────────────────────────────────────────────────────
const goNext = () => { internalIdx.value++; scheduleSnap() }
const goPrev = () => { internalIdx.value--; scheduleSnap() }

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  if (!containerRef.value) return
  containerW.value = containerRef.value.offsetWidth

  ro = new ResizeObserver(([entry]) => {
    containerW.value = entry.contentRect.width
    winW.value       = window.innerWidth
  })
  ro.observe(containerRef.value)

  // Enable transition only after first paint to avoid initial flicker
  nextTick(() => { animating.value = true })
})

onUnmounted(() => {
  ro?.disconnect()
  if (snapTimer) clearTimeout(snapTimer)
})
</script>

<template>
  <div class="carousel-root" ref="containerRef">

    <!-- Prev button -->
    <button class="carousel-btn carousel-btn--prev" @click="goPrev" aria-label="Previous image">
      <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
    </button>

    <!-- Viewport -->
    <div class="carousel-viewport">
      <div class="carousel-track" :style="trackStyle">
        <div
          v-for="(img, idx) in displayImages"
          :key="idx"
          class="carousel-item"
          :class="{ 'is-selected': selectedIds.has(img.id) }"
          :style="itemStyle"
          role="checkbox"
          :aria-checked="selectedIds.has(img.id)"
          tabindex="0"
          @click="emit('toggle-select', img.id)"
          @keydown.enter="emit('toggle-select', img.id)"
          @keydown.space.prevent="emit('toggle-select', img.id)"
        >
          <img
            class="carousel-item__img"
            :src="img.url"
            :alt="`Photo ${img.id}${img.author ? ' by ' + img.author : ''}`"
            loading="lazy"
            draggable="false"
          />
          <div class="carousel-item__overlay" />
          <div class="carousel-item__check" aria-hidden="true">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Next button -->
    <button class="carousel-btn carousel-btn--next" @click="goNext" aria-label="Next image">
      <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

  </div>
</template>
