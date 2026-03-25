<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVisitorAuth } from '../composables/useVisitorAuth'
import { formatAbsoluteTime, formatRelativeTime, useVisitorHub, type WishGroup, type WishItem } from '../composables/useVisitorHub'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const wish = ref('')
const { authenticated, loadVisitor, user } = useVisitorAuth()
const { actionMessage, actionPending, loadSummary, removeWish, submitWish, wishGroups } = useVisitorHub()

const visibleGroups = computed(() => props.compact ? wishGroups.value.slice(0, 4) : wishGroups.value)

function isOwnGroup(group: WishGroup) {
  return Boolean(user.value?.openid) && user.value?.openid === group.visitor.openid
}

async function handleWish() {
  if (!wish.value.trim())
    return

  const ok = await submitWish(wish.value)
  if (ok)
    wish.value = ''
}

async function handleDeleteWish(item: WishItem) {
  await removeWish(item.id)
}

onMounted(async () => {
  await loadVisitor()
  await loadSummary()
})
</script>

<template>
  <article class="wish-panel">
    <div class="panel-head">
      <div>
        <p class="mini-label">许愿池</p>
        <h3>{{ compact ? '最近丢进来的愿望' : '愿望会按访客身份归在一起' }}</h3>
      </div>
      <span v-if="authenticated && user" class="inline-chip">{{ user.nickname }}</span>
    </div>

    <p class="panel-copy">
      {{ compact ? '每个人丢过的愿望都会归在一起。' : '登录后丢进去的愿望，会按你自己的访客身份聚在一起。现在你也可以把自己想删的那条捞出来。' }}
    </p>

    <div v-if="!compact" class="wish-form">
      <textarea
        v-model="wish"
        class="wish-input"
        rows="3"
        maxlength="120"
        :disabled="!authenticated || actionPending"
        placeholder="比如：希望接下来的日子都顺一点。"
      />
      <div class="wish-actions">
        <button type="button" class="wish-button" :disabled="!authenticated || actionPending || !wish.trim()" @click="handleWish">
          {{ actionPending ? '丢进去...' : '丢个愿望' }}
        </button>
        <span class="wish-tip">{{ actionMessage || '愿望会按人归在一起，自己的那几条也能再捞出来。' }}</span>
      </div>
    </div>

    <div v-if="visibleGroups.length" class="wish-list">
      <div v-for="group in visibleGroups" :key="group.visitor.openid" class="wish-item" :class="{ 'is-me': isOwnGroup(group) }">
        <div class="wish-item-head">
          <div class="wish-user">
            <img v-if="group.visitor.avatar" :src="group.visitor.avatar" :alt="group.visitor.nickname" class="wish-avatar" />
            <div>
              <strong>{{ group.visitor.nickname }}</strong>
              <p class="wish-meta">最近一条 {{ formatRelativeTime(group.latest_at) }}</p>
            </div>
          </div>
          <span class="inline-chip">{{ group.count }} 条</span>
        </div>

        <div v-if="!compact && group.items.length" class="wish-stack">
          <div v-for="item in group.items" :key="item.id" class="wish-entry">
            <div class="wish-entry-copy">
              <p class="wish-message">{{ item.message }}</p>
              <small>{{ formatAbsoluteTime(item.created_at) }}</small>
            </div>
            <button
              v-if="isOwnGroup(group)"
              type="button"
              class="wish-delete"
              :disabled="actionPending"
              @click="handleDeleteWish(item)"
            >
              删掉
            </button>
          </div>
        </div>

        <p v-else class="wish-message compact-message">{{ group.latest_message }}</p>
      </div>
    </div>

    <p v-else class="wish-empty">这里还没开始攒愿望，你可以先丢第一个。</p>
  </article>
</template>

<style scoped>
.wish-panel {
  border-radius: 26px;
  padding: 1.1rem;
  background:
    radial-gradient(circle at top right, rgba(145, 215, 255, 0.12), transparent 32%),
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
.wish-user strong,
.wish-message,
.wish-entry small {
  color: #fff;
}

.panel-copy,
.wish-tip,
.wish-empty,
.wish-meta {
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.75;
}

.panel-copy {
  margin: 0.7rem 0 0;
}

.wish-form {
  margin-top: 0.95rem;
}

.wish-input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  resize: vertical;
}

.wish-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
  margin-top: 0.85rem;
}

.wish-button,
.wish-delete {
  border-radius: 999px;
  border: 1px solid rgba(255, 196, 230, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 0.7rem 1.1rem;
}

.wish-delete {
  padding: 0.45rem 0.85rem;
  border-color: rgba(145, 215, 255, 0.18);
}

.wish-button:disabled,
.wish-delete:disabled,
.wish-input:disabled {
  opacity: 0.55;
}

.wish-list {
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;
}

.wish-item {
  padding: 0.95rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wish-item.is-me {
  border-color: rgba(255, 196, 230, 0.3);
  box-shadow: 0 0 0 1px rgba(255, 196, 230, 0.1), 0 18px 30px rgba(4, 10, 20, 0.22);
}

.wish-item-head,
.wish-user {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: space-between;
}

.wish-user {
  justify-content: flex-start;
}

.wish-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.wish-meta {
  margin: 0.1rem 0 0;
  font-size: 0.85rem;
}

.wish-stack {
  display: grid;
  gap: 0.7rem;
  margin-top: 0.85rem;
}

.wish-entry {
  display: flex;
  gap: 0.8rem;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.8rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.wish-entry-copy {
  min-width: 0;
}

.wish-message {
  margin: 0;
}

.wish-entry small {
  display: block;
  margin-top: 0.35rem;
  color: rgba(240, 244, 255, 0.68);
}

.compact-message {
  margin-top: 0.7rem;
}

.wish-empty {
  margin: 1rem 0 0;
}

@media (max-width: 720px) {
  .wish-item-head,
  .wish-entry {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
