import { ref } from 'vue'
import { useVisitorAuth, type VisitorProfile } from './useVisitorAuth'

export interface VisitorCheckinEntry {
  visitor: VisitorProfile
  message: string
  day: string
  updated_at: string
}

export interface WishItem {
  id: string
  message: string
  created_at: string
}

export interface WishGroup {
  visitor: VisitorProfile
  count: number
  latest_at: string
  latest_message: string
  items: WishItem[]
}

const recentVisitors = ref<VisitorCheckinEntry[]>([])
const wishGroups = ref<WishGroup[]>([])
const todayCheckin = ref<VisitorCheckinEntry | null>(null)
const loadingSummary = ref(false)
const actionPending = ref(false)
const actionMessage = ref('')
let loaded = false

async function loadSummary(force = false) {
  const { apiBase, authenticated, user } = useVisitorAuth()
  if (!apiBase) {
    loaded = true
    return
  }

  if (loaded && !force)
    return

  loadingSummary.value = true
  actionMessage.value = ''

  try {
    const response = await fetch(`${apiBase}/pub/visitor/summary/`, {
      credentials: 'include',
    })
    const data = await response.json()

    recentVisitors.value = data?.recentVisitors || []
    wishGroups.value = data?.wishGroups || []
    todayCheckin.value = data?.todayCheckin || null

    if (data?.authenticated && data?.user) {
      authenticated.value = true
      user.value = data.user
    }
  }
  catch {
    actionMessage.value = '互动数据暂时没取到，等接口连上之后这里会恢复。'
  }
  finally {
    loadingSummary.value = false
    loaded = true
  }
}

async function submitCheckin(message: string) {
  const { apiBase } = useVisitorAuth()
  if (!apiBase)
    return false

  actionPending.value = true
  actionMessage.value = ''

  try {
    const response = await fetch(`${apiBase}/pub/visitor/checkin/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    const data = await response.json()

    if (!response.ok || data?.status === false) {
      actionMessage.value = data?.error || '签到没有成功，再试一次吧。'
      return false
    }

    todayCheckin.value = data.entry
    recentVisitors.value = data.recentVisitors || []
    actionMessage.value = '今天来过这件事，已经帮你记下了。'
    return true
  }
  catch {
    actionMessage.value = '签到没有成功，再试一次吧。'
    return false
  }
  finally {
    actionPending.value = false
  }
}

async function submitWish(message: string) {
  const { apiBase } = useVisitorAuth()
  if (!apiBase)
    return false

  actionPending.value = true
  actionMessage.value = ''

  try {
    const response = await fetch(`${apiBase}/pub/visitor/wish/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    const data = await response.json()

    if (!response.ok || data?.status === false) {
      actionMessage.value = data?.error || '愿望没有丢进去，再试一下。'
      return false
    }

    wishGroups.value = data.wishGroups || []
    actionMessage.value = '已经帮你丢进去了。'
    return true
  }
  catch {
    actionMessage.value = '愿望没有丢进去，再试一下。'
    return false
  }
  finally {
    actionPending.value = false
  }
}

export function useVisitorHub() {
  return {
    actionMessage,
    actionPending,
    loadSummary,
    loadingSummary,
    recentVisitors,
    submitCheckin,
    submitWish,
    todayCheckin,
    wishGroups,
  }
}
