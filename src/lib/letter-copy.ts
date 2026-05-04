import type { AccessRole } from '@/lib/access'

export type LetterType = 'normal' | 'goodnight' | 'missing' | 'hug' | 'praise' | 'sorry' | 'safe' | 'future'

export type MoodValue =
  | '开心 😊'
  | '想你 🥺'
  | '有点累 😴'
  | '需要抱抱 🤍'
  | '委屈 🫧'
  | '想安静 🌙'
  | '今天需要安全感 🫶'
  | '想听你声音 🎧'
  | '想见面 🚄'
  | '在等你消息 📱'

export const personName: Record<AccessRole, string> = {
  owner: '杜一',
  her: '杨婷婷',
}

export function otherRole(role: AccessRole): AccessRole {
  return role === 'owner' ? 'her' : 'owner'
}

export function otherName(role: AccessRole) {
  return personName[otherRole(role)]
}

export const homeSubtitles = [
  '今天也想把想念写成一封信。',
  '隔着一点距离，也在彼此身边。',
  '有些话不适合匆忙说，适合慢慢写。',
  '新的想念，可以从这里开始。',
  '这封信里，放着只给你看的温柔。',
  '像素小信箱已经醒来啦。',
]

export function stableHomeSubtitle(role: AccessRole) {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    day: '2-digit',
  }).format(new Date())
  const index = (Number.parseInt(day, 10) + (role === 'owner' ? 0 : 3)) % homeSubtitles.length
  return homeSubtitles[index]
}

export const countdownSubtitles = [
  '每靠近一天，这封信就更暖一点。',
  '再等一等，就能见到对方啦。',
  '距离拥抱，只剩一点点时间。',
  '像素列车正在慢慢靠近。',
  '见面的那天，会被认真保存起来。',
]

export const letterTypes: Array<{ value: LetterType, label: string, description: string }> = [
  { value: 'normal', label: '普通信', description: '平常想说的话。' },
  { value: 'goodnight', label: '晚安信', description: '适合在一天快结束的时候寄出。' },
  { value: 'missing', label: '想你信', description: '适合想念很多的时候。' },
  { value: 'hug', label: '抱抱信', description: '适合想隔着距离抱一下。' },
  { value: 'praise', label: '夸夸信', description: '把喜欢和欣赏认真写下来。' },
  { value: 'sorry', label: '道歉信', description: '有些抱歉，适合慢慢说。' },
  { value: 'safe', label: '安全感信', description: '适合在对方不安时，给一点安心。' },
  { value: 'future', label: '未来的信', description: '写给未来某个时间的对方。' },
]

export const moodOptions: MoodValue[] = [
  '开心 😊',
  '想你 🥺',
  '有点累 😴',
  '需要抱抱 🤍',
  '委屈 🫧',
  '想安静 🌙',
  '今天需要安全感 🫶',
  '想听你声音 🎧',
  '想见面 🚄',
  '在等你消息 📱',
]

export const notePlaceholders = [
  '今天想写些什么呢？',
  '把想说的话留在这里。',
  '慢慢写，不着急。',
  '有些想念，可以写成一封信。',
  '写给那个正在远方的人。',
]

export function letterTypeLabel(type: string) {
  return letterTypes.find(item => item.value === type)?.label ?? '普通信'
}

export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatFullDateTime(value: string | Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getTodayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function getCountdownParts(value?: string | null) {
  if (!value)
    return null

  const target = new Date(value).getTime()
  const diff = target - Date.now()

  if (!Number.isFinite(target) || diff <= 0)
    return { days: 0, hours: 0 }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
  }
}

export function previewText(content: string, length = 42) {
  const normalized = content.replace(/\s+/g, ' ').trim()

  if (normalized.length <= length)
    return normalized

  return `${normalized.slice(0, length)}...`
}
