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
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
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

const year = new Date().getFullYear()

const skillGroups = [
  {
    title: 'Frontend', icon: '⚡',
    cx: 20, cy: 38,
    skills: [
      { label: 'Angular', color: '#E40035', dx: 0, dy: -13, size: 'xl', delay: 0 },
      { label: 'Vue 3', color: '#42d392', dx: 10, dy: -8, size: 'xl', delay: .25 },
      { label: 'React', color: '#61DAFB', dx: 8, dy: 4, size: 'lg', delay: .45 },
      { label: 'TypeScript', color: '#3178C6', dx: -5, dy: 10, size: 'lg', delay: .1 },
      { label: 'SCSS', color: '#CF649A', dx: 5, dy: 13, size: 'md', delay: .55 },
      { label: 'Vite', color: '#BD34FE', dx: -10, dy: 3, size: 'md', delay: .35 },
      { label: 'Nuxt', color: '#00DC82', dx: 0, dy: 17, size: 'sm', delay: .65 },
      { label: 'Next.js', color: '#ffffff', dx: -9, dy: -8, size: 'sm', delay: .7 },
    ],
  },
  {
    title: 'Backend & APIs', icon: '🛠',
    cx: 78, cy: 36,
    skills: [
      { label: 'FastAPI', color: '#009485', dx: -6, dy: -10, size: 'lg', delay: .15 },
      { label: 'Express', color: '#aaaaaa', dx: 5, dy: -9, size: 'md', delay: .6 },
      { label: 'Node.js', color: '#339933', dx: 10, dy: 2, size: 'md', delay: .75 },
      { label: 'REST APIs', color: '#FF8C69', dx: -3, dy: 10, size: 'sm', delay: .3 },
      { label: 'Docker', color: '#2496ED', dx: 5, dy: 10, size: 'sm', delay: .95 },
      { label: 'Git', color: '#F05032', dx: -10, dy: 2, size: 'sm', delay: .4 },
    ],
  },
  {
    title: 'Dev Tools', icon: '🔧',
    cx: 50, cy: 68,
    skills: [
      { label: 'Figma', color: '#F24E1E', dx: -5, dy: -8, size: 'md', delay: .5 },
      { label: 'Three.js', color: '#2DD4BF', dx: 3, dy: -8, size: 'sm', delay: .85 },
      { label: 'GSAP', color: '#88CE02', dx: 8, dy: 0, size: 'sm', delay: .9 },
      { label: 'VS Code', color: '#2DD4BF', dx: 1, dy: 9, size: 'md', delay: .2 },
      { label: 'GitHub', color: '#ffffff', dx: -8, dy: 4, size: 'sm', delay: .55 },
    ],
  },
]

// Interests data
const interestBubbles = [
  // ── Sports (esquerda: x 8–44%) ─────────────────────────────
  { label: 'Football', emoji: '⚽', x: 14, y: 34, sz: 92, delay: 0, dur: 3.8 },
  { label: 'Running', emoji: '🏃', x: 38, y: 40, sz: 76, delay: .2, dur: 4.0 },
  { label: 'Calisthenics', emoji: '💪', x: 30, y: 62, sz: 88, delay: .35, dur: 4.2 },
  { label: 'Padel', emoji: '🏓', x: 10, y: 68, sz: 68, delay: .55, dur: 3.5 },

  // ── Tech (direita: x 58–90%) ─────────────────────────────
  { label: 'Open Source', emoji: '🔓', x: 66, y: 28, sz: 92, delay: .1, dur: 4.1 },
  { label: 'VS Code', emoji: '🎨', x: 85, y: 50, sz: 88, delay: .4, dur: 3.7 },
  { label: 'New Frameworks', emoji: '🚀', x: 60, y: 64, sz: 68, delay: .6, dur: 4.3 },
  { label: 'Tech Podcasts', emoji: '🎙', x: 80, y: 72, sz: 76, delay: .75, dur: 3.6 },
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
  { at: 0.40, label: '~25m' },
  { at: 0.56, label: '~50m' },
  { at: 0.70, label: '~80m' },
  { at: 0.80, label: '~100m' },
  { at: 0.88, label: '~120m' },
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

function backToSurface() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function setupTimeline() {
  const morphTo = getMorphTo()

  const tl = gsap.timeline({ paused: true })

  // ── HERO sai (0.18 → 0.30) ───────────────────────────────────
  tl.to('.vsc-bar--title', { y: -44, opacity: 0, ease: 'none', duration: .11 }, .18)
  tl.to('.vsc-bar--activity', { x: -52, opacity: 0, ease: 'none', duration: .11 }, .19)
  tl.to('.vsc-bar--status', { y: 28, opacity: 0, ease: 'none', duration: .11 }, .19)
  tl.to('.hero-content, .vsc-gutter, .vsc-code', {
    opacity: 0, scale: .93, filter: 'blur(5px)',
    ease: 'none', duration: .12,
  }, .20)
  tl.to('.l-hero', { opacity: 0, ease: 'none', duration: .06 }, .30)

  // ── ABOUT   (0.22 enter → 0.37 exit) ─────────────────────────
  tl.fromTo('.l-about',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .12 }, .22)
  tl.to('.l-about',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .09 }, .37)

  // ── SKILLS  (0.39 enter → 0.54 exit) ─────────────────────────
  tl.fromTo('.l-skills',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .13 }, .39)
  tl.to('.l-skills',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .09 }, .54)

  // ── PROJECTS (0.56 enter → 0.70 exit) ────────────────────────
  tl.fromTo('.l-projects',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .13 }, .56)
  tl.to('.l-projects',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .09 }, .70)

  // ── CERTS   (0.68 enter → 0.80 exit) ─────────────────────────
  tl.fromTo('.l-certs',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .10 }, .68)
  tl.to('.l-certs',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .08 }, .80)

  // ── INTERESTS (0.78 enter → 0.90 exit) ───────────────────────
  tl.fromTo('.l-interests',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .10 }, .78)
  tl.to('.l-interests',
    { opacity: 0, scale: 1.06, filter: 'blur(8px)', ease: 'none', duration: .08 }, .90)

  // ── CONTACT  (0.88 enter → stays) ────────────────────────────
  tl.fromTo('.l-contact',
    { opacity: 0, scale: .88, filter: 'blur(12px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'none', duration: .12 }, .88)

  // ── Vignette escurece até .90 de opacidade ────────────────────
  tl.to('.home__vignette', { opacity: .90, ease: 'none', duration: 1 }, 0)

  // ── Pointer-events helper ─────────────────────────────────────
  const tp = (sel: string, on: boolean) =>
    (document.querySelector(sel) as HTMLElement | null)
      ?.style.setProperty('pointer-events', on ? 'auto' : 'none')

  // ── Morph breaks ──────────────────────────────────────────────
  let lastSection = 'hero'
  const morphBreaks: Array<{ at: number; section: string }> = [
    { at: .22, section: 'about' },
    { at: .40, section: 'skills' },
    { at: .57, section: 'projects' },
    { at: .69, section: 'certifications' },
    { at: .79, section: 'about' }, // interests reusa esfera
    { at: .89, section: 'contact' },
  ]

  // ── ScrollTrigger ─────────────────────────────────────────────
  st = ScrollTrigger.create({
    trigger: '.home__driver',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.4,
    onUpdate(self) {
      tl.progress(self.progress)

      // Depth label
      for (const d of depths) {
        if (self.progress >= d.at) depthLabel.value = d.label
      }

      // Particle morph
      if (morphTo) {
        let cur = 'hero'
        for (const b of morphBreaks) {
          if (self.progress >= b.at) cur = b.section
        }
        if (cur !== lastSection) {
          lastSection = cur
          morphTo(cur as any)
        }
      }

      // Pointer-events sync
      const p = self.progress
      tp('.l-hero', p < .30)
      tp('.l-about', p >= .22 && p < .46)
      tp('.l-skills', p >= .39 && p < .62)
      tp('.l-projects', p >= .56 && p < .78)
      tp('.l-certs', p >= .68 && p < .86)
      tp('.l-interests', p >= .78 && p < .92)
      tp('.l-contact', p >= .88)
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
        <div class="vsc-bar vsc-bar--title">

          <!-- Window controls -->
          <div class="vsc-dots" aria-hidden="true">
            <span class="vsc-dot vsc-dot--r" />
            <span class="vsc-dot vsc-dot--y" />
            <span class="vsc-dot vsc-dot--g" />
          </div>

          <!-- Tabs = navegação real -->
          <nav class="vsc-tabs" aria-label="Site navigation">
            <!-- Tab activo: esta página -->
            <span class="vsc-tab vsc-tab--on" aria-current="page">
              <span aria-hidden="true">⚡</span>
              developer.ts
            </span>

            <!-- Tabs navegáveis -->
            <RouterLink to="/projects" class="vsc-tab">
              <span aria-hidden="true">📂</span>projects/
            </RouterLink>
            <RouterLink to="/certifications" class="vsc-tab">
              <span aria-hidden="true">🏆</span>certifications/
            </RouterLink>
          </nav>

          <!-- Accções -->
          <div class="vsc-titlebar-actions">

            <!-- Theme toggle -->
            <button class="vsc-action vsc-action--toggle"
              :aria-label="themeStore.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
              :data-tip="themeStore.theme === 'dark' ? 'Light mode' : 'Dark mode'" @click="themeStore.toggleTheme()">
              <!-- Sol (dark mode → trocar para light) -->
              <svg v-if="themeStore.theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
              <!-- Lua (light mode → trocar para dark) -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" />
              </svg>
            </button>

            <span class="vsc-action-sep" aria-hidden="true" />

            <!-- Download CV -->
            <a :href="cvUrl" download class="vsc-action vsc-action--cv" data-tip="Download CV"
              aria-label="Download CV PDF">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M12 15V3" />
                <path d="m8 11 4 4 4-4" />
                <path d="M3 19h18v2H3z" />
              </svg>
              <span>CV</span>
            </a>

          </div>

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
              <SocialLink platform="github" url="https://github.com/Ekkl3s1a" show-label />
              <SocialLink platform="linkedin" url="https://linkedin.com/in/bruno-mr-carvalho" show-label />
            </div>
          </div>

          <!-- Code panel — desktop only -->
          <aside class="vsc-code" aria-hidden="true">
            <pre><code
><span class="k">const</span> <span class="v">bruno</span><span class="o">:</span> <span class="t">Developer</span> <span class="o">=</span> {
  name<span class="o">:</span>      <span class="s">'Bruno Carvalho'</span><span class="o">,</span>
  location<span class="o">:</span>  <span class="s">'Portugal 🇵🇹'</span><span class="o">,</span>
  stack<span class="o">:</span>  [
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
        <div class="layer-badge">Core Competencies</div>

        <div class="skills-scene">
          <template v-for="group in skillGroups" :key="group.title">

            <!-- Group label (cluster centre) -->
            <div class="skill-group-label" :style="{ left: group.cx + '%', top: group.cy + '%' }" aria-hidden="true">
              <span>{{ group.icon }}</span>
              <span>{{ group.title }}</span>
            </div>

            <!-- Individual skills orbiting the group -->
            <span v-for="skill in group.skills" :key="skill.label" class="skill-tag" :class="`skill-tag--${skill.size}`"
              :style="{
                left: (group.cx + skill.dx) + '%',
                top: (group.cy + skill.dy) + '%',
                color: skill.color,
                borderColor: skill.color + '30',
                '--rot': (skill.dx > 0 ? 1.5 : -1.5) + 'deg',
                animationDelay: skill.delay + 's',
              }">{{ skill.label }}</span>

          </template>
        </div>
      </div>


      <!-- ══ PROJECTS ═══════════════════════════════════════════════ -->
      <div class="hlayer l-projects" aria-label="Projects">
        <div class="layer-badge">Work</div>
        <div class="projects-scene">
          <a v-for="(repo, i) in previewProjects" :key="repo.id" :href="repo.html_url" target="_blank"
            rel="noopener noreferrer" class="project-card" :style="{ '--i': i }">
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

      <!-- ══ INTERESTS ══════════════════════════════════════════════ -->
      <div class="hlayer l-interests" aria-label="Interests & hobbies">

        <!-- Sports label — centrado sobre o grupo -->
        <div class="interests-zone" style="left:24%;top:14%" aria-hidden="true">
          <i class="ti ti-heartbeat" /> Sports & Health
        </div>

        <!-- Tech label — centrado sobre o grupo -->
        <div class="interests-zone" style="left:74%;top:14%" aria-hidden="true">
          <i class="ti ti-code" /> Tech & Learning
        </div>

        <!-- Divider line -->
        <div class="interests-divider" aria-hidden="true" />

        <!-- Bubbles -->
        <div v-for="b in interestBubbles" :key="b.label" class="interest-bubble" :style="{
          left: b.x + '%',
          top: b.y + '%',
          '--sz': b.sz + 'px',
          '--dur': b.dur + 's',
          '--delay': b.delay + 's',
        }" role="listitem">
          <div class="interest-bubble__circle">
            <span class="interest-bubble__emoji" aria-hidden="true">{{ b.emoji }}</span>
          </div>
          <span class="interest-bubble__label">{{ b.label }}</span>
        </div>

      </div>

      <!-- ══ CONTACT ════════════════════════════════════════════════ -->
      <div class="hlayer l-contact" aria-label="Contact">
        <div class="contact-inner">

          <p class="contact-depth" aria-hidden="true">↓ 120m</p>

          <h2 class="contact-heading">
            Let's build something<br>
            <span>together.</span>
          </h2>

          <p class="contact-sub">
            Open to full-time roles, freelance projects, and interesting collaborations.
          </p>

          <!-- Email CTA -->
          <a href="mailto:carvalhobrunomr@gmail.com" class="contact-email">
            <i class="ti ti-mail" aria-hidden="true" />
            carvalhobrunomr@gmail.com
          </a>

          <!-- Social links -->
          <div class="contact-socials">
            <a href="https://github.com/Ekkl3s1a" target="_blank" rel="noopener noreferrer" class="contact-social"
              aria-label="GitHub profile">
              <i class="ti ti-brand-github" aria-hidden="true" />
              GitHub
            </a>
            <a href="https://linkedin.com/in/bruno-mr-carvalho" target="_blank" rel="noopener noreferrer"
              class="contact-social" aria-label="LinkedIn profile">
              <i class="ti ti-brand-linkedin" aria-hidden="true" />
              LinkedIn
            </a>
            <a href="https://marketplace.visualstudio.com/items?itemName=ekkl3s1a.ekkl3s1a-themes" target="_blank"
              rel="noopener noreferrer" class="contact-social" aria-label="VS Code theme">
              <i class="ti ti-brand-vscode" aria-hidden="true" />
              VS Code Theme
            </a>
          </div>

          <!-- Mini footer -->
          <div class="contact-footer-line">
            <span>© {{ year }} Bruno Carvalho</span>
            <span class="contact-footer-sep">·</span>
            <span>Built with <span class="contact-vue">Vue 3</span></span>
            <span class="contact-footer-sep">·</span>
            <button class="contact-surface-btn" aria-label="Back to top" @click="backToSurface">
              ↑ Back to surface
            </button>
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
    height: 800vh;
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
  min-width: 0;
  max-width: 60%;
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
.l-skills {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
}

.skills-scene {
  position: absolute;
  inset: 0;
}

// Group label (minimal, centered on cluster)
.skill-group-label {
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-family: var(--font-mono);
  font-size: .65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: rgba(45, 212, 191, .38);
  background: rgba(8, 33, 33, .65);
  border: 1px solid rgba(45, 212, 191, .1);
  padding: .225rem .65rem;
  border-radius: var(--radius-pill);
  backdrop-filter: blur(8px);
  pointer-events: none;
  z-index: 2;
  white-space: nowrap;
}

// Individual floating skill tags
.skill-tag {
  position: absolute;
  translate: -50% -50%;
  font-family: var(--font-mono);
  background: rgba(8, 33, 33, .72);
  border: 1px solid currentColor;
  border-radius: var(--radius-pill);
  backdrop-filter: blur(10px);
  white-space: nowrap;
  cursor: default;
  animation: float-skill 3.5s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  transition:
    transform .28s cubic-bezier(.34, 1.4, .64, 1),
    box-shadow .22s ease,
    opacity .15s ease;
  z-index: 1;

  &:hover {
    animation-play-state: paused;
    box-shadow:
      0 6px 20px -4px currentColor,
      0 2px 8px -2px rgba(0, 0, 0, .3);
    z-index: 3;
    opacity: 1 !important;
    transform: translateY(-6px) scale(1.05);
  }

  &--xl {
    font-size: .93rem;
    padding: .45rem 1.1rem;
  }

  &--lg {
    font-size: .84rem;
    padding: .4rem 1rem;
  }

  &--md {
    font-size: .78rem;
    padding: .35rem .875rem;
  }

  &--sm {
    font-size: .72rem;
    padding: .3rem .75rem;
    opacity: .85;
  }

  &--xs {
    font-size: .68rem;
    padding: .25rem .625rem;
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

// ── Interests layer ───────────────────────────────────────────
.l-interests {
  position: absolute;
  inset: 0;
}

.interests-zone {
  position: absolute;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: .62rem;
  color: rgba(45, 212, 191, .25);
  letter-spacing: .12em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: .4rem;
  pointer-events: none;
  white-space: nowrap;

  i {
    font-size: 11px;
  }
}

.interests-divider {
  position: absolute;
  top: 8%;
  bottom: 8%;
  left: 50%;
  width: 1px;
  background: linear-gradient(to bottom,
      transparent,
      rgba(45, 212, 191, .1) 20%,
      rgba(45, 212, 191, .1) 80%,
      transparent);
  pointer-events: none;
}

.interest-bubble {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .45rem;
  cursor: default;

  &__circle {
    width: var(--sz, 72px);
    height: var(--sz, 72px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(13, 46, 44, .78);
    border: 1px solid rgba(45, 212, 191, .16);
    backdrop-filter: blur(12px);
    animation: float-bubble var(--dur, 3.8s) ease-in-out infinite;
    animation-delay: var(--delay, 0s);
    transition: border-color .25s, box-shadow .25s, transform .2s;
  }

  &__emoji {
    font-size: calc(var(--sz, 72px) * .42);
    line-height: 1;
    user-select: none;
  }

  &__label {
    font-family: var(--font-mono);
    font-size: .7rem;
    color: rgba(45, 212, 191, .38);
    white-space: nowrap;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity .2s, transform .2s;
    pointer-events: none;
  }

  &:hover &__circle {
    border-color: rgba(45, 212, 191, .45);
    box-shadow: 0 0 20px rgba(45, 212, 191, .18), inset 0 0 20px rgba(45, 212, 191, .05);
    transform: scale(1.08);
  }

  &:hover &__label {
    opacity: 1;
    transform: translateY(0);
  }
}

// ── Contact layer ─────────────────────────────────────────────
.l-contact {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
  max-width: 560px;
  padding: 0 1.5rem;
}

.contact-depth {
  font-family: var(--font-mono);
  font-size: .75rem;
  color: rgba(45, 212, 191, .35);
  letter-spacing: .1em;
  margin: 0;
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
  max-width: 400px;
  margin: 0;
}

.contact-email {
  display: inline-flex;
  align-items: center;
  gap: .625rem;
  padding: .875rem 2rem;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #082121;
  font-size: .9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-base);

  i {
    font-size: 18px;
  }

  &:hover {
    background: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(45, 212, 191, .3);
  }
}

.contact-socials {
  display: flex;
  gap: .75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.contact-social {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  padding: .5rem 1.125rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(45, 212, 191, .2);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: .875rem;
  transition: all var(--transition-base);

  i {
    font-size: 17px;
  }

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    transform: translateY(-2px);
  }
}

.contact-footer-line {
  display: flex;
  align-items: center;
  gap: .5rem;
  flex-wrap: wrap;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: .72rem;
  color: rgba(45, 212, 191, .28);
}

.contact-footer-sep {
  opacity: .4;
}

.contact-vue {
  color: rgba(66, 211, 146, .55);
}

.contact-surface-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: .72rem;
  color: rgba(45, 212, 191, .28);
  transition: color .25s;
  padding: 0;

  &:hover {
    color: rgba(45, 212, 191, .6);
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

.vsc-titlebar-actions {
  display: flex;
  align-items: center;
  gap: .125rem;
  margin-left: auto;
  flex-shrink: 0;
  min-width: max-content;
  padding-right: 4px;
}

.vsc-action {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: rgba(45, 212, 191, .65);
  cursor: pointer;
  transition: background .15s, color .15s;
  font-size: 15px;
  overflow: visible;

  // Tooltip via data-tip
  &[data-tip]::after {
    content: attr(data-tip);
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(8, 33, 33, .95);
    border: 1px solid rgba(45, 212, 191, .18);
    color: rgba(45, 212, 191, .75);
    font-family: var(--font-mono);
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity .15s .2s;
    z-index: 100;
  }

  &:hover {
    background: rgba(45, 212, 191, .1);
    color: var(--color-primary);
  }

  &:hover::after {
    opacity: 1;
  }

  &--cv {
    display: inline-flex;
    align-items: center;
    gap: .3rem;
    width: auto;
    padding: 0 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    color: rgba(45, 212, 191, .5);
    text-decoration: none;
    transition: border-color .15s, background .15s, color .15s;

    &:hover {
      border-color: rgba(45, 212, 191, .4);
      background: rgba(45, 212, 191, .08);
      color: var(--color-primary);
    }

    i {
      font-size: 13px;
    }
  }

  &--toggle {
    &:active i {
      transform: rotate(20deg) scale(.85);
    }

    i {
      font-size: 15px;
      font-style: normal;
      line-height: 1;
      transition: transform .18s ease;
    }
  }
}

.vsc-action-sep {
  width: 1px;
  height: 16px;
  background: rgba(45, 212, 191, .1);
  margin: 0 .25rem;
  flex-shrink: 0;
}

// RouterLink active state nos tabs VS Code
.vsc-tab.router-link-active,
.vsc-tab.router-link-exact-active {
  background: rgba(8, 33, 33, .98);
  color: var(--color-text);
  border-top: 1.5px solid var(--color-primary);
  border-bottom: none;
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
    transform: translateY(-5px) rotate(calc(var(--rot, -1deg) + 1.5deg));
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

// ════════════════════════════════════════════════════════════
// LIGHT THEME — override de todos os valores hardcoded
// ════════════════════════════════════════════════════════════
[data-theme="light"] {

  // ── Atmosfera ────────────────────────────────────────────
  .home__caustics {
    background:
      radial-gradient(ellipse at 18% 48%, rgba(15, 118, 110, .07) 0%, transparent 52%),
      radial-gradient(ellipse at 78% 22%, rgba(15, 118, 110, .08) 0%, transparent 52%),
      radial-gradient(ellipse at 52% 78%, rgba(15, 118, 110, .05) 0%, transparent 52%);
  }

  .home__vignette {
    // Em light mode o vignette é uma névoa clara teal, não escura
    background: radial-gradient(ellipse at 50% 110%,
        rgba(200, 240, 235, .55) 0%,
        rgba(225, 245, 242, .25) 45%,
        transparent 72%);
  }

  .home__surface {
    background: linear-gradient(180deg,
        rgba(15, 118, 110, .10) 0%,
        rgba(232, 247, 244, .35) 30%,
        transparent 60%);
  }

  .home__depth {
    color: rgba(15, 118, 110, .55);
  }

  // ── VS Code titlebar ─────────────────────────────────────
  .vsc-bar--title {
    background: rgba(232, 247, 244, .97);
    border-bottom-color: rgba(15, 118, 110, .14);
  }

  .vsc-bar--activity {
    background: rgba(214, 239, 236, .97);
    border-right-color: rgba(15, 118, 110, .1);

    i {
      color: rgba(15, 118, 110, .5);

      &:first-child {
        color: #0f766e;
      }

      &:hover {
        color: #082121;
      }
    }
  }

  .vsc-tab {
    color: #4a8880;
    border-right-color: rgba(15, 118, 110, .1);

    &--on {
      background: rgba(255, 255, 255, .98);
      color: #082121;
      border-top-color: #0f766e;
    }
  }

  .vsc-gutter {
    color: rgba(15, 118, 110, .22);
  }

  .vsc-code {
    background: rgba(247, 253, 252, .75);
    border-left-color: rgba(15, 118, 110, .1);

    .v {
      color: #082121;
    }

    .o {
      color: #4a8880;
    }

    .s {
      color: #0f766e;
    }
  }

  // ── Actions ──────────────────────────────────────────────
  .vsc-action {
    color: rgba(15, 118, 110, .7);

    &:hover {
      background: rgba(15, 118, 110, .08);
      color: #0f766e;
    }

    &[data-tip]::after {
      background: rgba(240, 251, 249, .97);
      border-color: rgba(15, 118, 110, .2);
      color: #0f766e;
    }
  }

  .vsc-action--cv {
    color: rgba(15, 118, 110, .65);

    &:hover {
      border-color: rgba(15, 118, 110, .45);
      background: rgba(15, 118, 110, .06);
      color: #0f766e;
    }
  }

  .vsc-action-sep {
    background: rgba(15, 118, 110, .14);
  }

  // RouterLink active tab
  .vsc-tab.router-link-active,
  .vsc-tab.router-link-exact-active {
    background: rgba(255, 255, 255, .98);
    color: #082121;
    border-top-color: #0f766e;
  }

  // ── Layer badges ─────────────────────────────────────────
  .layer-badge {
    color: rgba(15, 118, 110, .6);
  }

  // ── Hero ─────────────────────────────────────────────────
  .hero-role {
    color: #0f766e;
  }

  .hero-bio {
    color: #2e5856;

    strong {
      color: #082121;
    }
  }

  .hero-link {
    color: #0f766e;
  }

  .hero-cursor {
    color: #0f766e;
  }

  .social-link {
    color: #2e5856;
    border-color: rgba(15, 118, 110, .2);

    &:hover {
      border-color: #0f766e;
      color: #0f766e;
    }
  }

  .btn-outlined:hover {
    background: rgba(15, 118, 110, .07);
  }

  // ── About ────────────────────────────────────────────────
  .glass-card {
    background: rgba(255, 255, 255, .90);
    border-color: rgba(15, 118, 110, .16);
    color: #2e5856;

    strong {
      color: #082121;
    }
  }

  .stat-bubble {
    background: rgba(242, 252, 250, .92);
    border-color: rgba(15, 118, 110, .2);

    &__lbl {
      color: #4a8880;
    }
  }

  // ── Skills ───────────────────────────────────────────────
  .skill-group-label {
    background: rgba(255, 255, 255, .90);
    border-color: rgba(15, 118, 110, .16);
    color: #0f766e;
  }

  .skill-tag {
    background: rgba(255, 255, 255, .88);

    &:hover {
      box-shadow:
        0 6px 20px -4px currentColor,
        0 2px 8px -2px rgba(0, 0, 0, .08);
    }
  }

  // ── Projects ─────────────────────────────────────────────
  .project-card {
    background: rgba(255, 255, 255, .90);
    border-color: rgba(15, 118, 110, .15);

    &__name {
      color: #082121;
    }

    &__desc {
      color: #2e5856;
    }

    &__lang {
      color: #0f766e;
      background: rgba(15, 118, 110, .08);
    }

    &__stars {
      color: #4a8880;
    }

    &__foot {
      border-top-color: rgba(15, 118, 110, .12);
    }

    &:hover {
      border-color: rgba(15, 118, 110, .4);
      box-shadow: 0 0 24px rgba(15, 118, 110, .1);
    }
  }

  .see-all {
    background: rgba(255, 255, 255, .82);
    border-color: rgba(15, 118, 110, .22);

    &:hover {
      border-color: #0f766e;
      background: rgba(15, 118, 110, .05);
    }
  }

  // ── Certs ────────────────────────────────────────────────
  .cert-badge {
    background: rgba(255, 255, 255, .90);
    border-color: rgba(180, 145, 20, .22);

    &__title {
      color: #082121;
    }

    &__issuer {
      color: #0f766e;
    }

    &:hover {
      border-color: rgba(180, 145, 20, .5);
      box-shadow: 0 0 20px rgba(180, 145, 20, .09);
    }
  }

  // ── Interests ────────────────────────────────────────────
  .interests-zone {
    color: rgba(15, 118, 110, .45);
  }

  .interests-divider {
    background: linear-gradient(to bottom,
        transparent,
        rgba(15, 118, 110, .14) 20%,
        rgba(15, 118, 110, .14) 80%,
        transparent);
  }

  .interest-bubble {
    &__circle {
      background: rgba(255, 255, 255, .90);
      border-color: rgba(15, 118, 110, .18);
    }

    &__label {
      color: #0f766e;
    }

    &:hover &__circle {
      border-color: rgba(15, 118, 110, .5);
      box-shadow: 0 0 20px rgba(15, 118, 110, .14), inset 0 0 16px rgba(15, 118, 110, .04);
    }
  }

  // ── Contact ──────────────────────────────────────────────
  .contact-depth {
    color: rgba(15, 118, 110, .45);
  }

  .contact-sub {
    color: #2e5856;
  }

  .contact-social {
    border-color: rgba(15, 118, 110, .2);
    color: #2e5856;

    &:hover {
      border-color: #0f766e;
      color: #0f766e;
    }
  }

  .contact-footer-line {
    color: rgba(15, 118, 110, .38);
  }

  .contact-footer-sep {
    opacity: .35;
  }

  .contact-vue {
    color: rgba(15, 118, 110, .65);
  }

  .contact-surface-btn {
    color: rgba(15, 118, 110, .38);

    &:hover {
      color: rgba(15, 118, 110, .72);
    }
  }
}
</style>