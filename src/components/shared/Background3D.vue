<script setup lang="ts">
import { ref } from 'vue'
import { useBackground3D } from '@/composables/useBackground3D'

const canvasRef = ref<HTMLCanvasElement>()
useBackground3D(canvasRef)
</script>

<template>
  <canvas ref="canvasRef" class="bg3d" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.bg3d {
  position: fixed;
  inset: 0;
  z-index: 0;
  width:  100vw !important;
  height: 100vh !important;
  pointer-events: none;
  display: block;
}
</style>