import { NextResponse } from 'next/server'
import { ensureDailySpark } from '@/lib/daily-spark'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!secret || authHeader !== `Bearer ${secret}`)
    return new Response('Unauthorized', { status: 401 })

  const spark = await ensureDailySpark()

  return NextResponse.json({
    ok: true,
    dateKey: spark.dateKey,
    releaseAt: spark.releaseAt,
    source: spark.source,
  })
}
