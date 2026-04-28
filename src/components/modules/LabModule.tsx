'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'

export function LabModule() {
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)
  const triggerOverdrive = useVoidStore(state => state.triggerOverdrive)
  const [burst, setBurst] = useState(0)

  function triggerBurst() {
    setBurst(value => value + 1)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-200/70">Experimental Chamber</p>
        <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-white">Unstable Toys</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <NeonButton onClick={triggerGlitch}>Glitch Text</NeonButton>
        <NeonButton onClick={triggerBurst}>Particle Burst</NeonButton>
        <NeonButton onClick={triggerOverdrive}>Core Overdrive</NeonButton>
      </div>
      <div className="relative mt-7 min-h-[280px] overflow-hidden border border-white/[0.08] bg-black/35 hud-corners">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.22),transparent_42%)]" />
        {Array.from({ length: 26 }).map((_, index) => (
          <motion.span
            key={`${burst}-${index}`}
            initial={{ opacity: 0, x: '50%', y: '50%', scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: `${50 + Math.cos(index) * (20 + (index % 6) * 8)}%`,
              y: `${50 + Math.sin(index * 1.8) * (20 + (index % 5) * 9)}%`,
              scale: [0, 1.2, 0.2],
            }}
            transition={{ duration: 0.9, delay: index * 0.012 }}
            className="absolute size-3 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.9)]"
          />
        ))}
        <div className="relative z-10 grid h-full place-items-center p-8 text-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">selected output</p>
            <p className="mt-4 text-2xl font-black uppercase text-white">Distortion ready. Touch something.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
