import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SecretGate } from '@/components/secret/SecretGate'
import { getAccessSession } from '@/lib/access'

export default async function Home() {
  const session = getAccessSession(await cookies())

  if (session)
    redirect('/void')

  return <SecretGate />
}
