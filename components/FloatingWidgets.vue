<script setup lang="ts">
defineProps<{
  isHome: boolean
  showMascot: boolean
}>()
</script>

<template>
  <aside class="floating-widgets">
    <div v-if="showMascot && isHome" id="sakana-widget" class="sakana-shell" />
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

.sakana-shell {
  width: 210px;
  min-height: 210px;
  border-radius: 28px;
  background: rgba(13, 18, 33, 0.42);
  border: 1px solid rgba(255, 196, 230, 0.18);
  backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px rgba(5, 10, 20, 0.18);
  overflow: hidden;
}

@media (max-width: 900px) {
  .floating-widgets,
  .sakana-shell {
    display: none;
  }
}
</style>
