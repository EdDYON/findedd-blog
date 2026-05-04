import { NextRequest, NextResponse } from 'next/server'
import { answerDailyQuestion } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as { answer?: string }
  const answer = body.answer?.trim() ?? ''

  if (!answer)
    return NextResponse.json({ ok: false, message: '先留下一点点答案吧。' }, { status: 400 })

  if (answer.length > 500)
    return NextResponse.json({ ok: false, message: '这次回答有点太长啦。' }, { status: 400 })

  const result = await answerDailyQuestion(session.role, answer)

  return NextResponse.json({ ok: true, answer: result })
}
