import { onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";

interface SwipeOptions {
  threshold?: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useSwipe(
  elementRef: Ref<HTMLElement | null>,
  options: SwipeOptions,
) {
  const { threshold = 50, onSwipeLeft, onSwipeRight } = options;

  let startX = 0;
  let startY = 0;
  let isDragging = false;

  const onTouchStart = (e: TouchEvent) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < -threshold) onSwipeLeft();
    if (deltaX > threshold) onSwipeRight();
  };

  const onMouseDown = (e: MouseEvent) => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX < -threshold) onSwipeLeft();
    if (deltaX > threshold) onSwipeRight();
  };

  const onMouseLeave = () => {
    isDragging = false;
  };

  onMounted(() => {
    const el = elementRef.value;
    if (!el) return;

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);
  });

  onUnmounted(() => {
    const el = elementRef.value;
    if (!el) return;

    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchend", onTouchEnd);
    el.removeEventListener("mousedown", onMouseDown);
    el.removeEventListener("mouseup", onMouseUp);
    el.removeEventListener("mouseleave", onMouseLeave);
  });
}
