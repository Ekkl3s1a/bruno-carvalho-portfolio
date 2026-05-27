<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  delay?:     number   // ms — para stagger entre cards
  threshold?: number   // 0–1 — quanto do elemento tem de estar visível
  once?:      boolean  // só anima uma vez (default: true)
}

const props = withDefaults(defineProps<Props>(), {
  delay:     0,
  threshold: 0.12,
  once:      true,
})

const el = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!el.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          if (props.once) observer?.unobserve(entry.target)
        } else if (!props.once) {
          entry.target.classList.remove('is-visible')
        }
      })
    },
    { threshold: props.threshold }
  )

  observer.observe(el.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    ref="el"
    class="reveal"
    :style="delay ? { transitionDelay: `${delay}ms` } : {}"
  >
    <slot />
  </div>
</template>