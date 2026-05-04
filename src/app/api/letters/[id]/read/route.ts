import { NextRequest, NextResponse } from 'next/server'
import { markLetterRead } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const { id } = await context.params
  const ok = await markLetterRead(session.role, id)

  return NextResponse.json({ ok })
}
