'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Archive,
  ChevronDown,
  MapPin,
  RotateCcw,
  Search,
} from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import {
  burgerCountries,
  burgerFlavors,
  burgerProteins,
  burgers,
  type BurgerFlavor,
  type BurgerProtein,
  type BurgerRecord,
} from '@/data/burgers'
import BurgerSpecimen from './BurgerSpecimen'

const allValue = '全部'
const pageSize = 18
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
  finished: boolean
}

export default function BurgerArchive() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [protein, setProtein] = useState<BurgerProtein | typeof allValue>(allValue)
  const [flavor, setFlavor] = useState<BurgerFlavor | typeof allValue>(allValue)
  const [country, setCountry] = useState(allValue)
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [journey, setJourney] = useState<BurgerJourney | null>(null)
  const journeyTimers = useRef<number[]>([])
  const previousOverflow = useRef('')
  const journeySlug = journey?.burger.slug

  useEffect(() => {
    return () => {
      journeyTimers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    if (!journeySlug) return

    const root = document.documentElement
    previousOverflow.current = root.style.overflow
    root.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousOverflow.current
    }
  }, [journeySlug])

  const filteredBurgers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN')

    return burgers.filter((burger) => {
      const searchableText = [
        burger.name,
        burger.englishName,
        burger.country,
        burger.countryCode,
        burger.protein,
        ...burger.flavors,
        ...burger.components,
      ]
        .join(' ')
        .toLocaleLowerCase('zh-CN')

      return (
        (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
        (protein === allValue || burger.protein === protein) &&
        (flavor === allValue || burger.flavors.includes(flavor)) &&
        (country === allValue || burger.country === country)
      )
    })
  }, [country, flavor, protein, query])

  const hasFilters = Boolean(query.trim()) || protein !== allValue || flavor !== allValue || country !== allValue
  const visibleBurgers = filteredBurgers.slice(0, visibleCount)
  const remainingCount = Math.max(0, filteredBurgers.length - visibleCount)

  function resetFilters() {
    setQuery('')
    setProtein(allValue)
    setFlavor(allValue)
    setCountry(allValue)
    setVisibleCount(pageSize)
  }

  function updateQuery(value: string) {
    setQuery(value)
    setVisibleCount(pageSize)
  }

  function updateProtein(value: BurgerProtein | typeof allValue) {
    setProtein(value)
    setVisibleCount(pageSize)
  }

  function updateFlavor(value: BurgerFlavor | typeof allValue) {
    setFlavor(value)
    setVisibleCount(pageSize)
  }

  function updateCountry(value: string) {
    setCountry(value)
    setVisibleCount(pageSize)
  }

  function startBurgerJourney(event: MouseEvent<HTMLAnchorElement>, burger: BurgerRecord) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    const href = `/burgers/${burger.slug}`

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push(href)
      return
    }

    const card = event.currentTarget.closest('.archive-card')
    const specimen = card?.querySelector('.burger-specimen')

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
      finished: false,
    })

    journeyTimers.current = [
      window.setTimeout(() => {
        setJourney((current) => current ? { ...current, centered: true } : current)
      }, 32),
      ...Array.from({ length: 6 }, (_, index) => window.setTimeout(() => {
        setJourney((current) => current ? { ...current, biteStage: index + 1 } : current)
      }, 500 + index * 135)),
      window.setTimeout(() => {
        setJourney((current) => current ? { ...current, finished: true } : current)
      }, 1370),
      window.setTimeout(() => router.push(href), 1530),
    ]
  }

  return (
    <main className="archive-shell">
      <header className="archive-topbar">
        <Link className="archive-brand" href="/">
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={3} />
          <span>汉堡</span>
        </Link>
        <div className="archive-status">
          <span className="archive-status-light" aria-hidden="true" />
          <span>OPEN ARCHIVE</span>
          <Archive aria-hidden="true" size={18} strokeWidth={3} />
        </div>
      </header>

      <section className="archive-heading" aria-labelledby="archive-title">
        <div>
          <p className="archive-kicker">WORLD BURGER FILES / GLOBAL EDITION</p>
          <h1 id="archive-title">
            汉堡<span>档案馆</span>
          </h1>
          <p className="archive-intro">
            从烤架、街角和餐桌收集来的世界汉堡与地方手持食物记录。
          </p>
        </div>
        <div className="archive-total" aria-label={`当前显示 ${filteredBurgers.length} 份，共 ${burgers.length} 份档案`}>
          <span>FILES</span>
          <strong>{String(filteredBurgers.length).padStart(2, '0')}</strong>
          <small>/ {String(burgers.length).padStart(2, '0')}</small>
        </div>
      </section>

      <section className="archive-controls" aria-label="汉堡筛选">
        <label className="archive-search">
          <span className="sr-only">搜索汉堡、国家或配料</span>
          <Search aria-hidden="true" size={20} strokeWidth={3} />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="搜索汉堡、国家或配料"
          />
        </label>

        <label className="archive-select">
          <select
            aria-label="肉类"
            value={protein}
            onChange={(event) => updateProtein(event.target.value as BurgerProtein | typeof allValue)}
          >
            <option value={allValue}>全部肉类</option>
            {burgerProteins.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="archive-select">
          <select
            aria-label="风味"
            value={flavor}
            onChange={(event) => updateFlavor(event.target.value as BurgerFlavor | typeof allValue)}
          >
            <option value={allValue}>全部风味</option>
            {burgerFlavors.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="archive-select">
          <select
            aria-label="国家"
            value={country}
            onChange={(event) => updateCountry(event.target.value)}
          >
            <option value={allValue}>全部国家</option>
            {burgerCountries.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <button
          className="archive-reset"
          type="button"
          onClick={resetFilters}
          disabled={!hasFilters}
          title="重置筛选"
          aria-label="重置筛选"
        >
          <RotateCcw aria-hidden="true" size={20} strokeWidth={3} />
        </button>
      </section>

      <section className="archive-results" aria-live="polite" aria-label="汉堡档案结果">
        <div className="archive-results-line">
          <span>{hasFilters ? 'MATCHED' : 'FILES'}</span>
          <strong>{visibleBurgers.length} / {filteredBurgers.length}</strong>
        </div>

        {filteredBurgers.length > 0 ? (
          <>
            <div className="archive-grid">
              {visibleBurgers.map((burger, index) => (
                <article
                  className="archive-card"
                  key={burger.slug}
                  style={{ '--card-tilt': `${index % 2 === 0 ? -0.6 : 0.6}deg` } as CSSProperties}
                >
                  <Link
                    className="archive-card-hit"
                    href={`/burgers/${burger.slug}`}
                    aria-label={`阅读 ${burger.name} 完整档案`}
                    onClick={(event) => startBurgerJourney(event, burger)}
                  />
                  <div className="archive-card-head">
                    <span>FILE NO. {burger.archiveNo}</span>
                    <span className="archive-country-stamp">{burger.countryCode}</span>
                  </div>
                  <BurgerSpecimen burger={burger} />
                  <div className="archive-card-copy">
                    <p className="archive-card-region">
                      <MapPin aria-hidden="true" size={15} strokeWidth={3} />
                      {burger.country} / {burger.protein}
                    </p>
                    <h2>{burger.name}</h2>
                    <p className="archive-card-english">{burger.englishName}</p>
                    <div className="archive-flavors" aria-label="风味标签">
                      {burger.flavors.map((item) => <span key={item}>{item}</span>)}
                    </div>
                    <p className="archive-card-summary">{burger.summary}</p>
                    <span className="archive-card-action" aria-hidden="true">
                      阅读完整档案
                      <ArrowUpRight size={18} strokeWidth={3} />
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {remainingCount > 0 && (
              <button
                className="archive-load-more"
                type="button"
                onClick={() => setVisibleCount((current) => current + pageSize)}
              >
                <span>继续翻档案</span>
                <strong>再看 {Math.min(pageSize, remainingCount)} 份</strong>
                <ChevronDown aria-hidden="true" size={22} strokeWidth={3} />
              </button>
            )}
          </>
        ) : (
          <div className="archive-empty">
            <span>NO FILE</span>
            <strong>没有找到这款汉堡</strong>
            <p>换一种肉类、风味或国家再找找。</p>
            <button type="button" onClick={resetFilters}>
              <RotateCcw aria-hidden="true" size={18} strokeWidth={3} />
              清空筛选
            </button>
          </div>
        )}
      </section>

      {journey && (
        <div
          className={`archive-bite-transition ${journey.finished ? 'is-finished' : ''}`}
          aria-hidden="true"
        >
          <div
            className={`archive-bite-specimen ${journey.centered ? 'is-centered' : ''} ${journey.finished ? 'is-consumed' : ''}`}
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

          {journey.biteStage > 0 && !journey.finished && (
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
        </div>
      )}

    </main>
  )
}
