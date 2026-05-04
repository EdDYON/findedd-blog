import { randomBytes, randomUUID } from 'node:crypto'
import type { AccessRole } from '@/lib/access'
import { createSecretHash, verifySecretKey } from '@/lib/access'
import { hasDatabase, query } from '@/lib/db'
import { getTodayKey, otherRole, type LetterType, type MoodValue } from '@/lib/letter-copy'

export type Letter = {
  id: string
  sender: AccessRole
  receiver: AccessRole
  type: LetterType
  content: string
  deliverAt: string
  createdAt: string
  readAt: string | null
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
}

type KeyRecord = {
  role: AccessRole
  hash: string
  updatedAt: string
}

type MemoryState = {
  keys: KeyRecord[]
  letters: Letter[]
  statuses: DailyStatus[]
  hugs: HugRecord[]
  meeting: MeetingInfo
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
        read_at timestamptz
      )
    `)

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
  }

  if (!hasDatabase()) {
    memory().letters.unshift(letter)
    return letter
  }

  await ensureSchema()
  await query(
    `
      INSERT INTO letters (id, sender, receiver, type, content, deliver_at, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [letter.id, letter.sender, letter.receiver, letter.type, letter.content, letter.deliverAt, letter.createdAt],
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
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at
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
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at
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
      SELECT id, sender, receiver, type, content, deliver_at, created_at, read_at
      FROM letters
      WHERE receiver = $1 AND deliver_at <= now()
      ORDER BY created_at DESC
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
