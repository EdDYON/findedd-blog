'use client'

import { useEffect, useRef } from 'react'
import { useVoidStore } from '@/store/useVoidStore'

const glyphs = [
  '0xVOID',
  '101101',
  'TRACE',
  'SCAN',
  'ROOT',
  'NULL',
  'PKT',
  'RED',
  'HASH',
  'SYNC',
  'SIG',
  'CORE',
]

function pickGlyph(index: number, tick: number) {
  return glyphs[(index * 5 + tick) % glyphs.length]
}

export function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const performanceMode = useVoidStore(state => state.performanceMode)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: true })

    if (!canvas || !context)
      return

    const rainCanvas = canvas
    const rainContext = context
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fontSize = performanceMode === 'low' ? 18 : 15
    let animationFrame = 0
    let tick = 0
    let width = 0
    let height = 0
    let columns = 0
    let drops: number[] = []

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      width = window.innerWidth
      height = window.innerHeight
      rainCanvas.width = Math.floor(width * pixelRatio)
      rainCanvas.height = Math.floor(height * pixelRatio)
      rainCanvas.style.width = `${width}px`
      rainCanvas.style.height = `${height}px`
      rainContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      columns = Math.ceil(width / fontSize)
      drops = Array.from({ length: columns }, () => Math.random() * -28)
    }

    function draw() {
      tick += 1

      if (performanceMode === 'low' && tick % 2 === 1) {
        animationFrame = window.requestAnimationFrame(draw)
        return
      }

      rainContext.fillStyle = 'rgba(2, 2, 7, 0.1)'
      rainContext.fillRect(0, 0, width, height)
      rainContext.font = `700 ${fontSize}px Cascadia Code, Consolas, monospace`
      rainContext.textAlign = 'center'
      rainContext.textBaseline = 'top'

      drops.forEach((drop, index) => {
        const x = index * fontSize + fontSize / 2
        const y = drop * fontSize
        const magenta = index % 13 === 0
        const violet = index % 7 === 0
        const alpha = magenta ? 0.24 : violet ? 0.2 : 0.28
        const color = magenta
          ? `rgba(236, 72, 153, ${alpha})`
          : violet
            ? `rgba(168, 85, 247, ${alpha})`
            : `rgba(34, 211, 238, ${alpha})`

        rainContext.shadowBlur = 12
        rainContext.shadowColor = color
        rainContext.fillStyle = color
        rainContext.fillText(pickGlyph(index, tick), x, y)

        if (y > height + Math.random() * 220)
          drops[index] = -Math.random() * 22
        else
          drops[index] = drop + 0.48 + (index % 5) * 0.045
      })

      if (!reducedMotion)
        animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize, { passive: true })

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [performanceMode])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-30 mix-blend-screen [mask-image:radial-gradient(circle_at_center,black,transparent_84%)]"
    />
  )
}
