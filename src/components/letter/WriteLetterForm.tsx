'use client'

import type { AccessRole } from '@/lib/access'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Send } from 'lucide-react'
import { futureJarPresets, letterTypes, notePlaceholders, otherName } from '@/lib/letter-copy'

type WriteLetterFormProps = {
  role: AccessRole
}

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export function WriteLetterForm({ role }: WriteLetterFormProps) {
  const router = useRouter()
  const placeholder = useMemo(() => notePlaceholders[new Date().getDate() % notePlaceholders.length], [])
  const [type, setType] = useState(letterTypes[0].value)
  const [content, setContent] = useState('')
  const [deliverMode, setDeliverMode] = useState<'now' | 'scheduled'>('now')
  const [deliverAt, setDeliverAt] = useState('')
  const [readOnce, setReadOnce] = useState(false)
  const [toast, setToast] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function applyFuturePreset(days: number) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setType('future')
    setDeliverMode('scheduled')
    setDeliverAt(toDateTimeLocal(date))
  }

  async function submit() {
    setSubmitting(true)
    setToast('')

    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content, deliverMode, deliverAt, readOnce }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }

      if (!response.ok)
        throw new Error(data.message ?? '这封信暂时没寄出去。')

      setToast('这封信已经寄出啦。\n像素小邮差已经出发。')
      setContent('')
      setDeliverMode('now')
      setDeliverAt('')
      setReadOnce(false)
      window.setTimeout(() => router.push('/void/letters'), 900)
    }
    catch (error) {
      setToast(`${error instanceof Error ? error.message : '这封信暂时没寄出去。'}\n再试一次好不好？`)
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className="letter-form"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <section className="letter-card">
        <p className="letter-card-title">{`寄给：${otherName(role)}`}</p>
        <p className="letter-soft-copy">把今天想说的话，慢慢写下来。</p>
      </section>

      <section className="letter-card">
        <p className="letter-card-title">未来信罐子</p>
        <p className="letter-soft-copy">有些话，可以先放进未来某一天。</p>
        <div className="letter-chip-row">
          {futureJarPresets.map(item => (
            <button key={item.label} className="letter-mini-chip" type="button" onClick={() => applyFuturePreset(item.days)}>
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="letter-card">
        <p className="letter-card-title">选择这封信的类型</p>
        <div className="letter-chip-grid">
          {letterTypes.map(item => (
            <button
              key={item.value}
              type="button"
              className={type === item.value ? 'letter-chip letter-chip-active' : 'letter-chip'}
              onClick={() => setType(item.value)}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="letter-card">
        <label className="letter-field-label" htmlFor="letter-content">信的内容</label>
        <textarea
          id="letter-content"
          value={content}
          onChange={event => setContent(event.target.value)}
          placeholder={placeholder}
          className="letter-textarea"
          maxLength={5000}
        />
      </section>

      <section className="letter-card">
        <p className="letter-card-title">什么时候送达？</p>
        <div className="letter-segment">
          <button type="button" className={deliverMode === 'now' ? 'letter-segment-active' : ''} onClick={() => setDeliverMode('now')}>现在送达</button>
          <button type="button" className={deliverMode === 'scheduled' ? 'letter-segment-active' : ''} onClick={() => setDeliverMode('scheduled')}>指定时间送达</button>
        </div>
        {deliverMode === 'scheduled' && (
          <div className="letter-field-stack">
            <p className="letter-soft-copy">适合生日、纪念日、晚安，或者未来某一天。</p>
            <label className="letter-field-label" htmlFor="deliver-at">送达时间</label>
            <input
              id="deliver-at"
              type="datetime-local"
              value={deliverAt}
              onChange={event => setDeliverAt(event.target.value)}
              className="letter-input"
            />
          </div>
        )}
      </section>

      <section className="letter-card">
        <p className="letter-card-title">只显示一次的信</p>
        <p className="letter-soft-copy">打开后会变成：这封信已经被认真读过了。</p>
        <label className="letter-toggle-row">
          <input
            type="checkbox"
            checked={readOnce}
            onChange={event => setReadOnce(event.target.checked)}
          />
          <span>让这封信只显示一次</span>
        </label>
      </section>

      <button className="letter-primary-button" type="submit" disabled={submitting}>
        <Send size={17} aria-hidden />
        {submitting ? '正在寄出这封信...' : '寄出这封信'}
      </button>
      <button className="letter-secondary-button" type="button" onClick={() => router.push('/void')}>先不写了</button>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="letter-toast"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onAnimationComplete={() => window.setTimeout(() => setToast(''), 3000)}
          >
            {toast.split('\n').map(line => <span key={line}>{line}</span>)}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
