<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollProgressBar  from '@/components/shared/ScrollProgressBar.vue'
import Background3D      from '@/components/shared/Background3D.vue'
import { useThemeStore } from '@/stores/theme'
import IntroScene from '@/components/intro/IntroScene.vue'

const themeStore = useThemeStore()
const route      = useRoute()
const isHome     = computed(() => route.name === 'home')
const introDone    = ref(false)

// Initialise theme from localStorage / system preference on first load
onMounted(() => themeStore.initTheme())

function onIntroDone() {
  introDone.value = true
}
</script>

<template>
  <div class="app">
    <Background3D />
    <ScrollProgressBar />

    <IntroScene v-if="isHome && !introDone" @done="onIntroDone" />

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
