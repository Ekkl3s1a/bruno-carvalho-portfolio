<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCertificationsStore } from '@/stores/certifications'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'

const certs  = useCertificationsStore()
const active = ref<number | null>(null)

const activeCert = computed(() => active.value !== null ? certs.getById(active.value) : null)

function open(id: number)  { active.value = id }
function close()           { active.value = null }
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }
</script>

<template>
  <div class="certs-view" @keydown.capture="onKey">
    <div class="certs-view__container">

      <ScrollReveal>
        <header class="certs-view__header">
          <div class="certs-view__heading-row">
            <h1 class="certs-view__title">Certifications</h1>
            <span class="certs-view__count">{{ certs.certifications.length }}</span>
          </div>
          <p class="certs-view__sub">
            A record of continuous learning — click any card for details.
          </p>
        </header>
      </ScrollReveal>

      <!-- Timeline -->
      <ol class="cert-timeline" aria-label="Certifications timeline">
        <li
          v-for="(cert, i) in certs.certifications"
          :key="cert.id"
          class="cert-timeline__item"
        >
          <!-- Column 1: connector (direct grid child, NOT wrapped in ScrollReveal) -->
          <div class="cert-timeline__connector" aria-hidden="true">
            <div class="cert-timeline__dot" />
            <div class="cert-timeline__line" />
          </div>

          <!-- Column 2: card (ScrollReveal only wraps this) -->
          <ScrollReveal :delay="i * 90">
            <button
              class="cert-card"
              :aria-label="`View details for ${cert.title}`"
              @click="open(cert.id)"
            >
              <div class="cert-card__meta">
                <span class="cert-card__date">{{ cert.date }}</span>
                <span class="cert-card__issuer">{{ cert.issuer }}</span>
              </div>
              <h2 class="cert-card__title">{{ cert.title }}</h2>
              <div class="cert-card__tags">
                <span v-for="tag in cert.skills" :key="tag" class="cert-card__tag">
                  {{ tag }}
                </span>
              </div>
              <span class="cert-card__cta" aria-hidden="true">View details →</span>
            </button>
          </ScrollReveal>
        </li>
      </ol>

    </div>

    <!-- Modal — Teleport to body, styles in non-scoped block below -->
    <Teleport to="body">
      <Transition name="bc-modal">
        <div
          v-if="active !== null && activeCert"
          class="bc-cert-backdrop"
          role="dialog"
          aria-modal="true"
          :aria-label="activeCert.title"
          @click.self="close"
        >
          <div class="bc-cert-modal">
            <button class="bc-cert-modal__close" aria-label="Close modal" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            <div class="bc-cert-modal__award" aria-hidden="true">🏆</div>
            <h2 class="bc-cert-modal__title">{{ activeCert.title }}</h2>
            <p  class="bc-cert-modal__issuer">{{ activeCert.issuer }}</p>
            <p  class="bc-cert-modal__date">{{ activeCert.date }}</p>

            <p v-if="activeCert.description" class="bc-cert-modal__desc">
              {{ activeCert.description }}
            </p>

            <div v-if="activeCert.skills?.length" class="bc-cert-modal__tags">
              <span v-for="tag in activeCert.skills" :key="tag" class="cert-card__tag">
                {{ tag }}
              </span>
            </div>

            <a
              v-if="activeCert.credentialUrl"
              :href="activeCert.credentialUrl"
              target="_blank" rel="noopener noreferrer"
              class="bc-cert-modal__link"
            >
              View credential ↗
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.certs-view {
  padding-top: 5rem;
  min-height: 100vh;

  &__container { @include container; max-width: 780px; }

  &__header  { margin-bottom: 3rem; }

  &__heading-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -.025em;
    color: var(--color-text);
  }

  &__count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 .625rem;
    background: rgba(45,212,191,.1);
    border: 1px solid rgba(45,212,191,.25);
    border-radius: var(--radius-pill);
    font-family: var(--font-mono);
    font-size: .875rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  &__sub {
    margin-top: .625rem;
    color: var(--color-text-muted);
    font-size: .9375rem;
  }
}

// ── Timeline ──────────────────────────────────────────────────
.cert-timeline {
  list-style: none;
  padding: 0 0 4rem;
  margin: 0;

  &__item {
    display: grid;
    grid-template-columns: 28px 1fr; // ← restored: col-1 connector, col-2 card
    gap: 0 1.25rem;
    align-items: start;
  }

  &__connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.5rem;
    height: 100%;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid var(--color-bg);
    box-shadow: 0 0 0 2px var(--color-primary), 0 0 10px rgba(45,212,191,.35);
    flex-shrink: 0;
    z-index: 1;
  }

  &__line {
    flex: 1;
    width: 1px;
    min-height: 1.5rem;
    margin-top: 5px;
    background: linear-gradient(
      to bottom,
      rgba(45,212,191,.4),
      rgba(45,212,191,.06)
    );
  }

  // Remove connector line after last item
  &__item:last-child .cert-timeline__line {
    display: none;
  }
}

// ── Cert card ─────────────────────────────────────────────────
.cert-card {
  display: flex;
  flex-direction: column;
  gap: .625rem;
  width: 100%;
  text-align: left;
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(14px);
  padding: 1.375rem 1.5rem;
  margin-bottom: 1.25rem;
  cursor: pointer;
  transition:
    border-color var(--transition-base),
    transform    var(--transition-base),
    box-shadow   var(--transition-base);

  &:hover {
    border-color: rgba(45,212,191,.38);
    transform: translateX(4px);
    box-shadow:
      -3px 0 0 0 var(--color-primary),
      0 4px 24px rgba(0,0,0,.14);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: .75rem;
    flex-wrap: wrap;
  }

  &__date {
    font-family: var(--font-mono);
    font-size: .72rem;
    color: var(--color-primary);
    background: rgba(45,212,191,.08);
    border: 1px solid rgba(45,212,191,.16);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
    white-space: nowrap;
  }

  &__issuer {
    font-size: .8125rem;
    color: var(--color-text-muted);
  }

  &__title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
    line-height: 1.35;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: .375rem;
  }

  &__tag {
    font-family: var(--font-mono);
    font-size: .72rem;
    padding: .2rem .6rem;
    background: rgba(45,212,191,.06);
    border: 1px solid rgba(45,212,191,.14);
    border-radius: var(--radius-pill);
    color: var(--color-primary);
    white-space: nowrap;
  }

  &__cta {
    font-family: var(--font-mono);
    font-size: .8125rem;
    color: var(--color-primary);
    opacity: 0;
    transition: opacity var(--transition-base);
    margin-top: .125rem;
  }
  &:hover &__cta { opacity: 1; }
}
</style>

<!--
  Modal styles in NON-SCOPED block.
  <Teleport> moves content outside the component DOM root,
  so scoped CSS (data-v-xxx attribute) is unreliable for the backdrop.
  Transition class names (.bc-modal-enter-from etc.) also need global scope.
  Prefix all classes with 'bc-cert-' to avoid collisions.
-->
<style lang="scss">
// ── Modal backdrop ─────────────────────────────────────────────
.bc-cert-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(4, 15, 15, .84);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

// ── Modal card ─────────────────────────────────────────────────
.bc-cert-modal {
  position: relative;
  background: var(--color-surface);
  border: 1px solid rgba(45,212,191,.22);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: .875rem;
  box-shadow: 0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(45,212,191,.06);

  &__close {
    position: absolute;
    top: 1rem; right: 1rem;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all .18s ease;

    &:hover { border-color: var(--color-primary); color: var(--color-primary); }
    &:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
  }

  &__award { font-size: 2.5rem; line-height: 1; }

  &__title {
    font-size: 1.3125rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
    line-height: 1.3;
  }

  &__issuer {
    font-size: .9375rem;
    color: var(--color-primary);
    margin: 0;
  }

  &__date {
    font-family: var(--font-mono, monospace);
    font-size: .8rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  &__desc {
    font-size: .9375rem;
    color: var(--color-text-muted);
    line-height: 1.75;
    margin: 0;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: .375rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    margin-top: .25rem;
    padding: .625rem 1.375rem;
    background: var(--color-primary);
    color: #082121;
    border-radius: var(--radius-md, 8px);
    font-size: .9375rem;
    font-weight: 600;
    text-decoration: none;
    align-self: flex-start;
    transition: all .18s ease;

    &:hover {
      background: var(--color-secondary);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(45,212,191,.25);
    }
  }
}

// ── Transition animations ──────────────────────────────────────
.bc-modal-enter-active {
  transition: opacity .25s ease;
  .bc-cert-modal { transition: transform .28s cubic-bezier(.34, 1.3, .64, 1), opacity .25s ease; }
}

.bc-modal-leave-active {
  transition: opacity .18s ease;
  .bc-cert-modal { transition: transform .18s ease-in, opacity .18s ease; }
}

.bc-modal-enter-from {
  opacity: 0;
  .bc-cert-modal { transform: scale(.92) translateY(18px); opacity: 0; }
}

.bc-modal-leave-to {
  opacity: 0;
  .bc-cert-modal { transform: scale(.96) translateY(-8px); opacity: 0; }
}
</style>