'use client'

import { motion } from 'motion/react'
import { NeonButton } from '@/components/ui/NeonButton'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

const gateStates = ['受限闸门', '访问被拒绝', '闸门正在抵抗', '闸门已打开']

export function GateModule() {
  const gateClickCount = useVoidStore(state => state.gateClickCount)
  const gateOpened = useVoidStore(state => state.gateOpened)
  const attemptGate = useVoidStore(state => state.attemptGate)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const message = gateOpened ? gateStates[3] : gateStates[Math.min(gateClickCount, 2)]

  function openGate() {
    const next = Math.min(gateClickCount + 1, 3)
    attemptGate()
    playVoidSound(next >= 3 ? 'gate' : 'click', soundEnabled)
  }

  return (
    <section className="relative min-h-[420px] overflow-hidden border border-red-500/20 bg-red-950/10 p-5 hud-corners md:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,44,54,0.24),transparent_46%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(251,44,54,0.08)_0_1px,transparent_1px_18px)]" />
      <div className="relative z-10 grid min-h-[360px] place-items-center text-center">
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
          className="w-full max-w-3xl"
        >
          <p className="text-xs font-black tracking-[0.32em] text-red-200/70">受限区域</p>
          <h2 className="glitch-text mt-5 text-[clamp(2.8rem,8vw,6.4rem)] font-black leading-[0.9] tracking-[0.02em] text-white">
            {message}
          </h2>
          <div className="mx-auto mt-6 grid max-w-xl gap-3 font-mono text-xs leading-6 tracking-[0.14em] text-zinc-400 md:text-sm">
            <p>该区域已封锁。不建议进行未授权开启。</p>
            <p className={gateOpened ? 'text-red-200' : 'text-zinc-500'}>
              闸门状态：{gateOpened ? '已打开' : '已封锁'} / 尝试 {gateClickCount.toString().padStart(2, '0')}
            </p>
          </div>
          <NeonButton variant="danger" onClick={openGate} className="mt-8">
            不要打开
          </NeonButton>
        </motion.div>
      </div>
    </section>
  )
}
