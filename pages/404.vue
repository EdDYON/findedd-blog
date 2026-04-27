<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.setTimeout(() => {
    window.location.href = '/'
  }, 900)
})
</script>

<template>
  <main class="missing-stage">
    <div class="missing-pulse" />
  </main>
</template>

<style scoped>
.missing-stage {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: #050814;
}

.missing-pulse {
  width: 74px;
  aspect-ratio: 1;
  border: 2px solid rgba(79, 231, 255, 0.65);
  border-radius: 50%;
  box-shadow:
    0 0 24px rgba(79, 231, 255, 0.42),
    inset 0 0 18px rgba(255, 79, 163, 0.28);
  animation: pulse 1.1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(0.86);
    opacity: 0.48;
  }

  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}
</style>
