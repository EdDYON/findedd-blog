'use client'

import { motion } from 'motion/react'
import type { VoidModule } from '@/types/void'
import { cn } from '@/lib/cn'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

const modules: Array<{ key: VoidModule; label: string; sub: string; tone: string }> = [
  { key: 'archive', label: '档案', sub: '黑箱报告', tone: 'cyan' },
  { key: 'signal', label: '信号', sub: '数据包监听', tone: 'violet' },
  { key: 'lab', label: '实验', sub: '破解器玩具', tone: 'cyan' },
  { key: 'gate', label: '闸门', sub: '权限突破', tone: 'red' },
]

const offsets = [
  'lg:-translate-x-4 lg:rotate-[-1.8deg]',
  'lg:translate-x-7 lg:rotate-[1.2deg]',
  'lg:translate-x-1 lg:rotate-[-0.7deg]',
  'lg:-translate-x-6 lg:rotate-[1.8deg]',
]

export function ModuleSelector() {
  const activeModule = useVoidStore(state => state.activeModule)
  const setActiveModule = useVoidStore(state => state.setActiveModule)
  const soundEnabled = useVoidStore(state => state.soundEnabled)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4">
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
            'hover:-translate-y-1 hover:bg-cyan-300/[0.06] hover:shadow-[0_0_34px_rgba(34,211,238,0.14)]',
            offsets[index],
            activeModule === module.key
              ? 'border-cyan-300/60 bg-cyan-300/[0.08] text-white shadow-[0_0_32px_rgba(34,211,238,0.16)]'
              : 'border-white/[0.08] text-zinc-300',
            module.tone === 'red' && activeModule === module.key && 'border-red-400/60 bg-red-500/[0.08] shadow-[0_0_32px_rgba(251,44,54,0.16)]',
          )}
        >
          <span className="absolute inset-y-3 left-0 w-1 bg-cyan-300 opacity-0 shadow-[0_0_18px_rgba(34,211,238,0.9)] transition group-hover:opacity-100" />
          <span className="block text-xl font-black tracking-[0.16em]">{module.label}</span>
          <span className="mt-1 block text-[10px] font-bold tracking-[0.2em] text-zinc-500">{module.sub}</span>
        </motion.button>
      ))}
    </div>
  )
}
