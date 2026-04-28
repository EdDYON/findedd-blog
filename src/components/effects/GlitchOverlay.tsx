'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useVoidStore } from '@/store/useVoidStore'

export function GlitchOverlay() {
  const glitching = useVoidStore(state => state.glitching)

  return (
    <AnimatePresence>
      {glitching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,44,54,0.18),transparent_42%),linear-gradient(90deg,rgba(34,211,238,0.22),transparent,rgba(139,92,246,0.22))]" />
          <div className="absolute inset-0 animate-pulse bg-[repeating-linear-gradient(0deg,transparent_0_9px,rgba(255,255,255,0.16)_9px_10px)] mix-blend-screen" />
          {Array.from({ length: 13 }).map((_, index) => (
            <motion.span
              key={index}
              initial={{ x: index % 2 ? '-18%' : '18%', opacity: 0 }}
              animate={{ x: 0, opacity: [0, 1, 0.2] }}
              transition={{ duration: 0.32, delay: index * 0.018 }}
              className="absolute h-4 bg-cyan-300/20 shadow-[0_0_24px_rgba(34,211,238,0.4)]"
              style={{
                top: `${6 + index * 7}%`,
                left: `${index % 3 * 12}%`,
                width: `${42 + (index % 5) * 12}%`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
