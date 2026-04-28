import type { ReactNode } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'

type HudFrameProps = {
  children: ReactNode
}

export function HudFrame({ children }: HudFrameProps) {
  return (
    <GlassPanel intense className="relative p-3 md:p-5">
      <div className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-cyan-200/55" />
      <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-violet-200/55" />
      <div className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b border-l border-violet-200/55" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-cyan-200/55" />
      {children}
    </GlassPanel>
  )
}
