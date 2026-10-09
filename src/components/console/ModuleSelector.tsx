'use client'

import { motion } from 'motion/react'
import type { VoidModule } from '@/types/void'
import { cn } from '@/lib/cn'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

const modules: Array<{ key: VoidModule; label: string; sub: string }> = [
  { key: 'archive', label: 'ARCHIVE', sub: 'classified files' },
  { key: 'signal', label: 'SIGNAL', sub: 'unknown message' },
  { key: 'lab', label: 'LAB', sub: 'unstable toys' },
  { key: 'gate', label: 'GATE', sub: 'do not open' },
]

export function ModuleSelector() {
  const activeModule = useVoidStore(state => state.activeModule)
  const setActiveModule = useVoidStore(state => state.setActiveModule)
  const soundEnabled = useVoidStore(state => state.soundEnabled)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      {modules.map((module, index) => (
        <motion.button
          key={module.key}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * index }}
          onClick={() => {
            playVoidSound('click', soundEnabled)
            setActiveModule(module.key)
          }}
          onMouseEnter={() => playVoidSound('hover', soundEnabled)}
          className={cn(
            'group relative overflow-hidden border bg-white/[0.035] p-4 text-left transition hud-corners',
            'hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-cyan-300/[0.06] hover:shadow-[0_0_34px_rgba(34,211,238,0.14)]',
            activeModule === module.key
              ? 'border-cyan-300/60 bg-cyan-300/[0.08] text-white shadow-[0_0_32px_rgba(34,211,238,0.16)]'
              : 'border-white/[0.08] text-zinc-300',
          )}
        >
          <span className="absolute inset-y-3 left-0 w-1 bg-cyan-300 opacity-0 shadow-[0_0_18px_rgba(34,211,238,0.9)] transition group-hover:opacity-100" />
          <span className="block text-lg font-black tracking-[0.18em]">{module.label}</span>
          <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{module.sub}</span>
        </motion.button>
      ))}
    </div>
  )
}
