<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowDown } from 'lucide-vue-next'
import BaseButton from '@/components/shared/BaseButton.vue'
import SocialLink from '@/components/shared/SocialLink.vue'

// ── Typewriter ────────────────────────────────────────────────
const roles = [
  'Frontend Developer',
  'Angular & Vue & React',
  'Full-Stack Explorer',
  'Open Source Enthusiast',
  'VS Code Theme Creator',
]

const displayText   = ref('')
const cursorOn      = ref(true)
let roleIndex       = 0
let charIndex       = 0
let isDeleting      = false
let typingTimer:    ReturnType<typeof setTimeout>
let cursorInterval: ReturnType<typeof setInterval>

function tick() {
  const current = roles[roleIndex]

  if (isDeleting) {
    displayText.value = current.slice(0, charIndex - 1)
    charIndex--
  } else {
    displayText.value = current.slice(0, charIndex + 1)
    charIndex++
  }

  let delay = isDeleting ? 55 : 100

  if (!isDeleting && charIndex === current.length) {
    delay      = 2000          // pausa no final da palavra
    isDeleting = true
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false
    roleIndex  = (roleIndex + 1) % roles.length
    delay      = 400           // pausa antes de escrever a próxima
  }

  typingTimer = setTimeout(tick, delay)
}

onMounted(() => {
  typingTimer    = setTimeout(tick, 600)
  cursorInterval = setInterval(() => { cursorOn.value = !cursorOn.value }, 530)
})

onBeforeUnmount(() => {
  clearTimeout(typingTimer)
  clearInterval(cursorInterval)
})
</script>

<template>
  <section id="hero" class="hero" aria-label="Introduction">

    <!-- Background decorativo -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__bg-blob hero__bg-blob--teal"   />
      <div class="hero__bg-blob hero__bg-blob--purple" />
      <div class="hero__bg-grid" />
    </div>

    <div class="hero__container">

      <!-- Conteúdo principal -->
      <div class="hero__content">

        <!-- Status badge -->
        <div class="hero__badge">
          <span class="hero__badge-dot" aria-hidden="true" />
          Available for opportunities
        </div>

        <!-- Nome -->
        <h1 class="hero__title">
          Hi, I'm
          <span class="hero__name">Bruno Carvalho</span>
        </h1>

        <!-- Typewriter -->
        <div class="hero__role" aria-label="Current role">
          <span class="hero__role-text">{{ displayText }}</span>
          <span
            class="hero__cursor"
            :class="{ 'hero__cursor--hidden': !cursorOn }"
            aria-hidden="true"
          >_</span>
        </div>

        <!-- Bio -->
        <p class="hero__bio">
            Web developer based in Portugal, focused on the frontend but
            not afraid to touch the backend. I build clean, performant web interfaces with
            <span class="hero__bio-highlight">Angular</span>,
            <span class="hero__bio-highlight">Vue</span>,
            <span class="hero__bio-highlight">React</span>, and
            <span class="hero__bio-highlight">TypeScript</span> — and reach for
            some Backend technologies whenever the project needs it.
            <br />
            Creator of the
          <a
            href="https://marketplace.visualstudio.com/items?itemName=ekkl3s1a.ekkl3s1a-themes"
            target="_blank"
            rel="noopener noreferrer"
            class="hero__link"
          >Teal Turquoise VS Code theme</a>.
        </p>

        <!-- CTAs -->
        <div class="hero__actions">
          <BaseButton :to="'/projects'">
            View Projects
          </BaseButton>
          <BaseButton variant="outlined" href="../../assets/resume_bruno_carvalho.pdf" download>
            Download CV
          </BaseButton>
        </div>

        <!-- Social links -->
        <div class="hero__socials" aria-label="Social profiles">
          <SocialLink
            platform="github"
            url="https://github.com/Ekkl3s1a"
            show-label
          />
          <SocialLink
            platform="linkedin"
            url="https://linkedin.com/in/bruno-mr-carvalho"
            show-label
          />
        </div>
      </div>

      <!-- Código decorativo (esconde em mobile) -->
      <div class="hero__code" aria-hidden="true">
        <div class="hero__code-header">
          <span class="hero__code-dot hero__code-dot--red"    />
          <span class="hero__code-dot hero__code-dot--yellow" />
          <span class="hero__code-dot hero__code-dot--green"  />
          <span class="hero__code-filename">developer.ts</span>
        </div>
        <pre class="hero__code-body"><code
><span class="t-keyword">const</span> <span class="t-var">bruno</span><span class="t-op">:</span> <span class="t-type">Developer</span> <span class="t-op">=</span> {
  name<span class="t-op">:</span> <span class="t-str">'Bruno Carvalho'</span><span class="t-op">,</span>
  location<span class="t-op">:</span> <span class="t-str">'Portugal 🇵🇹'</span><span class="t-op">,</span>
  stack<span class="t-op">:</span> [
    <span class="t-str">'Angular'</span><span class="t-op">,</span> <span class="t-str">'Vue 3'</span><span class="t-op">,</span> <span class="t-str">'React'</span><span class="t-op">,</span>
    <span class="t-str">'TypeScript'</span><span class="t-op">,</span> <span class="t-str">'SCSS'</span><span class="t-op">,</span> <span class="t-str">'Vite'</span><span class="t-op">,</span>
    <span class="t-str">'FastAPI'</span><span class="t-op">,</span> <span class="t-str">'Nuxt'</span><span class="t-op">,</span> <span class="t-str">'Next.js'</span>
  ]<span class="t-op">,</span>
  openTo<span class="t-op">: </span><span class="t-keyword">true</span><span class="t-op">,</span>
}</code></pre>
      </div>

    </div>

    <!-- Scroll indicator -->
    <a href="#about" class="hero__scroll" aria-label="Scroll to About section">
      <ArrowDown :size="20" aria-hidden="true" />
    </a>

  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: var(--header-height);
  overflow: hidden;

  // ── Background ────────────────────────────────────────────
  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  &__bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);

    &--teal {
      width: 500px;
      height: 500px;
      background: var(--color-primary);
      opacity: 0.10;
      top: -80px;
      right: -80px;
      animation: float 9s ease-in-out infinite;
    }

    &--purple {
      width: 320px;
      height: 320px;
      background: var(--color-accent);
      opacity: 0.07;
      bottom: 80px;
      left: -60px;
      animation: float 11s ease-in-out infinite reverse;
    }
  }

  &__bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--color-border) 1px, transparent 1px),
      linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse 75% 75% at 50% 50%, black, transparent);
    opacity: 0.5;
  }

  // ── Layout ────────────────────────────────────────────────
  &__container {
    @include container;
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    padding-top: 4rem;
    padding-bottom: 6rem;

    @include respond-to('lg') {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 5rem;
    }
  }

  // ── Content ───────────────────────────────────────────────
  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: fadeInUp 0.7s ease both;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-family: var(--font-mono);
    color: var(--color-primary);
  }

  &__badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-success);
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.25);
    animation: pulse 2.2s ease-in-out infinite;
    flex-shrink: 0;
  }

  &__title {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin: 0;
  }

  &__name {
    display: block;
    color: var(--color-primary);
  }

  &__role {
    font-family: var(--font-mono);
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    color: var(--color-secondary);
    min-height: 2em;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  &__cursor {
    color: var(--color-primary);
    font-weight: 300;
    transition: opacity 0.08s;
    &--hidden { opacity: 0; }
  }

  &__bio {
    font-size: 1.0625rem;
    color: var(--color-text-muted);
    line-height: 1.8;
    max-width: 520px;
    margin: 0;
  }

  &__link {
    color: var(--color-primary);
    text-decoration: underline;
    text-decoration-color: rgba(45, 212, 191, 0.40);
    transition: text-decoration-color var(--transition-base);

    &:hover { text-decoration-color: var(--color-primary); }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.875rem;
  }

  &__socials {
    display: flex;
    gap: 0.25rem;
    margin-top: -0.25rem;
  }

  // ── Código decorativo ─────────────────────────────────────
  &__code {
    display: none;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-md);
    animation: fadeInUp 0.8s ease 0.2s both;

    @include respond-to('lg') { display: block; }
  }

  &__code-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.25rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }

  &__code-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &--red    { background: #fb7185; }
    &--yellow { background: #fbbf24; }
    &--green  { background: #34d399; }
  }

  &__code-filename {
    margin-left: 0.5rem;
    font-size: 0.8125rem;
    font-family: var(--font-mono);
    color: var(--color-text-muted);
  }

  &__code-body {
    padding: 1.5rem 1.75rem;
    margin: 0;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    line-height: 2;
    white-space: pre;
    overflow-x: auto;

    // Syntax highlighting usando as cores do tema VS Code
    .t-keyword { color: var(--color-primary); }
    .t-type    { color: var(--color-accent); }
    .t-var     { color: var(--color-text); }
    .t-str     { color: var(--color-secondary); }
    .t-op      { color: var(--color-text-muted); }
  }

  // ── Scroll indicator ──────────────────────────────────────
  &__scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-text-muted);
    animation: float 2.5s ease-in-out infinite;
    transition: color var(--transition-base);
    z-index: 1;

    &:hover { color: var(--color-primary); }
  }
}
</style>