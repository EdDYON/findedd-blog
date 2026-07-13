'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { burgerBeltBurgers } from '@/data/dinerMenu'
import type { BurgerRecord } from '@/data/burgers'
import BurgerSpecimen from './burgers/BurgerSpecimen'
import './burgers/burger-archive.css'

const biteCrumbs = [
  { x: -128, y: -72, rotate: -26 },
  { x: -84, y: 98, rotate: 18 },
  { x: 96, y: -104, rotate: 34 },
  { x: 142, y: -38, rotate: -18 },
  { x: 126, y: 78, rotate: 24 },
  { x: 42, y: 126, rotate: -32 },
  { x: -36, y: -122, rotate: 16 },
  { x: -148, y: 32, rotate: 28 },
]

const routeBurstPieces = [
  { x: '-52vw', y: '-42vh', rotate: '-48deg' },
  { x: '-28vw', y: '-55vh', rotate: '36deg' },
  { x: '4vw', y: '-58vh', rotate: '-22deg' },
  { x: '34vw', y: '-48vh', rotate: '54deg' },
  { x: '54vw', y: '-18vh', rotate: '-36deg' },
  { x: '55vw', y: '24vh', rotate: '46deg' },
  { x: '35vw', y: '52vh', rotate: '-52deg' },
  { x: '2vw', y: '58vh', rotate: '28deg' },
  { x: '-31vw', y: '51vh', rotate: '-38deg' },
  { x: '-55vw', y: '24vh', rotate: '58deg' },
  { x: '-58vw', y: '-8vh', rotate: '-28deg' },
  { x: '48vw', y: '5vh', rotate: '32deg' },
]

type BurgerJourney = {
  burger: BurgerRecord
  href: string
  origin: {
    left: number
    top: number
    width: number
    height: number
  }
  centered: boolean
  biteStage: number
  exploding: boolean
}

export default function BurgerBelt() {
  const router = useRouter()
  const [journey, setJourney] = useState<BurgerJourney | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    return () => timers.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (!journey) return

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [journey])

  function startBurgerJourney(event: MouseEvent<HTMLAnchorElement>, burger: BurgerRecord) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || journey) return

    event.preventDefault()
    const href = `/burgers/${burger.slug}`

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(href)
      return
    }

    const specimen = event.currentTarget.querySelector('.burger-specimen')
    if (!(specimen instanceof HTMLElement)) {
      router.push(href)
      return
    }

    const bounds = specimen.getBoundingClientRect()
    router.prefetch(href)
    setJourney({
      burger,
      href,
      origin: {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      },
      centered: false,
      biteStage: 0,
      exploding: false,
    })

    timers.current = [
      window.setTimeout(() => {
        setJourney((current) => current ? { ...current, centered: true } : current)
      }, 24),
      ...Array.from({ length: 6 }, (_, index) => window.setTimeout(() => {
        setJourney((current) => current ? { ...current, biteStage: index + 1 } : current)
      }, 560 + index * 150)),
      window.setTimeout(() => {
        setJourney((current) => current ? { ...current, exploding: true } : current)
      }, 1570),
      window.setTimeout(() => router.push(href), 2070),
    ]
  }

  return (
    <section className="burger-belt" id="menu" aria-label="回转汉堡">
      <div className="burger-belt-window">
        <div className="burger-belt-track">
          {[0, 1].map((copyIndex) => (
            <div className="burger-belt-set" aria-hidden={copyIndex === 1} key={copyIndex}>
              {burgerBeltBurgers.map((burger) => (
                <Link
                  className="burger-belt-item"
                  href={`/burgers/${burger.slug}`}
                  key={`${copyIndex}-${burger.slug}`}
                  onClick={(event) => startBurgerJourney(event, burger)}
                  tabIndex={copyIndex === 1 ? -1 : undefined}
                  style={
                    {
                      '--belt-accent': burger.visual.accent,
                      '--belt-plate': burger.visual.cheese,
                    } as CSSProperties
                  }
                >
                  <BurgerSpecimen burger={burger} />
                  <span>{burger.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {journey && (
        <div className={`archive-bite-transition ${journey.exploding ? 'is-exploding' : ''}`} aria-hidden="true">
          <div
            className={`archive-bite-specimen ${journey.centered ? 'is-centered' : ''} ${journey.exploding ? 'is-exploding' : ''}`}
            data-bite-stage={journey.biteStage}
            style={
              {
                '--journey-left': `${journey.origin.left}px`,
                '--journey-top': `${journey.origin.top}px`,
                '--journey-width': `${journey.origin.width}px`,
                '--journey-height': `${journey.origin.height}px`,
              } as CSSProperties
            }
          >
            <BurgerSpecimen burger={journey.burger} large biteStage={journey.biteStage} />
          </div>

          {journey.biteStage > 0 && !journey.exploding && (
            <div className="archive-bite-crumbs" key={journey.biteStage}>
              {biteCrumbs.map((crumb, index) => (
                <span
                  key={`${journey.biteStage}-${index}`}
                  style={
                    {
                      '--crumb-delay': `${index * 12}ms`,
                      '--crumb-rotate': `${crumb.rotate}deg`,
                      '--crumb-x': `${crumb.x}px`,
                      '--crumb-y': `${crumb.y}px`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          )}

          {journey.exploding && (
            <div className="archive-route-burst">
              {routeBurstPieces.map((piece, index) => (
                <span
                  key={`${piece.x}-${piece.y}`}
                  style={
                    {
                      '--burst-delay': `${index * 14}ms`,
                      '--burst-rotate': piece.rotate,
                      '--burst-x': piece.x,
                      '--burst-y': piece.y,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
