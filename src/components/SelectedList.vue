<script setup lang="ts">
// ─── components/SelectedList.vue ───────────────────────────────────────────
import type { GalleryImage } from '@/types/image'

defineProps<{
  items: GalleryImage[]
}>()

const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <section class="selected-section">
    <div class="selected-header">
      <h2 class="selected-header__title">Selected</h2>
      <span class="selected-header__count">
        {{ items.length }}&nbsp;image{{ items.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <TransitionGroup name="sel" tag="div" class="selected-list">
      <div
        v-for="img in items"
        :key="img.id"
        class="selected-entry"
      >
        <img
          class="selected-entry__thumb"
          :src="img.thumb"
          :alt="`Photo ${img.id}`"
        />
        <span class="selected-entry__id">#{{ img.id }}</span>
        <span class="selected-entry__url" :title="img.url">{{ img.url }}</span>
        <button
          class="selected-entry__remove"
          @click="emit('remove', img.id)"
          :aria-label="`Deselect image ${img.id}`"
        >
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6"  x2="6"  y2="18"/>
            <line x1="6"  y1="6"  x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </section>
</template>
