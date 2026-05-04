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
import { Heart, Inbox, PenLine, Send, SmilePlus } from 'lucide-react'
import { AssuranceCard } from '@/components/letter/AssuranceCard'
import { DailyQuestionCard } from '@/components/letter/DailyQuestionCard'
import { DailySparkCard } from '@/components/letter/DailySparkCard'
import { MoodTemperatureCard } from '@/components/letter/MoodTemperatureCard'
import { WishDrawerCard } from '@/components/letter/WishDrawerCard'
import {
  countdownSubtitles,
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
  const countdownHint = useMemo(() => countdownSubtitles[new Date().getDate() % countdownSubtitles.length], [])
  const latestLetterLocked = latestLetter ? latestLetter.deliverAt > nowIso : false
  const hasMeetingPlan = Boolean(meeting.plan || meeting.bring || meeting.firstWords || meeting.firstThing)

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
      <section className="letter-hero-card">
        <p className="letter-eyebrow">HOME</p>
        <h1>{`欢迎回来，${personName[role]}。`}</h1>
        <p>{stableHomeSubtitle(role)}</p>
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

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">下一次见面</p>
          <span>PIXEL TRAIN</span>
        </div>
        {meeting.time && countdown
          ? (
              <div className="letter-countdown-block">
                <p className="letter-muted">距离下次见面还有</p>
                <div className="letter-big-count">
                  <strong>{countdown.days}</strong>
                  <span>天</span>
                  <strong>{countdown.hours}</strong>
                  <span>小时</span>
                </div>
                {meeting.place && <p className="letter-meta">{`地点：${meeting.place}`}</p>}
                {meeting.note && <p className="letter-meta">{`备注：${meeting.note}`}</p>}
                <p className="letter-soft-copy">{countdownHint}</p>
              </div>
            )
          : <p className="letter-empty">下一次见面，还在等待被写进这封信。</p>}
      </section>

      {hasMeetingPlan && (
        <section className="letter-card">
          <div className="letter-card-head">
            <p className="letter-card-title">见面计划卡</p>
            <span>PLAN</span>
          </div>
          {meeting.plan && <p className="letter-meta">{`见面当天计划：${meeting.plan}`}</p>}
          {meeting.bring && <p className="letter-meta">{`要带给对方的东西：${meeting.bring}`}</p>}
          {meeting.firstWords && <p className="letter-meta">{`第一句话：${meeting.firstWords}`}</p>}
          {meeting.firstThing && <p className="letter-meta">{`第一件想做的事：${meeting.firstThing}`}</p>}
        </section>
      )}

      <DailyQuestionCard role={role} state={dailyQuestion} />
      <DailySparkCard spark={dailySpark} />
      <AssuranceCard role={role} openRequest={openAssurance} latestRequest={latestAssurance} />

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">{role === 'owner' ? '杨婷婷今天' : '杜一今天'}</p>
          <span>STATUS</span>
        </div>
        {otherStatus
          ? (
              <>
                <p className="letter-mood">{otherStatus.mood}</p>
                {otherStatus.note && (
                  <p className="letter-soft-copy">
                    {`${personName[otherStatus.role]}留下了一句话：`}
                    <br />
                    {otherStatus.note}
                  </p>
                )}
              </>
            )
          : (
              <>
                <p className="letter-empty">今天还没有留下状态。</p>
                <p className="letter-soft-copy">
                  {role === 'owner' ? '也许可以给杨婷婷写一封信。' : '也许可以看看杜一有没有寄来什么。'}
                </p>
              </>
            )}
        <Link className="letter-secondary-button" href="/void/status">更新我的状态</Link>
      </section>

      <MoodTemperatureCard statuses={recentOtherStatuses} subject={otherName(role)} />

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">最新一封信</p>
          <span>LETTER</span>
        </div>
        {latestLetter && !latestLetterLocked
          ? (
              <>
                <p className="letter-soft-copy">{latestLetter.readAt ? `${letterTypeLabel(latestLetter.type)} 已打开` : '有一封新信在等你。'}</p>
                <p className="letter-preview">
                  {`${personName[latestLetter.sender]}寄给你：`}
                  <br />
                  {latestLetter.readOnce && latestLetter.readAt ? '这封信已经被认真读过了。' : `「${previewText(latestLetter.content)}」`}
                </p>
                <p className="letter-meta">{formatDateTime(latestLetter.createdAt)}</p>
                <Link className="letter-primary-button" href={`/void/letters/${latestLetter.id}`}>打开看看</Link>
              </>
            )
          : (
              <>
                <p className="letter-empty">还没有新的信。</p>
                <p className="letter-soft-copy">要不要先写一封寄过去？</p>
                <Link className="letter-secondary-button" href="/void/letters">去信箱</Link>
              </>
            )}
      </section>

      <WishDrawerCard wish={homeWish} />

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">抱抱信</p>
          <span>HUG</span>
        </div>
        <p className="letter-soft-copy">有些抱抱暂时到不了，但可以先寄出去。</p>
        <button className="letter-primary-button" type="button" onClick={() => void sendHug()} disabled={sendingHug}>
          <Heart size={17} aria-hidden />
          寄一个抱抱
        </button>
      </section>

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">今天可以做的小事</p>
          <span>QUEST</span>
        </div>
        <div className="letter-action-grid">
          <Link href="/void/write"><PenLine size={17} aria-hidden />写一封信</Link>
          <Link href="/void/letters"><Inbox size={17} aria-hidden />查看信箱</Link>
          <Link href="/void/status"><SmilePlus size={17} aria-hidden />更新状态</Link>
          <button type="button" onClick={() => void sendHug()} disabled={sendingHug}>
            <Send size={17} aria-hidden />
            寄一个抱抱
          </button>
        </div>
      </section>

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
