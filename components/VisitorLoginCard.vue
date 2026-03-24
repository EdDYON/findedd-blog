<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface VisitorProfile {
  provider: string
  openid: string
  nickname: string
  avatar?: string
  city?: string
  province?: string
}

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const apiBase = (import.meta.env.VITE_VISITOR_API_BASE || '').replace(/\/$/, '')
const loading = ref(true)
const authenticated = ref(false)
const user = ref<VisitorProfile | null>(null)
const error = ref('')

const loginStatus = computed(() => {
  if (typeof window === 'undefined')
    return ''

  return new URLSearchParams(window.location.search).get('visitor_login') || ''
})

const statusCopy = computed(() => {
  if (loginStatus.value === 'success')
    return 'QQ 登录已经接上了，现在这边会记住你的访客身份。'

  if (loginStatus.value === 'failed')
    return '这次 QQ 登录没有成功，可以再试一次。'

  if (error.value)
    return error.value

  if (!apiBase)
    return '还没填访客接口地址，先把 Qexo 的公开域名配上就能用。'

  if (authenticated.value && user.value)
    return `当前访客：${user.value.nickname}`

  return '用 QQ 一键登录，后面互动区会更容易把你认出来。'
})

async function loadVisitor() {
  if (!apiBase) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${apiBase}/pub/visitor/me/`, {
      credentials: 'include',
    })
    const data = await response.json()

    authenticated.value = Boolean(data?.authenticated)
    user.value = data?.user || null
  }
  catch {
    authenticated.value = false
    user.value = null
    error.value = '访客状态暂时没取到，可能是接口域名或跨域配置还没填完。'
  }
  finally {
    loading.value = false
  }
}

function loginWithQQ() {
  if (!apiBase || typeof window === 'undefined')
    return

  const url = new URL(`${apiBase}/auth/qq/start/`)
  url.searchParams.set('return_to', window.location.href)
  window.location.href = url.toString()
}

async function logoutVisitor() {
  if (!apiBase)
    return

  try {
    await fetch(`${apiBase}/pub/visitor/logout/`, {
      method: 'POST',
      credentials: 'include',
    })
  }
  catch {}

  authenticated.value = false
  user.value = null
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
        <h3>{{ compact ? '先登录再互动' : '互动区现在可以挂 QQ 身份了' }}</h3>
      </div>
      <button
        v-if="!loading && apiBase && !authenticated"
        type="button"
        class="visitor-action"
        @click="loginWithQQ"
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
      这一步先把互动页的访客身份接好，评论区还是 Waline 现在这套，后面再决定要不要一起并掉。
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
