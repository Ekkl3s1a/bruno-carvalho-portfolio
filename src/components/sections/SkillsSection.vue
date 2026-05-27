<script setup lang="ts">
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'
import SkillTag from '@/components/shared/SkillTag.vue'

interface SkillGroup {
  title: string
  icon: string
  description: string
  skills: string[]
}

const groups: SkillGroup[] = [
  {
    title: 'Programming & Frameworks',
    icon: '⚡',
    description: 'Frontend-first, but not framework-exclusive.',
    skills: [
      'Angular', 'Vue 3', 'React',
      'TypeScript', 'JavaScript ES6+',
      'HTML5', 'CSS3 / SCSS',
      'Next.js', 'Nuxt 3',
    ],
  },
  {
    title: 'Tools & Platforms',
    icon: '🛠',
    description: 'From API design to CI/CD pipelines.',
    skills: [
      'FastAPI', 'Express.js', 'Node.js',
      'REST APIs', 'Git & GitHub',
      'GitHub Actions', 'Vite', 'Docker',
      'VS Code', 'Figma',
    ],
  },
  {
    title: 'Professional Skills',
    icon: '🎯',
    description: 'What makes the code matter beyond the syntax.',
    skills: [
      'Responsive Design',
      'Performance Optimization',
      'Component Architecture',
      'Clean Code',
      'Problem Solving',
      'UI / UX Sensibility',
      'Open Source',
    ],
  },
]
</script>

<template>
  <section id="skills" class="skills">
    <div class="skills__container">

      <ScrollReveal>
        <SectionTitle
          title="Core Competencies"
          subtitle="Technologies and skills I bring to every project."
        />
      </ScrollReveal>

      <div class="skills__grid">
        <ScrollReveal
          v-for="(group, i) in groups"
          :key="group.title"
          :delay="i * 100"
        >
          <div class="skills__card">
            <div class="skills__card-header">
              <span class="skills__card-icon" aria-hidden="true">{{ group.icon }}</span>
              <div>
                <h3 class="skills__card-title">{{ group.title }}</h3>
                <p class="skills__card-desc">{{ group.description }}</p>
              </div>
            </div>
            <div class="skills__tags">
              <SkillTag
                v-for="skill in group.skills"
                :key="skill"
                :label="skill"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.skills {
  @include section-padding;

  &__container { @include container; }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @include respond-to('lg') {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__card {
    @include card;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    &-header {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
    }

    &-icon {
      font-size: 1.5rem;
      line-height: 1;
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    &-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: 0.25rem;
    }

    &-desc {
      font-size: 0.8125rem;
      color: var(--color-text-muted);
      line-height: 1.5;
      margin: 0;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>