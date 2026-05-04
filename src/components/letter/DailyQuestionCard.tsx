'use client'

import type { AccessRole } from '@/lib/access'
import type { DailyQuestionState } from '@/lib/letter-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { otherName, personName } from '@/lib/letter-copy'

type DailyQuestionCardProps = {
  role: AccessRole
  state: DailyQuestionState
}

export function DailyQuestionCard({ role, state }: DailyQuestionCardProps) {
  const router = useRouter()
  const [answer, setAnswer] = useState(state.myAnswer ?? '')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    setSaving(true)
    setToast('')

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }

      if (!response.ok)
        throw new Error(data.message ?? '今天的答案暂时没有保存成功。')

      setToast('答案已经放进今天的小格子里。')
      router.refresh()
    }
    catch (error) {
      setToast(error instanceof Error ? error.message : '今天的答案暂时没有保存成功。')
    }
    finally {
      setSaving(false)
    }
  }

  return (
    <section className="letter-card">
      <div className="letter-card-head">
        <p className="letter-card-title">今天的一问一答</p>
        <span>Q&A</span>
      </div>
      <p className="letter-question">{state.question}</p>

      {state.bothAnswered
        ? (
            <div className="letter-answer-grid">
              <div>
                <span>{personName[role]}</span>
                <p>{state.myAnswer}</p>
              </div>
              <div>
                <span>{otherName(role)}</span>
                <p>{state.otherAnswer}</p>
              </div>
            </div>
          )
        : state.myAnswer
          ? (
              <>
                <p className="letter-soft-copy">你的答案已经放好。</p>
                <p className="letter-empty">等对方也写下，就能一起打开。</p>
              </>
            )
          : (
              <>
                <textarea
                  className="letter-textarea letter-textarea-small"
                  value={answer}
                  onChange={event => setAnswer(event.target.value)}
                  placeholder="慢慢写，一句话也可以。"
                  maxLength={500}
                />
                <button className="letter-primary-button" type="button" onClick={() => void submit()} disabled={saving}>
                  {saving ? '正在保存今天的答案...' : '保存我的答案'}
                </button>
              </>
            )}

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
    </section>
  )
}
