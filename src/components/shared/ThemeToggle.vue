<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <button
    class="theme-toggle"
    :aria-label="`Switch to ${themeStore.theme === 'dark' ? 'light' : 'dark'} mode`"
    :title="`Switch to ${themeStore.theme === 'dark' ? 'light' : 'dark'} mode`"
    @click="themeStore.toggleTheme()"
  >
    <Transition name="icon" mode="out-in">
      <Sun v-if="themeStore.theme === 'dark'" key="sun" :size="18" aria-hidden="true" />
      <Moon v-else key="moon" :size="18" aria-hidden="true" />
    </Transition>
  </button>
</template>

<style lang="scss" scoped>
// Touch target: 44×44px (ui-ux-pro-max: touch-target-size)
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: rgba(45, 212, 191, 0.08);
  }
}

.icon-enter-active,
.icon-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.icon-enter-from { opacity: 0; transform: rotate(-90deg) scale(0.7); }
.icon-leave-to   { opacity: 0; transform: rotate( 90deg) scale(0.7); }
</style>
