<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

interface Props {
  platform: 'github' | 'linkedin' | 'email'
  url: string
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), { showLabel: false })

const config = {
  github:   { icon: Github,   label: 'GitHub',   prefix: '' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', prefix: '' },
  email:    { icon: Mail,     label: 'Email',    prefix: 'mailto:' },
}
</script>

<template>
  <a
    :href="config[platform].prefix + url"
    class="social-link"
    :target="platform !== 'email' ? '_blank' : undefined"
    :rel="platform !== 'email' ? 'noopener noreferrer' : undefined"
    :aria-label="config[platform].label"
  >
    <component :is="config[platform].icon" :size="18" aria-hidden="true" />
    <span v-if="showLabel" class="social-link__label">{{ config[platform].label }}</span>
  </a>
</template>

<style lang="scss" scoped>
.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  transition: all var(--transition-base);

  &:hover {
    color: var(--color-primary);
    background: rgba(45, 212, 191, 0.08);
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 500;
  }
}
</style>
