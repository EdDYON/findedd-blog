'use client'

import type { AccessRole } from '@/lib/access'
import type { Letter, LetterReaction } from '@/lib/letter-store'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LetterReactionBar } from '@/components/letter/LetterReactionBar'
import { PageHeader } from '@/components/letter/PageHeader'
import { formatFullDateTime, letterTypeLabel, personName } from '@/lib/letter-copy'

type LetterDetailClientProps = {
  letter: Letter
  reactions: LetterReaction[]
  sessionRole: AccessRole
}

export function LetterDetailClient({ letter, reactions, sessionRole }: LetterDetailClientProps) {
  const locked = letter.deliverAt > new Date().toISOString()
  const contentHidden = letter.readOnce && letter.receiver === sessionRole && Boolean(letter.readAt)
  const canMarkRead = letter.receiver === sessionRole && !letter.readAt && !locked
  const [phase, setPhase] = useState<'sealed' | 'tearing' | 'opened'>('sealed')
  const [read, setRead] = useState(Boolean(letter.readAt))
  const opened = phase === 'opened'
  const canReact = letter.receiver === sessionRole && !locked && !contentHidden && opened

  async function markRead() {
    if (!canMarkRead || read)
      return

    try {
      const response = await fetch(`/api/letters/${letter.id}/read`, { method: 'POST' })

      if (response.ok)
        setRead(true)
    }
    catch {
      // The local reveal should remain gentle even if the read stamp cannot sync.
    }
  }

  function openLetter() {
    setPhase('tearing')
    window.setTimeout(() => setPhase('opened'), 720)
    window.setTimeout(() => {
      void markRead()
    }, 1180)
  }

  return (
    <>
      <PageHeader eyebrow="LETTER" title="一封信" />

      {locked
        ? (
            <article className="letter-card letter-detail-card letter-ritual-card">
              <LetterMeta letter={letter} />
              <div className="letter-locked">
                <p className="letter-card-title">这封信还没到打开的时候。</p>
                <p className="letter-soft-copy">它还在路上，时间到了才会送达。</p>
              </div>
            </article>
          )
        : contentHidden
          ? (
              <article className="letter-card letter-detail-card letter-ritual-card">
                <LetterMeta letter={letter} />
                <div className="letter-locked">
                  <p className="letter-card-title">这封信已经被认真读过了。</p>
                </div>
              </article>
            )
          : (
              <article className={opened ? 'letter-card letter-detail-card letter-ritual-card letter-ritual-opened' : 'letter-card letter-detail-card letter-ritual-card'}>
                <LetterMeta letter={letter} />

                <AnimatePresence mode="wait">
                  {!opened
                    ? (
                        <motion.div
                          key="sealed"
                          className={phase === 'tearing' ? 'letter-open-stage letter-open-tearing' : 'letter-open-stage'}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                        >
                          <div className="letter-open-envelope" aria-hidden>
                            <div className="letter-open-envelope-back" />
                            <div className="letter-open-envelope-paper" />
                            <div className="letter-open-envelope-flap letter-open-envelope-left" />
                            <div className="letter-open-envelope-flap letter-open-envelope-right" />
                            <div className="letter-open-envelope-flap letter-open-envelope-top" />
                            <div className="letter-open-envelope-seal" />
                          </div>
                          {phase === 'sealed' && (
                            <button className="letter-primary-button letter-open-button" type="button" onClick={openLetter}>
                              拆开
                            </button>
                          )}
                        </motion.div>
                      )
                    : (
                        <motion.div
                          key="paper"
                          className="letter-paper-unfold"
                          initial={{ opacity: 0, scaleY: 0.24, y: -14 }}
                          animate={{ opacity: 1, scaleY: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.72, ease: 'easeOut' }}
                        >
                          <div className="letter-paper-stamps" aria-hidden>
                            <span className="letter-paw-stamp" />
                            <span className="letter-read-stamp">{read || canMarkRead ? '已读' : '已打开'}</span>
                          </div>
                          <div className="letter-body-text">
                            {letter.content.split('\n').map((line, index) => (
                              <p key={`${index}-${line}`}>{line || '\u00a0'}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                </AnimatePresence>
              </article>
            )}

      {opened && !locked && !contentHidden && (
        <LetterReactionBar letterId={letter.id} reactions={reactions} canReact={canReact} />
      )}
      <Link className="letter-secondary-button" href="/void/letters">返回信箱</Link>
    </>
  )
}

function LetterMeta({ letter }: { letter: Letter }) {
  return (
    <div className="letter-detail-meta">
      <p>{`来自：${personName[letter.sender]}`}</p>
      <p>{`寄给：${personName[letter.receiver]}`}</p>
      <p>{`类型：${letterTypeLabel(letter.type)}`}</p>
      <p>{`时间：${formatFullDateTime(letter.createdAt)}`}</p>
      {letter.readOnce && <p>只显示一次</p>}
    </div>
  )
}
