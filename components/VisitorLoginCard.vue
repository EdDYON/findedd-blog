<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useVisitorAuth } from '../composables/useVisitorAuth'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const {
  authenticated,
  error,
  hasVisitorApi,
  loading,
  loginStatus,
  loginWithQQ,
  loadVisitor,
  logoutVisitor,
  user,
} = useVisitorAuth()

const statusCopy = computed(() => {
  if (loginStatus.value === 'success')
    return 'QQ 登录已经接上了，下面留言会直接用这个昵称。'

  if (loginStatus.value.startsWith('failed'))
    return '这次 QQ 登录没走通，过一会儿再试就行。'

  if (error.value)
    return error.value

  if (!hasVisitorApi.value)
    return '访客接口还没填，等 Qexo 域名配好之后这里就能直接用。'

  if (authenticated.value && user.value)
    return `现在会用 ${user.value.nickname} 这个名字在互动区留言。`

  return '想留个 QQ 身份的话，点一下就行。不登也能写，只是不会记住你。'
})

function handleLogin() {
  loginWithQQ()
}

onMounted(() => {
  loadVisitor()
})
</script>

<template>
  <article class="visitor-card" :class="{ 'visitor-card-compact': compact }">
    <div class="visitor-card-head">
      <div>
        <p class="mini-label">QQ 访客</p>
        <h3>{{ compact ? '登录后会直接带上昵称' : '想留个 QQ 身份的话，从这里进就行' }}</h3>
      </div>
      <button
        v-if="!loading && hasVisitorApi && !authenticated"
        type="button"
        class="visitor-action"
        @click="handleLogin"
      >
        QQ 登录
      </button>
      <button
        v-else-if="!loading && authenticated"
        type="button"
        class="visitor-action visitor-action-ghost"
        @click="logoutVisitor"
      >
        退出
      </button>
    </div>

    <div v-if="authenticated && user" class="visitor-profile">
      <img v-if="user.avatar" :src="user.avatar" :alt="user.nickname" class="visitor-avatar" />
      <div>
        <strong>{{ user.nickname }}</strong>
        <p>{{ user.province || 'QQ 访客' }}<span v-if="user.city"> · {{ user.city }}</span></p>
      </div>
    </div>

    <p class="visitor-copy">
      {{ loading ? '正在确认访客状态...' : statusCopy }}
    </p>

    <p v-if="!compact" class="visitor-note">
      互动区现在只留昵称这一项。你如果先用 QQ 登录，后面几面墙都会直接带上这个名字。
    </p>
  </article>
</template>

<style scoped>
.visitor-card {
  border-radius: 26px;
  padding: 1.1rem;
  background:
    radial-gradient(circle at top right, rgba(145, 215, 255, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.visitor-card-compact {
  padding: 1rem;
}

.visitor-card-head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.visitor-card h3,
.visitor-profile strong {
  color: #fff;
}

.visitor-profile {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 1rem;
}

.visitor-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.visitor-profile p,
.visitor-copy,
.visitor-note {
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.75;
}

.visitor-copy {
  margin: 0.9rem 0 0;
}

.visitor-note {
  margin: 0.75rem 0 0;
  font-size: 0.95rem;
}

.visitor-action {
  border-radius: 999px;
  border: 1px solid rgba(255, 196, 230, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 0.65rem 1rem;
}

.visitor-action-ghost {
  border-color: rgba(255, 255, 255, 0.12);
}

@media (max-width: 720px) {
  .visitor-card-head {
    flex-direction: column;
  }
}
</style>
