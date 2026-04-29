'use client'

import { motion } from 'motion/react'
import { NeonButton } from '@/components/ui/NeonButton'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

const gateStates = [
  {
    title: '权限闸门',
    stage: '阶段 00 / 封锁',
    detail: '核心入口被多层校验包围。你可以尝试接入，但 VOID 会记录每一步。',
  },
  {
    title: '校验拒绝',
    stage: '阶段 01 / CHECKSUM FAIL',
    detail: '请求被挡在外层。伪装签名已被标记，日志开始变红。',
  },
  {
    title: '沙箱抵抗',
    stage: '阶段 02 / SANDBOX LOOP',
    detail: '闸门没有打开，它只是把你丢进了一个会回声的环。',
  },
  {
    title: '核心接入',
    stage: '阶段 03 / VOID LINKED',
    detail: '红色警戒启动。闸门不是出口，而是更深层的接入点。',
  },
]

export function GateModule() {
  const gateClickCount = useVoidStore(state => state.gateClickCount)
  const gateOpened = useVoidStore(state => state.gateOpened)
  const permissionLevel = useVoidStore(state => state.permissionLevel)
  const attemptGate = useVoidStore(state => state.attemptGate)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const state = gateOpened ? gateStates[3] : gateStates[Math.min(gateClickCount, 2)]

  function openGate() {
    const next = Math.min(gateClickCount + 1, 3)
    attemptGate()
    playVoidSound(next >= 3 ? 'gate' : 'click', soundEnabled)
  }

  return (
    <section className="relative min-h-[440px] overflow-hidden border border-red-500/20 bg-red-950/10 p-5 hud-corners md:p-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,44,54,0.24),transparent_46%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(251,44,54,0.08)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-300/80 to-transparent" />
      <div className="relative z-10 grid min-h-[380px] place-items-center text-center">
        <motion.div
          key={state.title}
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
          className="w-full max-w-4xl"
        >
          <p className="text-xs font-black tracking-[0.32em] text-red-200/70">权限突破事件</p>
          <h2 className="glitch-text mt-5 text-[clamp(2.8rem,8vw,6.4rem)] font-black leading-[0.9] tracking-[0.02em] text-white">
            {state.title}
          </h2>
          <div className="mx-auto mt-6 grid max-w-2xl gap-3 font-mono text-xs leading-6 tracking-[0.14em] text-zinc-400 md:text-sm">
            <p className="text-red-100">{state.stage}</p>
            <p>{state.detail}</p>
            <p className={gateOpened ? 'text-red-200' : 'text-zinc-500'}>
              GATE STATUS：{gateOpened ? '已接入' : '已封锁'} / ATTEMPT {gateClickCount.toString().padStart(2, '0')} / PERMISSION {permissionLevel}
            </p>
          </div>
          <div className="mx-auto mt-7 grid max-w-2xl gap-2 font-mono text-[10px] tracking-[0.16em] text-left text-red-100/60">
            {['CHECKSUM', 'SANDBOX', 'AUTH_BRIDGE'].map((label, index) => (
              <div key={label} className="border border-red-400/15 bg-black/30 p-2">
                &gt; {label} :: {gateClickCount > index ? 'BYPASSED' : 'LOCKED'}
              </div>
            ))}
          </div>
          <NeonButton variant="danger" onClick={openGate} className="mt-8">
            执行突破
          </NeonButton>
        </motion.div>
      </div>
    </section>
  )
}
