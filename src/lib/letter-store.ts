import { randomBytes, randomUUID } from 'node:crypto'
import type { AccessRole } from '@/lib/access'
import { createSecretHash, verifySecretKey } from '@/lib/access'
import { hasDatabase, query } from '@/lib/db'
import {
  getTodayKey,
  otherRole,
  questionForDate,
  stampTypes,
  type LetterReactionAction,
  type LetterType,
  type MoodValue,
  type WishCategory,
} from '@/lib/letter-copy'

export type Letter = {
  id: string
  sender: AccessRole
  receiver: AccessRole
  type: LetterType
  content: string
  deliverAt: string
  createdAt: string
  readAt: string | null
  readOnce: boolean
}

export type DailyStatus = {
  id: string
  role: AccessRole
  mood: MoodValue
  note: string
  dateKey: string
  updatedAt: string
}

export type HugRecord = {
  id: string
  sender: AccessRole
  receiver: AccessRole
  createdAt: string
  readAt: string | null
}

export type MeetingInfo = {
  time?: string
  place?: string
  note?: string
  plan?: string
  bring?: string
  firstWords?: string
  firstThing?: string
}

export type DailyQuestionState = {
  dateKey: string
  question: string
  myAnswer: string | null
  otherAnswer: string | null
  myAnsweredAt: string | null
  otherAnsweredAt: string | null
  bothAnswered: boolean
}

export type AssuranceRequest = {
  id: string
  requester: AccessRole
  responder: AccessRole
  message: string
  response: string | null
  createdAt: string
  respondedAt: string | null
}

export type Wish = {
  id: string
  role: AccessRole
  category: WishCategory
  content: string
  createdAt: string
}

export type LetterReaction = {
  id: string
  letterId: string
  role: AccessRole
  action: LetterReactionAction
  createdAt: string
}

export type StampCollectionItem = {
  type: LetterType
  label: string
  locked: string
  count: number
  unlocked: boolean
}

type KeyRecord = {
  role: AccessRole
  hash: string
  updatedAt: string
}

type QuestionAnswer = {
  dateKey: string
  question: string
  role: AccessRole
  answer: string
  createdAt: string
}

type MemoryState = {
  keys: KeyRecord[]
  letters: Letter[]
  statuses: DailyStatus[]
  hugs: HugRecord[]
  meeting: MeetingInfo
  questionAnswers: QuestionAnswer[]
  assurances: AssuranceRequest[]
  wishes: Wish[]
  reactions: LetterReaction[]
}

type KeyRow = {
  role: AccessRole
  hash: string
  updated_at: string
}

type LetterRow = {
  id: string
  sender: AccessRole
  receiver: AccessRole
  type: LetterType
  content: string
  deliver_at: string
  created_at: string
  read_at: string | null
  read_once: boolean | null
}

type StatusRow = {
  id: string
  role: AccessRole
  mood: MoodValue
  note: string | null
  date_key: string
  updated_at: string
}

type HugRow = {
  id: string
  sender: AccessRole
  receiver: AccessRole
  created_at: string
  read_at: string | null
}

type QuestionAnswerRow = {
  date_key: string
  question: string
  role: AccessRole
  answer: string
  created_at: string
}

type AssuranceRow = {
  id: string
  requester: AccessRole
  responder: AccessRole
  message: string
  response: string | null
  created_at: string
  responded_at: string | null
}

type WishRow = {
  id: string
  role: AccessRole
  category: WishCategory
  content: string
  created_at: string
}

type ReactionRow = {
  id: string
  letter_id: string
  role: AccessRole
  action: LetterReactionAction
  created_at: string
}

type SettingRow = {
  value: MeetingInfo | string
}

const globalMemory = globalThis as typeof globalThis & {
  __letterMemory?: MemoryState
}

let schemaPromise: Promise<void> | null = null

function nowIso() {
  return new Date().toISOString()
}

function initialMemory(): MemoryState {
  const now = nowIso()
  const keys: KeyRecord[] = []

  if (process.env.OWNER_KEY_HASH) {
    keys.push({
      role: 'owner',
      hash: process.env.OWNER_KEY_HASH,
      updatedAt: now,
    })
  }

  if (process.env.HER_KEY_HASH) {
    keys.push({
      role: 'her',
      hash: process.env.HER_KEY_HASH,
      updatedAt: now,
    })
  }

  return {
    keys,
    letters: [],
    statuses: [],
    hugs: [],
    meeting: {},
    questionAnswers: [],
    assurances: [],
    wishes: [],
    reactions: [],
  }
}

function memory() {
  if (!globalMemory.__letterMemory)
    globalMemory.__letterMemory = initialMemory()

  return globalMemory.__letterMemory
}

function mapLetter(row: LetterRow): Letter {
  return {
    id: row.id,
    sender: row.sender,
    receiver: row.receiver,
    type: row.type,
    content: row.content,
    deliverAt: new Date(row.deliver_at).toISOString(),
    createdAt: new Date(row.created_at).toISOString(),
    readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
    readOnce: Boolean(row.read_once),
  }
}

function mapStatus(row: StatusRow): DailyStatus {
  return {
    id: row.id,
    role: row.role,
    mood: row.mood,
    note: row.note ?? '',
    dateKey: row.date_key,
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

function mapHug(row: HugRow): HugRecord {
  return {
    id: row.id,
    sender: row.sender,
    receiver: row.receiver,
    createdAt: new Date(row.created_at).toISOString(),
    readAt: row.read_at ? new Date(row.read_at).toISOString() : null,
  }
}

function mapQuestionAnswer(row: QuestionAnswerRow): QuestionAnswer {
  return {
    dateKey: row.date_key,
    question: row.question,
    role: row.role,
    answer: row.answer,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

function mapAssurance(row: AssuranceRow): AssuranceRequest {
  return {
    id: row.id,
    requester: row.requester,
    responder: row.responder,
    message: row.message,
    response: row.response,
    createdAt: new Date(row.created_at).toISOString(),
    respondedAt: row.responded_at ? new Date(row.responded_at).toISOString() : null,
  }
}

function mapWish(row: WishRow): Wish {
  return {
    id: row.id,
    role: row.role,
    category: row.category,
    content: row.content,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

function mapReaction(row: ReactionRow): LetterReaction {
  return {
    id: row.id,
    letterId: row.letter_id,
    role: row.role,
    action: row.action,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

async function ensureSchema() {
  if (!hasDatabase())
    return

  schemaPromise ??= (async () => {
    await query(`
      CREATE TABLE IF NOT EXISTS letter_keys (
        role text PRIMARY KEY,
        hash text NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS letters (
        id text PRIMARY KEY,
        sender text NOT NULL,
        receiver text NOT NULL,
        type text NOT NULL,
        content text NOT NULL,
        deliver_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        read_at timestamptz,
        read_once boolean NOT NULL DEFAULT false
      )
    `)

    await query('ALTER TABLE letters ADD COLUMN IF NOT EXISTS read_once boolean NOT NULL DEFAULT false')

    await query(`
      CREATE TABLE IF NOT EXISTS daily_statuses (
        id text PRIMARY KEY,
        role text NOT NULL,
        mood text NOT NULL,
        note text,
        date_key text NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(role, date_key)
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS hugs (
        id text PRIMARY KEY,
        sender text NOT NULL,
        receiver text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        read_at timestamptz
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS daily_question_answers (
        date_key text NOT NULL,
        question text NOT NULL,
        role text NOT NULL,
        answer text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY(date_key, role)
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS assurance_requests (
        id text PRIMARY KEY,
        requester text NOT NULL,
        responder text NOT NULL,
        message text NOT NULL,
        response text,
        created_at timestamptz NOT NULL DEFAULT now(),
        responded_at timestamptz
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS wishes (
        id text PRIMARY KEY,
        role text NOT NULL,
        category text NOT NULL,
        content text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS letter_reactions (
        id text PRIMARY KEY,
        letter_id text NOT NULL,
        role text NOT NULL,
        action text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(letter_id, role, action)
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key text PRIMARY KEY,
        value jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    if (process.env.OWNER_KEY_HASH) {
      await query(
        'INSERT INTO letter_keys (role, hash) VALUES ($1, $2) ON CONFLICT (role) DO NOTHING',
        ['owner', process.env.OWNER_KEY_HASH],
      )
    }

    if (process.env.HER_KEY_HASH) {
      await query(
        'INSERT INTO letter_keys (role, hash) VALUES ($1, $2) ON CONFLICT (role) DO NOTHING',
        ['her', process.env.HER_KEY_HASH],
      )
    }
  })()

  await schemaPromise
}

export async function getStoredKeyHash(role: AccessRole) {
  if (!hasDatabase())
    return memory().keys.find(item => item.role === role)?.hash ?? (role === 'owner' ? process.env.OWNER_KEY_HASH : process.env.HER_KEY_HASH)

  await ensureSchema()
  const rows = await query<KeyRow>('SELECT role, hash, updated_at FROM letter_keys WHERE role = $1', [role])
  return rows[0]?.hash ?? (role === 'owner' ? process.env.OWNER_KEY_HASH : process.env.HER_KEY_HASH)
}

export async function resolveStoredAccessRole(key: string) {
  const ownerHash = await getStoredKeyHash('owner')

  if (verifySecretKey(key, ownerHash))
    return 'owner' satisfies AccessRole

  const herHash = await getStoredKeyHash('her')

  if (verifySecretKey(key, herHash))
    return 'her' satisfies AccessRole

  return null
}

export async function updateStoredKeyHash(role: AccessRole, hash: string) {
  if (!hasDatabase()) {
    const state = memory()
    const existing = state.keys.find(item => item.role === role)

    if (existing) {
      existing.hash = hash
      existing.updatedAt = nowIso()
    }
    else {
      state.keys.push({ role, hash, updatedAt: nowIso() })
    }

    return
  }

  await ensureSchema()
  await query(
    `
      INSERT INTO letter_keys (role, hash, updated_at)
      VALUES ($1, $2, now())
      ON CONFLICT (role)
      DO UPDATE SET hash = EXCLUDED.hash, updated_at = now()
    `,
    [role, hash],
  )
}

export async function changeOwnKey(role: AccessRole, currentKey: string, nextKey: string) {
  const currentHash = await getStoredKeyHash(role)

  if (!verifySecretKey(currentKey, currentHash))
    return { ok: false, code: 'current' as const }

  if (nextKey.length < 8)
    return { ok: false, code: 'short' as const }

  if (verifySecretKey(nextKey, currentHash))
    return { ok: false, code: 'same' as const }

  await updateStoredKeyHash(role, createSecretHash(nextKey))
  return { ok: true as const }
}

export async function resetHerKey() {
  const key = randomBytes(18).toString('base64url')
  await updateStoredKeyHash('her', createSecretHash(key))
  return key
}

export async function getMeetingInfo(): Promise<MeetingInfo> {
  if (!hasDatabase())
    return memory().meeting

  await ensureSchema()
  const rows = await query<SettingRow>('SELECT value FROM app_settings WHERE key = $1', ['meeting'])
  const value = rows[0]?.value

  if (!value || typeof value === 'string')
    return {}

  return value
}

export async function saveMeetingInfo(info: MeetingInfo) {
  const nextInfo = {
    time: info.time?.trim() || undefined,
    place: info.place?.trim() || undefined,
    note: info.note?.trim() || undefined,
    plan: info.plan?.trim() || undefined,
    bring: info.bring?.trim() || undefined,
    firstWords: info.firstWords?.trim() || undefined,
    firstThing: info.firstThing?.trim() || undefined,
  }

  if (!hasDatabase()) {
    memory().meeting = nextInfo
    return nextInfo
  }

  await ensureSchema()
  await query(
    `
      INSERT INTO app_settings (key, value, updated_at)
      VALUES ($1, $2::jsonb, now())
      ON CONFLICT (key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    `,
    ['meeting', JSON.stringify(nextInfo)],
  )

  return nextInfo
}

export async function createLetter(input: {
  sender: AccessRole
  type: LetterType
  content: string
  deliverAt?: string
  readOnce?: boolean
}) {
  const now = nowIso()
  const letter: Letter = {
    id: randomUUID(),
    sender: input.sender,
    receiver: otherRole(input.sender),
    type: input.type,
    content: input.content.trim(),
    deliverAt: input.deliverAt ? new Date(input.deliverAt).toISOString() : now,
    createdAt: now,
    readAt: null,
    readOnce: Boolean(input.readOnce),
  }

  if (!hasDatabase()) {
    memory().letters.unshift(letter)
    return letter
  }

  await ensureSchema()
  await query(
    `
      INSERT INTO letters (id, sender, receiver, type, content, deliver_at, created_at, read_once)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [letter.id, letter.sender, letter.receiver, letter.type, letter.content, letter.deliverAt, letter.createdAt, letter.readOnce],
  )

  return letter
}

export async function listLettersFor(role: AccessRole) {
  if (!hasDatabase()) {
    return [...memory().letters]
      .filter(letter => letter.sender === role || letter.receiver === role)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  await ensureSchema()
  const rows = await query<LetterRow>(
    `
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at, read_once
      FROM letters
      WHERE sender = $1 OR receiver = $1
      ORDER BY created_at DESC
    `,
    [role],
  )

  return rows.map(mapLetter)
}

export async function getLetterFor(role: AccessRole, id: string) {
  if (!hasDatabase())
    return memory().letters.find(letter => letter.id === id && (letter.sender === role || letter.receiver === role)) ?? null

  await ensureSchema()
  const rows = await query<LetterRow>(
    `
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at, read_once
      FROM letters
      WHERE id = $1 AND (sender = $2 OR receiver = $2)
      LIMIT 1
    `,
    [id, role],
  )

  return rows[0] ? mapLetter(rows[0]) : null
}

export async function getLatestReceivedLetter(role: AccessRole) {
  const now = nowIso()

  if (!hasDatabase()) {
    return memory().letters
      .filter(letter => letter.receiver === role && letter.deliverAt <= now)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null
  }

  await ensureSchema()
  const rows = await query<LetterRow>(
    `
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at, read_once
      FROM letters
      WHERE receiver = $1 AND deliver_at <= now()
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [role],
  )

  return rows[0] ? mapLetter(rows[0]) : null
}

export async function getAvailableFutureLetter(role: AccessRole) {
  const now = nowIso()

  if (!hasDatabase()) {
    return memory().letters
      .filter(letter => letter.receiver === role && letter.type === 'future' && letter.deliverAt <= now && !letter.readAt)
      .sort((a, b) => new Date(b.deliverAt).getTime() - new Date(a.deliverAt).getTime())[0] ?? null
  }

  await ensureSchema()
  const rows = await query<LetterRow>(
    `
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at, read_once
      FROM letters
      WHERE receiver = $1 AND type = 'future' AND deliver_at <= now() AND read_at IS NULL
      ORDER BY deliver_at DESC
      LIMIT 1
    `,
    [role],
  )

  return rows[0] ? mapLetter(rows[0]) : null
}

export async function markLetterRead(role: AccessRole, id: string) {
  const now = nowIso()

  if (!hasDatabase()) {
    const letter = memory().letters.find(item => item.id === id && item.receiver === role)

    if (letter)
      letter.readAt = now

    return Boolean(letter)
  }

  await ensureSchema()
  const rows = await query<{ id: string }>(
    'UPDATE letters SET read_at = COALESCE(read_at, now()) WHERE id = $1 AND receiver = $2 RETURNING id',
    [id, role],
  )

  return Boolean(rows[0])
}

export async function upsertTodayStatus(role: AccessRole, mood: MoodValue, note: string) {
  const dateKey = getTodayKey()
  const status: DailyStatus = {
    id: randomUUID(),
    role,
    mood,
    note: note.trim(),
    dateKey,
    updatedAt: nowIso(),
  }

  if (!hasDatabase()) {
    const state = memory()
    const index = state.statuses.findIndex(item => item.role === role && item.dateKey === dateKey)

    if (index >= 0)
      state.statuses[index] = status
    else
      state.statuses.unshift(status)

    return status
  }

  await ensureSchema()
  const rows = await query<StatusRow>(
    `
      INSERT INTO daily_statuses (id, role, mood, note, date_key, updated_at)
      VALUES ($1, $2, $3, $4, $5, now())
      ON CONFLICT (role, date_key)
      DO UPDATE SET mood = EXCLUDED.mood, note = EXCLUDED.note, updated_at = now()
      RETURNING id, role, mood, note, date_key, updated_at
    `,
    [status.id, status.role, status.mood, status.note, status.dateKey],
  )

  return mapStatus(rows[0])
}

export async function getTodayStatus(role: AccessRole) {
  const dateKey = getTodayKey()

  if (!hasDatabase())
    return memory().statuses.find(item => item.role === role && item.dateKey === dateKey) ?? null

  await ensureSchema()
  const rows = await query<StatusRow>(
    `
      SELECT id, role, mood, note, date_key, updated_at
      FROM daily_statuses
      WHERE role = $1 AND date_key = $2
      LIMIT 1
    `,
    [role, dateKey],
  )

  return rows[0] ? mapStatus(rows[0]) : null
}

export async function getRecentStatuses(role: AccessRole, limit = 7) {
  if (!hasDatabase()) {
    return [...memory().statuses]
      .filter(item => item.role === role)
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .slice(0, limit)
  }

  await ensureSchema()
  const rows = await query<StatusRow>(
    `
      SELECT id, role, mood, note, date_key, updated_at
      FROM daily_statuses
      WHERE role = $1
      ORDER BY date_key DESC
      LIMIT $2
    `,
    [role, limit],
  )

  return rows.map(mapStatus)
}

export async function createHug(sender: AccessRole) {
  const hug: HugRecord = {
    id: randomUUID(),
    sender,
    receiver: otherRole(sender),
    createdAt: nowIso(),
    readAt: null,
  }

  if (!hasDatabase()) {
    memory().hugs.unshift(hug)
    return hug
  }

  await ensureSchema()
  await query(
    'INSERT INTO hugs (id, sender, receiver, created_at) VALUES ($1, $2, $3, $4)',
    [hug.id, hug.sender, hug.receiver, hug.createdAt],
  )

  return hug
}

export async function getLatestReceivedHug(role: AccessRole) {
  if (!hasDatabase()) {
    return memory().hugs
      .filter(hug => hug.receiver === role && !hug.readAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null
  }

  await ensureSchema()
  const rows = await query<HugRow>(
    `
      SELECT id, sender, receiver, created_at, read_at
      FROM hugs
      WHERE receiver = $1 AND read_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [role],
  )

  return rows[0] ? mapHug(rows[0]) : null
}

export async function getDailyQuestionState(role: AccessRole): Promise<DailyQuestionState> {
  const dateKey = getTodayKey()
  const question = questionForDate(dateKey)
  const rows = hasDatabase()
    ? await (async () => {
        await ensureSchema()
        return (await query<QuestionAnswerRow>(
          'SELECT date_key, question, role, answer, created_at FROM daily_question_answers WHERE date_key = $1',
          [dateKey],
        )).map(mapQuestionAnswer)
      })()
    : memory().questionAnswers.filter(item => item.dateKey === dateKey)
  const my = rows.find(item => item.role === role)
  const other = rows.find(item => item.role === otherRole(role))

  return {
    dateKey,
    question,
    myAnswer: my?.answer ?? null,
    otherAnswer: other?.answer ?? null,
    myAnsweredAt: my?.createdAt ?? null,
    otherAnsweredAt: other?.createdAt ?? null,
    bothAnswered: Boolean(my?.answer && other?.answer),
  }
}

export async function answerDailyQuestion(role: AccessRole, answer: string) {
  const dateKey = getTodayKey()
  const question = questionForDate(dateKey)
  const cleaned = answer.trim()

  if (!hasDatabase()) {
    const state = memory()
    const index = state.questionAnswers.findIndex(item => item.dateKey === dateKey && item.role === role)
    const next = { dateKey, question, role, answer: cleaned, createdAt: nowIso() }

    if (index >= 0)
      state.questionAnswers[index] = next
    else
      state.questionAnswers.push(next)

    return next
  }

  await ensureSchema()
  const rows = await query<QuestionAnswerRow>(
    `
      INSERT INTO daily_question_answers (date_key, question, role, answer, created_at)
      VALUES ($1, $2, $3, $4, now())
      ON CONFLICT(date_key, role)
      DO UPDATE SET question = EXCLUDED.question, answer = EXCLUDED.answer, created_at = now()
      RETURNING date_key, question, role, answer, created_at
    `,
    [dateKey, question, role, cleaned],
  )

  return mapQuestionAnswer(rows[0])
}

export async function createAssuranceRequest(requester: AccessRole) {
  const item: AssuranceRequest = {
    id: randomUUID(),
    requester,
    responder: otherRole(requester),
    message: '给我一点安全感',
    response: null,
    createdAt: nowIso(),
    respondedAt: null,
  }

  if (!hasDatabase()) {
    memory().assurances.unshift(item)
    return item
  }

  await ensureSchema()
  await query(
    `
      INSERT INTO assurance_requests (id, requester, responder, message, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [item.id, item.requester, item.responder, item.message, item.createdAt],
  )

  return item
}

export async function getOpenAssuranceFor(role: AccessRole) {
  if (!hasDatabase()) {
    return memory().assurances
      .filter(item => item.responder === role && !item.response)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null
  }

  await ensureSchema()
  const rows = await query<AssuranceRow>(
    `
      SELECT id, requester, responder, message, response, created_at, responded_at
      FROM assurance_requests
      WHERE responder = $1 AND response IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [role],
  )

  return rows[0] ? mapAssurance(rows[0]) : null
}

export async function getLatestAssuranceFor(role: AccessRole) {
  if (!hasDatabase()) {
    return memory().assurances
      .filter(item => item.requester === role || item.responder === role)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null
  }

  await ensureSchema()
  const rows = await query<AssuranceRow>(
    `
      SELECT id, requester, responder, message, response, created_at, responded_at
      FROM assurance_requests
      WHERE requester = $1 OR responder = $1
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [role],
  )

  return rows[0] ? mapAssurance(rows[0]) : null
}

export async function respondAssurance(role: AccessRole, id: string, response: string) {
  const cleaned = response.trim()

  if (!hasDatabase()) {
    const item = memory().assurances.find(candidate => candidate.id === id && candidate.responder === role)

    if (!item)
      return null

    item.response = cleaned
    item.respondedAt = nowIso()
    return item
  }

  await ensureSchema()
  const rows = await query<AssuranceRow>(
    `
      UPDATE assurance_requests
      SET response = $3, responded_at = now()
      WHERE id = $1 AND responder = $2
      RETURNING id, requester, responder, message, response, created_at, responded_at
    `,
    [id, role, cleaned],
  )

  return rows[0] ? mapAssurance(rows[0]) : null
}

export async function createWish(role: AccessRole, category: WishCategory, content: string) {
  const wish: Wish = {
    id: randomUUID(),
    role,
    category,
    content: content.trim(),
    createdAt: nowIso(),
  }

  if (!hasDatabase()) {
    memory().wishes.unshift(wish)
    return wish
  }

  await ensureSchema()
  await query(
    'INSERT INTO wishes (id, role, category, content, created_at) VALUES ($1, $2, $3, $4, $5)',
    [wish.id, wish.role, wish.category, wish.content, wish.createdAt],
  )

  return wish
}

export async function listWishes(limit = 20) {
  if (!hasDatabase())
    return [...memory().wishes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit)

  await ensureSchema()
  const rows = await query<WishRow>(
    `
      SELECT id, role, category, content, created_at
      FROM wishes
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit],
  )

  return rows.map(mapWish)
}

export async function getWishForHome(role: AccessRole) {
  const wishes = await listWishes(30)

  if (wishes.length === 0)
    return null

  const seed = `${getTodayKey()}-${role}`.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return wishes[seed % wishes.length]
}

export async function addLetterReaction(role: AccessRole, letterId: string, action: LetterReactionAction) {
  const letter = await getLetterFor(role, letterId)

  if (!letter)
    return null

  const reaction: LetterReaction = {
    id: randomUUID(),
    letterId,
    role,
    action,
    createdAt: nowIso(),
  }

  if (!hasDatabase()) {
    const state = memory()
    const existing = state.reactions.find(item => item.letterId === letterId && item.role === role && item.action === action)

    if (existing)
      return existing

    state.reactions.push(reaction)
    return reaction
  }

  await ensureSchema()
  const rows = await query<ReactionRow>(
    `
      INSERT INTO letter_reactions (id, letter_id, role, action, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT(letter_id, role, action)
      DO UPDATE SET created_at = letter_reactions.created_at
      RETURNING id, letter_id, role, action, created_at
    `,
    [reaction.id, reaction.letterId, reaction.role, reaction.action, reaction.createdAt],
  )

  return mapReaction(rows[0])
}

export async function listLetterReactions(letterId: string) {
  if (!hasDatabase())
    return memory().reactions.filter(item => item.letterId === letterId)

  await ensureSchema()
  const rows = await query<ReactionRow>(
    `
      SELECT id, letter_id, role, action, created_at
      FROM letter_reactions
      WHERE letter_id = $1
      ORDER BY created_at ASC
    `,
    [letterId],
  )

  return rows.map(mapReaction)
}

export async function getStampCollection(role: AccessRole): Promise<StampCollectionItem[]> {
  const counts = new Map<LetterType, number>()

  if (!hasDatabase()) {
    for (const letter of memory().letters) {
      if (letter.sender === role)
        counts.set(letter.type, (counts.get(letter.type) ?? 0) + 1)
    }
  }
  else {
    await ensureSchema()
    const rows = await query<{ type: LetterType, count: string }>(
      'SELECT type, COUNT(*)::text AS count FROM letters WHERE sender = $1 GROUP BY type',
      [role],
    )

    for (const row of rows)
      counts.set(row.type, Number.parseInt(row.count, 10))
  }

  return stampTypes.map(item => {
    const count = counts.get(item.value) ?? 0

    return {
      type: item.value,
      label: item.label,
      locked: item.locked,
      count,
      unlocked: count > 0,
    }
  })
}
