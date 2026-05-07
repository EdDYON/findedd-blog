import type { AccessRole } from '@/lib/access'
import { NextResponse } from 'next/server'
import { hasDatabase, query } from '@/lib/db'
import { getTodayStatus } from '@/lib/letter-store'
import { otherRole } from '@/lib/letter-copy'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

const PRESENCE_WINDOW_MS = 90 * 1000
const memoryPresence = new Map<AccessRole, number>()

function moodBubble(mood?: string | null) {
  if (!mood)
    return '🤍'

  if (mood.includes('开心'))
    return '😊'

  if (mood.includes('想你') || mood.includes('想见面') || mood.includes('等你'))
    return '🥺'

  if (mood.includes('累') || mood.includes('委屈') || mood.includes('安全感'))
    return '🫧'

  if (mood.includes('安静'))
    return '🌙'

  return '🤍'
}

async function ensurePresenceTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS cat_presence (
      role text PRIMARY KEY,
      last_seen timestamptz NOT NULL DEFAULT now()
    )
  `)
}

async function touch(role: AccessRole) {
  if (!hasDatabase()) {
    memoryPresence.set(role, Date.now())
    return
  }

  await ensurePresenceTable()
  await query(
    `
      INSERT INTO cat_presence (role, last_seen)
      VALUES ($1, now())
      ON CONFLICT (role)
      DO UPDATE SET last_seen = now()
    `,
    [role],
  )
}

async function readLastSeen(role: AccessRole) {
  if (!hasDatabase())
    return memoryPresence.get(role) ?? 0

  await ensurePresenceTable()
  const rows = await query<{ last_seen: string }>(
    'SELECT last_seen FROM cat_presence WHERE role = $1 LIMIT 1',
    [role],
  )

  return rows[0]?.last_seen ? new Date(rows[0].last_seen).getTime() : 0
}

export async function GET() {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  await touch(session.role)

  const other = otherRole(session.role)
  const otherLastSeen = await readLastSeen(other)
  const otherOnline = otherLastSeen > 0 && Date.now() - otherLastSeen < PRESENCE_WINDOW_MS
  const otherStatus = await getTodayStatus(other)

  return NextResponse.json({
    ok: true,
    coPresent: otherOnline,
    moodBubble: moodBubble(otherStatus?.mood),
  })
}
