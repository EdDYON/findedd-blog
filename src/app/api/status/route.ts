import { NextRequest, NextResponse } from 'next/server'
import { moodOptions, type MoodValue } from '@/lib/letter-copy'
import { upsertTodayStatus } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as {
    mood?: string
    note?: string
  }

  if (!body.mood || !moodOptions.includes(body.mood as MoodValue))
    return NextResponse.json({ ok: false, message: '先选一个今天的状态吧。' }, { status: 400 })

  const status = await upsertTodayStatus(session.role, body.mood as MoodValue, body.note ?? '')

  return NextResponse.json({ ok: true, status })
}
