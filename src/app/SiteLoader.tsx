'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent } from 'react'

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
  '汉堡完成，点一下开饭！',
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

const logoLetters = Array.from('find burger')
const loaderToggleId = 'find-burger-loader-toggle'

export default function SiteLoader() {
  const [visible, setVisible] = useState(true)
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const previousOverflow = useRef('')
  const exitTimer = useRef<number | null>(null)
  const readyAt = useRef<number | null>(null)
  const interactionArmed = useRef(false)

  const enterSite = useCallback(() => {
    if (!isReady || isExiting || exitTimer.current || !interactionArmed.current) return
    if (readyAt.current && performance.now() - readyAt.current < 380) {
      interactionArmed.current = false
      return
    }

    interactionArmed.current = false
    setIsExiting(true)
    exitTimer.current = window.setTimeout(() => {
      document.documentElement.style.overflow = previousOverflow.current
      setVisible(false)
    }, 1080)
  }, [isExiting, isReady])

  const markReady = useCallback(() => {
    readyAt.current = performance.now()
    interactionArmed.current = false
    setIsReady(true)
  }, [])

  const enterFromToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.currentTarget.checked) return
      interactionArmed.current = true
      enterSite()
    },
    [enterSite],
  )

  const enterFromKeyboard = useCallback(
    (event: KeyboardEvent<HTMLLabelElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      if (!isReady || isExiting) return

      event.preventDefault()
      const toggle = document.getElementById(loaderToggleId)
      if (toggle instanceof HTMLInputElement) toggle.checked = true
      interactionArmed.current = true
      enterSite()
    },
    [enterSite, isExiting, isReady],
  )

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    previousOverflow.current = root.style.overflow
    root.style.overflow = 'hidden'

    if (reducedMotion) {
      const reducedProgressTimer = window.setTimeout(() => setProgress(100), 0)
      const reducedReadyTimer = window.setTimeout(() => {
        setMessageIndex(messages.length - 1)
        markReady()
      }, 260)

      return () => {
        window.clearTimeout(reducedProgressTimer)
        window.clearTimeout(reducedReadyTimer)
        if (exitTimer.current) window.clearTimeout(exitTimer.current)
        root.style.overflow = previousOverflow.current
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
    const readyTimer = window.setTimeout(() => {
      window.clearInterval(progressTimer)
      setProgress(100)
      setMessageIndex(messages.length - 1)
      markReady()
    }, 2420)

    return () => {
      window.clearInterval(progressTimer)
      messageTimers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(readyTimer)
      if (exitTimer.current) window.clearTimeout(exitTimer.current)
      root.style.overflow = previousOverflow.current
    }
  }, [markReady])

  if (!visible) return null

  return (
    <div
      className={`site-loader ${isReady ? 'is-ready' : ''} ${isExiting ? 'is-exiting' : ''}`}
      aria-label="find burger 开场动画"
      aria-modal="true"
      role="dialog"
    >
      <div className="site-loader-wipe site-loader-wipe-yellow" aria-hidden="true" />
      <div className="site-loader-wipe site-loader-wipe-orange" aria-hidden="true" />
      <div className="site-loader-wipe site-loader-wipe-red" aria-hidden="true" />
      <input
        aria-label="进入 find burger"
        className="site-loader-toggle"
        id={loaderToggleId}
        onChange={enterFromToggle}
        type="checkbox"
      />

      <div className="site-loader-content">
        <div className="site-loader-logo" aria-label="find burger">
          {logoLetters.map((letter, index) => (
            <span
              aria-hidden="true"
              key={`${letter}-${index}`}
              style={
                {
                  '--letter-delay': `${index * 54}ms`,
                  '--letter-ready-delay': `${index * 18}ms`,
                  '--letter-tilt': `${index % 2 === 0 ? -2 : 2}deg`,
                  '--letter-ready-tilt': `${index % 2 === 0 ? 2 : -2}deg`,
                } as CSSProperties
              }
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>

        <label
          aria-label={isReady ? '进入 find burger' : 'find burger 汉堡正在组装'}
          className="site-loader-stage"
          htmlFor={loaderToggleId}
          onKeyDown={enterFromKeyboard}
          role="button"
          tabIndex={0}
        >
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
                    '--crumb-ready-delay': `${index * 74}ms`,
                    '--crumb-exit-delay': `${index * 18}ms`,
                    '--crumb-x': `${x}px`,
                    '--crumb-y': `${y}px`,
                    '--crumb-ready-x': `${x * 0.62}px`,
                    '--crumb-ready-y': `${y * 0.5}px`,
                    '--crumb-burst-x': `${x * 1.45}px`,
                    '--crumb-burst-y': `${y * 1.1 - 42}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </label>

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

        <label
          className="site-loader-enter"
          htmlFor={loaderToggleId}
          onKeyDown={enterFromKeyboard}
          role="button"
          tabIndex={0}
        >
          点一下，开饭！
        </label>
      </div>
    </div>
  )
}
