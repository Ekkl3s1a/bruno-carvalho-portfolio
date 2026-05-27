import { useRouter, useRoute } from 'vue-router'

const HEADER_OFFSET = 72 // altura do header fixo em px

export function useScrollTo() {
  const router = useRouter()
  const route  = useRoute()

  function scrollTo(sectionId: string) {
    if (route.path === '/') {
      // Já estamos na home — scroll directo
      scrollToElement(sectionId)
    } else {
      // Noutra página — navega para home e depois faz scroll
      router.push('/').then(() => {
        // Aguarda o DOM renderizar as secções
        setTimeout(() => scrollToElement(sectionId), 80)
      })
    }
  }

  function scrollToElement(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return { scrollTo }
}