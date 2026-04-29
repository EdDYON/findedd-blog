'use client'

export function DeepSpaceBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="deep-space absolute inset-0" />
      <div className="star-drift absolute inset-[-10%]" />
      <div className="void-tunnel absolute left-1/2 top-1/2 size-[92vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div className="orbital-hud absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  )
}
