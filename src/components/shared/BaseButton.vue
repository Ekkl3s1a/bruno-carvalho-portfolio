<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  variant?: 'primary' | 'outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string           // RouterLink (rota interna)
  href?: string         // anchor (link externo ou download)
  target?: string
  download?: boolean
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
})

defineEmits<{ click: [event: MouseEvent] }>()

// Decide qual elemento renderizar
const tag = props.to ? RouterLink : props.href ? 'a' : 'button'
</script>

<template>
  <component
    :is="tag"
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--loading': loading, 'btn--disabled': disabled || loading, 'btn--full': fullWidth }
    ]"
    :to="to"
    :href="href"
    :target="target"
    :download="download || undefined"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :disabled="(disabled || loading) && !to && !href ? true : undefined"
    :aria-disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;

  // ── Sizes (todos com min-height 44px — touch target) ──
  &--sm {
    font-size: 0.8125rem;
    padding: 0.375rem 0.875rem;
    min-height: 44px;
  }
  &--md {
    font-size: 0.9375rem;
    padding: 0.625rem 1.5rem;
    min-height: 44px;
  }
  &--lg {
    font-size: 1rem;
    padding: 0.75rem 2rem;
    min-height: 48px;
  }

  // ── Variants ──
  &--primary {
    background: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border-color: var(--btn-primary-bg);

    &:not(.btn--disabled):hover {
      background: var(--btn-primary-bg-hover);
      border-color: var(--btn-primary-bg-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(45, 212, 191, 0.30);
    }

    &:not(.btn--disabled):active {
      transform: translateY(0);
      box-shadow: none;
    }
  }

  &--outlined {
    background: transparent;
    color: var(--btn-outlined-text);
    border-color: var(--btn-outlined-border);

    &:not(.btn--disabled):hover {
      background: var(--btn-outlined-bg-hover);
      transform: translateY(-1px);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-text-muted);
    border-color: transparent;

    &:not(.btn--disabled):hover {
      background: var(--color-surface);
      color: var(--color-text);
    }
  }

  // ── States ──
  &--full   { width: 100%; }
  &--disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
  &--loading  { opacity: 0.7; cursor: wait; }
}
</style>