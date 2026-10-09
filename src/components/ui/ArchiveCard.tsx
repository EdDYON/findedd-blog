'use client'

import { useState, type CSSProperties, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import type { ArchiveItem } from '@/types/void'
import { cn } from '@/lib/cn'

type ArchiveCardProps = {
  item: ArchiveItem
}

export function ArchiveCard({ item }: ArchiveCardProps) {
  const [style, setStyle] = useState<CSSProperties>({})

  function handleMove(event: MouseEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const rotateX = (0.5 - y / bounds.height) * 12
    const rotateY = (x / bounds.width - 0.5) * 14
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`,
      '--spot-x': `${x}px`,
      '--spot-y': `${y}px`,
    } as CSSProperties)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setStyle({})}
      style={style}
      className="group relative min-h-[260px] overflow-hidden border border-white/10 bg-black/35 p-5 transition duration-200 hud-corners hover:border-cyan-300/60 hover:shadow-[0_0_44px_rgba(34,211,238,0.18)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: 'radial-gradient(circle at var(--spot-x,50%) var(--spot-y,50%), rgba(34,211,238,0.18), transparent 34%)' }} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/75">
          <span>FILE {item.id}</span>
          <span className={cn(
            'rounded-full border px-2 py-1',
            item.danger === 'HIGH' && 'border-red-400/50 text-red-200',
            item.danger === 'MEDIUM' && 'border-yellow-300/50 text-yellow-100',
            item.danger === 'LOW' && 'border-emerald-300/50 text-emerald-100',
            item.danger === 'UNKNOWN' && 'border-violet-300/50 text-violet-100',
          )}
          >
            {item.danger}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-black uppercase tracking-[-0.04em] text-white glitch-text">
          {item.title}
        </h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200/70">
          {item.type} / {item.status}
        </p>
        <p className="mt-5 flex-1 text-sm leading-7 text-zinc-300">
          {item.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span key={tag} className="border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}
