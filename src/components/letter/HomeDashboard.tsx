'use client'

import type { AccessRole } from '@/lib/access'
import type { DailyStatus, HugRecord, Letter, MeetingInfo } from '@/lib/letter-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Inbox, PenLine, Send, SmilePlus } from 'lucide-react'
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
  otherStatus: DailyStatus | null
  latestHug: HugRecord | null
  meeting: MeetingInfo
  nowIso: string
}

export function HomeDashboard({ role, latestLetter, otherStatus, latestHug, meeting, nowIso }: HomeDashboardProps) {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [sendingHug, setSendingHug] = useState(false)
  const countdown = getCountdownParts(meeting.time)
  const countdownHint = useMemo(() => countdownSubtitles[new Date().getDate() % countdownSubtitles.length], [])
  const latestLetterLocked = latestLetter ? latestLetter.deliverAt > nowIso : false

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
                  {`「${previewText(latestLetter.content)}」`}
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
