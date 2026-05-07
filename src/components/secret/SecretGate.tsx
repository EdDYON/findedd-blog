'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MobileShell } from '@/components/secret/MobileShell'

type AccessResponse = {
  ok: boolean
}

const WRONG_KEY = '这不是打开它的密钥。'
const COOLDOWN = '现在暂时打不开它。\n请稍等一会儿再试。'
const NETWORK_ERROR = '好像有点慢。\n这封信正在路上。'

export function SecretGate() {
  const router = useRouter()
  const [key, setKey] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [opening, setOpening] = useState(false)
  const redirectTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (redirectTimer.current)
        window.clearTimeout(redirectTimer.current)
    }
  }, [])

  async function submitKey() {
    const trimmedKey = key.trim()

    if (!trimmedKey) {
      setMessage(WRONG_KEY)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: trimmedKey }),
      })
      const data = await response.json().catch(() => ({ ok: false })) as AccessResponse

      if (response.status === 429) {
        setMessage(COOLDOWN)
        return
      }

      if (!response.ok || !data.ok) {
        setMessage(WRONG_KEY)
        return
      }

      setMessage('信打开了。')
      setOpening(true)
      redirectTimer.current = window.setTimeout(() => router.replace('/void'), 720)
    }
    catch {
      setMessage(NETWORK_ERROR)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <MobileShell>
      <div className="secret-night-sky" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={opening ? { opacity: 0, y: -28, scale: 1.035, filter: 'blur(10px)' } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: opening ? 0.62 : 0.58, ease: 'easeOut' }}
        className={opening ? 'secret-card secret-gate-card secret-gate-card-opening' : 'secret-card secret-gate-card'}
      >
        <div className={opening ? 'secret-envelope secret-envelope-opening' : 'secret-envelope'} aria-hidden>
          <div className="secret-envelope-back" />
          <div className="secret-envelope-paper" />
          <div className="secret-envelope-flap secret-envelope-flap-left" />
          <div className="secret-envelope-flap secret-envelope-flap-right" />
          <div className="secret-envelope-flap secret-envelope-flap-top" />
          <div className="secret-envelope-seal" />
          <div className="secret-envelope-paw" />
          <div className="secret-envelope-crack" />
          <div className="secret-envelope-pixels">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>
        </div>

        <h1 className="secret-title">有一封信</h1>
        <p className="secret-copy">等待被打开。</p>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void submitKey()
          }}
        >
          <input
            id="secret-key"
            type="password"
            value={key}
            onChange={event => setKey(event.target.value)}
            className="secret-input"
            placeholder="神秘密钥"
            autoComplete="off"
            aria-label="神秘密钥"
          />

          <p className={key.trim() || loading ? 'secret-opening-hint secret-opening-hint-visible' : 'secret-opening-hint'}>
            信封正在为你打开...
          </p>

          <AnimatePresence>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className={opening ? 'secret-success' : 'secret-error'}
              >
                {message.split('\n').map(line => <span key={line}>{line}</span>)}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            aria-busy={loading}
            className="secret-primary-button"
          >
            {loading ? '正在打开这封信...' : '打开'}
          </motion.button>
        </form>

        <p className="secret-footnote">不是所有人，都能打开这封信。</p>
      </motion.section>
    </MobileShell>
  )
}
