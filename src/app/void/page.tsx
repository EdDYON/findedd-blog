import { HomeDashboard } from '@/components/letter/HomeDashboard'
import {
  getLatestReceivedHug,
  getLatestReceivedLetter,
  getMeetingInfo,
  getTodayStatus,
} from '@/lib/letter-store'
import { otherRole } from '@/lib/letter-copy'
import { requirePageSession } from '@/lib/server-auth'

export default async function VoidPage() {
  const session = await requirePageSession()
  const [latestLetter, otherStatus, latestHug, meeting] = await Promise.all([
    getLatestReceivedLetter(session.role),
    getTodayStatus(otherRole(session.role)),
    getLatestReceivedHug(session.role),
    getMeetingInfo(),
  ])

  return (
    <HomeDashboard
      role={session.role}
      latestLetter={latestLetter}
      otherStatus={otherStatus}
      latestHug={latestHug}
      meeting={meeting}
      nowIso={new Date().toISOString()}
    />
  )
}
