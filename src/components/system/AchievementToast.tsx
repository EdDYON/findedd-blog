'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { achievements } from '@/data/achievements'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'
import type { AchievementToast as AchievementToastType } from '@/types/void'

function ToastCard({ toast }: { toast: AchievementToastType }) {
  const dismissAchievementToast = useVoidStore(state => state.dismissAchievementToast)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const achievement = achievements[toast.achievementId]

  useEffect(() => {
    playVoidSound('achievement', soundEnabled)
    const timer = window.setTimeout(() => dismissAchievementToast(toast.id), 3000)
    return () => window.clearTimeout(timer)
  }, [dismissAchievementToast, soundEnabled, toast.id])

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: 80, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
      exit={{ opacity: 0, x: 80, filter: 'blur(10px)' }}
      className="relative overflow-hidden border border-cyan-300/35 bg-black/80 p-4 shadow-[0_0_42px_rgba(34,211,238,0.2)] backdrop-blur-2xl hud-corners"
    >
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(34,211,238,0.16),transparent)] opacity-60" />
      <div className="relative z-10">
        <p className="font-mono text-[10px] font-black uppercase tracking-[0.26em] text-violet-200">
          Achievement Unlocked
        </p>
        <h3 className="glitch-text mt-2 text-lg font-black uppercase tracking-[0.08em] text-white">{achievement.title}</h3>
        <p className="mt-2 text-xs uppercase leading-5 tracking-[0.12em] text-zinc-400">{achievement.description}</p>
      </div>
    </motion.article>
  )
}

export function AchievementToast() {
  const toasts = useVoidStore(state => state.achievementToasts)

  return (
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[95] grid gap-3 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[360px]">
      <AnimatePresence initial={false}>
        {toasts.map(toast => <ToastCard key={toast.id} toast={toast} />)}
      </AnimatePresence>
    </div>
  )
}
