'use client'

import { AnimatePresence, motion } from 'motion/react'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'

export function GateResultOverlay() {
  const gateResultOpen = useVoidStore(state => state.gateResultOpen)
  const closeGateResult = useVoidStore(state => state.closeGateResult)

  return (
    <AnimatePresence>
      {gateResultOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[88] grid place-items-center bg-black/72 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 32, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0)' }}
            exit={{ opacity: 0, scale: 0.92, y: 20, filter: 'blur(14px)' }}
            className="relative w-full max-w-2xl overflow-hidden border border-red-400/40 bg-[#110207]/90 p-6 text-center shadow-[0_0_80px_rgba(251,44,54,0.24)] hud-corners md:p-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,44,54,0.28),transparent_55%)]" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(251,44,54,0.12)_0_1px,transparent_1px_16px)]" />
            <div className="relative z-10">
              <p className="font-mono text-xs font-black tracking-[0.34em] text-red-200/80">权限闸门已接入</p>
              <h2 className="glitch-text mt-5 text-5xl font-black leading-[0.95] tracking-[0.02em] text-white md:text-8xl">
                红色警戒
              </h2>
              <p className="mx-auto mt-6 max-w-md font-mono text-xs leading-6 tracking-[0.16em] text-zinc-400 md:text-sm">
                这不是出口。VOID 已把你提升到 OPERATOR，并把这次接入写进黑箱。
              </p>
              <NeonButton variant="danger" onClick={closeGateResult} className="mt-8">
                关闭警戒窗
              </NeonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
