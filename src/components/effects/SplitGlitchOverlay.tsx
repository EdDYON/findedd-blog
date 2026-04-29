'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useVoidStore } from '@/store/useVoidStore'

const strips = Array.from({ length: 13 }, (_, index) => ({
  id: index,
  top: `${index * 7.9}%`,
  height: `${4 + (index % 4) * 1.4}%`,
  shift: index % 2 === 0 ? '-7vw' : '7vw',
  delay: index * 0.012,
}))

export function SplitGlitchOverlay() {
  const splitGlitching = useVoidStore(state => state.splitGlitching)
  const redAlert = useVoidStore(state => state.redAlert)

  return (
    <AnimatePresence>
      {splitGlitching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[86] overflow-hidden bg-black/10 mix-blend-screen"
        >
          <div className={redAlert ? 'split-glitch-red absolute inset-0' : 'split-glitch-cyan absolute inset-0'} />
          {strips.map(strip => (
            <motion.span
              key={strip.id}
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: [0, strip.shift, `-${strip.shift}`, 0], opacity: [0, 0.9, 0.45, 0] }}
              transition={{ duration: 0.44, delay: strip.delay }}
              className={redAlert ? 'absolute left-0 right-0 bg-red-400/20' : 'absolute left-0 right-0 bg-cyan-300/18'}
              style={{ top: strip.top, height: strip.height }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
