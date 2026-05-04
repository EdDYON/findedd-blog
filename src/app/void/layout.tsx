import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/letter/AppShell'
import { requirePageSession } from '@/lib/server-auth'

export const metadata: Metadata = {
  title: '一封信',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function VoidLayout({ children }: { children: ReactNode }) {
  await requirePageSession()

  return <AppShell>{children}</AppShell>
}
