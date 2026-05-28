<script setup lang="ts">
import { onMounted } from 'vue'
import { ExternalLink, Star, GitFork, ArrowUpDown } from 'lucide-vue-next'
import { useGithubStore } from '@/stores/github'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SkillTag from '@/components/shared/SkillTag.vue'

const github = useGithubStore()

onMounted(() => github.fetchRepos())
</script>

<template>
  <div class="projects-page">
    <div class="projects-page__container">

      <!-- Header -->
      <ScrollReveal>
        <SectionTitle
          title="All Projects"
          subtitle="Every public repository — filtered and sorted as you like."
        />
      </ScrollReveal>

      <!-- Stats bar -->
      <ScrollReveal :delay="60">
        <div class="projects-page__stats" aria-label="Repository statistics">
          <div class="projects-page__stat">
            <span class="projects-page__stat-value">
              {{ github.loading ? '—' : github.stats.totalRepos }}
            </span>
            <span class="projects-page__stat-label">Repos</span>
          </div>
          <div class="projects-page__stat-divider" aria-hidden="true" />
          <div class="projects-page__stat">
            <span class="projects-page__stat-value">
              {{ github.loading ? '—' : github.stats.languages }}
            </span>
            <span class="projects-page__stat-label">Languages</span>
          </div>
          <div class="projects-page__stat-divider" aria-hidden="true" />
          <div class="projects-page__stat">
            <span class="projects-page__stat-value">
              {{ github.loading ? '—' : github.stats.totalStars }}
            </span>
            <span class="projects-page__stat-label">Stars</span>
          </div>
        </div>
      </ScrollReveal>

      <!-- Toolbar: filtros + sort -->
      <ScrollReveal :delay="80">
        <div class="projects-page__toolbar">

          <!-- Language filters -->
          <div class="projects-page__filters" role="group" aria-label="Filter by language">
            <button
              class="projects-page__filter"
              :class="{ 'projects-page__filter--active': github.activeFilter === 'all' }"
              @click="github.setFilter('all')"
            >
              All
            </button>
            <button
              v-for="lang in github.languages"
              :key="lang"
              class="projects-page__filter"
              :class="{ 'projects-page__filter--active': github.activeFilter === lang }"
              @click="github.setFilter(lang)"
            >
              {{ lang }}
            </button>
          </div>

          <!-- Sort toggle -->
          <button
            class="projects-page__sort"
            :title="`Sorted by ${github.sortBy === 'updated' ? 'most recent' : 'most stars'}`"
            @click="github.setSortBy(github.sortBy === 'updated' ? 'stars' : 'updated')"
          >
            <ArrowUpDown :size="14" aria-hidden="true" />
            {{ github.sortBy === 'updated' ? 'Recent' : 'Stars' }}
          </button>
        </div>
      </ScrollReveal>

      <!-- Skeleton -->
      <div v-if="github.loading" class="projects-page__grid">
        <div v-for="n in 9" :key="n" class="project-skeleton">
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
      <p v-else-if="github.error" class="projects-page__error">
        {{ github.error }}
      </p>

      <!-- Empty state -->
      <div
        v-else-if="!github.filteredRepos.length"
        class="projects-page__empty"
      >
        <span class="projects-page__empty-icon" aria-hidden="true">🔍</span>
        <p>No repositories found for <strong>{{ github.activeFilter }}</strong>.</p>
        <button
          class="projects-page__empty-reset"
          @click="github.setFilter('all')"
        >
          Clear filter
        </button>
      </div>

      <!-- Grid -->
      <div v-else class="projects-page__grid">
        <ScrollReveal
          v-for="(repo, i) in github.filteredRepos"
          :key="repo.id"
          :delay="(i % 9) * 40"
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
                :size="13"
                class="project-card__external"
                aria-hidden="true"
              />
            </div>

            <p class="project-card__desc">
              {{ repo.description || 'No description provided.' }}
            </p>

            <!-- Live demo link se disponível -->
            <a
              v-if="repo.homepage"
              :href="repo.homepage"
              target="_blank"
              rel="noopener noreferrer"
              class="project-card__demo"
              :aria-label="`Live demo for ${repo.name}`"
              @click.stop.prevent="window.open(repo.homepage, '_blank')"
            >
              ↗ Live demo
            </a>

            <div class="project-card__footer">
              <SkillTag
                v-if="repo.language"
                :label="repo.language"
                variant="primary"
              />
              <div class="project-card__meta">
                <span v-if="repo.stargazers_count" class="project-card__stat">
                  <Star :size="11" aria-hidden="true" />
                  {{ repo.stargazers_count }}
                </span>
                <span v-if="repo.forks_count" class="project-card__stat">
                  <GitFork :size="11" aria-hidden="true" />
                  {{ repo.forks_count }}
                </span>
              </div>
            </div>
          </a>
        </ScrollReveal>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.projects-page {
  padding-top: calc(var(--header-height) + 3.5rem);
  padding-bottom: 5rem;

  &__container { @include container; }

  // ── Stats bar ──────────────────────────────────────────────
  &__stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1rem 1.5rem;
    margin-bottom: 1.75rem;
    width: fit-content;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    text-align: center;

    &-value {
      font-family: var(--font-mono);
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1;
    }

    &-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    &-divider {
      width: 1px;
      height: 32px;
      background: var(--color-border);
    }
  }

  // ── Toolbar ───────────────────────────────────────────────
  &__toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  &__filter {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-pill);
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    &--active {
      background: rgba(45, 212, 191, 0.10);
      border-color: var(--color-primary);
      color: var(--color-primary);
      font-weight: 500;
    }
  }

  &__sort {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 500;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    border: 1px solid var(--color-border);
    background: transparent;
    padding: 0.375rem 0.875rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    white-space: nowrap;

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }

  // ── Grid ──────────────────────────────────────────────────
  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @include respond-to('md') { grid-template-columns: repeat(2, 1fr); }
    @include respond-to('lg') { grid-template-columns: repeat(3, 1fr); }
  }

  // ── States ────────────────────────────────────────────────
  &__error {
    text-align: center;
    padding: 3rem;
    color: var(--color-error);
  }

  &__empty {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-muted);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    &-icon { font-size: 2.5rem; }

    strong { color: var(--color-text); }

    &-reset {
      font-size: 0.875rem;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      background: transparent;
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background var(--transition-base);
      margin-top: 0.5rem;

      &:hover { background: rgba(45, 212, 191, 0.08); }
    }
  }
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
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
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
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__demo {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--color-secondary);
    text-decoration: none;
    transition: color var(--transition-base);

    &:hover { color: var(--color-primary); }
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
    gap: 0.625rem;
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

// ── Skeleton ──────────────────────────────────────────────────

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

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(45, 212, 191, 0.07),
        transparent
      );
      animation: shimmer 1.6s ease-in-out infinite;
    }

    &--title { height: 16px; width: 65%; }
    &--short { width: 40%; }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }

  &__tag  { height: 22px; width: 56px; border-radius: var(--radius-pill); background: var(--color-surface); }
  &__stat { height: 14px; width: 36px; border-radius: var(--radius-sm);   background: var(--color-surface); }
}
</style>