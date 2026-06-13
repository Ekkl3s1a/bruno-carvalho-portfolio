<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
function toggle() { locale.value = locale.value === 'en' ? 'pt' : 'en' }
</script>

<template>
  <button
    class="lang-toggle"
    :aria-label="`Switch to ${locale === 'en' ? 'Portuguese' : 'English'}`"
    @click="toggle"
  >
    {{ locale === 'en' ? 'PT' : 'EN' }}
  </button>
</template>

<style lang="scss" scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px; height: 28px;
  border-radius: 4px; border: none;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 600;
  color: rgba(45,212,191,.55);
  cursor: pointer;
  transition: background .15s, color .15s;

  &:hover { background: rgba(45,212,191,.1); color: var(--color-primary); }
}
</style>