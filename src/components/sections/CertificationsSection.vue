<script setup lang="ts">
import { computed } from 'vue'
import { Award, ExternalLink, ArrowRight } from 'lucide-vue-next'
import { useCertificationsStore } from '@/stores/certifications'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import SkillTag from '@/components/shared/SkillTag.vue'

const certStore = useCertificationsStore()

// Preview: 3 mais recentes
const preview = computed(() => certStore.certifications.slice(0, 3))

function formatDate(date: string) {
  const [year, month] = date.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+month - 1]} ${year}`
}
</script>

<template>
  <section id="certifications" class="certs">
    <div class="certs__container">

      <ScrollReveal>
        <SectionTitle
          title="Certifications"
          subtitle="Continuous learning across frontend and backend technologies."
        />
      </ScrollReveal>

      <!-- Timeline -->
      <div class="certs__timeline">
        <ScrollReveal
          v-for="(cert, i) in preview"
          :key="cert.id"
          :delay="i * 90"
        >
          <div class="cert-item">
            <!-- Dot + linha vertical -->
            <div class="cert-item__aside" aria-hidden="true">
              <div class="cert-item__dot">
                <Award :size="12" />
              </div>
              <div v-if="i < preview.length - 1" class="cert-item__line" />
            </div>

            <!-- Card -->
            <div class="cert-item__card">
              <div class="cert-item__header">
                <div class="cert-item__info">
                  <h3 class="cert-item__title">{{ cert.title }}</h3>
                  <span class="cert-item__issuer">{{ cert.issuer }}</span>
                </div>
                <div class="cert-item__right">
                  <time class="cert-item__date" :datetime="cert.date">
                    {{ formatDate(cert.date) }}
                  </time>
                  <a
                    v-if="cert.credentialUrl && cert.credentialUrl !== '#'"
                    :href="cert.credentialUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="cert-item__link"
                    :aria-label="`View ${cert.title} credential`"
                  >
                    <ExternalLink :size="14" aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div class="cert-item__skills">
                <SkillTag
                  v-for="skill in cert.skills.slice(0, 4)"
                  :key="skill"
                  :label="skill"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <!-- CTA -->
      <ScrollReveal class="certs__cta">
        <BaseButton :to="'/certifications'" variant="outlined">
          <template #icon-right>
            <ArrowRight :size="16" aria-hidden="true" />
          </template>
          View all certifications
        </BaseButton>
      </ScrollReveal>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.certs {
  @include section-padding;

  &__container { @include container; }

  &__timeline {
    display: flex;
    flex-direction: column;
    margin-bottom: 2.5rem;
  }

  &__cta { text-align: center; }
}

// ── Cert item ─────────────────────────────────────────────────

.cert-item {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 0 1.25rem;
  position: relative;

  // ── Aside (dot + linha) ──
  &__aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0.875rem;
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

    .cert-item:hover & {
      background: rgba(45, 212, 191, 0.20);
    }
  }

  &__line {
    flex: 1;
    width: 2px;
    background: var(--color-border);
    margin-block: 6px;
    min-height: 1.5rem;
  }

  // ── Card ──
  &__card {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.125rem 1.375rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition:
      border-color var(--transition-base),
      transform var(--transition-base),
      box-shadow var(--transition-base);

    .cert-item:hover & {
      border-color: var(--color-primary);
      transform: translateX(4px);
      box-shadow: var(--shadow-glow);
    }
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 0.2rem;
  }

  &__issuer {
    font-size: 0.8125rem;
    color: var(--color-primary);
    display: block;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  &__date {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    transition: all var(--transition-base);

    &:hover {
      color: var(--color-primary);
      background: rgba(45, 212, 191, 0.10);
    }
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }
}
</style>