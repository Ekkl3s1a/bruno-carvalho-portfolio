<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface WakaLang { name: string; percent: number; color: string }
interface WakaStats {
  dailyAvg:  string
  thisWeek:  string
  topLangs:  WakaLang[]
  lastUpdate: string
}

const stats   = ref<WakaStats | null>(null)
const loading = ref(true)
const error   = ref(false)

const API_KEY = import.meta.env.VITE_WAKATIME_API_KEY as string | undefined

// Maps WakaTime language names → brand colors
const langColors: Record<string, string> = {
  'TypeScript': '#3178C6',
  'JavaScript': '#F7DF1E',
  'Vue.js':     '#42d392',
  'Python':     '#3776AB',
  'SCSS':       '#CF649A',
  'HTML':       '#E34F26',
  'CSS':        '#1572B6',
  'Markdown':   '#aaaaaa',
  'JSON':       '#FBBF24',
  'Shell':      '#34D399',
}

function getColor(name: string): string {
  return langColors[name] ?? 'rgba(45,212,191,.5)'
}

async function fetchStats() {
  if (!API_KEY) { loading.value = false; return }

  try {
    const res = await fetch(
      `https://wakatime.com/api/v1/users/current/stats/last_7_days?api_key=${API_KEY}`
    )
    if (!res.ok) throw new Error('WakaTime API error')

    const { data } = await res.json()

    stats.value = {
      dailyAvg:  data.human_readable_daily_average_including_other_language ?? '—',
      thisWeek:  data.human_readable_total_including_other_language ?? '—',
      topLangs:  (data.languages ?? [])
        .slice(0, 5)
        .map((l: any) => ({
          name:    l.name,
          percent: Math.round(l.percent),
          color:   getColor(l.name),
        })),
      lastUpdate: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

<template>
  <div class="waka" aria-label="WakaTime coding stats">

    <!-- No API key → show badge -->
    <template v-if="!API_KEY">
      <div class="waka__no-key">
        <span class="waka__label">Coding activity</span>
        <a
          href="https://wakatime.com/@Ekkl3s1a"
          target="_blank" rel="noopener noreferrer"
          class="waka__badge-link"
          aria-label="View WakaTime profile"
        >
          <img
            src="https://wakatime.com/badge/user/Ekkl3s1a.svg"
            alt="WakaTime coding activity"
            class="waka__badge"
          />
        </a>
      </div>
    </template>

    <!-- Loading -->
    <template v-else-if="loading">
      <div class="waka__skeleton">
        <div class="waka__sk-title" />
        <div class="waka__sk-bar" />
        <div class="waka__sk-bar waka__sk-bar--short" />
        <div class="waka__sk-bar" />
      </div>
    </template>

    <!-- Error -->
    <template v-else-if="error">
      <div class="waka__error">
        <span>⚠ WakaTime unavailable</span>
      </div>
    </template>

    <!-- Stats -->
    <template v-else-if="stats">
      <div class="waka__header">
        <span class="waka__label">Coding activity</span>
        <span class="waka__updated">last 7 days</span>
      </div>

      <div class="waka__time-row">
        <div class="waka__time-block">
          <span class="waka__time-val">{{ stats.thisWeek }}</span>
          <span class="waka__time-lbl">this week</span>
        </div>
        <div class="waka__sep" aria-hidden="true" />
        <div class="waka__time-block">
          <span class="waka__time-val">{{ stats.dailyAvg }}</span>
          <span class="waka__time-lbl">daily avg</span>
        </div>
      </div>

      <!-- Language bars -->
      <div class="waka__langs" role="list">
        <div
          v-for="lang in stats.topLangs"
          :key="lang.name"
          class="waka__lang"
          role="listitem"
        >
          <div class="waka__lang-meta">
            <span class="waka__lang-name" :style="{ color: lang.color }">{{ lang.name }}</span>
            <span class="waka__lang-pct">{{ lang.percent }}%</span>
          </div>
          <div class="waka__lang-track" aria-hidden="true">
            <div
              class="waka__lang-fill"
              :style="{ width: lang.percent + '%', background: lang.color }"
            />
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<style lang="scss" scoped>
.waka {
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(14px);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 260px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__label {
    font-family: var(--font-mono);
    font-size: .72rem;
    text-transform: uppercase;
    letter-spacing: .1em;
    color: var(--color-primary);
  }

  &__updated {
    font-family: var(--font-mono);
    font-size: .68rem;
    color: var(--color-text-muted);
    opacity: .6;
  }

  &__time-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__time-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__time-val {
    font-family: var(--font-mono);
    font-size: .9375rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__time-lbl {
    font-family: var(--font-mono);
    font-size: .7rem;
    color: var(--color-text-muted);
  }

  &__sep {
    width: 1px;
    height: 28px;
    background: var(--color-glass-border);
  }

  &__langs {
    display: flex;
    flex-direction: column;
    gap: .625rem;
  }

  &__lang-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  &__lang-name {
    font-family: var(--font-mono);
    font-size: .78rem;
    font-weight: 500;
  }

  &__lang-pct {
    font-family: var(--font-mono);
    font-size: .73rem;
    color: var(--color-text-muted);
  }

  &__lang-track {
    height: 4px;
    background: rgba(45,212,191,.1);
    border-radius: 2px;
    overflow: hidden;
  }

  &__lang-fill {
    height: 100%;
    border-radius: 2px;
    opacity: .75;
    transition: width .6s ease;
  }

  // Skeleton
  @keyframes shimmer {
    0%   { background-position: -300px 0; }
    100% { background-position:  300px 0; }
  }

  %sk {
    border-radius: 4px;
    background: linear-gradient(90deg, var(--color-surface) 25%, rgba(45,212,191,.06) 50%, var(--color-surface) 75%);
    background-size: 600px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
  }

  &__skeleton { display: flex; flex-direction: column; gap: .75rem; }
  &__sk-title { @extend %sk; height: 12px; width: 50%; }
  &__sk-bar   { @extend %sk; height: 28px; width: 100%; }
  &__sk-bar--short { width: 70%; }

  // Error / no-key
  &__error, &__no-key {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  &__error {
    font-family: var(--font-mono);
    font-size: .8rem;
    color: rgba(251,113,133,.6);
  }

  &__badge-link { align-self: flex-start; }
  &__badge { max-width: 100%; border-radius: 4px; }
}
</style>