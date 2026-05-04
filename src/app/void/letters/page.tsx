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
        subtitle="所有慢慢写下来的话，都被放在这里。"
      />
      <LetterTabs role={session.role} letters={letters} nowIso={new Date().toISOString()} />
    </>
  )
}
