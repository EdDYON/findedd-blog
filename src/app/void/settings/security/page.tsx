import { PageHeader } from '@/components/letter/PageHeader'
import { SecurityForm } from '@/components/letter/SecurityForm'
import { requirePageSession } from '@/lib/server-auth'

export default async function SecurityPage() {
  await requirePageSession()

  return (
    <>
      <PageHeader
        eyebrow="SECURITY"
        title="安全设置"
      />
      <SecurityForm />
    </>
  )
}
