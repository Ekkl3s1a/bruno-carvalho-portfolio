<script setup lang="ts">
import { Github, Linkedin, Mail, MoveRight } from 'lucide-vue-next'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'

interface ContactCard {
  platform: string
  value: string
  href: string
  icon: typeof Github
  external: boolean
}

const contacts: ContactCard[] = [
  {
    platform: 'Email',
    value: 'carvalhobrunomr@gmail.com',
    href: 'mailto:carvalhobrunomr@gmail.com',
    icon: Mail,
    external: false,
  },
  {
    platform: 'GitHub',
    value: 'github.com/Ekkl3s1a',
    href: 'https://github.com/Ekkl3s1a',
    icon: Github,
    external: true,
  },
  {
    platform: 'LinkedIn',
    value: 'linkedin.com/in/bruno-mr-carvalho',
    href: 'https://linkedin.com/in/bruno-mr-carvalho',
    icon: Linkedin,
    external: true,
  },
]
</script>

<template>
  <section id="contact" class="contact">
    <div class="contact__container">

      <ScrollReveal>
        <SectionTitle
          title="Get in Touch"
          subtitle="Open to new opportunities, collaborations, and interesting projects."
          align="center"
        />
      </ScrollReveal>

      <div class="contact__cards">
        <ScrollReveal
          v-for="(card, i) in contacts"
          :key="card.platform"
          :delay="i * 80"
        >
          <a
            :href="card.href"
            class="contact-card"
            :target="card.external ? '_blank' : undefined"
            :rel="card.external ? 'noopener noreferrer' : undefined"
            :aria-label="`Contact via ${card.platform}`"
          >
            <div class="contact-card__icon" aria-hidden="true">
              <component :is="card.icon" :size="20" />
            </div>

            <div class="contact-card__body">
              <span class="contact-card__platform">{{ card.platform }}</span>
              <span class="contact-card__value">{{ card.value }}</span>
            </div>

            <MoveRight
              class="contact-card__arrow"
              :size="18"
              aria-hidden="true"
            />
          </a>
        </ScrollReveal>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.contact {
  @include section-padding;
  background: var(--color-surface);

  &__container {
    @include container;
    max-width: 680px;
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
}

// ── Contact card ──────────────────────────────────────────────

.contact-card {
  @include card;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  text-decoration: none;

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: rgba(45, 212, 191, 0.10);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background var(--transition-base);
  }

  &:hover &__icon {
    background: rgba(45, 212, 191, 0.20);
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
  }

  &__platform {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__value {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    color: var(--color-text-muted);
    flex-shrink: 0;
    transition: color var(--transition-base), transform var(--transition-base);
  }

  &:hover &__arrow {
    color: var(--color-primary);
    transform: translateX(5px);
  }
}
</style>