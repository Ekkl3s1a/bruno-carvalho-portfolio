<script setup lang="ts">
import SocialLink from '@/components/shared/SocialLink.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__mark" aria-hidden="true">BC</span>
        <p class="footer__tagline">Building the web, one line at a time.</p>
      </div>

      <div class="footer__socials" aria-label="Social links">
        <SocialLink platform="github"   url="https://github.com/Ekkl3s1a" />
        <SocialLink platform="linkedin" url="https://linkedin.com/in/bruno-mr-carvalho" />
        <SocialLink platform="email"    url="carvalhobrunomr@gmail.com" />
      </div>

      <p class="footer__copy">
        © {{ year }} Bruno Carvalho ·
        Built with <span class="footer__vue">Vue 3</span>
      </p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  padding-block: 2.5rem;

  &__inner {
    @include container;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    text-align: center;

    @include respond-to('md') {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__mark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    background: var(--color-primary);
    color: #082121;
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 0.8125rem;
    flex-shrink: 0;
  }

  &__tagline {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  &__socials {
    display: flex;
    gap: 0.125rem;
  }

  &__copy {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  &__vue {
    color: var(--color-primary);
    font-weight: 500;
  }
}
</style>
