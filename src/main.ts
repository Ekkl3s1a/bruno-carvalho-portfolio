import { createApp } from 'vue'
import { createPinia } from 'pinia'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

import App from './App.vue'
import router from './router'
import { i18n } from '@/i18n'

// Global styles (tokens + reset + typography + animations)
import '@/styles/main.scss'

// ── Registar plugins GSAP uma única vez, globalmente ─────────
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// ScrollTrigger defaults para todo o projecto
ScrollTrigger.config({ limitCallbacks: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
