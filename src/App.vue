<script setup lang="ts">
import Carousel from "@/components/Carousel.vue";
import SelectedList from "@/components/SelectedList.vue";
import { useImages } from "@/composables/useImages";
import { useSelection } from "@/composables/useSelection";

const { images, loading } = useImages();
const { selectedSet, selectedImages, toggleSelect } = useSelection(images);
</script>

<template>
  <header class="site-header">
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
    :items="selectedImages"
    :loading="loading"
    @remove="toggleSelect"
  />
</template>
