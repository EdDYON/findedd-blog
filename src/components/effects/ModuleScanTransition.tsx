'use client'

import { motion } from 'motion/react'
import type { VoidModule } from '@/types/void'

const moduleLabel: Record<VoidModule, string> = {
  archive: '档案接入',
  signal: '信号校准',
  lab: '实验舱同步',
  gate: '闸门协议',
}

export function ModuleScanTransition({ module }: { module: VoidModule }) {
  return (
    <motion.div
      key={`scan-${module}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.72, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <motion.div
        initial={{ x: '-120%' }}
        animate={{ x: '120%' }}
        transition={{ duration: 0.62, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent blur-sm"
      />
      <motion.div
        initial={{ y: '-40%' }}
        animate={{ y: '140%' }}
        transition={{ duration: 0.58, ease: 'easeInOut' }}
        className="absolute inset-x-0 h-px bg-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.9)]"
      />
      <div className="absolute right-4 top-4 border border-cyan-300/25 bg-black/60 px-3 py-2 font-mono text-[10px] tracking-[0.22em] text-cyan-100/80 hud-corners">
        {moduleLabel[module]}
      </div>
    </motion.div>
  )
}
