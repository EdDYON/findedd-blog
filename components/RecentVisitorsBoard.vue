<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useVisitorHub } from '../composables/useVisitorHub'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const { loadSummary, loadingSummary, recentVisitors } = useVisitorHub()

const visibleVisitors = computed(() => props.compact ? recentVisitors.value.slice(0, 6) : recentVisitors.value)

onMounted(() => {
  loadSummary()
})
</script>

<template>
  <article class="visitor-panel">
    <div class="panel-head">
      <div>
        <p class="mini-label">最近访客</p>
        <h3>{{ compact ? '最近来过的人' : '这几天路过这里的人' }}</h3>
      </div>
      <span class="inline-chip">{{ recentVisitors.length }} 人</span>
    </div>

    <p class="panel-copy">
      {{ loadingSummary ? '正在看最近谁来过...' : '来过就会在这里留下一点痕迹。' }}
    </p>

    <div v-if="visibleVisitors.length" class="visitor-list">
      <div v-for="item in visibleVisitors" :key="`${item.visitor.openid}-${item.updated_at}`" class="visitor-item">
        <img v-if="item.visitor.avatar" :src="item.visitor.avatar" :alt="item.visitor.nickname" class="visitor-avatar" />
        <div>
          <strong>{{ item.visitor.nickname }}</strong>
          <p>{{ item.message }}</p>
        </div>
      </div>
    </div>

    <p v-else class="panel-empty">这里还空着，等第一个人来按一下签到。</p>
  </article>
</template>

<style scoped>
.visitor-panel {
  border-radius: 26px;
  padding: 1.1rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.panel-head h3,
.visitor-item strong {
  color: #fff;
}

.panel-copy,
.visitor-item p,
.panel-empty {
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.75;
}

.panel-copy {
  margin: 0.7rem 0 0;
}

.visitor-list {
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;
}

.visitor-item {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.visitor-avatar {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.panel-empty {
  margin: 1rem 0 0;
}
</style>
