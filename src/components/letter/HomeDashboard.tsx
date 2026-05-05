'use client'

import type { AccessRole } from '@/lib/access'
import type { DailySpark } from '@/lib/daily-spark'
import type {
  AssuranceRequest,
  DailyQuestionState,
  DailyStatus,
  HugRecord,
  Letter,
  MeetingInfo,
  Wish,
} from '@/lib/letter-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Inbox, PenLine, Send, SmilePlus } from 'lucide-react'
import { AssuranceCard } from '@/components/letter/AssuranceCard'
import { DailyQuestionCard } from '@/components/letter/DailyQuestionCard'
import { DailySparkCard } from '@/components/letter/DailySparkCard'
import { MoodTemperatureCard } from '@/components/letter/MoodTemperatureCard'
import { WishDrawerCard } from '@/components/letter/WishDrawerCard'
import {
  formatDateTime,
  getCountdownParts,
  letterTypeLabel,
  otherName,
  personName,
  previewText,
  stableHomeSubtitle,
} from '@/lib/letter-copy'

type HomeDashboardProps = {
  role: AccessRole
  latestLetter: Letter | null
  futureLetter: Letter | null
  otherStatus: DailyStatus | null
  recentOtherStatuses: DailyStatus[]
  latestHug: HugRecord | null
  meeting: MeetingInfo
  dailyQuestion: DailyQuestionState
  openAssurance: AssuranceRequest | null
  latestAssurance: AssuranceRequest | null
  homeWish: Wish | null
  dailySpark: DailySpark | null
  nowIso: string
}

export function HomeDashboard({
  role,
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
  nowIso,
}: HomeDashboardProps) {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [sendingHug, setSendingHug] = useState(false)
  const countdown = getCountdownParts(meeting.time)
  const latestLetterLocked = latestLetter ? latestLetter.deliverAt > nowIso : false
  const hasMeetingPlan = Boolean(meeting.plan || meeting.bring || meeting.firstWords || meeting.firstThing)
  const togetherDays = useMemo(() => {
    const start = new Date('2025-12-22T00:00:00+08:00').getTime()
    const now = new Date(nowIso).getTime()

    if (!Number.isFinite(now) || now < start)
      return 1

    return Math.floor((now - start) / 86400000) + 1
  }, [nowIso])

  async function sendHug() {
    setSendingHug(true)
    setToast('')

    try {
      const response = await fetch('/api/hugs', { method: 'POST' })

      if (!response.ok)
        throw new Error('failed')

      setToast('抱抱已经寄出啦。\n它会穿过很远很远的距离。')
      router.refresh()
    }
    catch {
      setToast('好像出了点小问题。\n再试一次好不好？')
    }
    finally {
      setSendingHug(false)
    }
  }

  return (
    <>
      <section className="letter-hero-card letter-hero-console">
        <div>
          <p className="letter-eyebrow">HOME / POCKET</p>
          <h1>{`欢迎回来，${personName[role]}。`}</h1>
          <p>{stableHomeSubtitle(role)}</p>
        </div>
        <div className="letter-hero-stats">
          <span>
            <small>SINCE</small>
            <strong>2025.12.22</strong>
          </span>
          <span>
            <small>DAYS</small>
            <strong>{togetherDays}</strong>
          </span>
          <span>
            <small>MEET</small>
            <strong>{countdown ? `${countdown.days}天` : '未设置'}</strong>
          </span>
        </div>
      </section>

      <AnimatePresence>
        {futureLetter && (
          <motion.section
            className="letter-card letter-pixel-alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <p className="letter-card-title">有一封未来的信可以打开了。</p>
            <p className="letter-soft-copy">{`${personName[futureLetter.sender]}寄来的未来，已经到达。`}</p>
            <Link className="letter-primary-button" href={`/void/letters/${futureLetter.id}`}>打开未来的信</Link>
          </motion.section>
        )}
        {latestHug && (
          <motion.section
            className="letter-card letter-pixel-alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <p className="letter-card-title">
              {`${otherName(role)}刚刚寄来了一封抱抱信。`}
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <div className="letter-home-grid">
        <section className="letter-card letter-mini-panel">
          <div className="letter-card-head">
            <p className="letter-card-title">最新信件</p>
            <span>MAIL</span>
          </div>
          {latestLetter && !latestLetterLocked
            ? (
                <>
                  <p className="letter-soft-copy">{latestLetter.readAt ? `${letterTypeLabel(latestLetter.type)} 已打开` : '新信待开'}</p>
                  <p className="letter-preview">
                    {latestLetter.readOnce && latestLetter.readAt ? '已认真读过' : `「${previewText(latestLetter.content, 28)}」`}
                  </p>
                  <p className="letter-meta">{formatDateTime(latestLetter.createdAt)}</p>
                  <Link className="letter-secondary-button letter-button-compact" href={`/void/letters/${latestLetter.id}`}>打开</Link>
                </>
              )
            : (
                <>
                  <p className="letter-empty">暂无新信</p>
                  <Link className="letter-secondary-button letter-button-compact" href="/void/write">写一封</Link>
                </>
              )}
        </section>

        <section className="letter-card letter-mini-panel">
          <div className="letter-card-head">
            <p className="letter-card-title">{role === 'owner' ? '杨婷婷今天' : '杜一今天'}</p>
            <span>MOOD</span>
          </div>
          {otherStatus
            ? (
                <>
                  <p className="letter-mood">{otherStatus.mood}</p>
                  {otherStatus.note && <p className="letter-soft-copy">{otherStatus.note}</p>}
                </>
              )
            : <p className="letter-empty">今日待机</p>}
          <Link className="letter-secondary-button letter-button-compact" href="/void/status">更新状态</Link>
        </section>

        <DailySparkCard spark={dailySpark} />
        <MoodTemperatureCard statuses={recentOtherStatuses} subject={otherName(role)} />
      </div>

      {(meeting.time || hasMeetingPlan) && (
        <section className="letter-card letter-meeting-panel">
          <div className="letter-card-head">
            <p className="letter-card-title">见面计划</p>
            <span>TRAIN</span>
          </div>
          {meeting.time && countdown && (
            <div className="letter-countdown-inline">
              <span>{countdown.days} 天</span>
              <span>{countdown.hours} 小时</span>
            </div>
          )}
          {meeting.place && <p className="letter-meta">{`地点：${meeting.place}`}</p>}
          {meeting.note && <p className="letter-meta">{`备注：${meeting.note}`}</p>}
          {meeting.plan && <p className="letter-meta">{`计划：${meeting.plan}`}</p>}
          {meeting.bring && <p className="letter-meta">{`带给对方：${meeting.bring}`}</p>}
          {meeting.firstWords && <p className="letter-meta">{`第一句话：${meeting.firstWords}`}</p>}
          {meeting.firstThing && <p className="letter-meta">{`第一件事：${meeting.firstThing}`}</p>}
        </section>
      )}

      <div className="letter-wide-stack">
        <DailyQuestionCard role={role} state={dailyQuestion} />
        <WishDrawerCard wish={homeWish} />
      </div>

      <div className="letter-home-grid">
        <AssuranceCard role={role} openRequest={openAssurance} latestRequest={latestAssurance} />
        <section className="letter-card letter-quest-panel">
          <div className="letter-card-head">
            <p className="letter-card-title">快捷动作</p>
            <span>PAD</span>
          </div>
          <div className="letter-action-grid">
            <Link href="/void/write"><PenLine size={17} aria-hidden />写信</Link>
            <Link href="/void/letters"><Inbox size={17} aria-hidden />信箱</Link>
            <Link href="/void/status"><SmilePlus size={17} aria-hidden />状态</Link>
            <button type="button" onClick={() => void sendHug()} disabled={sendingHug}>
              <Send size={17} aria-hidden />
              抱抱
            </button>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="letter-toast"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onAnimationComplete={() => window.setTimeout(() => setToast(''), 2600)}
          >
            {toast.split('\n').map(line => <span key={line}>{line}</span>)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
