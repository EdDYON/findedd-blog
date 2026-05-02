'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export function PaperNote() {
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const sentTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (sentTimer.current)
        window.clearTimeout(sentTimer.current)
    }
  }, [])

  function sendNote() {
    if (!note.trim())
      return

    if (sentTimer.current)
      window.clearTimeout(sentTimer.current)

    setNote('')
    setSent(true)
    sentTimer.current = window.setTimeout(() => setSent(false), 1100)
  }

  return (
    <section className="secret-card secret-mini-card">
      <p className="secret-card-title">纸条</p>
      <textarea
        value={note}
        onChange={event => setNote(event.target.value)}
        className="secret-note-input"
        placeholder="写一张只有门后能看懂的小纸条"
        rows={4}
      />
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={sendNote}
        className="secret-secondary-button"
      >
        发送纸条
      </motion.button>

      <AnimatePresence>
        {sent && (
          <motion.div
            className="secret-note-stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], y: -34 - index * 4, scale: [0.5, 1, 0.7] }}
                transition={{ duration: 0.9, delay: index * 0.045 }}
                style={{ left: `${20 + index * 9}%` }}
              >
                ✦
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
