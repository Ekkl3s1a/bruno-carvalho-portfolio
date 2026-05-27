// ─────────────────────────────────────────────────────────────
// src/stores/theme.ts
// Persists to localStorage, respects prefers-color-scheme
// ─────────────────────────────────────────────────────────────

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme } from '@/types'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>('dark')

  // Called once in App.vue onMounted
  function initTheme() {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved === 'light' || saved === 'dark') {
      theme.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme.value = 'light'
    }
    applyTheme(theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(t: Theme) {
    theme.value = t
  }

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('theme', t)
  }

  watch(theme, (newTheme) => applyTheme(newTheme))

  return { theme, initTheme, toggleTheme, setTheme }
})
