'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { signalMessages } from '@/data/signals'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'

export function SignalModule() {
  const [message, setMessage] = useState(signalMessages[0])
  const incrementSignalScan = useVoidStore(state => state.incrementSignalScan)
  const frequency = useMemo(() => {
    const index = signalMessages.indexOf(message)
    return (77.03 + Math.max(index, 0) * 1.37).toFixed(2)
  }, [message])

  function scanAgain() {
    const next = signalMessages[Math.floor(Math.random() * signalMessages.length)]
    setMessage(next === message ? signalMessages[(signalMessages.indexOf(next) + 1) % signalMessages.length] : next)
    incrementSignalScan()
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/70">Signal Found</p>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.07em] text-white">{frequency} MHz</h2>
        <div className="mt-7 space-y-3 font-mono text-sm uppercase tracking-[0.14em] text-zinc-400">
          <p>SOURCE: OUTSIDE_SCREEN</p>
          <p>CHANNEL: BLACK STATIC</p>
          <p>CONTACT: UNVERIFIED</p>
        </div>
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          className="mt-8 border border-cyan-300/20 bg-cyan-300/[0.045] p-5 text-2xl font-black uppercase leading-tight tracking-[-0.04em] text-cyan-50 hud-corners"
        >
          {message}
        </motion.div>
        <NeonButton onClick={scanAgain} className="mt-6">
          Scan Again
        </NeonButton>
      </div>
      <div className="relative min-h-[330px] overflow-hidden border border-white/[0.08] bg-black/35 p-5 hud-corners">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_48%)]" />
        <div className="relative z-10 flex h-full items-center gap-2">
          {Array.from({ length: 44 }).map((_, index) => (
            <span
              key={index}
              className="block flex-1 origin-center bg-cyan-200/70 shadow-[0_0_18px_rgba(34,211,238,0.6)]"
              style={{
                height: `${12 + ((index * 17) % 82)}%`,
                animation: `waveform ${0.8 + (index % 7) * 0.12}s ease-in-out infinite`,
                animationDelay: `${index * 0.035}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
