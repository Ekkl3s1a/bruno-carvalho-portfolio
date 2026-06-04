<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGithubStore } from '@/stores/github'
import { useCertificationsStore } from '@/stores/certifications'
import { getMorphTo } from '@/composables/useBackground3D'
import BaseButton from '@/components/shared/BaseButton.vue'
import SocialLink from '@/components/shared/SocialLink.vue'
import { ExternalLink } from 'lucide-vue-next'

const router = useRouter()
const github = useGithubStore()
const certs = useCertificationsStore()

const previewProjects = computed(() => github.repos.slice(0, 3))
const previewCerts = computed(() => certs.certifications.slice(0, 3))

// ── Typewriter ────────────────────────────────────────────────
const roles = [
  'Frontend Developer',
  'Angular · Vue · React',
  'Full-Stack Explorer',
  'Open Source Enthusiast',
  'VS Code Theme Creator',
]

// ── Skills data ───────────────────────────────────────────────
const skillsData = [
  { label: 'Angular', color: '#E40035', x: 15, y: 25, size: 'xl', delay: 0, rot: -2 },
  { label: 'Vue 3', color: '#42d392', x: 55, y: 30, size: 'xl', delay: .3, rot: 1 },
  { label: 'React', color: '#61DAFB', x: 78, y: 22, size: 'lg', delay: .5, rot: -1 },
  { label: 'TypeScript', color: '#3178C6', x: 29, y: 37, size: 'lg', delay: .1, rot: 2 },
  { label: 'SCSS', color: '#CF649A', x: 62, y: 40, size: 'md', delay: .6, rot: -3 },
  { label: 'Vite', color: '#BD34FE', x: 14, y: 50, size: 'md', delay: .4, rot: 1 },
  { label: 'FastAPI', color: '#009485', x: 46, y: 58, size: 'md', delay: .2, rot: -1 },
  { label: 'Express', color: '#aaaaaa', x: 82, y: 54, size: 'md', delay: .7, rot: 2 },
  { label: 'Three.js', color: '#2DD4BF', x: 68, y: 68, size: 'sm', delay: .9, rot: 3 },
  { label: 'GSAP', color: '#88CE02', x: 5, y: 62, size: 'sm', delay: 1.0, rot: -1 },
  { label: 'Git', color: '#F05032', x: 30, y: 60, size: 'sm', delay: .5, rot: 1 },
  { label: 'Node.js', color: '#339933', x: 87, y: 74, size: 'sm', delay: .8, rot: -2 },
  { label: 'Figma', color: '#F24E1E', x: 15, y: 80, size: 'xs', delay: 1.2, rot: 2 },
  { label: 'Docker', color: '#2496ED', x: 52, y: 85, size: 'xs', delay: 1.1, rot: -1 },
  { label: 'Nuxt', color: '#00DC82', x: 72, y: 82, size: 'xs', delay: .6, rot: 1 },
  { label: 'Next.js', color: '#ffffff', x: 32, y: 88, size: 'xs', delay: .7, rot: -2 },
]

const displayText = ref('')
const cursorOn = ref(true)
let roleIdx = 0, charIdx = 0, deleting = false
let typingTimer: ReturnType<typeof setTimeout>
let cursorTimer: ReturnType<typeof setInterval>

function tick() {
  const word = roles[roleIdx]
  displayText.value = deleting ? word.slice(0, charIdx - 1) : word.slice(0, charIdx + 1)
  deleting ? charIdx-- : charIdx++
  let delay = deleting ? 52 : 96
  if (!deleting && charIdx === word.length) { delay = 1900; deleting = true }
  else if (deleting && charIdx === 0) {
    deleting = false
    roleIdx = (roleIdx + 1) % roles.length
    delay = 380
  }
  typingTimer = setTimeout(tick, delay)
}

// ── Depth tracker ─────────────────────────────────────────────
const depthLabel = ref('Surface')
const depths = [
  { at: 0.00, label: 'Surface' },
  { at: 0.22, label: '~10m' },
  { at: 0.42, label: '~25m' },
  { at: 0.60, label: '~50m' },
  { at: 0.78, label: '~80m' },
  { at: 0.90, label: '~120m' },
]

// ── ScrollTrigger handle ──────────────────────────────────────
let st: ScrollTrigger | null = null

// ── Lifecycle ─────────────────────────────────────────────────
onMounted(async () => {
  github.fetchRepos()
  typingTimer = setTimeout(tick, 700)
  cursorTimer = setInterval(() => { cursorOn.value = !cursorOn.value }, 530)
  await new Promise(r => setTimeout(r, 120)) // wait for DOM
  setupTimeline()
})

onBeforeUnmount(() => {
  clearTimeout(typingTimer)
  clearInterval(cursorTimer)
  st?.kill()
})

function setupTimeline() {
  const morphTo = getMorphTo()

  // Mapa: progress 0→1 ao longo de 600vh de scroll
  const tl = gsap.timeline({ paused: true })

  // ── HERO sai (0.18 → 0.32) ──────────────────────────────────
  tl.to('.vsc-bar--title', { y: -44, opacity: 0, ease: 'none', duration: .12 }, .18)
  tl.to('.vsc-bar--activity', { x: -52, opacity: 0, ease: 'none', duration: .12 }, .19)
  tl.to('.vsc-bar--status', { y: 26, opacity: 0, ease: 'none', duration: .12 }, .19)
  tl.to('.hero-content, .vsc-gutter, .vsc-code', {
    opacity: 0, scale: .93, filter: 'blur(5px)',
    ease: 'none', duration: .12,
  }, .21)
  tl.to('.l-hero', { opacity: 0, ease: 'none', duration: .06 }, .30)

  // ── ABOUT entra (0.22 → 0.34) / sai (0.40 → 0.48) ──────────
  tl.fromTo('.l-about',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .12 },
    .22)
  tl.to('.l-about',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .10 },
    .40)

  // ── SKILLS entra (0.42 → 0.55) / sai (0.58 → 0.65) ─────────
  tl.fromTo('.l-skills',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .13 },
    .42)
  tl.to('.l-skills',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .09 },
    .58)

  // ── PROJECTS entra (0.60 → 0.73) / sai (0.76 → 0.83) ───────
  tl.fromTo('.l-projects',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .13 },
    .60)
  tl.to('.l-projects',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .09 },
    .76)

  // ── CERTS entra (0.78 → 0.88) / sai (0.90 → 0.95) ──────────
  tl.fromTo('.l-certs',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .10 },
    .78)
  tl.to('.l-certs',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .07 },
    .90)

  // ── CONTACT entra (0.88 → 1.00) ─────────────────────────────
  tl.fromTo('.l-contact',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .12 },
    .88)

  // ── Vignette escurece progressivamente ───────────────────────
  tl.to('.home__vignette', { opacity: .88, ease: 'none', duration: 1 }, 0)

  // ── pointer-events: sync com opacidade ───────────────────────
  // (layers invisíveis não devem ser clicáveis)
  const togglePointer = (sel: string, on: boolean) =>
    (document.querySelector(sel) as HTMLElement | null)
      ?.style.setProperty('pointer-events', on ? 'auto' : 'none')

  // ── Ligar ao scroll ───────────────────────────────────────────
  let lastSection = 'hero'
  const morphBreaks: Array<{ at: number; section: string }> = [
    { at: .22, section: 'about' },
    { at: .42, section: 'skills' },
    { at: .60, section: 'projects' },
    { at: .78, section: 'certifications' },
    { at: .88, section: 'contact' },
  ]
  // Reverse map for scrolling back up
  const reverseMorphBreaks = [...morphBreaks].reverse()

  st = ScrollTrigger.create({
    trigger: '.home__driver',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.4,
    onUpdate(self) {
      // Drive master timeline
      tl.progress(self.progress)

      // Update depth label
      for (const d of depths) {
        if (self.progress >= d.at) depthLabel.value = d.label
      }

      // Trigger particle morph at section boundaries
      if (morphTo) {
        let current = 'hero'
        for (const b of morphBreaks) {
          if (self.progress >= b.at) current = b.section
        }
        if (current !== lastSection) {
          lastSection = current
          morphTo(current as any)
        }
      }

      // Sync pointer-events: only active layer is interactive
      const p = self.progress
      togglePointer('.l-hero', p < .32)
      togglePointer('.l-about', p >= .22 && p < .48)
      togglePointer('.l-skills', p >= .42 && p < .65)
      togglePointer('.l-projects', p >= .60 && p < .83)
      togglePointer('.l-certs', p >= .78 && p < .95)
      togglePointer('.l-contact', p >= .88)
    },
  })
}

const cvUrl = `${import.meta.env.BASE_URL}resume_bruno_carvalho.pdf`
</script>

<template>
  <div class="home">

    <!-- Cria o espaço de scroll (700vh) — o stage fica fixo -->
    <div class="home__driver" aria-hidden="true" />

    <!-- Stage fixo — tudo acontece aqui -->
    <div class="home__stage">

      <!-- Atmosfera de água -->
      <div class="home__caustics" aria-hidden="true" />
      <div class="home__vignette" aria-hidden="true" />
      <div class="home__surface" aria-hidden="true" />

      <!-- Profundidade actual -->
      <div class="home__depth" aria-hidden="true">
        ↓ {{ depthLabel }}
      </div>

      <!-- ══ LAYERS (adicionados nos steps 3-9) ══ -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <!--  HERO LAYER                                                -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <div class="hlayer l-hero" aria-label="Introduction">

        <!-- Titlebar -->
        <div class="vsc-bar vsc-bar--title" aria-hidden="true">
          <span class="vsc-dot vsc-dot--r" />
          <span class="vsc-dot vsc-dot--y" />
          <span class="vsc-dot vsc-dot--g" />
          <div class="vsc-tabs">
            <span class="vsc-tab vsc-tab--on"><span aria-hidden="true">⚡</span>developer.ts</span>
            <span class="vsc-tab">portfolio.config.ts</span>
          </div>
          <span class="vsc-wintitle" aria-hidden="true">Bruno Carvalho — Portfolio</span>
        </div>

        <!-- Editor row -->
        <div class="vsc-editor">

          <!-- Activity bar -->
          <nav class="vsc-bar vsc-bar--activity" aria-label="Decorative VS Code sidebar">
            <i class="ti ti-files" aria-hidden="true" />
            <i class="ti ti-git-branch" aria-hidden="true" />
            <i class="ti ti-search" aria-hidden="true" />
            <i class="ti ti-brand-github" aria-hidden="true" />
            <i class="ti ti-settings" aria-hidden="true" />
          </nav>

          <!-- Line numbers -->
          <ol class="vsc-gutter" aria-hidden="true">
            <li v-for="n in 20" :key="n">{{ n }}</li>
          </ol>

          <!-- Hero content -->
          <div class="hero-content">
            <div class="hero-badge">
              <span class="hero-badge__dot" aria-hidden="true" />
              Available for opportunities
            </div>

            <h1 class="hero-title">
              Hi, I'm
              <span class="hero-name">Bruno Carvalho</span>
            </h1>

            <p class="hero-role" aria-label="Current role">
              <span>{{ displayText }}</span>
              <span class="hero-cursor" :class="{ 'off': !cursorOn }" aria-hidden="true">_</span>
            </p>

            <p class="hero-bio">
              Web developer based in Portugal. Building with
              <strong>Angular</strong>, <strong>Vue 3</strong> and
              <strong>React</strong> — reaching for FastAPI or Express when needed.
              Creator of the
              <a href="https://marketplace.visualstudio.com/items?itemName=ekkl3s1a.ekkl3s1a-themes" target="_blank"
                rel="noopener noreferrer" class="hero-link">Teal Turquoise VS Code theme ↗</a>.
            </p>

            <div class="hero-actions">
              <BaseButton :to="'/projects'">View Projects</BaseButton>
              <BaseButton variant="outlined" :href="cvUrl" download>Download CV</BaseButton>
            </div>

            <div class="hero-socials">
              <SocialLink platform="github"   url="https://github.com/Ekkl3s1a"              show-label />
              <SocialLink platform="linkedin" url="https://linkedin.com/in/bruno-mr-carvalho" show-label />
            </div>
          </div>

          <!-- Code panel — desktop only -->
          <aside class="vsc-code" aria-hidden="true">
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

        <!-- Status bar -->
        <div class="vsc-bar vsc-bar--status" aria-hidden="true">
          <span>
            <i class="ti ti-git-branch" /> main ·
            <i class="ti ti-circle-check" /> 0 errors ·
            TypeScript
          </span>
          <span>UTF-8 · Ln 1, Col 1</span>
        </div>

      </div>

      <!-- ══ ABOUT ══════════════════════════════════════════════════ -->
        
      <div class="hlayer l-about" aria-label="About">
        <div class="layer-badge">About me</div>
        <div class="about-grid">
          <div class="glass-card about-bio">
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
          </div>
          <div class="stat-bubble" style="--delay:.1s">
            <span class="stat-bubble__val">{{ github.loading ? '—' : github.stats.totalRepos }}</span>
            <span class="stat-bubble__lbl">Repos</span>
          </div>
          <div class="stat-bubble" style="--delay:.25s">
            <span class="stat-bubble__val">{{ github.loading ? '—' : github.stats.totalStars }}</span>
            <span class="stat-bubble__lbl">Stars</span>
          </div>
          <div class="stat-bubble" style="--delay:.4s">
            <span class="stat-bubble__val">{{ certs.certifications.length }}</span>
            <span class="stat-bubble__lbl">Certs</span>
          </div>
        </div>
      </div>

      <!-- ══ SKILLS ═════════════════════════════════════════════════ -->
      <div class="hlayer l-skills" aria-label="Tech stack">
        <div class="layer-badge">Tech Stack</div>
        <div class="skills-scene">
          <span v-for="sk in skillsData" :key="sk.label" class="skill-tag" :class="`skill-tag--${sk.size}`" :style="{
            left: sk.x + '%',
            top: sk.y + '%',
            color: sk.color,
            borderColor: sk.color + '35',
            '--rot': sk.rot + 'deg',
            animationDelay: sk.delay + 's',
          }">{{ sk.label }}</span>
        </div>
      </div>

      <!-- ══ PROJECTS ═══════════════════════════════════════════════ -->
      <div class="hlayer l-projects" aria-label="Projects">
        <div class="layer-badge">Work</div>
        <div class="projects-scene">
          <a
          v-for="(repo, i) in previewProjects"
          :key="repo.id"
          :href="repo.html_url"
          target="_blank" rel="noopener noreferrer"
          class="project-card"
          :style="{ '--i': i }"
          >
          <div class="project-card__top">
            <span class="project-card__name">{{ repo.name }}</span>
            <i class="ti ti-external-link project-card__ext" aria-hidden="true" />
          </div>
          <p class="project-card__desc">{{ repo.description || 'No description.' }}</p>
          <div class="project-card__foot">
            <span v-if="repo.language" class="project-card__lang">{{ repo.language }}</span>
            <span v-if="repo.stargazers_count" class="project-card__stars">
              <i class="ti ti-star" />{{ repo.stargazers_count }}
            </span>
          </div>
          </a>
        </div>
        <button class="see-all" @click="router.push('/projects')">
          See all repos <i class="ti ti-arrow-right" />
        </button>
      </div>

      <!-- ══ CERTS ══════════════════════════════════════════════════ -->
      <div class="hlayer l-certs" aria-label="Certifications">
        <div class="layer-badge">Certifications</div>
        <div class="certs-scene">
          <div v-for="(cert, i) in previewCerts" :key="cert.id" class="cert-badge" :style="{ '--i': i }">
            <i class="ti ti-award cert-badge__icon" aria-hidden="true" />
            <div>
              <div class="cert-badge__title">{{ cert.title }}</div>
              <div class="cert-badge__issuer">{{ cert.issuer }}</div>
            </div>
          </div>
        </div>
        <button class="see-all" @click="router.push('/certifications')">
          All certifications <i class="ti ti-arrow-right" />
        </button>
      </div>

      <!-- ══ CONTACT ════════════════════════════════════════════════ -->
      <div class="hlayer l-contact" aria-label="Contact">
        <div class="contact-inner">
          <p class="contact-depth">↓ 120m depth</p>
          <h2 class="contact-heading">
            Let's build something<br>
            <span>together.</span>
          </h2>
          <p class="contact-sub">
            Open to full-time roles, freelance projects, and interesting collaborations.
          </p>
          <div class="contact-links">
            <a href="mailto:hello@brunocarvalho.dev" class="contact-email">
              <i class="ti ti-mail" /> Send an email
            </a>
            <a href="https://linkedin.com/in/bruno-mr-carvalho" target="_blank" rel="noopener noreferrer"
              class="contact-social">
              <i class="ti ti-brand-linkedin" />
            </a>
            <a href="https://github.com/Ekkl3s1a" target="_blank" rel="noopener noreferrer" class="contact-social">
              <i class="ti ti-brand-github" />
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

// ── Scroll driver ─────────────────────────────────────────────
.home {
  position: relative;

  &__driver {
    height: 700vh;
    pointer-events: none;
  }

  // ── Stage (fixo, full viewport) ───────────────────────────
  &__stage {
    position: fixed;
    inset: 0;
    z-index: 1;
    overflow: hidden;
  }

  // ── Caustics (luz a atravessar água) ─────────────────────
  &__caustics {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse at 18% 48%, rgba(45, 212, 191, .05) 0%, transparent 52%),
      radial-gradient(ellipse at 78% 22%, rgba(45, 212, 191, .06) 0%, transparent 52%),
      radial-gradient(ellipse at 52% 78%, rgba(45, 212, 191, .04) 0%, transparent 52%);
    animation: caustics 11s ease-in-out infinite;
  }

  // ── Vignette (escurece com profundidade) ──────────────────
  &__vignette {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0; // GSAP anima de 0 → .88
    background:
      radial-gradient(ellipse at 50% 105%,
        rgba(4, 15, 15, .96) 0%,
        rgba(4, 20, 20, .65) 42%,
        transparent 72%);
  }

  // ── Surface shimmer (entrada na página) ───────────────────
  &__surface {
    position: absolute;
    inset: 0;
    z-index: 30;
    pointer-events: none;
    background: linear-gradient(180deg,
        rgba(45, 212, 191, .18) 0%,
        rgba(8, 33, 33, .55) 30%,
        transparent 60%);
    animation: surface-exit 2.2s ease-out forwards;
  }

  // ── Profundidade label ────────────────────────────────────
  &__depth {
    position: absolute;
    bottom: 1.5rem;
    right: 1.75rem;
    z-index: 50;
    font-family: var(--font-mono);
    font-size: .7rem;
    color: rgba(45, 212, 191, .45);
    letter-spacing: .06em;
    transition: color .4s ease;
  }
}

// ── Layer base ─────────────────────────────────────────────────
.hlayer {
  position: absolute;
  inset: 0;
  z-index: 10;

  // Todos os layers exceto hero começam invisíveis
  &.l-about,
  &.l-skills,
  &.l-projects,
  &.l-certs,
  &.l-contact {
    opacity: 0;
    pointer-events: none;
    will-change: opacity, transform, filter;
  }

  // Hero visível
  &.l-hero {
    display: flex;
    flex-direction: column;
    z-index: 15;
  }
}

// ── VS Code chrome ────────────────────────────────────────────
.vsc-bar {
  display: flex;
  align-items: center;
  flex-shrink: 0;

  // Titlebar
  &--title {
    height: 38px;
    background: rgba(13, 46, 44, .97);
    border-bottom: 1px solid rgba(45, 212, 191, .1);
    padding: 0 12px;
    gap: 10px;
    backdrop-filter: blur(10px);
  }

  // Activity bar
  &--activity {
    width: 48px;
    flex-direction: column;
    justify-content: flex-start;
    padding: 14px 0;
    gap: 22px;
    background: rgba(8, 33, 33, .97);
    border-right: 1px solid rgba(45, 212, 191, .08);
    display: none;

    @include respond-to('lg') {
      display: flex;
    }

    i {
      font-size: 20px;
      color: rgba(45, 212, 191, .45);
      transition: color var(--transition-base);

      &:first-child {
        color: var(--color-primary);
      }

      &:hover {
        color: var(--color-text);
      }
    }
  }

  // Status bar
  &--status {
    height: 24px;
    background: var(--color-primary);
    padding: 0 12px;
    justify-content: space-between;
    font-size: 11px;
    font-family: var(--font-mono);
    color: #082121;
    font-weight: 500;

    i {
      font-size: 12px;
    }
  }
}

.vsc-dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.vsc-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &--r {
    background: #FF5F57;
  }

  &--y {
    background: #FEBC2E;
  }

  &--g {
    background: #28C840;
  }
}

.vsc-tabs {
  display: flex;
  height: 100%;
  align-items: flex-end;
  flex: 1;
  overflow: hidden;
}

.vsc-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 28px;
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  border-right: 1px solid rgba(45, 212, 191, .08);
  white-space: nowrap;

  &--on {
    background: rgba(8, 33, 33, .98);
    color: var(--color-text);
    border-top: 1.5px solid var(--color-primary);
    border-bottom: none;
  }
}

.vsc-wintitle {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  display: none;

  @include respond-to('xl') {
    display: block;
  }
}

.vsc-editor {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.vsc-gutter {
  display: none;

  @include respond-to('md') {
    display: flex;
  }

  flex-direction: column;
  list-style: none;
  padding: 1.75rem 10px 1.75rem 0;
  min-width: 44px;
  text-align: right;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 2;
  color: rgba(45, 212, 191, .18);
  user-select: none;
  flex-shrink: 0;
}

.vsc-code {
  display: none;

  @include respond-to('xl') {
    display: block;
  }

  width: 360px;
  flex-shrink: 0;
  padding: 1.75rem 1.5rem;
  background: rgba(8, 33, 33, .42);
  border-left: 1px solid rgba(45, 212, 191, .08);
  font-family: var(--font-mono);
  font-size: .875rem;
  line-height: 2;
  overflow: hidden;

  pre {
    margin: 0;
  }

  .k {
    color: var(--color-primary);
  }

  .t {
    color: #A78BFA;
  }

  .v {
    color: var(--color-text);
  }

  .s {
    color: var(--color-secondary);
  }

  .o {
    color: var(--color-text-muted);
  }
}

// ── Hero content ──────────────────────────────────────────────
.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.75rem 1.5rem;

  @include respond-to('xl') {
    padding: 2.5rem 2.5rem;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-size: .8125rem;
  font-family: var(--font-mono);
  color: var(--color-primary);

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-success);
    box-shadow: 0 0 0 3px rgba(52, 211, 153, .25);
    animation: pulse 2.2s ease-in-out infinite;
  }
}

.hero-title {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -.025em;
  line-height: 1.1;
  margin: 0;
}

.hero-name {
  display: block;
  color: var(--color-primary);
}

.hero-role {
  font-family: var(--font-mono);
  font-size: clamp(.95rem, 2.2vw, 1.25rem);
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 1.8em;
}

.hero-cursor {
  color: var(--color-primary);

  &.off {
    opacity: 0;
  }
}

.hero-bio {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  max-width: 500px;
  margin: 0;

  strong {
    color: var(--color-text);
    font-weight: 600;
  }
}

.hero-link {
  color: var(--color-primary);
  text-underline-offset: 3px;

  &:hover {
    text-decoration-color: var(--color-primary);
  }
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .875rem;
}

.hero-socials {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1.375rem;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #082121;
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-secondary);
    transform: translateY(-1px);
  }
}

.btn-outlined {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1.375rem;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  font-size: .9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);

  &:hover {
    background: rgba(45, 212, 191, .08);
  }
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  font-size: .875rem;
  color: var(--color-text-muted);
  padding: .375rem .75rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(45, 212, 191, .15);
  text-decoration: none;
  transition: all var(--transition-base);

  i {
    font-size: 16px;
  }

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

// ── Layer badge (label flutuante) ─────────────────────────────
.layer-badge {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: .7rem;
  letter-spacing: .12em;
  color: rgba(45, 212, 191, .45);
  text-transform: uppercase;
  pointer-events: none;
}

// ── About ────────────────────────────────────────────────────
.l-about {
  display: flex;
  align-items: center;
  justify-content: center;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr repeat(3, auto);
  gap: 1.5rem;
  max-width: 900px;
  width: 90%;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto repeat(3, auto);
  }
}

.glass-card {
  background: rgba(13, 46, 44, .75);
  border: 1px solid rgba(45, 212, 191, .14);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(14px);
  padding: 1.75rem;
  font-size: .9375rem;
  color: var(--color-text-muted);
  line-height: 1.8;

  strong {
    color: var(--color-text);
  }
}

.stat-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .25rem;
  background: rgba(8, 33, 33, .7);
  border: 1px solid rgba(45, 212, 191, .18);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(12px);
  padding: 1.25rem 1.75rem;
  animation: float-bubble 3.5s ease-in-out infinite;
  animation-delay: var(--delay, 0s);

  &__val {
    font-family: var(--font-mono);
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-primary);
    line-height: 1;
  }

  &__lbl {
    font-size: .75rem;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--color-text-muted);
  }
}

// ── Skills ───────────────────────────────────────────────────
.skills-scene {
  position: absolute;
  inset: 0;
}

.skill-tag {
  position: absolute;
  font-family: var(--font-mono);
  background: rgba(8, 33, 33, .7);
  border: 1px solid currentColor;
  border-radius: var(--radius-pill);
  backdrop-filter: blur(10px);
  white-space: nowrap;
  animation: float-skill 3.5s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  cursor: default;
  transition: transform var(--transition-base), box-shadow var(--transition-base);

  &:hover {
    box-shadow: 0 0 16px currentColor;
    transform: translateY(-4px) rotate(0deg) !important;
  }

  &--xl {
    font-size: .95rem;
    padding: .5rem 1.125rem;
  }

  &--lg {
    font-size: .875rem;
    padding: .45rem 1rem;
  }

  &--md {
    font-size: .8rem;
    padding: .4rem .875rem;
  }

  &--sm {
    font-size: .75rem;
    padding: .35rem .75rem;
    opacity: .85;
  }

  &--xs {
    font-size: .7rem;
    padding: .3rem .625rem;
    opacity: .7;
  }
}

// ── Projects ──────────────────────────────────────────────────
.l-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.projects-scene {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  perspective: 800px;
}

.project-card {
  width: 280px;
  background: rgba(13, 46, 44, .78);
  border: 1px solid rgba(45, 212, 191, .14);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(14px);
  padding: 1.375rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: .75rem;
  animation: float-bubble 4s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.4s);
  transition: border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base);

  &:hover {
    border-color: rgba(45, 212, 191, .4);
    transform: translateY(-6px);
    box-shadow: 0 0 24px rgba(45, 212, 191, .15);
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
  }

  &__ext {
    font-size: 13px;
    color: var(--color-text-muted);
    flex-shrink: 0;
    opacity: 0;
    transition: opacity var(--transition-base);
  }

  &:hover &__ext {
    opacity: 1;
  }

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
    justify-content: space-between;
    padding-top: .5rem;
    border-top: 1px solid rgba(45, 212, 191, .1);
  }

  &__lang {
    font-family: var(--font-mono);
    font-size: .75rem;
    color: var(--color-primary);
    background: rgba(45, 212, 191, .08);
    padding: 2px 8px;
    border-radius: var(--radius-pill);
  }

  &__stars {
    display: flex;
    align-items: center;
    gap: .25rem;
    font-family: var(--font-mono);
    font-size: .75rem;
    color: var(--color-text-muted);
  }
}

// ── Certs ─────────────────────────────────────────────────────
.l-certs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.certs-scene {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cert-badge {
  display: flex;
  align-items: center;
  gap: .875rem;
  background: rgba(13, 46, 44, .78);
  border: 1px solid rgba(212, 175, 55, .2);
  border-radius: var(--radius-xl);
  backdrop-filter: blur(14px);
  padding: 1.125rem 1.5rem;
  animation: float-bubble 4.5s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * 0.35s);
  transition: all var(--transition-base);

  &:hover {
    border-color: rgba(212, 175, 55, .45);
    box-shadow: 0 0 20px rgba(212, 175, 55, .12);
  }

  &__icon {
    font-size: 22px;
    color: #FBBF24;
    flex-shrink: 0;
  }

  &__title {
    font-size: .875rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__issuer {
    font-size: .8rem;
    color: var(--color-primary);
    margin-top: 2px;
  }
}

// ── Contact ───────────────────────────────────────────────────
.l-contact {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 560px;
}

.contact-depth {
  font-family: var(--font-mono);
  font-size: .75rem;
  color: rgba(45, 212, 191, .4);
  letter-spacing: .1em;
}

.contact-heading {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -.025em;
  margin: 0;

  span {
    color: var(--color-primary);
  }
}

.contact-sub {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 420px;
}

.contact-links {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.contact-email {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .75rem 1.75rem;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #082121;
  font-size: .9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);

  &:hover {
    background: var(--color-secondary);
    transform: translateY(-2px);
  }
}

.contact-social {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid rgba(45, 212, 191, .25);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 20px;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

// ── Shared ────────────────────────────────────────────────────
.see-all {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-size: .875rem;
  font-family: var(--font-mono);
  color: var(--color-primary);
  border: 1px solid rgba(45, 212, 191, .25);
  background: rgba(8, 33, 33, .6);
  backdrop-filter: blur(8px);
  padding: .5rem 1.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--color-primary);
    background: rgba(45, 212, 191, .08);
  }
}

// ── Keyframes ─────────────────────────────────────────────────
@keyframes float-bubble {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes float-skill {

  0%,
  100% {
    transform: translateY(0) rotate(var(--rot, -1deg));
  }

  50% {
    transform: translateY(-7px) rotate(calc(var(--rot, -1deg) + 2deg));
  }
}

// ── Keyframes atmosphere ──────────────────────────────────────

@keyframes caustics {

  0%,
  100% {
    background-position: 0% 0%, 100% 0%, 50% 100%;
    opacity: .8;
  }

  33% {
    background-position: 8% 18%, 92% 28%, 42% 82%;
    opacity: 1;
  }

  66% {
    background-position: 4% 38%, 96% 8%, 56% 88%;
    opacity: .7;
  }
}

@keyframes surface-exit {
  0% {
    opacity: 1;
  }

  60% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    pointer-events: none;
  }
}
</style>