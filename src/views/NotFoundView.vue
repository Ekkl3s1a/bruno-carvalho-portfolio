<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route  = useRoute()
</script>

<template>
  <div class="nf">
    <div class="nf__window">

      <!-- Titlebar -->
      <div class="nf__titlebar">
        <div class="nf__dots">
          <span style="background:#FF5F57" />
          <span style="background:#FEBC2E" />
          <span style="background:#28C840" />
        </div>
        <span class="nf__tab">⚠ 404.ts — not found</span>
      </div>

      <!-- Editor -->
      <div class="nf__editor">
        <ol class="nf__gutter" aria-hidden="true">
          <li v-for="n in 14" :key="n">{{ n }}</li>
        </ol>

        <div class="nf__code" aria-label="404 error as code">
          <p><span class="k">import</span> <span class="t">{ redirect }</span> <span class="k">from</span> <span class="s">'@/router'</span></p>
          <p>&nbsp;</p>
          <p><span class="k">interface</span> <span class="t">NotFoundError</span> <span class="o">{</span></p>
          <p>&nbsp;&nbsp;<span class="v">status</span><span class="o">:</span> <span class="t">404</span></p>
          <p>&nbsp;&nbsp;<span class="v">path</span><span class="o">:</span> <span class="t">string</span></p>
          <p><span class="o">}</span></p>
          <p>&nbsp;</p>
          <p><span class="k">const</span> <span class="v">error</span><span class="o">:</span> <span class="t">NotFoundError</span> <span class="o">=</span> <span class="o">{</span></p>
          <p>&nbsp;&nbsp;<span class="v">status</span><span class="o">:</span> <span class="n">404</span><span class="o">,</span></p>
          <p>&nbsp;&nbsp;<span class="v">path</span><span class="o">:</span> <span class="s">'{{ route.path }}'</span><span class="o">,</span></p>
          <p><span class="o">}</span></p>
          <p>&nbsp;</p>
          <p class="nf__err-line">
            <span class="nf__err-icon" aria-hidden="true">✖</span>
            <span>Cannot resolve path <span class="s">'{{ route.path }}'</span></span>
          </p>
          <p class="nf__warn-line">
            <span class="nf__warn-icon" aria-hidden="true">⚠</span>
            <span>Did you mean <span class="s">'/'</span> ?</span>
          </p>
        </div>
      </div>

      <!-- Status bar -->
      <div class="nf__statusbar">
        <span>⎇ main · ✖ 1 error · TypeScript</span>
        <span>404 Not Found</span>
      </div>

    </div>

    <!-- Actions below the window -->
    <div class="nf__actions">
      <button class="nf__btn nf__btn--primary" @click="router.push('/')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Back to home
      </button>
      <button class="nf__btn" @click="router.back()">
        ← Go back
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.nf {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;

  &__window {
    width: min(680px, 100%);
    background: rgba(8,33,33,.95);
    border: 1px solid rgba(45,212,191,.15);
    border-radius: 12px;
    overflow: hidden;
    box-shadow:
      0 32px 80px rgba(0,0,0,.5),
      0 0 0 1px rgba(45,212,191,.08);
    animation: nf-in .5s cubic-bezier(.34,1.2,.64,1) both;
  }

  &__titlebar {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 36px;
    background: rgba(13,46,44,.97);
    border-bottom: 1px solid rgba(45,212,191,.1);
    padding: 0 14px;
  }

  &__dots {
    display: flex;
    gap: 6px;

    span {
      width: 12px; height: 12px;
      border-radius: 50%;
      display: block;
    }
  }

  &__tab {
    font-family: var(--font-mono);
    font-size: 12px;
    color: rgba(45,212,191,.55);
  }

  &__editor {
    display: flex;
    padding: 1.5rem 0;
  }

  &__gutter {
    list-style: none;
    padding: 0 10px 0 0;
    min-width: 40px;
    text-align: right;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 2;
    color: rgba(45,212,191,.15);
    user-select: none;
    flex-shrink: 0;
  }

  &__code {
    flex: 1;
    padding: 0 1.5rem 0 .5rem;
    font-family: var(--font-mono);
    font-size: .8125rem;
    line-height: 2;
    overflow: hidden;

    p { margin: 0; white-space: pre; }

    .k { color: var(--color-primary); }
    .t { color: #A78BFA; }
    .v { color: var(--color-text); }
    .s { color: var(--color-secondary); }
    .o { color: var(--color-text-muted); }
    .n { color: #FBBF24; }
  }

  &__err-line {
    display: flex;
    align-items: center;
    gap: .5rem;
    color: #FB7185;
    background: rgba(251,113,133,.06);
    border-radius: 4px;
    padding: 0 .5rem;
  }

  &__warn-line {
    display: flex;
    align-items: center;
    gap: .5rem;
    color: #FBBF24;
    background: rgba(251,191,36,.06);
    border-radius: 4px;
    padding: 0 .5rem;
  }

  &__err-icon  { color: #FB7185; flex-shrink: 0; }
  &__warn-icon { color: #FBBF24; flex-shrink: 0; }

  &__statusbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    background: #FB7185;
    padding: 0 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #3d0014;
    font-weight: 600;
  }

  // Actions
  &__actions {
    display: flex;
    gap: .875rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    padding: .625rem 1.375rem;
    border-radius: var(--radius-md);
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-mono);
    border: 1px solid rgba(45,212,191,.25);
    background: rgba(45,212,191,.06);
    color: var(--color-primary);
    transition: all .18s ease;

    &:hover {
      background: rgba(45,212,191,.12);
      border-color: var(--color-primary);
    }

    &--primary {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #082121;
      &:hover { background: var(--color-secondary); transform: translateY(-1px); }
    }
  }
}

@keyframes nf-in {
  from { opacity: 0; transform: translateY(24px) scale(.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);   }
}
</style>