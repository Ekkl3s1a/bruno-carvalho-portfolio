import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Certification } from '@/types'

export const useCertificationsStore = defineStore('certifications', () => {
  const certifications = ref<Certification[]>([
    {
      id: 1,
      title: 'Angular — The Complete Guide',
      issuer: 'Udemy',
      date: '2024-05',
      credentialUrl: '#',
      skills: ['Angular 17', 'TypeScript', 'RxJS', 'Angular Material'],
    },
    {
      id: 2,
      title: 'Vue.js 3 – The Complete Guide',
      issuer: 'Udemy',
      date: '2024-01',
      credentialUrl: '#',
      skills: ['Vue 3', 'Composition API', 'Vue Router', 'Pinia'],
    },
    {
      id: 3,
      title: 'React — The Complete Guide',
      issuer: 'Udemy',
      date: '2023-09',
      credentialUrl: '#',
      skills: ['React 18', 'Hooks', 'Redux', 'Next.js'],
    },
    {
      id: 4,
      title: 'TypeScript Masterclass',
      issuer: 'Udemy',
      date: '2023-06',
      credentialUrl: '#',
      skills: ['TypeScript', 'Generics', 'Decorators', 'Type Guards'],
    },
    {
      id: 5,
      title: 'Python & FastAPI – REST APIs',
      issuer: 'Udemy',
      date: '2023-03',
      credentialUrl: '#',
      skills: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy'],
    },
    {
      id: 6,
      title: 'Advanced CSS and SCSS',
      issuer: 'Udemy',
      date: '2022-11',
      credentialUrl: '#',
      skills: ['SCSS', 'CSS3', 'Flexbox', 'Grid', 'Animations'],
    },
  ])

  return { certifications }
})