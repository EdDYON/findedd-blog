import { PageHeader } from '@/components/letter/PageHeader'
import { WriteLetterForm } from '@/components/letter/WriteLetterForm'
import { requirePageSession } from '@/lib/server-auth'

export default async function WritePage() {
  const session = await requirePageSession()

  return (
    <>
      <PageHeader
        eyebrow="WRITE"
        title="写一封信"
      />
      <WriteLetterForm role={session.role} />
    </>
  )
}
