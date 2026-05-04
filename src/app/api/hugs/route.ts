import { NextResponse } from 'next/server'
import { createHug } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST() {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const hug = await createHug(session.role)

  return NextResponse.json({ ok: true, hug })
}
