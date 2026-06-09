<script setup lang="ts">
import { ref } from 'vue'
import { useCertificationsStore }  from '@/stores/certifications'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'

const certs  = useCertificationsStore()
const active = ref<number | null>(null)

function open(id: number)  { active.value = id }
function close()           { active.value = null }

// Close on Escape
function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }
</script>

<template>
  <div class="certs-view" @keydown="onKey">
    <div class="certs-view__container">

      <ScrollReveal>
        <header class="certs-view__header">
          <h1 class="certs-view__title">Certifications</h1>
          <p  class="certs-view__sub">
            {{ certs.certifications.length }} certifications earned.
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
          <ScrollReveal :delay="i * 80">
            <div class="cert-timeline__connector" aria-hidden="true">
              <div class="cert-timeline__dot" />
              <div class="cert-timeline__line" />
            </div>

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
                <span
                  v-for="tag in cert.skills"
                  :key="tag"
                  class="cert-card__tag"
                >{{ tag }}</span>
              </div>
              <span class="cert-card__cta">View details →</span>
            </button>
          </ScrollReveal>
        </li>
      </ol>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="active"
          class="cert-modal-backdrop"
          role="dialog"
          aria-modal="true"
          :aria-label="certs.getById(active)?.title"
          @click.self="close"
        >
          <div class="cert-modal" v-if="certs.getById(active) as any">
            <button class="cert-modal__close" aria-label="Close" @click="close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>

            <div class="cert-modal__award" aria-hidden="true">🏆</div>
            <h2 class="cert-modal__title">{{ certs.getById(active)?.title }}</h2>
            <p  class="cert-modal__issuer">{{ certs.getById(active)?.issuer }}</p>
            <p  class="cert-modal__date">{{ certs.getById(active)?.date }}</p>

            <p v-if="certs.getById(active)?.description" class="cert-modal__desc">
              {{ certs.getById(active)?.description }}
            </p>

            <div class="cert-modal__tags">
              <span
                v-for="tag in certs.getById(active)?.skills"
                :key="tag"
                class="cert-card__tag"
              >{{ tag }}</span>
            </div>

            <a
              v-if="certs.getById(active)?.credentialUrl"
              :href="certs.getById(active)?.credentialUrl"
              target="_blank" rel="noopener noreferrer"
              class="cert-modal__link"
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

  &__container { @include container; max-width: 760px; }

  &__header  { margin-bottom: 3rem; }
  &__title   {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -.025em;
    color: var(--color-text);
  }
  &__sub     { margin-top: .5rem; color: var(--color-text-muted); }
}

// ── Timeline ──────────────────────────────────────────────────
.cert-timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-bottom: 4rem;

  &__item {
    display: grid;
    //grid-template-columns: 28px 1fr;
    gap: 0 1.25rem;
    margin-bottom: 0;
  }

  &__connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.25rem;
  }

  &__dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid var(--color-bg);
    box-shadow: 0 0 0 2px var(--color-primary);
    flex-shrink: 0;
    z-index: 1;
  }

  &__line {
    flex: 1;
    width: 1px;
    background: linear-gradient(
      to bottom,
      rgba(45, 212, 191, .4),
      rgba(45, 212, 191, .08)
    );
    min-height: 2rem;
    margin-top: 4px;
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
  cursor: pointer;
  margin-bottom: 1.25rem;
  transition:
    border-color var(--transition-base),
    transform    var(--transition-base),
    box-shadow   var(--transition-base);

  &:hover {
    border-color: rgba(45, 212, 191, .38);
    transform: translateX(4px);
    box-shadow: -4px 0 0 0 var(--color-primary), 0 4px 24px rgba(0, 0, 0, .12);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: .75rem;
  }

  &__date {
    font-family: var(--font-mono);
    font-size: .72rem;
    color: var(--color-primary);
    background: rgba(45, 212, 191, .08);
    border: 1px solid rgba(45, 212, 191, .16);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
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
    line-height: 1.3;
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
    background: rgba(45, 212, 191, .06);
    border: 1px solid rgba(45, 212, 191, .14);
    border-radius: var(--radius-pill);
    color: var(--color-primary);
    white-space: nowrap;
  }

  &__cta {
    font-size: .8125rem;
    color: var(--color-primary);
    opacity: 0;
    transition: opacity var(--transition-base);
    font-family: var(--font-mono);
  }
  &:hover &__cta { opacity: 1; }
}

// ── Modal ─────────────────────────────────────────────────────
.cert-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(4, 15, 15, .82);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.cert-modal {
  position: relative;
  background: var(--color-surface);
  border: 1px solid rgba(45, 212, 191, .2);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: .875rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, .5);

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
    transition: all var(--transition-base);
    &:hover { border-color: var(--color-primary); color: var(--color-primary); }
  }

  &__award { font-size: 2.5rem; line-height: 1; }
  &__title  { font-size: 1.25rem; font-weight: 700; color: var(--color-text); margin: 0; }
  &__issuer { font-size: .9375rem; color: var(--color-primary); margin: 0; }
  &__date   { font-family: var(--font-mono); font-size: .8rem; color: var(--color-text-muted); margin: 0; }
  &__desc   { font-size: .9375rem; color: var(--color-text-muted); line-height: 1.7; margin: 0; }

  &__tags { display: flex; flex-wrap: wrap; gap: .375rem; }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: .4rem;
    margin-top: .5rem;
    padding: .625rem 1.25rem;
    background: var(--color-primary);
    color: #082121;
    border-radius: var(--radius-md);
    font-size: .9rem;
    font-weight: 600;
    text-decoration: none;
    align-self: flex-start;
    transition: all var(--transition-base);
    &:hover { background: var(--color-secondary); transform: translateY(-1px); }
  }
}

// Modal transitions
.modal-enter-active { transition: all .25s cubic-bezier(.34, 1.2, .64, 1); }
.modal-leave-active { transition: all .18s ease-in; }
.modal-enter-from   { opacity: 0; .cert-modal { transform: scale(.92) translateY(16px); } }
.modal-leave-to     { opacity: 0; .cert-modal { transform: scale(.96) translateY(-8px); } }
</style>