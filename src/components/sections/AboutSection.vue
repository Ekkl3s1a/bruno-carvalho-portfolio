<script setup lang="ts">
import { onMounted } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
import { useGithubStore } from '@/stores/github'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'

const github = useGithubStore()

// Busca repos para ter as stats disponíveis
onMounted(() => github.fetchRepos())
</script>

<template>
  <section id="about" class="about">
    <div class="about__container">

      <ScrollReveal>
        <SectionTitle
          title="About Me"
          subtitle="Web developer who loves the frontend but isn't afraid of the backend."
        />
      </ScrollReveal>

      <div class="about__grid">

        <!-- Texto -->
        <ScrollReveal :delay="80">
          <div class="about__text">
            <p>
              I'm a web developer based in Portugal with a strong focus on the frontend.
              I build interfaces with <strong>Angular</strong>, <strong>Vue 3</strong>,
              and <strong>React</strong> — choosing the right tool for each project rather
              than sticking to just one framework.
            </p>
            <p>
              When the project needs it, I reach for the backend too.
              I'm comfortable with <strong>FastAPI</strong> and <strong>Express</strong>,
              and I enjoy the full picture from API design to polished UI.
            </p>
            <p>
              Outside of client work I contribute to open source and build developer tooling —
              most recently the
              <a
                href="https://marketplace.visualstudio.com/items?itemName=ekkl3s1a.ekkl3s1a-themes"
                target="_blank"
                rel="noopener noreferrer"
                class="about__link"
              >
                Teal Turquoise VS Code theme
                <ExternalLink :size="12" aria-hidden="true" />
              </a>,
              a dark theme designed to make long coding sessions easier on the eyes.
            </p>
          </div>
        </ScrollReveal>

        <!-- Stats -->
        <ScrollReveal :delay="180">
          <div class="about__stats">
            <div class="about__stat">
              <span class="about__stat-value">
                {{ github.loading ? '—' : `${github.stats.totalRepos}+` }}
              </span>
              <span class="about__stat-label">Public repos</span>
            </div>
            <div class="about__stat">
              <span class="about__stat-value">3</span>
              <span class="about__stat-label">JS Frameworks</span>
            </div>
            <div class="about__stat">
              <span class="about__stat-value">
                {{ github.loading ? '—' : github.stats.languages }}
              </span>
              <span class="about__stat-label">Languages used</span>
            </div>
            <div class="about__stat">
              <span class="about__stat-value">
                {{ github.loading ? '—' : github.stats.totalStars }}
              </span>
              <span class="about__stat-label">GitHub stars</span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.about {
  @include section-padding;
  background: var(--color-surface);

  &__container { @include container; }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;

    @include respond-to('lg') {
      grid-template-columns: 3fr 2fr;
      align-items: start;
      gap: 4rem;
    }
  }

  // ── Texto ──────────────────────────────────────────────────
  &__text {
    font-size: 1.0625rem;
    color: var(--color-text-muted);
    line-height: 1.85;

    p + p { margin-top: 1.25rem; }

    strong {
      color: var(--color-text);
      font-weight: 600;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--color-primary);
    text-decoration: underline;
    text-decoration-color: rgba(45, 212, 191, 0.40);
    transition: text-decoration-color var(--transition-base);

    &:hover { text-decoration-color: var(--color-primary); }
  }

  // ── Stats ──────────────────────────────────────────────────
  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  &__stat {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.125rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    transition: border-color var(--transition-base), transform var(--transition-base);

    &:hover {
      border-color: var(--color-primary);
      transform: translateY(-2px);
    }
  }

  &__stat-value {
    font-size: 2rem;
    font-weight: 700;
    font-family: var(--font-mono);
    color: var(--color-primary);
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }
}
</style>