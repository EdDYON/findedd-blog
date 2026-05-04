'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export function SecurityForm() {
  const router = useRouter()
  const [currentKey, setCurrentKey] = useState('')
  const [nextKey, setNextKey] = useState('')
  const [confirmKey, setConfirmKey] = useState('')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    setToast('')

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentKey, nextKey, confirmKey }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }

      if (!response.ok)
        throw new Error(data.message ?? '新的密钥暂时没有保存成功。')

      setCurrentKey('')
      setNextKey('')
      setConfirmKey('')
      setToast('新的密钥已经收好啦。\n下次请用新密钥打开这封信。')
    }
    catch (error) {
      setToast(error instanceof Error ? error.message : '新的密钥暂时没有保存成功。')
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
        <p className="letter-card-title">修改我的密钥</p>
        <p className="letter-soft-copy">密钥只属于你自己，请好好保存。</p>

        <label className="letter-field-label" htmlFor="current-key">当前密钥</label>
        <input
          id="current-key"
          type="password"
          value={currentKey}
          onChange={event => setCurrentKey(event.target.value)}
          className="letter-input"
          placeholder="输入现在使用的密钥"
          autoComplete="current-password"
        />

        <label className="letter-field-label" htmlFor="next-key">新密钥</label>
        <input
          id="next-key"
          type="password"
          value={nextKey}
          onChange={event => setNextKey(event.target.value)}
          className="letter-input"
          placeholder="输入新的密钥"
          autoComplete="new-password"
        />

        <label className="letter-field-label" htmlFor="confirm-key">确认新密钥</label>
        <input
          id="confirm-key"
          type="password"
          value={confirmKey}
          onChange={event => setConfirmKey(event.target.value)}
          className="letter-input"
          placeholder="再输入一次新的密钥"
          autoComplete="new-password"
        />

        <div className="letter-rule-list">
          <p>新密钥至少 8 位。</p>
          <p>不要使用太容易猜到的内容。</p>
          <p>新的密钥保存后，下次打开需要使用它。</p>
        </div>
      </section>

      <button className="letter-primary-button" type="submit" disabled={saving}>
        {saving ? '正在保存今天的状态...' : '保存新密钥'}
      </button>
      <button className="letter-secondary-button" type="button" onClick={() => router.push('/void/settings')}>返回设置</button>

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
