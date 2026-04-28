'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)
  const x = useSpring(rawX, { stiffness: 360, damping: 30 })
  const y = useSpring(rawY, { stiffness: 360, damping: 30 })

  useEffect(() => {
    const query = window.matchMedia('(pointer: fine) and (min-width: 768px)')
    queueMicrotask(() => setEnabled(query.matches))

    function handleMove(event: MouseEvent) {
      rawX.set(event.clientX)
      rawY.set(event.clientY)
      const target = event.target as HTMLElement | null
      setHovering(Boolean(target?.closest('button,a,input,[role="button"]')))
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [rawX, rawY])

  if (!enabled)
    return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] size-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/70 mix-blend-screen shadow-[0_0_35px_rgba(34,211,238,0.5)]"
        style={{ x, y }}
        animate={{ scale: hovering ? 1.65 : 1 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[101] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]"
        style={{ x: rawX, y: rawY }}
      />
    </>
  )
}
