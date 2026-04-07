<script setup lang="ts">
import TaigaMascot from './TaigaMascot.vue'

defineProps<{
  isHome: boolean
  showMascot: boolean
}>()
</script>

<template>
  <aside class="floating-widgets">
    <TaigaMascot v-if="showMascot" :is-home="isHome" />
  </aside>
</template>

<style scoped>
.floating-widgets {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 34;
  display: grid;
  justify-items: end;
  gap: 0.55rem;
}

@media (max-width: 900px) {
  .floating-widgets {
    display: none;
  }
}
</style>
