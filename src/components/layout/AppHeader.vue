<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, X, Download } from 'lucide-vue-next'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'

const isScrolled  = ref(false)
const isMenuOpen  = ref(false)

const navLinks = [
  { label: 'Home',           to: '/',                hash: '' },
  { label: 'About',          to: '/#about',          hash: '#about' },
  { label: 'Skills',         to: '/#skills',         hash: '#skills' },
  { label: 'Projects',       to: '/projects',        hash: '' },
  { label: 'Certifications', to: '/certifications',  hash: '' },
  { label: 'Contact',        to: '/#contact',        hash: '#contact' },
]

function handleScroll() { isScrolled.value = window.scrollY > 24 }

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': isScrolled }">
    <div class="header__inner">

      <!-- Logo -->
      <RouterLink to="/" class="header__logo" aria-label="Bruno Carvalho — Home" @click="closeMenu">
        <span class="header__logo-mark" aria-hidden="true">BC</span>
        <span class="header__logo-name">Bruno Carvalho</span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="header__nav" aria-label="Main navigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="header__nav-link"
          active-class="header__nav-link--active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="header__actions">
        <ThemeToggle />

        <a
          href="../../assets/resume_bruno_carvalho.pdf"
          download
          class="header__cv"
          aria-label="Download CV PDF"
        >
          <Download :size="14" aria-hidden="true" />
          <span>CV</span>
        </a>

        <!-- Hamburger (mobile only) -->
        <button
          class="header__hamburger"
          :aria-label="isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          @click="toggleMenu"
        >
          <Transition name="icon" mode="out-in">
            <X   v-if="isMenuOpen" key="x"    :size="20" aria-hidden="true" />
            <Menu v-else            key="menu" :size="20" aria-hidden="true" />
          </Transition>
        </button>
      </div>
    </div>

    <!-- Mobile nav menu -->
    <Transition name="mobile-menu">
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        class="header__mobile"
        aria-label="Mobile navigation"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="header__mobile-link"
          active-class="header__mobile-link--active"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>

        <div class="header__mobile-footer">
          <a
            href="../../assets/resume_bruno_carvalho.pdf"
            download
            class="header__mobile-cv"
            @click="closeMenu"
          >
            <Download :size="15" aria-hidden="true" />
            Download CV
          </a>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 100;
  height: var(--header-height);
  transition:
    background var(--transition-base),
    border-color var(--transition-base),
    backdrop-filter var(--transition-base);

  // On scroll: frosted glass effect
  &--scrolled {
    background: var(--header-bg-scrolled);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  &__inner {
    @include flex-between;
    @include container;
    height: 100%;
    gap: 1rem;
  }

  // ── Logo ─────────────────────────────────────────────────
  &__logo {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    text-decoration: none;
    flex-shrink: 0;
  }

  &__logo-mark {
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
    transition: transform var(--transition-base), box-shadow var(--transition-base);

    .header__logo:hover & {
      transform: scale(1.06);
      box-shadow: var(--shadow-glow);
    }
  }

  &__logo-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    display: none;

    @include respond-to('sm') { display: block; }
  }

  // ── Desktop nav ───────────────────────────────────────────
  &__nav {
    display: none;
    align-items: center;
    gap: 0.125rem;

    @include respond-to('lg') { display: flex; }
  }

  &__nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
    padding: 0.4rem 0.75rem;
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: var(--color-text);
      background: var(--color-surface);
    }

    &--active {
      color: var(--color-primary) !important;
      background: rgba(45, 212, 191, 0.08) !important;
    }
  }

  // ── Actions ───────────────────────────────────────────────
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__cv {
    display: none;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--btn-outlined-text);
    border: 1px solid var(--btn-outlined-border);
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: all var(--transition-base);
    white-space: nowrap;

    @include respond-to('md') { display: flex; }

    &:hover { background: var(--btn-outlined-bg-hover); }
  }

  // ── Hamburger ─────────────────────────────────────────────
  &__hamburger {
    @include touch-target(44px);
    width: 38px;
    height: 38px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    color: var(--color-text-muted);
    background: transparent;
    cursor: pointer;
    transition: all var(--transition-base);

    @include respond-to('lg') { display: none; }

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  // ── Mobile menu ───────────────────────────────────────────
  &__mobile {
    position: fixed;
    inset-block-start: var(--header-height);
    inset-inline: 0;
    inset-block-end: 0;
    background: var(--color-bg);
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 1.25rem;
    gap: 0.375rem;
    overflow-y: auto;

    @include respond-to('lg') { display: none; }
  }

  &__mobile-link {
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--color-text-muted);
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    border: 1px solid transparent;
    transition: all var(--transition-base);

    &:hover,
    &--active {
      color: var(--color-primary);
      background: rgba(45, 212, 191, 0.06);
      border-color: var(--color-border);
    }
  }

  &__mobile-footer {
    margin-block-start: auto;
    padding-block-start: 1.5rem;
    border-block-start: 1px solid var(--color-border);
  }

  &__mobile-cv {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: background var(--transition-base);

    &:hover { background: var(--btn-outlined-bg-hover); }
  }
}

// ── Transitions ───────────────────────────────────────────────

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.icon-enter-active, .icon-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-enter-from { opacity: 0; transform: scale(0.7); }
.icon-leave-to   { opacity: 0; transform: scale(0.7); }
</style>
