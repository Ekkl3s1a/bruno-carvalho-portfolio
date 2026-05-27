<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  tag?: 'h2' | 'h3'
}

withDefaults(defineProps<Props>(), {
  align: 'left',
  tag: 'h2',
})
</script>

<template>
  <div class="section-title" :class="`section-title--${align}`">
    <component :is="tag" class="section-title__heading">
      {{ title }}
    </component>
    <p v-if="subtitle" class="section-title__subtitle">
      {{ subtitle }}
    </p>
    <div class="section-title__line" aria-hidden="true" />
  </div>
</template>

<style lang="scss" scoped>
.section-title {
  margin-bottom: 3rem;

  &--center {
    text-align: center;

    .section-title__subtitle { margin-inline: auto; }
    .section-title__line     { margin-inline: auto; }
  }

  &__heading {
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 0.75rem;
    letter-spacing: -0.015em;
  }

  &__subtitle {
    font-size: 1.0625rem;
    color: var(--color-text-muted);
    line-height: 1.75;
    max-width: 560px;
    margin-bottom: 1.25rem;
  }

  &__line {
    width: 40px;
    height: 3px;
    background: var(--color-primary);
    border-radius: var(--radius-pill);
  }
}
</style>