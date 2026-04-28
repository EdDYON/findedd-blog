'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ModuleContent } from '@/components/console/ModuleContent'
import { ModuleSelector } from '@/components/console/ModuleSelector'
import { StatusPanel } from '@/components/console/StatusPanel'
import { HudFrame } from '@/components/console/HudFrame'
import { HudShake } from '@/components/system/HudShake'
import { SoundToggle } from '@/components/system/SoundToggle'
import { VoidCoreScene } from '@/components/three/VoidCoreScene'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

export function VoidConsole() {
  const [time, setTime] = useState('--:--:--')
  const setTerminalOpen = useVoidStore(state => state.setTerminalOpen)
  const soundEnabled = useVoidStore(state => state.soundEnabled)

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(18px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="relative z-10 mx-auto min-h-screen w-full max-w-[1720px] px-3 py-4 md:px-6 md:py-7"
    >
      <HudShake>
      <HudFrame>
        <header className="grid gap-4 border-b border-white/10 p-4 md:grid-cols-[1fr_auto] md:p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-cyan-200/70">VOID</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.07em] text-white md:text-6xl">
              Digital Anomaly Interface
            </h1>
          </div>
          <div className="grid gap-2 text-left font-mono text-xs uppercase tracking-[0.16em] text-zinc-400 md:text-right">
            <span>{time}</span>
            <span className="text-emerald-200">SIGNAL: STABLE</span>
            <SoundToggle />
            <button
              type="button"
              onClick={() => {
                playVoidSound('click', soundEnabled)
                setTerminalOpen(true)
              }}
              className="border border-cyan-300/30 bg-cyan-300/[0.06] px-3 py-2 text-cyan-100 transition hover:bg-cyan-300/15"
            >
              OPEN TERMINAL
            </button>
          </div>
        </header>

        <div className="grid gap-5 p-4 lg:grid-cols-[260px_minmax(360px,1fr)_260px] xl:grid-cols-[300px_minmax(460px,1fr)_310px]">
          <StatusPanel />
          <div className="grid gap-5">
            <VoidCoreScene />
            <div className="border border-white/[0.07] bg-white/[0.025] p-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 hud-corners md:text-xs">
              &gt; Press ~ to open terminal. Type /help.
            </div>
          </div>
          <div className="grid content-start gap-4">
            <div className="border border-white/[0.08] bg-white/[0.035] p-4 hud-corners">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-200/70">Modules</p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">Select a sector. Every sector mutates the interface.</p>
            </div>
            <ModuleSelector />
          </div>
        </div>

        <div className="border-t border-white/10 p-4 md:p-5">
          <ModuleContent />
        </div>
      </HudFrame>
      </HudShake>
    </motion.section>
  )
}
