import { HomeDashboard } from '@/components/letter/HomeDashboard'
import { getDailySparkForHome } from '@/lib/daily-spark'
import {
  getAvailableFutureLetter,
  getDailyQuestionState,
  getLatestAssuranceFor,
  getLatestReceivedHug,
  getLatestReceivedLetter,
  getMeetingInfo,
  getOpenAssuranceFor,
  getRecentStatuses,
  getTodayStatus,
  getWishForHome,
} from '@/lib/letter-store'
import { otherRole } from '@/lib/letter-copy'
import { requirePageSession } from '@/lib/server-auth'

export default async function VoidPage() {
  const session = await requirePageSession()
  const other = otherRole(session.role)
  const [
    latestLetter,
    futureLetter,
    otherStatus,
    recentOtherStatuses,
    latestHug,
    meeting,
    dailyQuestion,
    openAssurance,
    latestAssurance,
    homeWish,
    dailySpark,
  ] = await Promise.all([
    getLatestReceivedLetter(session.role),
    getAvailableFutureLetter(session.role),
    getTodayStatus(other),
    getRecentStatuses(other),
    getLatestReceivedHug(session.role),
    getMeetingInfo(),
    getDailyQuestionState(session.role),
    getOpenAssuranceFor(session.role),
    getLatestAssuranceFor(session.role),
    getWishForHome(session.role),
    getDailySparkForHome(),
  ])

  return (
    <HomeDashboard
      role={session.role}
      latestLetter={latestLetter}
      futureLetter={futureLetter}
      otherStatus={otherStatus}
      recentOtherStatuses={recentOtherStatuses}
      latestHug={latestHug}
      meeting={meeting}
      dailyQuestion={dailyQuestion}
      openAssurance={openAssurance}
      latestAssurance={latestAssurance}
      homeWish={homeWish}
      dailySpark={dailySpark}
      nowIso={new Date().toISOString()}
    />
  )
}
