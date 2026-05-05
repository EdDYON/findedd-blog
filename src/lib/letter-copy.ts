import type { AccessRole } from '@/lib/access'

export type LetterType = 'normal' | 'goodnight' | 'missing' | 'hug' | 'praise' | 'sorry' | 'safe' | 'future'
export type WishCategory = 'todo' | 'food' | 'place' | 'tiny'
export type LetterReactionAction = 'received' | 'hug_again' | 'miss_too'

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

export const stampTypes: Array<{ value: LetterType, label: string, locked: string }> = [
  { value: 'goodnight', label: '晚安邮票', locked: '还没有晚安信。' },
  { value: 'missing', label: '想你邮票', locked: '还没有想你信。' },
  { value: 'hug', label: '抱抱邮票', locked: '还没有抱抱信。' },
  { value: 'future', label: '未来邮票', locked: '还没有未来的信。' },
  { value: 'safe', label: '安全感邮票', locked: '还没有安全感信。' },
  { value: 'praise', label: '夸夸邮票', locked: '还没有夸夸信。' },
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
  '写给屏幕那边的人。',
]

export const dailyQuestions = [
  '今天有没有一瞬间想我？',
  '今天最想被我抱一下的时刻是什么？',
  '今天有什么小事，想第一时间告诉我？',
  '如果今晚能一起散步，你想走到哪里？',
  '今天有没有一句话，想被我认真听见？',
  '今天最需要我靠近你的哪一刻？',
  '下次见面第一件想做的小事是什么？',
]

export const assuranceResponses = [
  '抱住你',
  '认真听见',
  '今天也喜欢你',
]

export const wishCategories: Array<{ value: WishCategory, label: string, placeholder: string }> = [
  { value: 'todo', label: '想一起做的事', placeholder: '比如：下次见面一起看一场电影。' },
  { value: 'food', label: '想一起吃的东西', placeholder: '比如：一起吃热乎乎的火锅。' },
  { value: 'place', label: '想一起去的地方', placeholder: '比如：去一条很安静的小路散步。' },
  { value: 'tiny', label: '很小的愿望', placeholder: '比如：想被牵着手多走一会儿。' },
]

export const reactionOptions: Array<{ value: LetterReactionAction, label: string }> = [
  { value: 'received', label: '我收到啦' },
  { value: 'hug_again', label: '再抱一下' },
  { value: 'miss_too', label: '我也想你' },
]

export const futureJarPresets = [
  { label: '写给一周后的你', days: 7 },
  { label: '写给见面前一天的你', days: 1 },
  { label: '写给不开心那天的你', days: 3 },
]

export function questionForDate(dateKey: string) {
  const seed = dateKey.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return dailyQuestions[seed % dailyQuestions.length]
}

export function letterTypeLabel(type: string) {
  return letterTypes.find(item => item.value === type)?.label ?? '普通信'
}

export function wishCategoryLabel(category: string) {
  return wishCategories.find(item => item.value === category)?.label ?? '很小的愿望'
}

export function reactionLabel(action: string) {
  return reactionOptions.find(item => item.value === action)?.label ?? '我收到啦'
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

export function moodTemperatureText(moods: string[], subject = '对方') {
  if (moods.length === 0)
    return '这几天的状态，还在等一小格像素亮起来。'

  if (moods.some(item => item.includes('累') || item.includes('委屈') || item.includes('安静')))
    return `这几天，${subject}好像有点累，适合被轻轻抱住。`

  if (moods.some(item => item.includes('想你') || item.includes('见面') || item.includes('消息')))
    return '这几天，想念一直在小小发光。'

  if (moods.some(item => item.includes('开心')))
    return '这几天，有几格像素是亮晶晶的。'

  return '这几天的心情，被安静地保存下来了。'
}
