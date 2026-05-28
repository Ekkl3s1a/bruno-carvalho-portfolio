<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const { y } = useWindowScroll()
const { height } = useWindowSize()

const progress = computed(() => {
  const docHeight = document.documentElement.scrollHeight
  const maxScroll  = docHeight - height.value
  if (maxScroll <= 0) return 0
  return Math.min(100, (y.value / maxScroll) * 100)
})
</script>

<template>
  <div
    class="scroll-progress"
    role="progressbar"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="`Page scroll progress: ${Math.round(progress)}%`"
  >
    <div
      class="scroll-progress__bar"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>

<style lang="scss" scoped>
.scroll-progress {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  height: 2px;
  z-index: 200;
  // Fundo subtil para definir o track sem distrair
  background: transparent;
  pointer-events: none; // não interfere com cliques

  &__bar {
    height: 100%;
    background: var(--color-primary);
    border-radius: 0 var(--radius-pill) var(--radius-pill) 0;
    // Responsivo ao scroll sem lag visível
    transition: width 80ms linear;
    // Glow subtil — só no dark mode tem impacto real
    box-shadow: 0 0 8px rgba(45, 212, 191, 0.5);

    // Respeita prefers-reduced-motion: remove a transição, mantém a barra
    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
}
</style>