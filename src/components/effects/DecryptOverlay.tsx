'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useVoidStore } from '@/store/useVoidStore'
import type { DecryptOverlayState } from '@/types/void'

const noiseChars = '01ABCDEFVOID_ROOT_NULL_TRACE_权限解码'

function noise(length: number, seed: number) {
  return Array.from({ length }, (_, index) => noiseChars[(index * 7 + seed) % noiseChars.length]).join('')
}

export function DecryptOverlay() {
  const decryptOverlay = useVoidStore(state => state.decryptOverlay)
  const closeDecryptOverlay = useVoidStore(state => state.closeDecryptOverlay)
  return (
    <AnimatePresence>
      {decryptOverlay && (
        <DecryptPanel
          key={decryptOverlay.id}
          decryptOverlay={decryptOverlay}
          closeDecryptOverlay={closeDecryptOverlay}
        />
      )}
    </AnimatePresence>
  )
}

function DecryptPanel({
  decryptOverlay,
  closeDecryptOverlay,
}: {
  decryptOverlay: DecryptOverlayState
  closeDecryptOverlay: () => void
}) {
  const [step, setStep] = useState(0)
  const target = decryptOverlay.message
  const total = Math.max(target.length, 1)
  const rendered = useMemo(() => {
    if (!target)
      return ''
    const resolved = target.slice(0, step)
    return `${resolved}${noise(Math.max(total - step, 0), step)}`
  }, [step, target, total])

  useEffect(() => {
    const reveal = window.setInterval(() => {
      setStep(value => Math.min(value + 2, total))
    }, 42)
    const close = window.setTimeout(() => closeDecryptOverlay(), 3600)

    return () => {
      window.clearInterval(reveal)
      window.clearTimeout(close)
    }
  }, [closeDecryptOverlay, total])

  return (
    <motion.aside
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
      exit={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      className="pointer-events-none fixed inset-x-4 bottom-28 z-[84] mx-auto max-w-4xl border border-cyan-300/30 bg-black/80 p-4 font-mono text-xs tracking-[0.14em] text-cyan-50 shadow-[0_0_60px_rgba(34,211,238,0.18)] backdrop-blur-2xl hud-corners md:bottom-10 md:p-5"
    >
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3 text-[10px] text-cyan-200/70">
        <span>DECRYPT STREAM</span>
        <span>{step >= total ? 'COMPLETE' : 'DECODING'}</span>
      </div>
      <p className="break-words text-base font-black leading-7 md:text-xl">{rendered}</p>
    </motion.aside>
  )
}
