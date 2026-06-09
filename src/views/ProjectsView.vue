<script setup lang="ts">
import { computed } from 'vue'
import { useGithubStore } from '@/stores/github'
import ScrollReveal       from '@/components/shared/ScrollReveal.vue'

const github = useGithubStore()

// Garante fetch ao entrar na página
github.fetchRepos()

const activeFilter = computed(() => github.activeFilter)
const activeSortBy = computed(() => github.sortBy)

const languages = computed(() => ['All', ...github.languages])
</script>

<template>
  <div class="projects-view">
    <div class="projects-view__container">

      <ScrollReveal>
        <header class="projects-view__header">
          <h1 class="projects-view__title">Projects</h1>
          <p class="projects-view__sub">
            Public repositories on GitHub — {{ github.repos.length }} total.
          </p>
        </header>
      </ScrollReveal>

      <!-- Filters -->
      <div class="projects-view__filters">
        <div class="filter-group">
          <span class="filter-group__label">Language</span>
          <div class="filter-group__pills">
            <button
              v-for="lang in languages"
              :key="lang"
              class="filter-pill"
              :class="{ 'filter-pill--active': activeFilter === (lang === 'All' ? '' : lang) }"
              @click="github.setFilter(lang === 'All' ? '' : lang)"
            >
              {{ lang }}
            </button>
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-group__label">Sort by</span>
          <div class="filter-group__pills">
            <button
              class="filter-pill"
              :class="{ 'filter-pill--active': activeSortBy === 'updated' }"
              @click="github.setSortBy('updated')"
            >Recent</button>
            <button
              class="filter-pill"
              :class="{ 'filter-pill--active': activeSortBy === 'stars' }"
              @click="github.setSortBy('stars')"
            >Stars</button>
          </div>
        </div>
      </div>

      <!-- Skeleton loaders -->
      <div v-if="github.loading" class="projects-view__grid">
        <div v-for="n in 9" :key="n" class="project-skeleton">
          <div class="project-skeleton__name" />
          <div class="project-skeleton__desc" />
          <div class="project-skeleton__desc project-skeleton__desc--short" />
          <div class="project-skeleton__foot">
            <div class="project-skeleton__tag" />
            <div class="project-skeleton__stat" />
          </div>
        </div>
      </div>

      <!-- Repos grid -->
      <div v-else class="projects-view__grid">
        <ScrollReveal
          v-for="(repo, i) in github.filteredRepos"
          :key="repo.id"
          :delay="(i % 3) * 60"
        >
          <a
            :href="repo.html_url"
            target="_blank" rel="noopener noreferrer"
            class="project-card"
          >
            <div class="project-card__top">
              <span class="project-card__name">{{ repo.name }}</span>
              <svg class="project-card__ext" xmlns="http://www.w3.org/2000/svg"
                width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
            </div>
            <p class="project-card__desc">
              {{ repo.description || 'No description.' }}
            </p>
            <div class="project-card__foot">
              <span v-if="repo.language" class="project-card__lang">
                {{ repo.language }}
              </span>
              <span v-if="repo.stargazers_count" class="project-card__stars">
                ★ {{ repo.stargazers_count }}
              </span>
              <span class="project-card__updated">
                {{ new Date(repo.updated_at).toLocaleDateString('en', { month: 'short', year: 'numeric' }) }}
              </span>
            </div>
          </a>
        </ScrollReveal>

        <!-- Empty state -->
        <div v-if="!github.filteredRepos.length" class="projects-view__empty">
          No repos found for <strong>{{ activeFilter }}</strong>.
          <button @click="github.setFilter('')">Clear filter</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.projects-view {
  padding-top: 5rem;
  min-height: 100vh;

  &__container { @include container; }

  &__header { margin-bottom: 2.5rem; }

  &__title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -.025em;
    color: var(--color-text);
  }

  &__sub {
    margin-top: .5rem;
    color: var(--color-text-muted);
    font-size: .9375rem;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    padding-bottom: 4rem;
  }

  &__empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--color-text-muted);

    strong { color: var(--color-primary); }

    button {
      display: inline-block;
      margin-top: .75rem;
      font-size: .875rem;
      color: var(--color-primary);
      background: none;
      border: 1px solid rgba(45, 212, 191, .3);
      border-radius: var(--radius-pill);
      padding: .3rem .875rem;
      cursor: pointer;
      transition: all var(--transition-base);
      &:hover { background: rgba(45, 212, 191, .08); }
    }
  }
}

// ── Filter pills ──────────────────────────────────────────────
.filter-group {
  display: flex;
  align-items: center;
  gap: .625rem;

  &__label {
    font-size: .75rem;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: .08em;
    white-space: nowrap;
  }

  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: .375rem;
  }
}

.filter-pill {
  font-size: .8125rem;
  font-family: var(--font-mono);
  padding: .3rem .875rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;

  &:hover { border-color: var(--color-primary); color: var(--color-primary); }

  &--active {
    background: rgba(45, 212, 191, .1);
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-weight: 500;
  }
}

// ── Skeleton loader ───────────────────────────────────────────
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

%skeleton-line {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    rgba(45, 212, 191, .06) 50%,
    var(--color-surface) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

.project-skeleton {
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-xl);
  padding: 1.375rem;
  display: flex;
  flex-direction: column;
  gap: .75rem;

  &__name  { @extend %skeleton-line; height: 16px; width: 65%; }
  &__desc  { @extend %skeleton-line; height: 12px; width: 100%; }
  &__desc--short { width: 72%; }

  &__foot  {
    display: flex;
    justify-content: space-between;
    margin-top: .25rem;
  }
  &__tag   { @extend %skeleton-line; height: 20px; width: 72px; border-radius: 20px; }
  &__stat  { @extend %skeleton-line; height: 14px; width: 40px; }
}

// ── Project cards ─────────────────────────────────────────────
.project-card {
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(14px);
  padding: 1.375rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: .75rem;
  transition:
    border-color var(--transition-base),
    transform    var(--transition-base),
    box-shadow   var(--transition-base);

  &:hover {
    border-color: rgba(45, 212, 191, .38);
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, .18), 0 0 0 1px rgba(45, 212, 191, .12);
  }

  &__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: .5rem;
  }

  &__name {
    font-family: var(--font-mono);
    font-size: .875rem;
    font-weight: 600;
    color: var(--color-text);
    word-break: break-word;
  }

  &__ext {
    flex-shrink: 0;
    color: var(--color-text-muted);
    opacity: 0;
    transition: opacity var(--transition-base);
    margin-top: 2px;
  }
  &:hover &__ext { opacity: 1; }

  &__desc {
    font-size: .8125rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__foot {
    display: flex;
    align-items: center;
    gap: .625rem;
    padding-top: .5rem;
    border-top: 1px solid var(--color-glass-border);
    flex-wrap: wrap;
  }

  &__lang {
    font-family: var(--font-mono);
    font-size: .73rem;
    color: var(--color-primary);
    background: rgba(45, 212, 191, .08);
    border: 1px solid rgba(45, 212, 191, .16);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
  }

  &__stars {
    font-family: var(--font-mono);
    font-size: .73rem;
    color: #FBBF24;
  }

  &__updated {
    font-family: var(--font-mono);
    font-size: .7rem;
    color: var(--color-text-muted);
    margin-left: auto;
    opacity: .7;
  }
}
</style>