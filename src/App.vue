<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollProgressBar  from '@/components/shared/ScrollProgressBar.vue'
import Background3D      from '@/components/shared/Background3D.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const route      = useRoute()
const isHome     = computed(() => route.name === 'home')

// Initialise theme from localStorage / system preference on first load
onMounted(() => themeStore.initTheme())
</script>

<template>
  <div class="app">
    <Background3D />
    <ScrollProgressBar />

    <AppHeader v-if="!isHome" />
    <main id="main-content" class="app__main" tabindex="-1">
      <RouterView />
    </main>
    <AppFooter v-if="!isHome" />
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
    position: relative;
    flex: 1;
    outline: none; // tabindex="-1" skip link target
  }
}
</style>
