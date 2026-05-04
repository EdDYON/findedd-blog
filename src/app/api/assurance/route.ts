import { NextRequest, NextResponse } from 'next/server'
import { assuranceResponses } from '@/lib/letter-copy'
import { createAssuranceRequest, respondAssurance } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as {
    action?: string
    id?: string
    response?: string
  }

  if (body.action === 'respond') {
    const response = body.response?.trim() ?? ''

    if (!body.id || !assuranceResponses.includes(response))
      return NextResponse.json({ ok: false, message: '这句话暂时没有送出去。' }, { status: 400 })

    const item = await respondAssurance(session.role, body.id, response)

    if (!item)
      return NextResponse.json({ ok: false, message: '这句话暂时没有送出去。' }, { status: 404 })

    return NextResponse.json({ ok: true, assurance: item })
  }

  const item = await createAssuranceRequest(session.role)

  return NextResponse.json({ ok: true, assurance: item })
}
