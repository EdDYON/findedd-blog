'use client'

import type { MouseEvent, ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/cn'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

type NeonButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'primary' | 'danger' | 'ghost'
}

export function NeonButton({
  children,
  className,
  variant = 'primary',
  onClick,
  onMouseEnter,
  ...props
}: NeonButtonProps) {
  const soundEnabled = useVoidStore(state => state.soundEnabled)

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    playVoidSound('click', soundEnabled)
    onClick?.(event)
  }

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    playVoidSound('hover', soundEnabled)
    onMouseEnter?.(event)
  }

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'group relative overflow-hidden border px-5 py-3 text-xs font-black uppercase tracking-[0.24em] transition hud-corners',
        'before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition before:duration-700 hover:before:translate-x-full',
        variant === 'primary' && 'border-cyan-300/45 bg-cyan-300/10 text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.22)] hover:border-cyan-200',
        variant === 'danger' && 'border-red-500/50 bg-red-500/10 text-red-100 shadow-[0_0_32px_rgba(251,44,54,0.22)] hover:border-red-300',
        variant === 'ghost' && 'border-white/15 bg-white/[0.04] text-zinc-200 hover:border-violet-300/60 hover:bg-violet-400/10',
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
