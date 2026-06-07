<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits<{ done: [] }>()

const STORAGE_KEY = 'bc_intro_v1'
const sceneRef    = ref<HTMLElement>()
const linesDom    = ref<HTMLElement[]>([])

const lines = [
  { text: '> initializing portfolio...',      type: 'cmd' },
  { text: '✓ teal-turquoise theme  loaded',   type: 'ok'  },
  { text: '✓ github api            connected', type: 'ok'  },
  { text: '✓ 4500 particles        ready',     type: 'ok'  },
  { text: '> diving in...',                    type: 'cmd' },
]

function complete() {
  if (!sceneRef.value) { emit('done'); return }
  localStorage.setItem(STORAGE_KEY, 'true')
  gsap.to(sceneRef.value, {
    opacity: 0,
    duration: .55,
    ease: 'power2.in',
    onComplete: () => emit('done'),
  })
}

function skip() {
  gsap.killTweensOf('*')
  complete()
}

onMounted(() => {
  if (localStorage.getItem(STORAGE_KEY)) { emit('done'); return }

  // Terminal window entrance
  gsap.fromTo('.intro-terminal',
    { opacity: 0, y: 18, scale: .97 },
    { opacity: 1, y: 0,  scale: 1, duration: .55, ease: 'back.out(1.6)', delay: .15 }
  )

  // Lines appear one by one
  const tl = gsap.timeline({ delay: .5 })

  linesDom.value.forEach((el, i) => {
    tl.to(el, {
      opacity: 1, y: 0,
      duration: .28, ease: 'power2.out',
    }, i === 0 ? 0 : `+=${i < 4 ? .48 : .6}`)
  })

  // Cursor blinks then dive
  tl.to('.intro-cursor', { opacity: 0, repeat: 5, yoyo: true, duration: .22, ease: 'none' }, '+=.2')
  tl.add(complete, '+=.3')
})
</script>

<template>
  <div ref="sceneRef" class="intro-scene" aria-live="polite">

    <!-- Rising bubbles (CSS only) -->
    <div v-for="i in 10" :key="i" class="intro-bubble"
      :style="{
        left: (8 + i * 9) + '%',
        '--dur':   (3.5 + i * .4) + 's',
        '--delay': (i * .35) + 's',
        '--sz':    (6 + (i % 4) * 6) + 'px',
      }" aria-hidden="true"
    />

    <!-- Terminal window -->
    <div class="intro-terminal" role="log">
      <div class="intro-terminal__bar" aria-hidden="true">
        <div class="intro-terminal__dots">
          <span class="id--r" /><span class="id--y" /><span class="id--g" />
        </div>
        <span class="intro-terminal__title">terminal — zsh</span>
      </div>

      <div class="intro-terminal__body">
        <div
          v-for="(line, i) in lines"
          :key="i"
          :ref="(el) => el && (linesDom[i] = el as HTMLElement)"
          class="intro-line"
          :class="`intro-line--${line.type}`"
          style="opacity:0; transform:translateY(5px)"
        >
          <span class="intro-line__prefix" aria-hidden="true">
            {{ line.type === 'ok' ? '  ' : '' }}
          </span>
          <span class="intro-line__text">{{ line.text }}</span>
          <span
            v-if="i === lines.length - 1"
            class="intro-cursor"
            aria-hidden="true"
          >█</span>
        </div>
      </div>
    </div>

    <button class="intro-skip" @click="skip" aria-label="Skip intro">
      Skip <span aria-hidden="true">↓</span>
    </button>

  </div>
</template>

<style lang="scss" scoped>
.intro-scene {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #030E0E;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

// ── Rising bubbles ───────────────────────────────────────────
.intro-bubble {
  position: absolute;
  bottom: -20px;
  width:  var(--sz, 10px);
  height: var(--sz, 10px);
  border-radius: 50%;
  background: rgba(45,212,191,.07);
  border: 1px solid rgba(45,212,191,.12);
  animation: bubble-rise var(--dur, 4s) ease-in infinite;
  animation-delay: var(--delay, 0s);
  pointer-events: none;
}

@keyframes bubble-rise {
  0%   { transform: translateY(0)     scale(0.4); opacity: 0; }
  8%   { opacity: 1; }
  90%  { opacity: .5; }
  100% { transform: translateY(-100vh) scale(1.1); opacity: 0; }
}

// ── Terminal window ──────────────────────────────────────────
.intro-terminal {
  width: 100%;
  max-width: 520px;
  background: rgba(8,28,28,.96);
  border: 1px solid rgba(45,212,191,.14);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,.65), 0 0 0 1px rgba(45,212,191,.06);

  &__bar {
    display: flex;
    align-items: center;
    gap: .75rem;
    height: 36px;
    background: rgba(13,46,44,.95);
    border-bottom: 1px solid rgba(45,212,191,.1);
    padding: 0 14px;
  }

  &__dots {
    display: flex;
    gap: 6px;

    span {
      width: 11px; height: 11px; border-radius: 50%;
      &.id--r { background: #FF5F57; }
      &.id--y { background: #FEBC2E; }
      &.id--g { background: #28C840; }
    }
  }

  &__title {
    font-family: var(--font-mono);
    font-size: 11px;
    color: rgba(45,212,191,.4);
  }

  &__body {
    padding: 1.5rem 1.75rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: .625rem;
    min-height: 160px;
  }
}

// ── Terminal lines ────────────────────────────────────────────
.intro-line {
  display: flex;
  align-items: baseline;
  gap: .25rem;
  font-family: var(--font-mono);
  font-size: .875rem;
  line-height: 1.5;
  will-change: opacity, transform;

  &__text {
    white-space: pre; // preserve spacing in aligned columns
  }

  &--cmd .intro-line__text {
    color: #D6F5F2;
    font-weight: 500;
  }

  &--ok .intro-line__text {
    color: rgba(45,212,191,.75);
  }
}

.intro-cursor {
  color: var(--color-primary);
  font-size: .8rem;
  line-height: 1;
  margin-left: 2px;
  animation: blink .9s step-end infinite;
}

@keyframes blink {
  0%,100% { opacity: 1; }
  50%      { opacity: 0; }
}

// ── Skip ─────────────────────────────────────────────────────
.intro-skip {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  background: transparent;
  border: 1px solid rgba(45,212,191,.18);
  color: rgba(45,212,191,.45);
  font-family: var(--font-mono);
  font-size: .75rem;
  padding: .375rem .875rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all .2s;

  &:hover {
    border-color: rgba(45,212,191,.5);
    color: var(--color-primary);
    background: rgba(45,212,191,.06);
  }
}
</style>