'use client'

import { useEffect, useState } from 'react'

type Ripple = {
  id: number
  x: number
  y: number
}

export function ClickRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    let id = 0
    function handleClick(event: MouseEvent) {
      const next = { id: id += 1, x: event.clientX, y: event.clientY }
      setRipples(current => [...current, next])
      window.setTimeout(() => {
        setRipples(current => current.filter(ripple => ripple.id !== next.id))
      }, 850)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/70 shadow-[0_0_32px_rgba(34,211,238,0.45)] animate-[ripple_850ms_ease-out_forwards]"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  )
}
