'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MobileShell } from '@/components/secret/MobileShell'

type AccessResponse = {
  ok: boolean
}

const GATE_ERROR = '这不是打开它的密钥。'

export function SecretGate() {
  const router = useRouter()
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [spark, setSpark] = useState(false)
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
      setError(GATE_ERROR)
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: trimmedKey }),
      })
      const data = await response.json().catch(() => ({ ok: false })) as AccessResponse

      if (!response.ok || !data.ok) {
        setError(GATE_ERROR)
        return
      }

      setSpark(true)
      redirectTimer.current = window.setTimeout(() => router.replace('/void'), 520)
    }
    catch {
      setError(GATE_ERROR)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <MobileShell>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="secret-card"
      >
        <div className="secret-orbit" aria-hidden />
        <h1 className="secret-title">有一封信。</h1>
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
            placeholder="输入密钥"
            autoComplete="off"
            aria-label="输入密钥"
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="secret-error"
              >
                {error}
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
            打开
          </motion.button>
        </form>
      </motion.section>

      <AnimatePresence>
        {spark && (
          <motion.div
            className="secret-stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0], y: -44 - index * 3, scale: [0.4, 1, 0.7] }}
                transition={{ duration: 0.85, delay: index * 0.035 }}
                style={{ left: `${18 + index * 8}%` }}
              >
                ✦
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </MobileShell>
  )
}
