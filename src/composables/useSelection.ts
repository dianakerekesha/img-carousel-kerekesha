import { ref, computed } from "vue";
import type { Ref } from "vue";
import type { GalleryImage } from "@/types/image";

export function useSelection(images: Ref<GalleryImage[]>) {
  const selectedSet = ref<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const next = new Set(selectedSet.value);
    next.has(id) ? next.delete(id) : next.add(id);
    selectedSet.value = next;
  };

  const selectedImages = computed<GalleryImage[]>(() =>
    (images.value as GalleryImage[]).filter((img) =>
      selectedSet.value.has(img.id),
    ),
  );

  return { selectedSet, selectedImages, toggleSelect };
}
