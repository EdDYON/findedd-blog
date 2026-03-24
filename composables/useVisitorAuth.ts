import { computed, ref } from 'vue'

export interface VisitorProfile {
  provider: string
  openid: string
  nickname: string
  avatar?: string
  city?: string
  province?: string
}

const apiBase = (import.meta.env.VITE_VISITOR_API_BASE || '').replace(/\/$/, '')
const loading = ref(false)
const authenticated = ref(false)
const user = ref<VisitorProfile | null>(null)
const error = ref('')
const loginStatus = ref('')
let initialized = false

function consumeLoginStatus() {
  if (typeof window === 'undefined')
    return

  const url = new URL(window.location.href)
  const status = url.searchParams.get('visitor_login') || ''
  const reason = url.searchParams.get('reason') || ''

  if (!status)
    return

  loginStatus.value = status === 'failed' && reason ? `${status}:${reason}` : status
  url.searchParams.delete('visitor_login')
  url.searchParams.delete('reason')
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

async function loadVisitor(force = false) {
  consumeLoginStatus()

  if (!apiBase) {
    initialized = true
    return
  }

  if (initialized && !force)
    return

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
    error.value = '访客状态没取到，可能是接口域名或者跨域配置还没填完。'
  }
  finally {
    loading.value = false
    initialized = true
  }
}

function loginWithQQ(returnTo?: string) {
  if (!apiBase || typeof window === 'undefined')
    return

  const url = new URL(`${apiBase}/auth/qq/start/`)
  url.searchParams.set('return_to', returnTo || window.location.href)
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
  loginStatus.value = ''
}

const hasVisitorApi = computed(() => Boolean(apiBase))

export function useVisitorAuth() {
  return {
    apiBase,
    authenticated,
    error,
    hasVisitorApi,
    loading,
    loginStatus,
    logoutVisitor,
    loginWithQQ,
    loadVisitor,
    user,
  }
}
