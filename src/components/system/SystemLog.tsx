'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useVoidStore } from '@/store/useVoidStore'

export function SystemLog() {
  const logs = useVoidStore(state => state.systemLogs)
  const recentLogs = logs.slice(-8).reverse()

  return (
    <section className="overflow-hidden border border-cyan-300/20 bg-cyan-300/[0.025] p-3 font-mono text-[10px] uppercase leading-5 text-cyan-100/75 shadow-[0_0_28px_rgba(34,211,238,0.08)] hud-corners">
      <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="neon-text tracking-[0.22em] text-cyan-100">系统日志</span>
        <span className="text-fuchsia-300/70">{recentLogs.length.toString().padStart(2, '0')}/08</span>
      </div>
      <div className="grid max-h-44 gap-1 overflow-hidden md:max-h-52">
        <AnimatePresence initial={false}>
          {recentLogs.length ? recentLogs.map(log => (
            <motion.p
              key={log.id}
              initial={{ opacity: 0, x: -12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
              exit={{ opacity: 0, x: 12 }}
              className="terminal-line break-words text-cyan-100/70 odd:text-fuchsia-100/60 md:truncate"
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
              &gt; 等待访客输入
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
