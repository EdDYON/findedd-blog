'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useVoidStore } from '@/store/useVoidStore'

export function SystemLog() {
  const logs = useVoidStore(state => state.systemLogs)
  const recentLogs = logs.slice(-8).reverse()

  return (
    <section className="overflow-hidden border border-cyan-300/15 bg-cyan-300/[0.025] p-3 font-mono text-[10px] uppercase leading-5 text-cyan-100/65 hud-corners">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="tracking-[0.22em] text-cyan-100">System Log</span>
        <span className="text-zinc-600">{recentLogs.length.toString().padStart(2, '0')}/08</span>
      </div>
      <div className="grid max-h-44 gap-1 overflow-hidden md:max-h-52">
        <AnimatePresence initial={false}>
          {recentLogs.length ? recentLogs.map(log => (
            <motion.p
              key={log.id}
              initial={{ opacity: 0, x: -12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, x: 12 }}
              className="truncate"
            >
              &gt; {log.message}
            </motion.p>
          )) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-zinc-600"
            >
              &gt; waiting for visitor input
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
