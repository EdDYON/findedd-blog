'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'

const gateMessages = [
  'SEALED. DO NOT OPEN.',
  'ACCESS DENIED.',
  'GATE RESISTING.',
  'GATE OPENED. WELCOME TO THE OTHER SIDE.',
]

export function GateModule() {
  const [clicks, setClicks] = useState(0)
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)
  const message = gateMessages[Math.min(clicks, gateMessages.length - 1)]

  function openGate() {
    const next = clicks + 1
    setClicks(next)
    if (next >= 3)
      triggerGlitch()
  }

  return (
    <section className="relative min-h-[460px] overflow-hidden border border-red-500/20 bg-red-950/10 p-7 hud-corners">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,44,54,0.24),transparent_46%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(251,44,54,0.08)_0_1px,transparent_1px_18px)]" />
      <div className="relative z-10 grid min-h-[400px] place-items-center text-center">
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
        >
          <p className="text-xs font-black uppercase tracking-[0.32em] text-red-200/70">Restricted Gate</p>
          <h2 className="glitch-text mt-5 text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.8] tracking-[-0.1em] text-white">
            {message}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-mono text-sm uppercase leading-7 tracking-[0.14em] text-zinc-400">
            Every attempt leaves a trace. Every trace makes the gate remember you.
          </p>
          <NeonButton variant="danger" onClick={openGate} className="mt-8">
            Do Not Open
          </NeonButton>
        </motion.div>
      </div>
    </section>
  )
}
