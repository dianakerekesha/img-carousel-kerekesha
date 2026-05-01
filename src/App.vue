<script setup lang="ts">
import Carousel      from '@/components/Carousel.vue'
import SelectedList  from '@/components/SelectedList.vue'
import { useImages }    from '@/composables/useImages'
import { useSelection } from '@/composables/useSelection'

const { images, loading } = useImages()
const { selectedSet, selectedImages, toggleSelect } = useSelection(images)
</script>

<template>
  <header class="site-header">
    <p class="site-header__eyebrow">picsum.photos · curated</p>
    <h1 class="site-header__title">The <em>Gallery</em></h1>
  </header>

  <div v-if="loading" class="skeleton-row">
    <div class="skeleton-item" v-for="n in 5" :key="n" />
  </div>

  <Carousel
    v-else
    :images="images"
    :selected-ids="selectedSet"
    @toggle-select="toggleSelect"
  />

  <SelectedList
    v-if="selectedImages.length > 0"
    :items="selectedImages"
    @remove="toggleSelect"
  />
</template>
