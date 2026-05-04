import { NextRequest, NextResponse } from 'next/server'
import { isApiSession, requireApiSession } from '@/lib/server-auth'
import { createLetter } from '@/lib/letter-store'
import { letterTypes, type LetterType } from '@/lib/letter-copy'

const MAX_CONTENT_LENGTH = 5000

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as {
    type?: string
    content?: string
    deliverMode?: string
    deliverAt?: string
  }

  const content = body.content?.trim() ?? ''

  if (!content)
    return NextResponse.json({ ok: false, message: '这封信还没有内容。' }, { status: 400 })

  if (content.length > MAX_CONTENT_LENGTH)
    return NextResponse.json({ ok: false, message: '这封信有点太长啦，可以稍微分成几封。' }, { status: 400 })

  const type = letterTypes.some(item => item.value === body.type)
    ? body.type as LetterType
    : 'normal'

  let deliverAt: string | undefined

  if (body.deliverMode === 'scheduled') {
    if (!body.deliverAt)
      return NextResponse.json({ ok: false, message: '请选择送达时间。' }, { status: 400 })

    const deliverDate = new Date(body.deliverAt)

    if (!Number.isFinite(deliverDate.getTime()) || deliverDate.getTime() <= Date.now())
      return NextResponse.json({ ok: false, message: '送达时间不能早于现在。' }, { status: 400 })

    deliverAt = deliverDate.toISOString()
  }

  const letter = await createLetter({
    sender: session.role,
    type,
    content,
    deliverAt,
  })

  return NextResponse.json({ ok: true, letter })
}
