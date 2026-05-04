'use client'

import type { LetterReaction } from '@/lib/letter-store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { personName, reactionLabel, reactionOptions, type LetterReactionAction } from '@/lib/letter-copy'

type LetterReactionBarProps = {
  letterId: string
  reactions: LetterReaction[]
  canReact: boolean
}

export function LetterReactionBar({ letterId, reactions, canReact }: LetterReactionBarProps) {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  async function react(action: LetterReactionAction) {
    setBusy(true)
    setToast('')

    try {
      const response = await fetch(`/api/letters/${letterId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (!response.ok)
        throw new Error('failed')

      setToast('你的回应已经放到这封信旁边。')
      router.refresh()
    }
    catch {
      setToast('这次回应没有送出去。')
    }
    finally {
      setBusy(false)
    }
  }

  return (
    <section className="letter-card">
      <div className="letter-card-head">
        <p className="letter-card-title">给这封信一点回应</p>
        <span>REPLY</span>
      </div>
      {reactions.length > 0 && (
        <div className="letter-reaction-list">
          {reactions.map(item => (
            <p key={item.id}>{`${personName[item.role]}：${reactionLabel(item.action)}`}</p>
          ))}
        </div>
      )}
      {canReact && (
        <div className="letter-action-grid">
          {reactionOptions.map(item => (
            <button key={item.value} type="button" onClick={() => void react(item.value)} disabled={busy}>
              {item.label}
            </button>
          ))}
          <Link href="/void/write">写一封回信</Link>
        </div>
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
