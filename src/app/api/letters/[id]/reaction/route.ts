import { NextRequest, NextResponse } from 'next/server'
import { reactionOptions, type LetterReactionAction } from '@/lib/letter-copy'
import { addLetterReaction } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const { id } = await context.params
  const body = await request.json().catch(() => ({})) as { action?: string }
  const action = reactionOptions.some(item => item.value === body.action)
    ? body.action as LetterReactionAction
    : null

  if (!action)
    return NextResponse.json({ ok: false, message: '这次回应没有送出去。' }, { status: 400 })

  const reaction = await addLetterReaction(session.role, id, action)

  if (!reaction)
    return NextResponse.json({ ok: false, message: '这封信没有找到。' }, { status: 404 })

  return NextResponse.json({ ok: true, reaction })
}
