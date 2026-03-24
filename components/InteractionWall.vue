<script setup lang="ts">
import { computed } from 'vue'
import { useAddonWaline } from 'valaxy-addon-waline'

const props = withDefaults(defineProps<{
  title: string
  eyebrow?: string
  intro: string
  tips?: string[]
}>(), {
  eyebrow: '互动区',
  tips: () => [],
})

const addon = useAddonWaline()
const commentOptions = computed(() => ({
  ...addon.value.options,
  pageview: false,
}))
</script>

<template>
  <section class="wall-board">
    <article class="wall-panel page-intro-shell">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p>{{ intro }}</p>
      <div v-if="tips.length" class="wall-tips">
        <span v-for="tip in tips" :key="tip" class="inline-chip">{{ tip }}</span>
      </div>
    </article>

    <article class="wall-panel">
      <ClientOnly>
        <WalineClient w="full" :options="commentOptions" />
      </ClientOnly>
    </article>
  </section>
</template>

<style scoped>
.wall-board {
  display: grid;
  gap: 1rem;
}

.wall-panel {
  border-radius: 28px;
  padding: 1.25rem;
  background: rgba(8, 14, 25, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.page-intro-shell h2 {
  margin: 0.35rem 0 0.8rem;
  color: #fff;
}

.page-intro-shell p {
  color: rgba(240, 244, 255, 0.76);
  line-height: 1.8;
}

.wall-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1rem;
}
</style>
