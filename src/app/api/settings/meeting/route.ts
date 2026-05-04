import { NextRequest, NextResponse } from 'next/server'
import { requireApiSession, requireOwner } from '@/lib/server-auth'
import { saveMeetingInfo } from '@/lib/letter-store'

export async function POST(request: NextRequest) {
  const owner = requireOwner(await requireApiSession())

  if (owner instanceof NextResponse)
    return owner

  const body = await request.json().catch(() => ({})) as {
    time?: string
    place?: string
    note?: string
  }

  const meeting = await saveMeetingInfo({
    time: body.time,
    place: body.place,
    note: body.note,
  })

  return NextResponse.json({ ok: true, meeting })
}
