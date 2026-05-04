'use client'

import type { DailyStatus } from '@/lib/letter-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { moodOptions, type MoodValue } from '@/lib/letter-copy'

type StatusFormProps = {
  initialStatus: DailyStatus | null
}

export function StatusForm({ initialStatus }: StatusFormProps) {
  const router = useRouter()
  const [mood, setMood] = useState<MoodValue | ''>(initialStatus?.mood ?? '')
  const [note, setNote] = useState(initialStatus?.note ?? '')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    setToast('')

    try {
      const response = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, note }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }

      if (!response.ok)
        throw new Error(data.message ?? '今天的状态暂时没保存成功。')

      setToast('今天的状态已经放进这封信里。')
      router.refresh()
    }
    catch (error) {
      setToast(error instanceof Error ? error.message : '今天的状态暂时没保存成功。')
    }
    finally {
      setSaving(false)
    }
  }

  return (
    <form
      className="letter-form"
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
    >
      <section className="letter-card">
        <p className="letter-card-title">今天的你是什么样子？</p>
        <div className="letter-chip-grid letter-mood-grid">
          {moodOptions.map(item => (
            <button
              key={item}
              type="button"
              className={mood === item ? 'letter-chip letter-chip-active' : 'letter-chip'}
              onClick={() => setMood(item)}
            >
              <span>{item}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="letter-card">
        <label className="letter-field-label" htmlFor="status-note">想补充一句吗？</label>
        <textarea
          id="status-note"
          value={note}
          onChange={event => setNote(event.target.value)}
          placeholder="比如：今天有点累，但看到你会好一点。"
          className="letter-textarea letter-textarea-small"
          maxLength={500}
        />
      </section>

      <button className="letter-primary-button" type="submit" disabled={saving}>
        {saving ? '正在保存今天的状态...' : '保存今天'}
      </button>
      <button className="letter-secondary-button" type="button" onClick={() => router.push('/void')}>返回首页</button>

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
    </form>
  )
}
