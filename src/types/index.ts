// ─────────────────────────────────────────────────────────────
// src/types/index.ts — Shared TypeScript interfaces
// ─────────────────────────────────────────────────────────────

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
  created_at: string
  fork: boolean
  archived: boolean
}

export interface Certification {
  id: number
  title: string
  issuer: string
  date: string           // 'YYYY-MM'
  credentialUrl?: string
  skills: string[]
  logo?: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  text: string
  avatar?: string
}

export type Theme = 'dark' | 'light'

export interface NavLink {
  label: string
  to: string
  external?: boolean
}
