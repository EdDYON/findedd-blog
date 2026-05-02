import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SecretHome } from '@/components/secret/SecretHome'
import { getAccessSession } from '@/lib/access'

export const metadata: Metadata = {
  title: '已接入',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function VoidPage() {
  const session = getAccessSession(await cookies())

  if (!session)
    redirect('/')

  return <SecretHome role={session.role} />
}
