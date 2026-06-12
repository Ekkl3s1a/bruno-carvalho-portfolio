// ─────────────────────────────────────────────────────────────
// src/router/index.ts
// Hash history = no server config needed for GitHub Pages
// ─────────────────────────────────────────────────────────────

import { createRouter, createWebHashHistory } from 'vue-router'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
      meta: { title: 'Projects' },
    },
    {
      path: '/certifications',
      name: 'certifications',
      component: () => import('@/views/CertificationsView.vue'),
      meta: { title: 'Certifications' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0, behavior: 'smooth' }
  },
})


router.beforeEach(() => {
  // Mata todas as instâncias activas antes de navegar
  const all = ScrollTrigger.getAll()
  all.forEach(st => st.kill())
})

router.afterEach(() => {
  // Pequeno delay para o DOM assentar, depois refresh
  requestAnimationFrame(() => {
    ScrollTrigger.refresh(true) // true = força recalcular posições
  })
})

export default router
