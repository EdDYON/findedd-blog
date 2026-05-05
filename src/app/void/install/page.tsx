import { InstallGuide } from '@/components/letter/InstallGuide'
import { PageHeader } from '@/components/letter/PageHeader'
import { requirePageSession } from '@/lib/server-auth'

export default async function InstallPage() {
  await requirePageSession()

  return (
    <>
      <PageHeader
        eyebrow="INSTALL"
        title="把一封信放到桌面"
      />
      <InstallGuide />
    </>
  )
}
