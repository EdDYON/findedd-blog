import { NextRequest, NextResponse } from 'next/server'
import { changeOwnKey, resetHerKey } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as {
    action?: string
    currentKey?: string
    nextKey?: string
    confirmKey?: string
  }

  if (body.action === 'reset-her') {
    if (session.role !== 'owner')
      return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })

    const key = await resetHerKey()

    return NextResponse.json({ ok: true, key })
  }

  const currentKey = body.currentKey?.trim() ?? ''
  const nextKey = body.nextKey?.trim() ?? ''
  const confirmKey = body.confirmKey?.trim() ?? ''

  if (nextKey !== confirmKey)
    return NextResponse.json({ ok: false, message: '两次输入的新密钥不一样。' }, { status: 400 })

  const result = await changeOwnKey(session.role, currentKey, nextKey)

  if (!result.ok) {
    const message = {
      current: '当前密钥好像不对。',
      short: '新的密钥再长一点会更安全。',
      same: '新的密钥不能和现在的一样。',
    }[result.code]

    return NextResponse.json({ ok: false, message }, { status: 400 })
  }

  return NextResponse.json({ ok: true, message: '新的密钥已经收好啦。' })
}
