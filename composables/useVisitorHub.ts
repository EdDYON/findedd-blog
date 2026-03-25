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

const relativeFormatter = typeof Intl !== 'undefined'
  ? new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' })
  : null

const absoluteFormatter = typeof Intl !== 'undefined'
  ? new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  : null

function parseDate(value: string) {
  if (!value)
    return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatRelativeTime(value: string) {
  const date = parseDate(value)
  if (!date || !relativeFormatter)
    return '刚刚'

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const divisions: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]

  if (Math.abs(diffSeconds) < 45)
    return '刚刚'

  for (const [unit, seconds] of divisions) {
    if (Math.abs(diffSeconds) >= seconds || unit === 'minute') {
      return relativeFormatter.format(Math.round(diffSeconds / seconds), unit)
    }
  }

  return '刚刚'
}

export function formatAbsoluteTime(value: string) {
  const date = parseDate(value)
  if (!date || !absoluteFormatter)
    return ''

  return absoluteFormatter.format(date)
}

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

async function deleteCheckin() {
  const { apiBase } = useVisitorAuth()
  if (!apiBase)
    return false

  actionPending.value = true
  actionMessage.value = ''

  try {
    const response = await fetch(`${apiBase}/pub/visitor/checkin/`, {
      method: 'DELETE',
      credentials: 'include',
    })
    const data = await response.json()

    if (!response.ok || data?.status === false) {
      actionMessage.value = data?.error || '这条签到没删掉，再试一次吧。'
      return false
    }

    todayCheckin.value = null
    recentVisitors.value = data?.recentVisitors || []
    actionMessage.value = '今天这条脚印已经收起来了。'
    return true
  }
  catch {
    actionMessage.value = '这条签到没删掉，再试一次吧。'
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

async function removeWish(id: string) {
  const { apiBase } = useVisitorAuth()
  if (!apiBase)
    return false

  actionPending.value = true
  actionMessage.value = ''

  try {
    const response = await fetch(`${apiBase}/pub/visitor/wish/delete/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
    const data = await response.json()

    if (!response.ok || data?.status === false) {
      actionMessage.value = data?.error || '这条愿望没有删掉，再试一下。'
      return false
    }

    wishGroups.value = data?.wishGroups || []
    actionMessage.value = '这条愿望已经从池子里捞出来了。'
    return true
  }
  catch {
    actionMessage.value = '这条愿望没有删掉，再试一下。'
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
    deleteCheckin,
    formatAbsoluteTime,
    formatRelativeTime,
    loadSummary,
    loadingSummary,
    recentVisitors,
    removeWish,
    submitCheckin,
    submitWish,
    todayCheckin,
    wishGroups,
  }
}
