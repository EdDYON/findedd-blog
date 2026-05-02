'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

function getNextMidnightDistance() {
  const now = new Date()
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  const diff = Math.max(0, next.getTime() - now.getTime())
  const hours = Math.floor(diff / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)

  return { hours, minutes, seconds }
}

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

export function CountdownCard() {
  const [time, setTime] = useState(getNextMidnightDistance)

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getNextMidnightDistance()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="secret-card secret-mini-card">
      <p className="secret-card-title">下一次见面倒计时</p>
      <div className="secret-countdown" aria-label="下一次见面倒计时">
        {[time.hours, time.minutes, time.seconds].map((value, index) => (
          <motion.span
            key={index}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {pad(value)}
          </motion.span>
        ))}
      </div>
      <p className="secret-card-copy">先用今天的终点当作温柔占位，之后可以换成真正的纪念日。</p>
    </section>
  )
}
