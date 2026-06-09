import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Certification } from '@/types'

export const useCertificationsStore = defineStore('certifications', () => {
  const certifications = ref<Certification[]>([
    {
      id: 1,
      title: 'Angular — The Complete Guide',
      description: 'Comprehensive course covering Angular 17, TypeScript, RxJS, and Angular Material for building dynamic web applications.',
      issuer: 'Udemy',
      date: '2024-05',
      credentialUrl: '#',
      skills: ['Angular 17', 'TypeScript', 'RxJS', 'Angular Material'],
    },
    {
      id: 2,
      title: 'Vue.js 3 – The Complete Guide',
      description: 'Comprehensive course covering Vue 3, Composition API, Vue Router, and Pinia for building modern web applications.',
      issuer: 'Udemy',
      date: '2024-01',
      credentialUrl: '#',
      skills: ['Vue 3', 'Composition API', 'Vue Router', 'Pinia'],
    },
    {
      id: 3,
      title: 'React — The Complete Guide',
      description: 'Comprehensive course covering React 18, Hooks, Redux, and Next.js for building dynamic web applications.',
      issuer: 'Udemy',
      date: '2023-09',
      credentialUrl: '#',
      skills: ['React 18', 'Hooks', 'Redux', 'Next.js'],
    },
    {
      id: 4,
      title: 'TypeScript Masterclass',
      description: 'In-depth course covering TypeScript fundamentals, advanced types, generics, decorators, and type guards for building robust applications.',
      issuer: 'Udemy',
      date: '2023-06',
      credentialUrl: '#',
      skills: ['TypeScript', 'Generics', 'Decorators', 'Type Guards'],
    },
    {
      id: 5,
      title: 'Python & FastAPI – REST APIs',
      description: 'Comprehensive course covering Python, FastAPI, Pydantic, and SQLAlchemy for building high-performance REST APIs.',
      issuer: 'Udemy',
      date: '2023-03',
      credentialUrl: '#',
      skills: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy'],
    },
    {
      id: 6,
      title: 'Advanced CSS and SCSS',
      description: 'In-depth course covering advanced CSS techniques, SCSS features, Flexbox, Grid, and CSS animations for creating responsive and visually appealing web designs.',
      issuer: 'Udemy',
      date: '2022-11',
      credentialUrl: '#',
      skills: ['SCSS', 'CSS3', 'Flexbox', 'Grid', 'Animations'],
    },
  ])

  function getById(id: number) {
    return certifications.value.find(c => c.id === id) ?? null
  }

  return { certifications, getById }
})