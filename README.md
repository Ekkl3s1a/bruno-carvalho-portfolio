# Bruno Carvalho — Portfolio

Personal portfolio built with Vue 3, TypeScript, and SCSS.
Live at **https://ekkl3s1a.github.io/bruno-carvalho-portfolio/**

## Tech stack

| Layer       | Tools                                              |
|-------------|---------------------------------------------------|
| Framework   | Vue 3.5 · Composition API · `<script setup>`      |
| Language    | TypeScript                                         |
| Build       | Vite 6                                             |
| State       | Pinia (theme · GitHub repos · certifications)     |
| Routing     | Vue Router 4 · hash history                       |
| Styling     | SCSS · 3-layer CSS custom properties (dark/light) |
| Icons       | Lucide Vue Next                                    |
| Utilities   | @vueuse/core                                       |
| Deploy      | GitHub Actions → GitHub Pages                      |

## Setup

```bash
npm install
npm run dev      # http://localhost:5173/bruno-carvalho-portfolio/
npm run build    # output: dist/
npm run preview  # preview do build de produção
```

## Project structure
src/
├── components/
│   ├── layout/     # AppHeader · AppFooter
│   ├── shared/     # BaseButton · SectionTitle · SkillTag
│   │               # SocialLink · ThemeToggle · ScrollReveal
│   └── sections/   # Hero · About · Skills · Projects
│                   # Certifications · Testimonials · Interests · Contact
├── composables/    # useScrollTo
├── router/         # index.ts
├── stores/         # theme · github · certifications
├── styles/         # _tokens · _mixins · _reset · _typography
│                   # _animations · main.scss
├── types/          # index.ts
└── views/          # HomeView · ProjectsView · CertificationsView

## Personalizar

| O que mudar             | Ficheiro                               |
|-------------------------|----------------------------------------|
| Bio e redes sociais     | `HeroSection.vue` · `AboutSection.vue` |
| Certificações           | `stores/certifications.ts`             |
| Testemunhos             | `TestimonialsSection.vue`              |
| Interesses              | `InterestsSection.vue`                 |
| Email de contacto       | `ContactSection.vue`                   |
| CV (PDF)                | `public/resume_bruno_carvalho.pdf`     |
| GitHub username         | `stores/github.ts` → `USERNAME`        |

## Deploy

Push para `main` → GitHub Actions faz build → publica em GitHub Pages.

Antes do primeiro deploy, activa Pages em:
**Settings → Pages → Source: GitHub Actions**