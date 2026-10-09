'use client'

import Image from 'next/image'
import { useEffect, useState, type CSSProperties } from 'react'

type LoaderLayer = {
  id: string
  image: string
  label: string
  className: string
}

const layers: LoaderLayer[] = [
  {
    id: 'bun-bottom',
    image: '/assets/loader/burger-bun-bottom.png',
    label: '芝麻面包底',
    className: 'loader-layer-bun-bottom',
  },
  {
    id: 'patty',
    image: '/assets/loader/burger-beef-patty.png',
    label: '经典牛肉饼',
    className: 'loader-layer-patty',
  },
  {
    id: 'cheese',
    image: '/assets/loader/burger-cheddar.png',
    label: '切达芝士片',
    className: 'loader-layer-cheese',
  },
  {
    id: 'lettuce',
    image: '/assets/loader/burger-lettuce.png',
    label: '绿叶生菜',
    className: 'loader-layer-lettuce',
  },
  {
    id: 'tomato',
    image: '/assets/loader/burger-tomato.png',
    label: '番茄片',
    className: 'loader-layer-tomato',
  },
  {
    id: 'bun-top',
    image: '/assets/loader/burger-bun-top.png',
    label: '芝麻面包顶',
    className: 'loader-layer-bun-top',
  },
]

const messages = [
  '正在预热汉堡厨房...',
  '放稳芝麻面包底...',
  '煎一块滋滋作响的牛肉饼...',
  '盖上融化的切达芝士...',
  '加入脆爽生菜和番茄...',
  '最后盖上金黄面包顶...',
  '汉堡完成，准备开饭！',
]

const crumbs = [
  [-118, -64],
  [-88, -116],
  [-42, -138],
  [12, -148],
  [66, -130],
  [112, -92],
  [128, -38],
  [112, 12],
  [66, 40],
  [12, 52],
  [-52, 38],
  [-104, 2],
]

export default function SiteLoader() {
  const [visible, setVisible] = useState(true)
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    if (reducedMotion) {
      const reducedProgressTimer = window.setTimeout(() => setProgress(100), 0)
      const reducedTimer = window.setTimeout(() => {
        root.style.overflow = previousOverflow
        setVisible(false)
      }, 260)

      return () => {
        window.clearTimeout(reducedProgressTimer)
        window.clearTimeout(reducedTimer)
        root.style.overflow = previousOverflow
      }
    }

    const startedAt = performance.now()
    const progressTimer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt
      setProgress(Math.min(100, Math.round((elapsed / 1880) * 100)))
    }, 40)

    const messageTimers = messages.slice(1).map((_, index) =>
      window.setTimeout(() => setMessageIndex(index + 1), 280 + index * 260),
    )
    const removeTimer = window.setTimeout(() => {
      window.clearInterval(progressTimer)
      setProgress(100)
      root.style.overflow = previousOverflow
      setVisible(false)
    }, 3580)

    return () => {
      window.clearInterval(progressTimer)
      messageTimers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(removeTimer)
      root.style.overflow = previousOverflow
    }
  }, [])

  if (!visible) return null

  return (
    <div className="site-loader" aria-busy="true" aria-label="正在准备汉堡网站" role="status">
      <div className="site-loader-wipe site-loader-wipe-yellow" aria-hidden="true" />
      <div className="site-loader-wipe site-loader-wipe-orange" aria-hidden="true" />
      <div className="site-loader-wipe site-loader-wipe-red" aria-hidden="true" />

      <div className="site-loader-content">
        <div className="site-loader-kicker">FINDEDD BURGER LAB</div>

        <div className="site-loader-stage" aria-hidden="true">
          <div className="site-loader-shadow" />
          <div className="site-loader-stack">
            {layers.map((layer, index) => (
              <div
                className={`site-loader-layer ${layer.className}`}
                key={layer.id}
                style={
                  {
                    '--loader-delay': `${110 + index * 235}ms`,
                    '--loader-mobile-y': `${index * 35}px`,
                    '--loader-y': `${index * 42}px`,
                  } as CSSProperties
                }
              >
                <Image
                  alt={layer.label}
                  height={180}
                  priority
                  src={layer.image}
                  unoptimized
                  width={360}
                />
              </div>
            ))}
          </div>

          <div className="site-loader-crumbs">
            {crumbs.map(([x, y], index) => (
              <i
                key={`${x}-${y}`}
                style={
                  {
                    '--crumb-delay': `${1740 + index * 18}ms`,
                    '--crumb-x': `${x}px`,
                    '--crumb-y': `${y}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <div className="site-loader-copy" aria-live="polite">
          <strong>{messages[messageIndex]}</strong>
          <span>{String(progress).padStart(3, '0')}%</span>
        </div>

        <div
          aria-label="加载进度"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="site-loader-progress"
          role="progressbar"
        >
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
