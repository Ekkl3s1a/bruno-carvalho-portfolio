<script setup lang="ts">
interface Props {
  label: string
  variant?: 'default' | 'primary' | 'muted'
}

withDefaults(defineProps<Props>(), { variant: 'default' })
</script>

<template>
  <span class="skill-tag" :class="`skill-tag--${variant}`">
    <slot name="icon" />
    {{ label }}
  </span>
</template>

<style lang="scss" scoped>
.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--tag-border);
  transition: all var(--transition-base);
  white-space: nowrap;

  &--default {
    background: var(--tag-bg);
    color: var(--tag-text);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  &--primary {
    background: rgba(45, 212, 191, 0.10);
    color: var(--color-primary);
    border-color: rgba(45, 212, 191, 0.30);
  }

  &--muted {
    background: transparent;
    color: var(--color-text-muted);
    border-color: transparent;
    font-size: 0.75rem;
  }
}
</style>