'use client'

import { useVoidStore } from '@/store/useVoidStore'
import { cn } from '@/lib/cn'

export function DeepSpaceBackground() {
  const redAlert = useVoidStore(state => state.redAlert)

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className={cn('deep-space absolute inset-0 transition duration-700', redAlert && 'deep-space-alert')} />
      <div className="star-drift absolute inset-[-10%]" />
      <div className="void-tunnel absolute left-1/2 top-1/2 size-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="orbital-hud absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      {redAlert && <div className="red-alert-vignette absolute inset-0" />}
    </div>
  )
}
