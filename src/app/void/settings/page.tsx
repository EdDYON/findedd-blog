import { PageHeader } from '@/components/letter/PageHeader'
import { SettingsPanel } from '@/components/letter/SettingsPanel'
import { getMeetingInfo, getStampCollection } from '@/lib/letter-store'
import { requirePageSession } from '@/lib/server-auth'

export default async function SettingsPage() {
  const session = await requirePageSession()
  const [meeting, stamps] = await Promise.all([
    getMeetingInfo(),
    getStampCollection(session.role),
  ])

  return (
    <>
      <PageHeader
        eyebrow="ME"
        title="我的"
        subtitle="这里放着关于这封信的小设置。"
      />
      <SettingsPanel role={session.role} meeting={meeting} stamps={stamps} />
    </>
  )
}
