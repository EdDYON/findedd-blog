import { randomInt, randomUUID } from 'node:crypto'
import { hasDatabase, query } from '@/lib/db'
import { getTodayKey } from '@/lib/letter-copy'

export type DailySparkKind = 'challenge' | 'sweet' | 'question' | 'tiny'

export type DailySpark = {
  id: string
  dateKey: string
  kind: DailySparkKind
  title: string
  content: string
  actionLabel: string
  releaseAt: string
  createdAt: string
  source: 'deepseek' | 'fallback'
}

type DailySparkRow = {
  id: string
  date_key: string
  kind: DailySparkKind
  title: string
  content: string
  action_label: string
  release_at: string
  created_at: string
  source: 'deepseek' | 'fallback'
}

const globalSparkMemory = globalThis as typeof globalThis & {
  __dailySparkMemory?: DailySpark[]
}

let schemaPromise: Promise<void> | null = null

const fallbackSparks: Array<Omit<DailySpark, 'id' | 'dateKey' | 'releaseAt' | 'createdAt' | 'source'>> = [
  {
    kind: 'challenge',
    title: '今日小挑战',
    content: '今天找一个很小的瞬间，告诉对方：刚刚有一点点想你。',
    actionLabel: '记在心里',
  },
  {
    kind: 'sweet',
    title: '今日甜话',
    content: '远方不是空白，是我们把想念慢慢寄过去的地方。',
    actionLabel: '收下这句',
  },
  {
    kind: 'question',
    title: '今日小问题',
    content: '如果今晚能一起散步，你最想把哪句话慢慢说给对方听？',
    actionLabel: '慢慢回答',
  },
  {
    kind: 'tiny',
    title: '今日小约定',
    content: '睡前留一句晚安，不用很长，只要让对方知道你在。',
    actionLabel: '轻轻做到',
  },
]

function memory() {
  globalSparkMemory.__dailySparkMemory ??= []
  return globalSparkMemory.__dailySparkMemory
}

function mapSpark(row: DailySparkRow): DailySpark {
  return {
    id: row.id,
    dateKey: row.date_key,
    kind: row.kind,
    title: row.title,
    content: row.content,
    actionLabel: row.action_label,
    releaseAt: new Date(row.release_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
    source: row.source,
  }
}

async function ensureSparkSchema() {
  if (!hasDatabase())
    return

  schemaPromise ??= (async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS daily_sparks (
        id text PRIMARY KEY,
        date_key text NOT NULL UNIQUE,
        kind text NOT NULL,
        title text NOT NULL,
        content text NOT NULL,
        action_label text NOT NULL,
        release_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        source text NOT NULL DEFAULT 'fallback'
      )
    `)
  })()

  await schemaPromise
}

function scheduledReleaseFor(dateKey: string) {
  const hour = randomInt(9, 23)
  const minute = hour === 22 ? randomInt(0, 30) : randomInt(0, 60)
  const hh = hour.toString().padStart(2, '0')
  const mm = minute.toString().padStart(2, '0')

  return new Date(`${dateKey}T${hh}:${mm}:00+08:00`).toISOString()
}

function fallbackSparkFor(dateKey: string) {
  const seed = dateKey.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return fallbackSparks[seed % fallbackSparks.length]
}

function cleanJson(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
}

function isSparkKind(value: unknown): value is DailySparkKind {
  return value === 'challenge' || value === 'sweet' || value === 'question' || value === 'tiny'
}

async function generateSparkCopy(dateKey: string) {
  const fallback = fallbackSparkFor(dateKey)
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey || process.env.DAILY_SPARK_ENABLED === 'false')
    return { ...fallback, source: 'fallback' as const }

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
              '你在为一个只属于两个人的私密像素风 PWA「一封信」写每日小纸条。',
              '语气：温柔、可爱、安静、异地恋、像旧掌机里的信箱。',
              '只输出 JSON，不要 Markdown。',
              'JSON 字段：kind,title,content,actionLabel。',
              'kind 只能是 challenge、sweet、question、tiny 之一。',
              'content 36 到 64 个中文字符，不要出现露骨内容，不要出现链接，不要要求频繁互动。',
            ].join('\n'),
          },
          {
            role: 'user',
            content: `请为 ${dateKey} 生成一条今日小纸条。可以是小挑战、甜话、小问题或小约定。`,
          },
        ],
        temperature: 0.9,
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

    const parsed = JSON.parse(cleanJson(content)) as Partial<typeof fallback>

    return {
      kind: isSparkKind(parsed.kind) ? parsed.kind : fallback.kind,
      title: typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim().slice(0, 16) : fallback.title,
      content: typeof parsed.content === 'string' && parsed.content.trim() ? parsed.content.trim().slice(0, 88) : fallback.content,
      actionLabel: typeof parsed.actionLabel === 'string' && parsed.actionLabel.trim() ? parsed.actionLabel.trim().slice(0, 12) : fallback.actionLabel,
      source: 'deepseek' as const,
    }
  }
  catch {
    return { ...fallback, source: 'fallback' as const }
  }
  finally {
    clearTimeout(timer)
  }
}

export async function ensureDailySpark(now = new Date()) {
  const dateKey = getTodayKey()

  if (!hasDatabase()) {
    const state = memory()
    const existing = state.find(item => item.dateKey === dateKey)

    if (existing)
      return existing

    const copy = await generateSparkCopy(dateKey)
    const spark: DailySpark = {
      id: randomUUID(),
      dateKey,
      kind: copy.kind,
      title: copy.title,
      content: copy.content,
      actionLabel: copy.actionLabel,
      releaseAt: scheduledReleaseFor(dateKey),
      createdAt: now.toISOString(),
      source: copy.source,
    }
    state.unshift(spark)
    return spark
  }

  await ensureSparkSchema()
  const rows = await query<DailySparkRow>(
    'SELECT id, date_key, kind, title, content, action_label, release_at, created_at, source FROM daily_sparks WHERE date_key = $1 LIMIT 1',
    [dateKey],
  )

  if (rows[0])
    return mapSpark(rows[0])

  const copy = await generateSparkCopy(dateKey)
  const id = randomUUID()
  const releaseAt = scheduledReleaseFor(dateKey)
  const inserted = await query<DailySparkRow>(
    `
      INSERT INTO daily_sparks (id, date_key, kind, title, content, action_label, release_at, created_at, source)
      VALUES ($1, $2, $3, $4, $5, $6, $7, now(), $8)
      ON CONFLICT (date_key) DO NOTHING
      RETURNING id, date_key, kind, title, content, action_label, release_at, created_at, source
    `,
    [id, dateKey, copy.kind, copy.title, copy.content, copy.actionLabel, releaseAt, copy.source],
  )

  if (inserted[0])
    return mapSpark(inserted[0])

  const existing = await query<DailySparkRow>(
    'SELECT id, date_key, kind, title, content, action_label, release_at, created_at, source FROM daily_sparks WHERE date_key = $1 LIMIT 1',
    [dateKey],
  )
  return mapSpark(existing[0])
}

export async function getDailySparkForHome(now = new Date()) {
  const spark = await ensureDailySpark(now)

  if (new Date(spark.releaseAt).getTime() > now.getTime())
    return null

  return spark
}
