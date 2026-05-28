<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-vue-next'
import ScrollReveal from '@/components/shared/ScrollReveal.vue'
import SectionTitle from '@/components/shared/SectionTitle.vue'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  text: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ana Silva',
    role: 'Senior Developer',
    company: 'Tech Corp',
    text: 'Bruno has an exceptional eye for UI detail and writes clean, maintainable components. His ability to pick up any framework quickly and deliver polished results is remarkable.',
  },
  {
    id: 2,
    name: 'Pedro Santos',
    role: 'Project Manager',
    company: 'Digital Agency',
    text: 'Working with Bruno is a pleasure — he delivers on time, communicates clearly, and always brings thoughtful solutions to complex problems. A true full-stack mindset.',
  },
  {
    id: 3,
    name: 'Maria Costa',
    role: 'UX Designer',
    company: 'Startup XYZ',
    text: 'Bruno is one of the rare developers who genuinely understands design. He implemented our Figma specs precisely and improved them along the way with great attention to detail.',
  },
]

const current   = ref(0)
const direction = ref<'left' | 'right'>('right')
let autoTimer: ReturnType<typeof setInterval>

function go(index: number) {
  direction.value = index > current.value ? 'right' : 'left'
  current.value   = (index + testimonials.length) % testimonials.length
}

function prev() { go(current.value - 1) }
function next() { go(current.value + 1) }

function startAuto() {
  autoTimer = setInterval(() => {
    direction.value = 'right'
    current.value   = (current.value + 1) % testimonials.length
  }, 5000)
}

function stopAuto()  { clearInterval(autoTimer) }
function resetAuto() { stopAuto(); startAuto() }

onMounted(startAuto)
onBeforeUnmount(stopAuto)
</script>

<template>
  <section id="testimonials" class="testimonials">
    <div class="testimonials__container">

      <ScrollReveal>
        <SectionTitle
          title="Testimonials"
          subtitle="What colleagues and clients have to say."
          align="center"
        />
      </ScrollReveal>

      <ScrollReveal :delay="100">
        <div
          class="testimonials__card"
          @mouseenter="stopAuto"
          @mouseleave="startAuto"
        >
          <!-- Ícone de quote decorativo -->
          <Quote
            class="testimonials__quote-icon"
            :size="36"
            aria-hidden="true"
          />

          <!-- Slide content -->
          <div class="testimonials__track">
            <Transition :name="`slide-${direction}`" mode="out-in">
              <div :key="current" class="testimonials__slide">
                <blockquote class="testimonials__text">
                  "{{ testimonials[current].text }}"
                </blockquote>
                <div class="testimonials__author">
                  <div class="testimonials__avatar" aria-hidden="true">
                    {{ testimonials[current].name.charAt(0) }}
                  </div>
                  <div>
                    <p class="testimonials__name">{{ testimonials[current].name }}</p>
                    <p class="testimonials__meta">
                      {{ testimonials[current].role }}
                      <span aria-hidden="true">·</span>
                      {{ testimonials[current].company }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Controls -->
          <div class="testimonials__controls">
            <button
              class="testimonials__btn"
              aria-label="Previous testimonial"
              @click="prev(); resetAuto()"
            >
              <ChevronLeft :size="18" aria-hidden="true" />
            </button>

            <div class="testimonials__dots" role="tablist" aria-label="Testimonials">
              <button
                v-for="(_, i) in testimonials"
                :key="i"
                class="testimonials__dot"
                :class="{ 'testimonials__dot--active': i === current }"
                role="tab"
                :aria-selected="i === current"
                :aria-label="`Testimonial ${i + 1}`"
                @click="go(i); resetAuto()"
              />
            </div>

            <button
              class="testimonials__btn"
              aria-label="Next testimonial"
              @click="next(); resetAuto()"
            >
              <ChevronRight :size="18" aria-hidden="true" />
            </button>
          </div>
        </div>
      </ScrollReveal>

    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.testimonials {
  @include section-padding;
  background: var(--color-surface);

  &__container {
    @include container;
    max-width: 760px;
  }

  &__card {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: 2.5rem;
    position: relative;
  }

  &__quote-icon {
    color: var(--color-primary);
    opacity: 0.20;
    margin-bottom: 1.25rem;
  }

  &__track {
    // Altura mínima para evitar layout shift entre slides
    min-height: 180px;

    @include respond-to('md') { min-height: 150px; }
  }

  &__slide {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__text {
    font-size: 1.0625rem;
    color: var(--color-text-muted);
    line-height: 1.85;
    font-style: italic;
  }

  &__author {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(45, 212, 191, 0.12);
    border: 1px solid rgba(45, 212, 191, 0.30);
    color: var(--color-primary);
    font-weight: 700;
    font-size: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  &__meta {
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1.75rem;
    border-top: 1px solid var(--color-border);
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--color-border);
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all var(--transition-base);

    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: rgba(45, 212, 191, 0.08);
    }
  }

  &__dots {
    display: flex;
    gap: 0.5rem;
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-border);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: all var(--transition-base);

    &--active {
      background: var(--color-primary);
      transform: scale(1.3);
    }

    &:hover:not(&--active) {
      background: var(--color-text-muted);
    }
  }
}

// ── Slide transitions ─────────────────────────────────────────

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.30s ease, transform 0.30s ease;
}

.slide-right-enter-from { opacity: 0; transform: translateX(30px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(-30px); }
.slide-left-enter-from  { opacity: 0; transform: translateX(-30px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(30px); }
</style>