<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ExternalLink, Star, GitFork, Github } from 'lucide-vue-next'
import { useGithubStore } from '@/stores/github'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import SkillTag from '@/components/shared/SkillTag.vue'

const github = useGithubStore()

onMounted(() => github.fetchRepos())

// 6 repos mais recentes para o preview
const preview = computed(() => github.filteredRepos.slice(0, 6))
</script>

<template>
  <section id="projects" class="projects">
    <div class="projects__container">

      <ScrollReveal>
        <SectionTitle
          title="Featured Projects"
          subtitle="A selection of my public repositories on GitHub."
        />
      </ScrollReveal>

      <!-- Skeleton -->
      <div v-if="github.loading" class="projects__grid">
        <div v-for="n in 6" :key="n" class="project-skeleton">
          <div class="project-skeleton__line project-skeleton__line--title" />
          <div class="project-skeleton__line" />
          <div class="project-skeleton__line project-skeleton__line--short" />
          <div class="project-skeleton__footer">
            <div class="project-skeleton__tag" />
            <div class="project-skeleton__stat" />
          </div>
        </div>
      </div>

      <!-- Erro -->
      <div v-else-if="github.error" class="projects__error">
        <p>{{ github.error }}</p>
      </div>

      <!-- Cards -->
      <div v-else class="projects__grid">
        <ScrollReveal
          v-for="(repo, i) in preview"
          :key="repo.id"
          :delay="i * 60"
        >
          <a
            :href="repo.html_url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-card"
          >
            <div class="project-card__top">
              <h3 class="project-card__name">{{ repo.name }}</h3>
              <ExternalLink
                :size="14"
                class="project-card__external"
                aria-hidden="true"
              />
            </div>

            <p class="project-card__desc">
              {{ repo.description || 'No description provided.' }}
            </p>

            <div class="project-card__footer">
              <SkillTag
                v-if="repo.language"
                :label="repo.language"
                variant="primary"
              />
              <div class="project-card__meta">
                <span v-if="repo.stargazers_count" class="project-card__stat">
                  <Star :size="12" aria-hidden="true" />
                  {{ repo.stargazers_count }}
                </span>
                <span v-if="repo.forks_count" class="project-card__stat">
                  <GitFork :size="12" aria-hidden="true" />
                  {{ repo.forks_count }}
                </span>
              </div>
            </div>
          </a>
        </ScrollReveal>
      </div>

      <!-- CTA -->
      <ScrollReveal class="projects__cta">
        <BaseButton :to="'/projects'" variant="outlined">
          <template #icon-left>
            <Github :size="16" aria-hidden="true" />
          </template>
          View all projects
        </BaseButton>
      </ScrollReveal>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.projects {
  @include section-padding;
  background: var(--color-surface);

  &__container { @include container; }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2.5rem;

    @include respond-to('md') { grid-template-columns: repeat(2, 1fr); }
    @include respond-to('xl') { grid-template-columns: repeat(3, 1fr); }
  }

  &__error {
    text-align: center;
    padding: 3rem;
    color: var(--color-error);
    margin-bottom: 2rem;
  }

  &__cta { text-align: center; }
}

// ── Project card ──────────────────────────────────────────────

.project-card {
  @include card;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1.375rem;
  text-decoration: none;
  height: 100%;

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__name {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text);
    // Evita overflow em nomes longos
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__external {
    color: var(--color-text-muted);
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity var(--transition-base), transform var(--transition-base);
  }

  &:hover &__external {
    opacity: 1;
    transform: translateX(0);
  }

  &__desc {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    line-height: 1.65;
    flex: 1;
    margin: 0;
    // Clamp a 3 linhas
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: auto;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }

  &__meta {
    display: flex;
    gap: 0.75rem;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
}

// ── Skeleton loader ───────────────────────────────────────────

.project-skeleton {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.375rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__line {
    height: 12px;
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    position: relative;
    overflow: hidden;

    // Shimmer effect
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(45, 212, 191, 0.07) 50%,
        transparent 100%
      );
      animation: shimmer 1.6s ease-in-out infinite;
    }

    &--title { height: 16px; width: 65%; }
    &--short { width: 40%; }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }

  &__tag  { height: 22px; width: 60px;  border-radius: var(--radius-pill); background: var(--color-surface); }
  &__stat { height: 14px; width: 40px;  border-radius: var(--radius-sm);   background: var(--color-surface); }
}
</style>