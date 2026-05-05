import type { AccessRole } from '@/lib/access'
import { NextRequest, NextResponse } from 'next/server'
import { personName } from '@/lib/letter-copy'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

type CatWhisperKind = 'sweet' | 'challenge' | 'comfort' | 'letter' | 'random'

type CatWhisper = {
  kind: CatWhisperKind
  title: string
  content: string
  actionLabel: string
  source: 'deepseek' | 'fallback'
}

const catWhisperKinds = new Set<CatWhisperKind>(['sweet', 'challenge', 'comfort', 'letter', 'random'])
const cache = new Map<string, { expiresAt: number, value: CatWhisper }>()
const CACHE_MS = 10 * 60 * 1000

const fallbackWhispers: Record<CatWhisperKind, Omit<CatWhisper, 'source'>> = {
  sweet: {
    kind: 'sweet',
    title: '小猫甜话',
    content: '今天也要记得，对方不是离你很远，只是把想念暂时放在路上。',
    actionLabel: '收下啦',
  },
  challenge: {
    kind: 'challenge',
    title: '小猫挑战',
    content: '今天找一个很小的瞬间，给对方留一句：刚刚这里有一点点想你。',
    actionLabel: '我试试',
  },
  comfort: {
    kind: 'comfort',
    title: '小猫安慰',
    content: '不用一直很勇敢。想被确认、想被抱住、想被认真惦记，都是可以的。',
    actionLabel: '被抱住',
  },
  letter: {
    kind: 'letter',
    title: '写信灵感',
    content: '可以写一件今天的小事，再写一句：如果你在旁边，我会第一个讲给你听。',
    actionLabel: '去写信',
  },
  random: {
    kind: 'random',
    title: '小猫口袋',
    content: '今天的像素口袋里有一颗小星星，适合放进一封短短的信。',
    actionLabel: '放进口袋',
  },
}

function otherName(role: AccessRole) {
  return personName[role === 'owner' ? 'her' : 'owner']
}

function normalizeKind(value: unknown): CatWhisperKind {
  return typeof value === 'string' && catWhisperKinds.has(value as CatWhisperKind)
    ? value as CatWhisperKind
    : 'random'
}

function cleanJson(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function validKind(value: unknown): value is CatWhisperKind {
  return typeof value === 'string' && catWhisperKinds.has(value as CatWhisperKind)
}

function fallbackFor(kind: CatWhisperKind) {
  return { ...fallbackWhispers[kind], source: 'fallback' as const }
}

async function generateWhisper(kind: CatWhisperKind, role: AccessRole): Promise<CatWhisper> {
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey || process.env.DAILY_SPARK_ENABLED === 'false')
    return fallbackFor(kind)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: [
              '你是一只像素小猫，是私密 PWA「一封信」里的小信使。',
              '你只给已经进入系统的两个人生成温柔、可爱、克制的互动内容。',
              '语气像旧掌机里的小纸条：短、暖、轻，不油腻。',
              '只输出 JSON，不要 Markdown。',
              'JSON 字段：kind,title,content,actionLabel。',
              'kind 只能是 sweet、challenge、comfort、letter、random。',
              'title 不超过 8 个中文字符，actionLabel 不超过 6 个中文字符。',
              'content 32 到 72 个中文字符，不要露骨，不要出现链接，不要催促频繁互动。',
            ].join('\n'),
          },
          {
            role: 'user',
            content: [
              `当前身份：${personName[role]}`,
              `对方：${otherName(role)}`,
              `想要的类型：${kind}`,
              '请生成一条可以放在像素小猫面板里的内容。',
            ].join('\n'),
          },
        ],
        temperature: 0.92,
        max_tokens: 220,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    })

    if (!response.ok)
      throw new Error(`DeepSeek request failed: ${response.status}`)

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content

    if (!content)
      throw new Error('DeepSeek returned empty content.')

    const parsed = JSON.parse(cleanJson(content)) as Partial<CatWhisper>
    const fallback = fallbackWhispers[kind]

    return {
      kind: validKind(parsed.kind) ? parsed.kind : kind,
      title: typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim().slice(0, 12) : fallback.title,
      content: typeof parsed.content === 'string' && parsed.content.trim() ? parsed.content.trim().slice(0, 90) : fallback.content,
      actionLabel: typeof parsed.actionLabel === 'string' && parsed.actionLabel.trim() ? parsed.actionLabel.trim().slice(0, 8) : fallback.actionLabel,
      source: 'deepseek',
    }
  }
  catch {
    return fallbackFor(kind)
  }
  finally {
    clearTimeout(timer)
  }
}

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as { kind?: string }
  const kind = normalizeKind(body.kind)
  const cacheKey = `${session.role}:${kind}`
  const cached = cache.get(cacheKey)
  const now = Date.now()

  if (cached && cached.expiresAt > now)
    return NextResponse.json({ ok: true, whisper: cached.value, cached: true })

  const whisper = await generateWhisper(kind, session.role)
  cache.set(cacheKey, { expiresAt: now + CACHE_MS, value: whisper })

  return NextResponse.json({ ok: true, whisper, cached: false })
}
