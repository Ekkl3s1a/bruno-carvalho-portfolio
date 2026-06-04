<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BaseButton from '@/components/shared/BaseButton.vue'
import SocialLink from '@/components/shared/SocialLink.vue'

// ── Typewriter ────────────────────────────────────────────────
const roles = [
  'Frontend Developer',
  'Angular · Vue · React',
  'Full-Stack Explorer',
  'Open Source Enthusiast',
  'VS Code Theme Creator',
]

const cvUrl = `${import.meta.env.BASE_URL}resume_bruno_carvalho.pdf`

const displayText   = ref('')
const cursorOn      = ref(true)
let roleIndex       = 0
let charIndex       = 0
let isDeleting      = false
let typingTimer:    ReturnType<typeof setTimeout>
let cursorInterval: ReturnType<typeof setInterval>

function tick() {
  const word = roles[roleIndex]
  displayText.value = isDeleting ? word.slice(0, charIndex - 1) : word.slice(0, charIndex + 1)
  isDeleting ? charIndex-- : charIndex++

  let delay = isDeleting ? 52 : 98
  if (!isDeleting && charIndex === word.length)    { delay = 1900; isDeleting = true }
  else if (isDeleting && charIndex === 0) { isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 380 }
  typingTimer = setTimeout(tick, delay)
}

// ── Scroll to section ─────────────────────────────────────────
function scrollTo(id: string) {
  const el  = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top, behavior: 'smooth' })
}

// ── Deep Dive GSAP timeline ───────────────────────────────────
const heroRef = ref<HTMLElement>()

onMounted(() => {
  typingTimer    = setTimeout(tick, 700)
  cursorInterval = setInterval(() => { cursorOn.value = !cursorOn.value }, 530)

  const hero = heroRef.value
  if (!hero) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:    hero,
      start:      'top top',
      end:        '+=1000',
      scrub:      1.1,
      pin:        true,
      pinSpacing: true,
    },
  })

  // Titlebar + activity bar slide out
  tl.to('.hero__vsc-titlebar', { y: -42, opacity: 0, duration: .35 }, 0)
  tl.to('.hero__vsc-activity', { x: -52, opacity: 0, duration: .4  }, .05)
  tl.to('.hero__vsc-statusbar',{ y:  26, opacity: 0, duration: .35 }, .05)

  // Editor content: scale + blur (the "dive" feel)
  tl.to('.hero__vsc-editor', {
    scale:  .93,
    filter: 'blur(4px) brightness(.65)',
    y:      40,
    duration: .6,
  }, .18)

  // Deep water overlay
  tl.to('.hero__water-overlay', { opacity: 1, duration: .75 }, .18)
})

onBeforeUnmount(() => {
  clearTimeout(typingTimer)
  clearInterval(cursorInterval)
  ScrollTrigger.getAll()
    .filter(t => (t.vars as any)?.id === 'hero-dive')
    .forEach(t => t.kill())
})
</script>

<template>
  <section id="hero" ref="heroRef" class="hero" aria-label="Hero section">

    <div class="hero__water-overlay" aria-hidden="true" />

    <!-- VS Code shell ─────────────────────────────────────────── -->
    <div class="hero__vsc">

      <!-- ① Title bar -->
      <div class="hero__vsc-titlebar" aria-hidden="true">
        <div class="hero__dots">
          <span class="hero__dot hero__dot--red"    />
          <span class="hero__dot hero__dot--yellow" />
          <span class="hero__dot hero__dot--green"  />
        </div>
        <div class="hero__tabs">
          <div class="hero__tab hero__tab--active">
            <span aria-hidden="true">⚡</span>developer.ts
          </div>
          <div class="hero__tab">
            <span aria-hidden="true">📄</span>portfolio.config.ts
          </div>
        </div>
        <div class="hero__vsc-title">Bruno Carvalho — Portfolio</div>
      </div>

      <!-- ② Editor row -->
      <div class="hero__vsc-editor">

        <!-- Activity bar -->
        <nav class="hero__vsc-activity" aria-label="VS Code activity bar (decorative)">
          <i class="ti ti-files"        aria-hidden="true" />
          <i class="ti ti-git-branch"   aria-hidden="true" />
          <i class="ti ti-search"       aria-hidden="true" />
          <i class="ti ti-brand-github" aria-hidden="true" />
          <i class="ti ti-settings"     aria-hidden="true" />
        </nav>

        <!-- Gutter (line numbers) -->
        <ol class="hero__vsc-gutter" aria-hidden="true">
          <li v-for="n in 20" :key="n">{{ n }}</li>
        </ol>

        <!-- Main hero content -->
        <div class="hero__content">
          <div class="hero__badge">
            <span class="hero__badge-dot" aria-hidden="true" />
            Available for opportunities
          </div>

          <h1 class="hero__title">
            Hi, I'm
            <span class="hero__name">Bruno Carvalho</span>
          </h1>

          <p class="hero__role" aria-label="Current role">
            <span>{{ displayText }}</span>
            <span
              class="hero__cursor"
              :class="{ 'hero__cursor--off': !cursorOn }"
              aria-hidden="true"
            >_</span>
          </p>

          <p class="hero__bio">
            Web developer based in Portugal. I build with
            <strong>Angular</strong>, <strong>Vue 3</strong> and
            <strong>React</strong> — and reach for FastAPI or Express
            whenever the project needs it. Creator of the
            <a
              href="https://marketplace.visualstudio.com/items?itemName=ekkl3s1a.ekkl3s1a-themes"
              target="_blank"
              rel="noopener noreferrer"
              class="hero__link"
            >Teal Turquoise VS Code theme</a>.
          </p>

          <div class="hero__actions">
            <BaseButton :to="'/projects'">View Projects</BaseButton>
            <BaseButton variant="outlined" :href="cvUrl" download>Download CV</BaseButton>
          </div>

          <div class="hero__socials">
            <SocialLink platform="github"   url="https://github.com/Ekkl3s1a"              show-label />
            <SocialLink platform="linkedin" url="https://linkedin.com/in/bruno-mr-carvalho" show-label />
          </div>
        </div>

        <!-- Code panel — desktop only -->
        <aside class="hero__vsc-code" aria-hidden="true">
          <pre><code
><span class="k">const</span> <span class="v">bruno</span><span class="o">:</span> <span class="t">Developer</span> <span class="o">=</span> {
  name<span class="o">:</span>      <span class="s">'Bruno Carvalho'</span><span class="o">,</span>
  location<span class="o">:</span>  <span class="s">'Portugal 🇵🇹'</span><span class="o">,</span>
  frontend<span class="o">:</span>  [
    <span class="s">'Angular'</span><span class="o">,</span> <span class="s">'Vue 3'</span><span class="o">,</span> <span class="s">'React'</span><span class="o">,</span>
    <span class="s">'TypeScript'</span><span class="o">,</span> <span class="s">'SCSS'</span><span class="o">,</span> <span class="s">'Vite'</span><span class="o">,</span>
    <span class="s">'FastAPI'</span><span class="o">,</span> <span class="s">'Nuxt'</span><span class="o">,</span> <span class="s">'Next.js'</span>
  ]<span class="o">,</span>
  openTo<span class="o">:</span>    <span class="k">true</span><span class="o">,</span>
}</code></pre>
        </aside>
      </div>

      <!-- ③ Status bar -->
      <div class="hero__vsc-statusbar" aria-hidden="true">
        <span class="hero__sb-left">
          <i class="ti ti-git-branch" /> main
          <span class="hero__sb-sep">·</span>
          <i class="ti ti-circle-check" /> 0 errors
          <span class="hero__sb-sep">·</span>
          TypeScript
        </span>
        <span class="hero__sb-right">
          UTF-8 · Ln 1, Col 1
        </span>
      </div>
    </div>

    <!-- Scroll indicator -->
    <button
      class="hero__scroll"
      aria-label="Scroll to About section"
      @click="scrollTo('about')"
    >
      <ArrowDown :size="20" aria-hidden="true" />
    </button>

  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
  background: transparent; // Three.js canvas shows through

  // ── Water depth overlay ──────────────────────────────────────
  &__water-overlay {
    position: absolute;
    inset: 0;
    z-index: 8;
    opacity: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse at 50% 110%,
        rgba(4, 20, 20, .9)  0%,
        rgba(4, 20, 20, .55) 45%,
        transparent          75%),
      linear-gradient(to bottom,
        transparent          0%,
        rgba(4, 20, 20, .45) 60%,
        rgba(4, 20, 20, .92) 100%);
  }

  // ── VS Code outer shell ──────────────────────────────────────
  &__vsc {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
  }

  // ── ① Title bar ──────────────────────────────────────────────
  &__vsc-titlebar {
    display: flex;
    align-items: center;
    height: 38px;
    background: var(--vsc-titlebar);
    border-bottom: 1px solid var(--color-glass-border);
    padding: 0 12px;
    flex-shrink: 0;
    backdrop-filter: blur(8px);
    gap: 1rem;
  }

  &__dots {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
  &__dot {
    width: 12px; height: 12px; border-radius: 50%;
    &--red    { background: #FF5F57; }
    &--yellow { background: #FEBC2E; }
    &--green  { background: #28C840; }
  }

  &__tabs {
    display: flex;
    height: 100%;
    align-items: flex-end;
    flex: 1;
    overflow: hidden;
  }
  &__tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 14px;
    height: 28px;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
    border-right: 1px solid var(--color-glass-border);
    white-space: nowrap;

    &--active {
      background: var(--vsc-tab-active);
      color: var(--color-text);
      border-top: 1.5px solid var(--color-primary);
      border-bottom: none;
    }
  }

  &__vsc-title {
    font-size: 11px;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    display: none;
    @include respond-to('lg') { display: block; }
  }

  // ── ② Editor row ─────────────────────────────────────────────
  &__vsc-editor {
    flex: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;
  }

  &__vsc-activity {
    width: 48px;
    display: none;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    gap: 22px;
    background: var(--vsc-activity);
    border-right: 1px solid var(--color-glass-border);
    flex-shrink: 0;

    @include respond-to('lg') { display: flex; }

    i {
      font-size: 20px;
      color: var(--color-text-muted);
      opacity: .6;
      cursor: pointer;
      transition: opacity var(--transition-base);
      &:first-child { color: var(--color-primary); opacity: 1; }
      &:hover { opacity: 1; }
    }
  }

  &__vsc-gutter {
    display: none;
    flex-direction: column;
    list-style: none;
    padding: 1.75rem 10px 1.75rem 0;
    min-width: 44px;
    text-align: right;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 2;
    color: var(--vsc-gutter);
    user-select: none;
    flex-shrink: 0;

    @include respond-to('md') { display: flex; }
  }

  // ── Hero content ─────────────────────────────────────────────
  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.75rem 1.5rem;
    overflow: hidden;
    min-width: 0;

    @include respond-to('xl') { padding: 2.5rem 2.5rem; }
  }

  // ── Code panel ───────────────────────────────────────────────
  &__vsc-code {
    display: none;
    width: 360px;
    flex-shrink: 0;
    padding: 1.75rem 1.5rem;
    background: rgba(8, 33, 33, .45);
    border-left: 1px solid var(--color-glass-border);
    font-family: var(--font-mono);
    font-size: .875rem;
    line-height: 2;
    overflow: hidden;

    @include respond-to('xl') { display: block; }

    pre { margin: 0; }

    .k { color: var(--color-primary); }
    .t { color: #A78BFA; }
    .v { color: var(--color-text); }
    .s { color: var(--color-secondary); }
    .o { color: var(--color-text-muted); }
  }

  // ── ③ Status bar ─────────────────────────────────────────────
  &__vsc-statusbar {
    height: 24px;
    background: var(--vsc-statusbar);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 11px;
    font-family: var(--font-mono);
    color: #082121;
    font-weight: 500;
    flex-shrink: 0;

    &-left, &-right { display: flex; align-items: center; gap: 6px; }

    .hero__sb-left,
    .hero__sb-right { display: flex; align-items: center; gap: 6px; }

    .hero__sb-sep { opacity: .45; }
    i { font-size: 12px; }
  }

  // ── Hero text ─────────────────────────────────────────────────
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-size: .8125rem;
    font-family: var(--font-mono);
    color: var(--color-primary);
  }
  &__badge-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--color-success);
    box-shadow: 0 0 0 3px rgba(52, 211, 153, .25);
    animation: pulse 2.2s ease-in-out infinite;
  }

  &__title {
    font-size: clamp(1.75rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -.025em;
    margin: 0;
  }
  &__name { display: block; color: var(--color-primary); }

  &__role {
    font-family: var(--font-mono);
    font-size: clamp(.95rem, 2.2vw, 1.25rem);
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    gap: 2px;
    min-height: 1.8em;
  }
  &__cursor {
    color: var(--color-primary);
    transition: opacity .08s;
    &--off { opacity: 0; }
  }

  &__bio {
    font-size: 1rem;
    color: var(--color-text-muted);
    line-height: 1.8;
    max-width: 500px;
    margin: 0;
    strong { color: var(--color-text); font-weight: 600; }
  }
  &__link {
    color: var(--color-primary);
    text-underline-offset: 3px;
    &:hover { text-decoration-color: var(--color-primary); }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: .875rem;
  }
  &__socials { display: flex; gap: .25rem; flex-wrap: wrap; }

  // ── Scroll cue ────────────────────────────────────────────────
  &__scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    color: var(--color-text-muted);
    background: none;
    border: none;
    cursor: pointer;
    animation: float 2.5s ease-in-out infinite;
    transition: color var(--transition-base);
    &:hover { color: var(--color-primary); }
  }
}
</style>