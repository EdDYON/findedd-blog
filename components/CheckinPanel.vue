<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVisitorAuth } from '../composables/useVisitorAuth'
import { useVisitorHub } from '../composables/useVisitorHub'

const note = ref('')
const { authenticated, loadVisitor, user } = useVisitorAuth()
const { actionMessage, actionPending, loadSummary, submitCheckin, todayCheckin } = useVisitorHub()

const currentCopy = computed(() => {
  if (!authenticated.value)
    return '先用 QQ 登录一下，再把今天的脚印留在这里。'

  if (todayCheckin.value)
    return `今天已经记过一次了：${todayCheckin.value.message}`

  return '来过的话按一下就行，顺手留一句今天的状态也可以。'
})

async function handleCheckin() {
  const ok = await submitCheckin(note.value)
  if (ok)
    note.value = ''
}

onMounted(async () => {
  await loadVisitor()
  await loadSummary()
})
</script>

<template>
  <article class="action-panel">
    <div class="panel-head">
      <div>
        <p class="mini-label">签到一下</p>
        <h3>今天来过的话，就在这里按一下</h3>
      </div>
      <span v-if="authenticated && user" class="inline-chip">{{ user.nickname }}</span>
    </div>

    <p class="panel-copy">{{ currentCopy }}</p>

    <textarea
      v-model="note"
      class="action-input"
      rows="3"
      maxlength="80"
      :disabled="!authenticated || actionPending"
      placeholder="比如：今天也来了，顺手留个脚印。"
    />

    <div class="panel-actions">
      <button type="button" class="panel-button" :disabled="!authenticated || actionPending" @click="handleCheckin">
        {{ actionPending ? '记一下...' : '今天来过' }}
      </button>
      <span class="panel-tip">{{ actionMessage || '一天只记一次，后面会出现在最近访客里。' }}</span>
    </div>
  </article>
</template>

<style scoped>
.action-panel {
  border-radius: 26px;
  padding: 1.1rem;
  background:
    radial-gradient(circle at top right, rgba(255, 174, 210, 0.12), transparent 32%),
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
.panel-tip {
  color: #fff;
}

.panel-copy {
  margin: 0.7rem 0 0;
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.75;
}

.action-input {
  width: 100%;
  margin-top: 0.95rem;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  resize: vertical;
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
  margin-top: 0.9rem;
}

.panel-button {
  border-radius: 999px;
  border: 1px solid rgba(255, 196, 230, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 0.7rem 1.1rem;
}

.panel-button:disabled,
.action-input:disabled {
  opacity: 0.55;
}

.panel-tip {
  color: rgba(240, 244, 255, 0.72);
}
</style>
