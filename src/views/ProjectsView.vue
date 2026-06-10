<script setup lang="ts">
import { computed } from 'vue'
import { useGithubStore } from '@/stores/github'
import ScrollReveal       from '@/components/shared/ScrollReveal.vue'

const github = useGithubStore()
github.fetchRepos()

// Guard: alguns stores expõem 'filter', outros 'activeFilter'
// Usa o que existir no teu store
const activeFilter = computed(() => github.activeFilter ?? '')
const activeSortBy = computed(() => github.sortBy)
const languages    = computed(() => ['All', ...github.languages])

const resultCount  = computed(() => github.filteredRepos.length)
const totalCount   = computed(() => github.repos.length)
const isFiltered   = computed(() => activeFilter.value !== '')
</script>

<template>
  <div class="projects-view">
    <div class="projects-view__container">

      <ScrollReveal>
        <header class="projects-view__header">
          <div class="projects-view__heading-row">
            <h1 class="projects-view__title">Projects</h1>
            <span class="projects-view__count" aria-live="polite">
              {{ isFiltered ? `${resultCount} / ${totalCount}` : totalCount }}
            </span>
          </div>
          <p class="projects-view__sub">
            Public repositories on GitHub.
            <a
              href="https://github.com/Ekkl3s1a"
              target="_blank" rel="noopener noreferrer"
              class="projects-view__gh-link"
            >View profile ↗</a>
          </p>
        </header>
      </ScrollReveal>

      <!-- Filters -->
      <div class="projects-view__filters">
        <div class="filter-group">
          <span class="filter-group__label">Language</span>
          <div class="filter-group__pills" role="group" aria-label="Filter by language">
            <button
              v-for="lang in languages"
              :key="lang"
              class="filter-pill"
              :class="{ 'filter-pill--active': activeFilter === (lang === 'All' ? '' : lang) }"
              @click="github.setFilter(lang === 'All' ? '' : lang)"
            >{{ lang }}</button>
          </div>
        </div>

        <div class="filter-group filter-group--sort">
          <span class="filter-group__label">Sort</span>
          <div class="filter-group__pills" role="group" aria-label="Sort order">
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

        <!-- Active filter badge -->
        <Transition name="badge-fade">
          <div v-if="isFiltered" class="filter-active-badge">
            <span>{{ activeFilter }}</span>
            <button
              class="filter-active-badge__clear"
              aria-label="Clear language filter"
              @click="github.setFilter('')"
            >×</button>
          </div>
        </Transition>
      </div>

      <!-- Skeleton loaders -->
      <div v-if="github.loading" class="projects-view__grid" aria-busy="true" aria-label="Loading repositories">
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
          :delay="(i % 3) * 55"
        >
          <a
            :href="repo.html_url"
            target="_blank" rel="noopener noreferrer"
            class="project-card"
          >
            <div class="project-card__top">
              <span class="project-card__name">{{ repo.name }}</span>
              <svg class="project-card__ext" xmlns="http://www.w3.org/2000/svg"
                width="12" height="12" viewBox="0 0 24 24" fill="none"
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
        <div v-if="!github.loading && !github.filteredRepos.length && isFiltered" class="projects-view__empty">
          <div class="projects-view__empty-icon">🔍</div>
          <p>No repos in <strong>{{ activeFilter }}</strong>.</p>
          <button class="projects-view__empty-btn" @click="github.setFilter('')">
            Clear filter
          </button>
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
    height: 32px;
    padding: 0 .75rem;
    background: rgba(45,212,191,.1);
    border: 1px solid rgba(45,212,191,.25);
    border-radius: var(--radius-pill);
    font-family: var(--font-mono);
    font-size: .875rem;
    font-weight: 600;
    color: var(--color-primary);
    transition: all .2s ease;
  }

  &__sub {
    margin-top: .5rem;
    color: var(--color-text-muted);
    font-size: .9375rem;
    display: flex;
    align-items: center;
    gap: .625rem;
  }

  &__gh-link {
    color: var(--color-primary);
    font-size: .875rem;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .875rem;
    padding: 4rem 2rem;
    text-align: center;
    color: var(--color-text-muted);

    strong { color: var(--color-primary); }
  }

  &__empty-icon { font-size: 2rem; }

  &__empty-btn {
    font-family: var(--font-mono);
    font-size: .875rem;
    color: var(--color-primary);
    background: none;
    border: 1px solid rgba(45,212,191,.3);
    border-radius: var(--radius-pill);
    padding: .375rem 1rem;
    cursor: pointer;
    transition: all var(--transition-base);
    &:hover { background: rgba(45,212,191,.08); border-color: var(--color-primary); }
  }
}

// ── Filter row ─────────────────────────────────────────────────
.filter-group {
  display: flex;
  align-items: center;
  gap: .5rem;

  &--sort { margin-left: auto; }

  &__label {
    font-size: .72rem;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: .09em;
    white-space: nowrap;
  }

  &__pills { display: flex; flex-wrap: wrap; gap: .35rem; }
}

.filter-pill {
  font-size: .8rem;
  font-family: var(--font-mono);
  padding: .3rem .8rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all .15s ease;
  white-space: nowrap;

  &:hover { border-color: var(--color-primary); color: var(--color-primary); }

  &--active {
    background: rgba(45,212,191,.1);
    border-color: var(--color-primary);
    color: var(--color-primary);
    font-weight: 500;
  }
}

.filter-active-badge {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  font-family: var(--font-mono);
  font-size: .78rem;
  padding: .25rem .5rem .25rem .875rem;
  background: rgba(45,212,191,.12);
  border: 1px solid rgba(45,212,191,.3);
  border-radius: var(--radius-pill);
  color: var(--color-primary);

  &__clear {
    width: 18px; height: 18px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(45,212,191,.15);
    border: none;
    border-radius: 50%;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    transition: background .15s;
    &:hover { background: rgba(45,212,191,.3); }
  }
}

// Fade for badge
.badge-fade-enter-active, .badge-fade-leave-active { transition: all .2s ease; }
.badge-fade-enter-from, .badge-fade-leave-to { opacity: 0; transform: scale(.88); }

// ── Skeleton ───────────────────────────────────────────────────
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

%shimmer {
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--color-surface)        25%,
    rgba(45,212,191,.07)        50%,
    var(--color-surface)        75%
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
  height: 148px;

  &__name  { @extend %shimmer; height: 15px; width: 62%; }
  &__desc  { @extend %shimmer; height: 11px; width: 100%; }
  &__desc--short { width: 74%; }
  &__foot  { display: flex; justify-content: space-between; margin-top: auto; }
  &__tag   { @extend %shimmer; height: 20px; width: 68px; border-radius: 20px; }
  &__stat  { @extend %shimmer; height: 13px; width: 36px; }
}

// ── Project cards ──────────────────────────────────────────────
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
    border-color: rgba(45,212,191,.38);
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0,0,0,.18), 0 0 0 1px rgba(45,212,191,.12);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
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
    gap: .5rem;
    padding-top: .5rem;
    border-top: 1px solid var(--color-glass-border);
    flex-wrap: wrap;
  }

  &__lang {
    font-family: var(--font-mono);
    font-size: .72rem;
    color: var(--color-primary);
    background: rgba(45,212,191,.08);
    border: 1px solid rgba(45,212,191,.16);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
  }

  &__stars {
    font-family: var(--font-mono);
    font-size: .72rem;
    color: #FBBF24;
  }

  &__updated {
    font-family: var(--font-mono);
    font-size: .7rem;
    color: var(--color-text-muted);
    margin-left: auto;
    opacity: .6;
  }
}
</style>