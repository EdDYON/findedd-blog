'use client'

import { useState, type CSSProperties, type MouseEvent } from 'react'
import { motion } from 'motion/react'
import type { ArchiveItem, PermissionLevel } from '@/types/void'
import { cn } from '@/lib/cn'

type ArchiveCardProps = {
  item: ArchiveItem
}

const statusLabel: Record<ArchiveItem['status'], string> = {
  Active: '活跃',
  Dormant: '休眠',
  Unstable: '不稳定',
  Corrupted: '损坏',
  Unknown: '未知',
}

const dangerLabel: Record<ArchiveItem['danger'], string> = {
  LOW: '低风险',
  MEDIUM: '中风险',
  HIGH: '高风险',
  UNKNOWN: '未知风险',
}

const permissions: PermissionLevel[] = ['GUEST', 'SIGNAL', 'OPERATOR', 'ROOT']
const leakStates = ['未泄露', '局部泄露', '镜像泄露', '红门泄露']

function checksum(value: string) {
  const sum = Array.from(value).reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 3), 0)
  return `0x${(sum % 0xfffff).toString(16).toUpperCase().padStart(5, '0')}`
}

function blackBoxMeta(item: ArchiveItem) {
  const index = Number(item.id) || 0
  return {
    permission: permissions[index % permissions.length],
    leak: leakStates[index % leakStates.length],
    checksum: checksum(`${item.id}:${item.title}:${item.type}`),
  }
}

export function ArchiveCard({ item }: ArchiveCardProps) {
  const [style, setStyle] = useState<CSSProperties>({})
  const meta = blackBoxMeta(item)

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
      className="group relative min-h-[300px] overflow-hidden border border-white/10 bg-black/40 p-5 transition duration-200 hud-corners hover:border-cyan-300/60 hover:shadow-[0_0_44px_rgba(34,211,238,0.18)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: 'radial-gradient(circle at var(--spot-x,50%) var(--spot-y,50%), rgba(34,211,238,0.2), transparent 34%)' }} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200/75">
          <span>BLACKBOX {item.id}</span>
          <span className={cn(
            'rounded-full border px-2 py-1',
            item.danger === 'HIGH' && 'border-red-400/50 text-red-200',
            item.danger === 'MEDIUM' && 'border-yellow-300/50 text-yellow-100',
            item.danger === 'LOW' && 'border-emerald-300/50 text-emerald-100',
            item.danger === 'UNKNOWN' && 'border-violet-300/50 text-violet-100',
          )}
          >
            {dangerLabel[item.danger]}
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-black tracking-[0.04em] text-white glitch-text">
          {item.title}
        </h3>
        <p className="mt-2 text-xs font-bold tracking-[0.18em] text-violet-200/70">
          {item.type} / {statusLabel[item.status]}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[10px] tracking-[0.14em] text-zinc-500">
          <div className="border border-white/[0.08] bg-white/[0.03] p-2">
            <p>权限</p>
            <p className="mt-1 text-cyan-100">{meta.permission}</p>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.03] p-2">
            <p>泄露</p>
            <p className="mt-1 text-red-100">{meta.leak}</p>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.03] p-2">
            <p>校验</p>
            <p className="mt-1 text-zinc-100">{meta.checksum}</p>
          </div>
        </div>

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
