'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useVoidStore } from '@/store/useVoidStore'

export function HudShake({ children }: { children: ReactNode }) {
  const hudShaking = useVoidStore(state => state.hudShaking)

  return (
    <motion.div
      animate={hudShaking
        ? { x: [0, -8, 7, -4, 3, 0], y: [0, 4, -3, 2, -1, 0], rotate: [0, -0.18, 0.14, -0.1, 0] }
        : { x: 0, y: 0, rotate: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
