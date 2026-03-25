<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVisitorAuth } from '../composables/useVisitorAuth'
import { formatAbsoluteTime, formatRelativeTime, useVisitorHub } from '../composables/useVisitorHub'

const note = ref('')
const { authenticated, loadVisitor, user } = useVisitorAuth()
const { actionMessage, actionPending, deleteCheckin, loadSummary, submitCheckin, todayCheckin } = useVisitorHub()

const currentCopy = computed(() => {
  if (!authenticated.value)
    return '先用 QQ 登录一下，再把今天的脚印留在这里。'

  if (todayCheckin.value)
    return '今天已经留过脚印了。想换一句也行，或者直接把今天这条收起来。'

  return '来过的话按一下就行，顺手留一句今天的状态也可以。'
})

const canSubmit = computed(() => {
  if (!authenticated.value || actionPending.value)
    return false

  if (!todayCheckin.value)
    return true

  return Boolean(note.value.trim())
})

async function handleCheckin() {
  const ok = await submitCheckin(note.value)
  if (ok)
    note.value = ''
}

async function handleDelete() {
  const ok = await deleteCheckin()
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

    <div v-if="todayCheckin" class="checkin-preview">
      <div class="preview-head">
        <strong>今天这条脚印</strong>
        <span>{{ formatRelativeTime(todayCheckin.updated_at) }}</span>
      </div>
      <p>{{ todayCheckin.message }}</p>
      <small>{{ formatAbsoluteTime(todayCheckin.updated_at) }}</small>
    </div>

    <textarea
      v-model="note"
      class="action-input"
      rows="3"
      maxlength="80"
      :disabled="!authenticated || actionPending"
      :placeholder="todayCheckin ? '想换一句的话，写在这里再更新。' : '比如：今天也来了，顺手留个脚印。'"
    />

    <div class="panel-actions">
      <button type="button" class="panel-button" :disabled="!canSubmit" @click="handleCheckin">
        {{ actionPending ? '记一下...' : todayCheckin ? '改一下今天的话' : '今天来过' }}
      </button>
      <button v-if="todayCheckin" type="button" class="panel-button ghost" :disabled="actionPending" @click="handleDelete">
        {{ actionPending ? '收起来...' : '删掉今天这条' }}
      </button>
      <span class="panel-tip">{{ actionMessage || '一天只记一次，但你可以改一句，或者把今天这条删掉。' }}</span>
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
.checkin-preview strong {
  color: #fff;
}

.panel-copy,
.panel-tip,
.checkin-preview p,
.checkin-preview small,
.preview-head span {
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.75;
}

.panel-copy {
  margin: 0.7rem 0 0;
}

.checkin-preview {
  margin-top: 0.95rem;
  padding: 0.95rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.checkin-preview p {
  margin: 0.4rem 0 0;
}

.checkin-preview small {
  display: block;
  margin-top: 0.4rem;
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

.panel-button.ghost {
  border-color: rgba(145, 215, 255, 0.18);
}

.panel-button:disabled,
.action-input:disabled {
  opacity: 0.55;
}

@media (max-width: 720px) {
  .preview-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
