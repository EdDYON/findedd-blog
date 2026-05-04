import { NextRequest, NextResponse } from 'next/server'
import { wishCategories, type WishCategory } from '@/lib/letter-copy'
import { createWish } from '@/lib/letter-store'
import { isApiSession, requireApiSession } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  const session = await requireApiSession()

  if (!isApiSession(session))
    return session

  const body = await request.json().catch(() => ({})) as {
    category?: string
    content?: string
  }
  const content = body.content?.trim() ?? ''
  const category = wishCategories.some(item => item.value === body.category)
    ? body.category as WishCategory
    : 'tiny'

  if (!content)
    return NextResponse.json({ ok: false, message: '先写下一个小愿望吧。' }, { status: 400 })

  if (content.length > 240)
    return NextResponse.json({ ok: false, message: '这个愿望有点太长啦。' }, { status: 400 })

  const wish = await createWish(session.role, category, content)

  return NextResponse.json({ ok: true, wish })
}
