import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import type { AccessRole, AccessSession } from '@/lib/access'
import { getAccessSession } from '@/lib/access'

export async function getCurrentSession() {
  return getAccessSession(await cookies())
}

export async function requirePageSession() {
  const session = await getCurrentSession()

  if (!session)
    redirect('/')

  return session
}

export async function requireApiSession(): Promise<AccessSession | NextResponse> {
  const session = await getCurrentSession()

  if (!session)
    return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 })

  return session
}

export function isApiSession(value: AccessSession | NextResponse): value is AccessSession {
  return 'role' in value
}

export function requireOwner(session: AccessSession | NextResponse) {
  if (!isApiSession(session))
    return session

  if (session.role !== 'owner')
    return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 })

  return session as AccessSession & { role: Extract<AccessRole, 'owner'> }
}
