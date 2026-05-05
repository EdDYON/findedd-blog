import { LetterTabs } from '@/components/letter/LetterTabs'
import { PageHeader } from '@/components/letter/PageHeader'
import { listLettersFor } from '@/lib/letter-store'
import { requirePageSession } from '@/lib/server-auth'

export default async function LettersPage() {
  const session = await requirePageSession()
  const letters = await listLettersFor(session.role)

  return (
    <>
      <PageHeader
        eyebrow="LETTER BOX"
        title="信箱"
      />
      <LetterTabs role={session.role} letters={letters} nowIso={new Date().toISOString()} />
    </>
  )
}
