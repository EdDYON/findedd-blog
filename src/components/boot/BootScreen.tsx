'use client'

import { motion } from 'motion/react'
import { BootLog } from '@/components/boot/BootLog'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'

const bootLines = [
  '[启动] VOID 核心正在苏醒...',
  '[扫描] 检测到访客信号...',
  '[同步] 界面连接已建立...',
  '[载入] 异常场正在展开...',
  '[就绪] 可以接入 VOID。',
]

export function BootScreen() {
  const setBooted = useVoidStore(state => state.setBooted)
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)

  function enterVoid() {
    triggerGlitch()
    window.setTimeout(() => setBooted(true), 360)
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(14px)' }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-30 grid place-items-center overflow-hidden bg-[#020207]"
    >
      <div className="void-grid absolute inset-0 opacity-60" />
      <div className="scanlines absolute inset-0 opacity-35" />
      <div className="noise absolute inset-0 opacity-30" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="relative z-10 w-full px-6 text-center"
      >
        <p className="mb-4 text-xs font-black uppercase tracking-[0.42em] text-violet-200/70">
          这不是普通网页
        </p>
        <h1 className="glitch-text text-[clamp(5rem,18vw,18rem)] font-black leading-[0.72] tracking-[-0.12em] text-white">
          VOID
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-balance text-sm font-bold uppercase tracking-[0.28em] text-cyan-100/80 md:text-base">
          屏幕之外的数字异常界面
        </p>
        <BootLog lines={bootLines} />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.35, duration: 0.45 }}
          className="mt-10"
        >
          <NeonButton onClick={enterVoid} className="min-w-56">
            接入 VOID
          </NeonButton>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
