import { PageHeader } from '@/components/letter/PageHeader'
import { StatusForm } from '@/components/letter/StatusForm'
import { getTodayStatus } from '@/lib/letter-store'
import { requirePageSession } from '@/lib/server-auth'

export default async function StatusPage() {
  const session = await requirePageSession()
  const status = await getTodayStatus(session.role)

  return (
    <>
      <PageHeader
        eyebrow="STATUS"
        title="今天的状态"
        subtitle="不用写很多，只留下一点点今天的你。"
      />
      <StatusForm initialStatus={status} />
    </>
  )
}
