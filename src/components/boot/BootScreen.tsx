'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { BootLog } from '@/components/boot/BootLog'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'

const bootLines = [
  '[启动] VOID 核心正在苏醒...',
  '[扫描] 正在校验访客信号...',
  '[同步] 神经接口握手完成...',
  '[展开] 异常场正在覆盖屏幕...',
  '[接入] 终端桥已开放。',
]

export function BootScreen() {
  const [launching, setLaunching] = useState(false)
  const bootTimer = useRef<number | null>(null)
  const glitchTimer = useRef<number | null>(null)
  const setBooted = useVoidStore(state => state.setBooted)
  const setTerminalOpen = useVoidStore(state => state.setTerminalOpen)
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)

  useEffect(() => {
    return () => {
      if (bootTimer.current)
        window.clearTimeout(bootTimer.current)
      if (glitchTimer.current)
        window.clearTimeout(glitchTimer.current)
    }
  }, [])

  function enterVoid() {
    if (launching)
      return

    setLaunching(true)
    triggerGlitch(900)
    glitchTimer.current = window.setTimeout(() => triggerGlitch(520), 1900)
    bootTimer.current = window.setTimeout(() => {
      setBooted(true)
      setTerminalOpen(true)
    }, 4200)
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
        <h1
          className="glitch-text text-[clamp(4.8rem,17vw,17rem)] font-black leading-[0.76] tracking-[0] text-white"
          data-text="VOID"
        >
          VOID
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-balance text-sm font-bold uppercase tracking-[0.28em] text-cyan-100/80 md:text-base">
          屏幕之外的数字异常界面
        </p>
        <BootLog lines={bootLines} active={launching} />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.35, duration: 0.45 }}
          className="mt-10"
        >
          <NeonButton onClick={enterVoid} className="min-w-56" disabled={launching}>
            {launching ? '启动中...' : '[启动] 接入 VOID'}
          </NeonButton>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            {launching ? '核心苏醒 / 扫描访客 / 异常场展开' : '等待访客授权启动'}
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
