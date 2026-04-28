import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  intense?: boolean
}

export function GlassPanel({
  children,
  className,
  intense = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden border border-white/[0.08] bg-white/[0.035] shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl hud-corners',
        'after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] after:bg-[length:220%_100%] after:opacity-50 after:[animation:border-scan_5s_linear_infinite]',
        intense && 'border-cyan-300/25 bg-cyan-300/[0.055] shadow-[0_0_55px_rgba(34,211,238,0.14)]',
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
