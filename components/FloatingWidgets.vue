<script setup lang="ts">
defineProps<{
  isHome: boolean
  showMascot: boolean
}>()

</script>

<template>
  <aside class="floating-widgets">
    <div v-if="showMascot && isHome" class="mascot-note">
      <span>今日施工</span>
      <small>首页还在继续收边角</small>
    </div>
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

.mascot-note {
  display: inline-flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: rgba(16, 21, 38, 0.72);
  border: 1px solid rgba(255, 201, 226, 0.18);
  color: #fff3fb;
  text-align: right;
  backdrop-filter: blur(12px);
}

.mascot-note span {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.mascot-note small {
  color: rgba(255, 234, 244, 0.74);
}

@media (max-width: 900px) {
  .floating-widgets,
  .mascot-note,
  .sakana-shell {
    display: none;
  }
}
</style>
