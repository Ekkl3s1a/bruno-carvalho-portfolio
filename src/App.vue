<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Initialise theme from localStorage / system preference on first load
onMounted(() => themeStore.initTheme())
</script>

<template>
  <div class="app">
    <AppHeader />
    <main id="main-content" class="app__main" tabindex="-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  color: var(--color-text);
  transition:
    background-color var(--transition-base),
    color var(--transition-base);

  &__main {
    flex: 1;
    outline: none; // tabindex="-1" skip link target
  }
}
</style>
