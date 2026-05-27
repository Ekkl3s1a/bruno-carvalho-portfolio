// ─────────────────────────────────────────────────────────────
// src/stores/github.ts
// Fetches public repos from GitHub API, exposes filters
// ─────────────────────────────────────────────────────────────

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GitHubRepo } from '@/types'

export const useGithubStore = defineStore('github', () => {
  const repos       = ref<GitHubRepo[]>([])
  const loading     = ref(false)
  const error       = ref<string | null>(null)
  const activeFilter = ref<string>('all')
  const sortBy      = ref<'updated' | 'stars'>('updated')

  const USERNAME = 'Ekkl3s1a'

  // Only non-fork, non-archived repos
  const publicRepos = computed(() =>
    repos.value.filter(r => !r.fork && !r.archived)
  )

  const filteredRepos = computed(() => {
    let result = publicRepos.value
    if (activeFilter.value !== 'all') {
      result = result.filter(
        r => r.language?.toLowerCase() === activeFilter.value.toLowerCase()
      )
    }
    if (sortBy.value === 'stars') {
      result = [...result].sort((a, b) => b.stargazers_count - a.stargazers_count)
    }
    return result
  })

  const languages = computed(() => {
    const langs = publicRepos.value
      .filter(r => r.language)
      .map(r => r.language!)
    return [...new Set(langs)].sort()
  })

  const stats = computed(() => ({
    totalRepos:  publicRepos.value.length,
    totalStars:  repos.value.reduce((s, r) => s + r.stargazers_count, 0),
    languages:   languages.value.length,
  }))

  async function fetchRepos() {
    if (repos.value.length) return   // cached
    loading.value = true
    error.value   = null
    try {
      const res = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=public`
      )
      if (!res.ok) throw new Error(`GitHub API error ${res.status}`)
      repos.value = await res.json()
    } catch {
      error.value = 'Failed to load projects. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  function setFilter(filter: string) { activeFilter.value = filter }
  function setSortBy(s: 'updated' | 'stars') { sortBy.value = s }

  return {
    repos, loading, error,
    filteredRepos, languages, stats, activeFilter, sortBy,
    fetchRepos, setFilter, setSortBy,
    USERNAME,
  }
})
