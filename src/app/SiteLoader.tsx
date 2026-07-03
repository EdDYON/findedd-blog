'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

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
  '汉堡完成，开饭！！！',
]

const burstVectors = [
  { x: '-180px', y: '82px', rotate: '-16deg' },
  { x: '210px', y: '24px', rotate: '18deg' },
  { x: '-250px', y: '-86px', rotate: '-24deg' },
  { x: '250px', y: '-132px', rotate: '22deg' },
  { x: '-170px', y: '-220px', rotate: '-18deg' },
  { x: '160px', y: '-300px', rotate: '16deg' },
]

const brandBands = [
  'FIND BURGER   OPEN KITCHEN   HAND DRAWN BURGERS',
  'CHEESE   SAUCE   PATTY   LETTUCE   TOMATO',
  'FIND BURGER   HOT GRILL   CRAYON SHOP',
  'ORDER UP   BURGER LAB   FRESH STACK',
  'FIND BURGER   OPEN KITCHEN   HARD CRAYON',
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
      <div className="site-loader-brand-bands" aria-hidden="true">
        {brandBands.map((band, index) => (
          <span key={band} style={{ '--band-delay': `${index * -7}s` } as CSSProperties}>
            {band}&nbsp;&nbsp;&nbsp;{band}&nbsp;&nbsp;&nbsp;{band}
          </span>
        ))}
      </div>
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
                    '--burst-delay': `${index * 34}ms`,
                    '--burst-rotate': burstVectors[index].rotate,
                    '--burst-x': burstVectors[index].x,
                    '--burst-y': burstVectors[index].y,
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
          开饭！！！
        </label>
      </div>
    </div>
  )
}
