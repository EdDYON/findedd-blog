'use client'

import type { AccessRole } from '@/lib/access'
import type { MeetingInfo, StampCollectionItem } from '@/lib/letter-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, CalendarDays, Info, LogOut, MonitorDown, RotateCcw, ShieldCheck, UserRound } from 'lucide-react'
import { StampCollection } from '@/components/letter/StampCollection'
import { formatFullDateTime, personName } from '@/lib/letter-copy'

type SettingsPanelProps = {
  role: AccessRole
  meeting: MeetingInfo
  stamps: StampCollectionItem[]
}

export function SettingsPanel({ role, meeting, stamps }: SettingsPanelProps) {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [showExit, setShowExit] = useState(false)
  const [meetingTime, setMeetingTime] = useState(meeting.time ? meeting.time.slice(0, 16) : '')
  const [meetingPlace, setMeetingPlace] = useState(meeting.place ?? '')
  const [meetingNote, setMeetingNote] = useState(meeting.note ?? '')
  const [meetingPlan, setMeetingPlan] = useState(meeting.plan ?? '')
  const [meetingBring, setMeetingBring] = useState(meeting.bring ?? '')
  const [meetingFirstWords, setMeetingFirstWords] = useState(meeting.firstWords ?? '')
  const [meetingFirstThing, setMeetingFirstThing] = useState(meeting.firstThing ?? '')
  const [newHerKey, setNewHerKey] = useState('')

  async function leave() {
    await fetch('/api/access', { method: 'DELETE' })
    setToast('已经把这封信合上啦。')
    window.setTimeout(() => router.replace('/'), 500)
  }

  async function saveMeeting() {
    const response = await fetch('/api/settings/meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time: meetingTime,
        place: meetingPlace,
        note: meetingNote,
        plan: meetingPlan,
        bring: meetingBring,
        firstWords: meetingFirstWords,
        firstThing: meetingFirstThing,
      }),
    })

    if (response.ok) {
      setToast('下一次见面已经写进这封信。')
      router.refresh()
    }
    else {
      setToast('好像出了点小问题。')
    }
  }

  async function resetKey() {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset-her' }),
    })
    const data = await response.json().catch(() => ({})) as { key?: string }

    if (response.ok && data.key) {
      setNewHerKey(data.key)
      setToast('新的密钥已经收好啦。')
    }
    else {
      setToast('新的密钥暂时没有保存成功。')
    }
  }

  return (
    <>
      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">当前身份</p>
          <UserRound size={18} aria-hidden />
        </div>
        <p className="letter-mood">{personName[role]}</p>
        <p className="letter-soft-copy">{`正在以${personName[role]}的身份读这封信。`}</p>
      </section>

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">安全设置</p>
          <ShieldCheck size={18} aria-hidden />
        </div>
        <p className="letter-soft-copy">可以修改自己的密钥，或者退出这封信。</p>
        <Link className="letter-secondary-button" href="/void/settings/security">修改我的密钥</Link>
        <button className="letter-danger-button" type="button" onClick={() => setShowExit(true)}>退出这封信</button>
      </section>

      {role === 'owner' && (
        <section className="letter-card">
          <div className="letter-card-head">
            <p className="letter-card-title">下一次见面</p>
            <CalendarDays size={18} aria-hidden />
          </div>
          {meeting.time
            ? (
                <div className="letter-field-stack">
                  <p className="letter-meta">{`时间：${formatFullDateTime(meeting.time)}`}</p>
                  {meeting.place && <p className="letter-meta">{`地点：${meeting.place}`}</p>}
                  {meeting.note && <p className="letter-meta">{`备注：${meeting.note}`}</p>}
                </div>
              )
            : <p className="letter-empty">下一次见面还没有被写进来。</p>}
          <label className="letter-field-label" htmlFor="meeting-time">修改见面信息</label>
          <input id="meeting-time" className="letter-input" type="datetime-local" value={meetingTime} onChange={event => setMeetingTime(event.target.value)} />
          <input className="letter-input" value={meetingPlace} onChange={event => setMeetingPlace(event.target.value)} placeholder="地点" />
          <textarea className="letter-textarea letter-textarea-small" value={meetingNote} onChange={event => setMeetingNote(event.target.value)} placeholder="备注" />
          <textarea className="letter-textarea letter-textarea-small" value={meetingPlan} onChange={event => setMeetingPlan(event.target.value)} placeholder="见面当天计划" />
          <input className="letter-input" value={meetingBring} onChange={event => setMeetingBring(event.target.value)} placeholder="要带给对方的东西" />
          <input className="letter-input" value={meetingFirstWords} onChange={event => setMeetingFirstWords(event.target.value)} placeholder="第一句话" />
          <input className="letter-input" value={meetingFirstThing} onChange={event => setMeetingFirstThing(event.target.value)} placeholder="第一件想做的事" />
          <button className="letter-primary-button" type="button" onClick={() => void saveMeeting()}>保存见面信息</button>
        </section>
      )}

      <StampCollection stamps={stamps} />

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">把一封信放到桌面</p>
          <MonitorDown size={18} aria-hidden />
        </div>
        <p className="letter-soft-copy">添加到 iPhone 主屏幕后，就可以像 App 一样打开。</p>
        <Link className="letter-secondary-button" href="/void/install">查看安装方法</Link>
      </section>

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">消息提醒</p>
          <Bell size={18} aria-hidden />
        </div>
        <p className="letter-soft-copy">提醒功能还在路上。</p>
        <Link className="letter-secondary-button" href="/void/settings/notifications">开启提醒</Link>
      </section>

      {role === 'owner' && (
        <section className="letter-card">
          <div className="letter-card-head">
            <p className="letter-card-title">维护模式</p>
            <RotateCcw size={18} aria-hidden />
          </div>
          <p className="letter-soft-copy">可以重置杨婷婷的密钥。新密钥只会显示一次，请认真保存。</p>
          <button className="letter-danger-button" type="button" onClick={() => void resetKey()}>重新生成她的密钥</button>
          {newHerKey && (
            <div className="letter-code-block">
              {newHerKey}
            </div>
          )}
        </section>
      )}

      <section className="letter-card">
        <div className="letter-card-head">
          <p className="letter-card-title">关于一封信</p>
          <Info size={18} aria-hidden />
        </div>
        <p className="letter-soft-copy">
          一封信，是一个只属于两个人的私密信箱。
          <br />
          有些想念，不急着说出口，也可以慢慢写下来。
        </p>
      </section>

      <AnimatePresence>
        {showExit && (
          <motion.div className="letter-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.section className="letter-modal" initial={{ scale: 0.96, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 18 }}>
              <LogOut size={22} aria-hidden />
              <h2>要退出这封信吗？</h2>
              <p>退出后，需要重新输入密钥才能打开。</p>
              <button className="letter-danger-button" type="button" onClick={() => void leave()}>退出</button>
              <button className="letter-secondary-button" type="button" onClick={() => setShowExit(false)}>先不退出</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="letter-toast"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onAnimationComplete={() => window.setTimeout(() => setToast(''), 2600)}
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
