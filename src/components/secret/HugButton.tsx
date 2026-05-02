'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

export function HugButton() {
  const [hearts, setHearts] = useState<Array<{ id: number; left: number }>>([])
  const clearTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (clearTimer.current)
        window.clearTimeout(clearTimer.current)
    }
  }, [])

  function sendHug() {
    if (clearTimer.current)
      window.clearTimeout(clearTimer.current)

    const now = Date.now()
    setHearts(Array.from({ length: 8 }, (_, index) => ({
      id: now + index,
      left: 14 + index * 9,
    })))
    clearTimer.current = window.setTimeout(() => setHearts([]), 1100)
  }

  return (
    <div className="secret-action-card">
      <div>
        <p className="secret-card-title">抱抱通道</p>
        <p className="secret-card-copy">按一下，给门后的她发一个软软的信号。</p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={sendHug}
        className="secret-primary-button secret-button-compact"
      >
        抱一下
      </motion.button>

      <AnimatePresence>
        {hearts.map(heart => (
          <motion.span
            key={heart.id}
            className="secret-heart"
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: -72, scale: [0.5, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ left: `${heart.left}%` }}
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
