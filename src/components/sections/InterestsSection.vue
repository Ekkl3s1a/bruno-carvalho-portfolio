<script setup lang="ts">
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'

interface Interest {
  label: string
  detail: string
}

interface Group {
  title: string
  emoji: string
  items: Interest[]
}

const groups: Group[] = [
  {
    title: 'Sports',
    emoji: '⚽',
    items: [
      { label: 'Football',  detail: 'Passionate player and fan' },
      { label: 'Padel',     detail: 'Fast-growing favourite sport' },
      { label: 'Running',   detail: 'Weekend morning runs' },
      { label: 'Gym',       detail: 'Consistent training routine' },
    ],
  },
  {
    title: 'Tech & Programming',
    emoji: '💻',
    items: [
      { label: 'Open Source',      detail: 'Building & contributing' },
      { label: 'VS Code Tooling',  detail: 'Themes & extensions' },
      { label: 'New Frameworks',   detail: 'Always exploring' },
      { label: 'Tech Podcasts',    detail: 'Staying up to date' },
    ],
  },
]
</script>

<template>
  <section id="interests" class="interests">
    <div class="interests__container">

      <ScrollReveal>
        <SectionTitle
          title="Interests"
          subtitle="What keeps me balanced and sharp outside of work."
        />
      </ScrollReveal>

      <div class="interests__grid">
        <ScrollReveal
          v-for="(group, i) in groups"
          :key="group.title"
          :delay="i * 120"
        >
          <div class="interests__card">
            <div class="interests__card-header">
              <span class="interests__emoji" aria-hidden="true">
                {{ group.emoji }}
              </span>
              <h3 class="interests__card-title">{{ group.title }}</h3>
            </div>

            <ul class="interests__list">
              <li
                v-for="item in group.items"
                :key="item.label"
                class="interests__item"
              >
                <span class="interests__item-label">{{ item.label }}</span>
                <span class="interests__item-detail">{{ item.detail }}</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.interests {
  @include section-padding;

  &__container { @include container; }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @include respond-to('md') { grid-template-columns: repeat(2, 1fr); }
  }

  &__card {
    @include card;
    padding: 1.75rem;

    &-header {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      margin-bottom: 1.375rem;
    }
  }

  &__emoji {
    font-size: 1.75rem;
    line-height: 1;
  }

  &__card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__list { display: flex; flex-direction: column; }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);

    &:last-child { border-bottom: none; }

    &-label {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--color-text);
    }

    &-detail {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      text-align: right;
    }
  }
}
</style>