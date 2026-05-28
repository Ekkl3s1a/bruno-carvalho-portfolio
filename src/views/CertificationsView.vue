<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Award, ExternalLink, X, Calendar, Building2 } from 'lucide-vue-next'
import { useCertificationsStore } from '@/stores/certifications'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SkillTag from '@/components/shared/SkillTag.vue'
import type { Certification } from '@/types'

const certStore = useCertificationsStore()

// ── Modal ─────────────────────────────────────────────────────
const selected = ref<Certification | null>(null)
const modalEl  = ref<HTMLElement>()

function open(cert: Certification) {
  selected.value = cert
  document.body.style.overflow = 'hidden'
  // Foca o modal depois do DOM actualizar
  setTimeout(() => modalEl.value?.focus(), 50)
}

function close() {
  selected.value = null
  document.body.style.overflow = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// ── Helpers ───────────────────────────────────────────────────
function formatDate(date: string) {
  const [year, month] = date.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+month - 1]} ${year}`
}
</script>

<template>
  <div class="certs-page">
    <div class="certs-page__container">

      <ScrollReveal>
        <SectionTitle
          title="Certifications"
          subtitle="A chronological record of my professional development."
        />
      </ScrollReveal>

      <!-- Timeline completa -->
      <div class="timeline">
        <ScrollReveal
          v-for="(cert, i) in certStore.certifications"
          :key="cert.id"
          :delay="i * 80"
        >
          <div class="timeline__item">

            <!-- Dot + linha vertical -->
            <div class="timeline__aside" aria-hidden="true">
              <div class="timeline__dot">
                <Award :size="13" />
              </div>
              <div
                v-if="i < certStore.certifications.length - 1"
                class="timeline__line"
              />
            </div>

            <!-- Card clicável -->
            <button
              class="timeline__card"
              :aria-label="`View details for ${cert.title}`"
              @click="open(cert)"
            >
              <div class="timeline__card-header">
                <div class="timeline__card-info">
                  <h3 class="timeline__card-title">{{ cert.title }}</h3>
                  <span class="timeline__card-issuer">
                    <Building2 :size="12" aria-hidden="true" />
                    {{ cert.issuer }}
                  </span>
                </div>
                <time
                  class="timeline__card-date"
                  :datetime="cert.date"
                >
                  <Calendar :size="12" aria-hidden="true" />
                  {{ formatDate(cert.date) }}
                </time>
              </div>

              <div class="timeline__card-skills">
                <SkillTag
                  v-for="skill in cert.skills"
                  :key="skill"
                  :label="skill"
                />
              </div>

              <span class="timeline__card-hint" aria-hidden="true">
                Click for details
              </span>
            </button>

          </div>
        </ScrollReveal>
      </div>
    </div>

    <!-- ── Modal ── Teleport escapa o stacking context ─────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selected"
          class="modal-overlay"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`modal-title-${selected.id}`"
          @click.self="close"
        >
          <div
            ref="modalEl"
            class="modal"
            tabindex="-1"
          >
            <!-- Close -->
            <button
              class="modal__close"
              aria-label="Close modal"
              @click="close"
            >
              <X :size="18" aria-hidden="true" />
            </button>

            <!-- Icon -->
            <div class="modal__icon" aria-hidden="true">
              <Award :size="26" />
            </div>

            <!-- Content -->
            <h2 :id="`modal-title-${selected.id}`" class="modal__title">
              {{ selected.title }}
            </h2>

            <div class="modal__meta">
              <span class="modal__issuer">
                <Building2 :size="14" aria-hidden="true" />
                {{ selected.issuer }}
              </span>
              <span class="modal__date">
                <Calendar :size="14" aria-hidden="true" />
                {{ formatDate(selected.date) }}
              </span>
            </div>

            <!-- Skills -->
            <div class="modal__skills">
              <p class="modal__skills-label">Skills covered</p>
              <div class="modal__skills-list">
                <SkillTag
                  v-for="skill in selected.skills"
                  :key="skill"
                  :label="skill"
                  variant="primary"
                />
              </div>
            </div>

            <!-- Credential link -->
            <a
              v-if="selected.credentialUrl && selected.credentialUrl !== '#'"
              :href="selected.credentialUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="modal__cta"
            >
              <ExternalLink :size="16" aria-hidden="true" />
              View credential
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

// ── Page ──────────────────────────────────────────────────────

.certs-page {
  padding-top: calc(var(--header-height) + 3.5rem);
  padding-bottom: 5rem;

  &__container {
    @include container;
    max-width: 780px;
  }
}

// ── Timeline ──────────────────────────────────────────────────

.timeline {
  display: flex;
  flex-direction: column;

  &__item {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 0 1.25rem;
  }

  // Coluna esquerda
  &__aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.9rem;
  }

  &__dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(45, 212, 191, 0.10);
    border: 2px solid var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    flex-shrink: 0;
    z-index: 1;
    transition: background var(--transition-base);

    .timeline__item:has(.timeline__card:hover) & {
      background: rgba(45, 212, 191, 0.22);
    }
  }

  &__line {
    flex: 1;
    width: 2px;
    background: var(--color-border);
    margin-block: 6px;
    min-height: 1.5rem;
  }

  // Card (button reset)
  &__card {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.125rem 1.375rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: left;
    cursor: pointer;
    width: 100%;
    font-family: var(--font-sans);
    position: relative;
    transition:
      border-color var(--transition-base),
      transform var(--transition-base),
      box-shadow var(--transition-base);

    &:hover {
      border-color: var(--color-primary);
      transform: translateX(4px);
      box-shadow: var(--shadow-glow);
    }

    &-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    &-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 0.25rem;
    }

    &-issuer {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      color: var(--color-primary);
    }

    &-date {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--color-text-muted);
      white-space: nowrap;
      flex-shrink: 0;
    }

    &-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    // Hint subtil — só aparece no hover
    &-hint {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      font-family: var(--font-mono);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    &:hover &-hint { opacity: 1; }
  }
}

// ── Modal ─────────────────────────────────────────────────────

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  position: relative;
  outline: none; // tabindex="-1", foco gerido pelo JS

  &__close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--transition-base);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  &__icon {
    width: 52px;
    height: 52px;
    border-radius: var(--radius-lg);
    background: rgba(45, 212, 191, 0.12);
    border: 1px solid rgba(45, 212, 191, 0.25);
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.125rem;
  }

  &__title {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 0.75rem;
    padding-right: 2rem; // espaço para o botão close
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__issuer,
  &__date {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-family: var(--font-mono);
  }

  &__issuer { color: var(--color-primary); }
  &__date   { color: var(--color-text-muted); }

  &__skills {
    margin-bottom: 1.75rem;

    &-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 0.625rem;
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius-md);
    text-decoration: none;
    transition: background var(--transition-base);

    &:hover { background: rgba(45, 212, 191, 0.08); }
  }
}

// ── Modal transitions ─────────────────────────────────────────

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;

  .modal {
    transition: transform 0.22s ease, opacity 0.22s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal {
    transform: scale(0.95) translateY(12px);
    opacity: 0;
  }
}
</style>