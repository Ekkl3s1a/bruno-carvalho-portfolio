// ─────────────────────────────────────────────────────────────
// src/router/index.ts
// Hash history = no server config needed for GitHub Pages
// ─────────────────────────────────────────────────────────────

import { createRouter, createWebHashHistory } from 'vue-router'
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
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0, behavior: 'smooth' }
  },
})

// Dynamic page title
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title
    ? `${title} — Bruno Carvalho`
    : 'Bruno Carvalho — Web Developer'
})

export default router
