'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Archive,
  ChevronDown,
  ExternalLink,
  Layers3,
  MapPin,
  RotateCcw,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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

export default function BurgerArchive() {
  const [query, setQuery] = useState('')
  const [protein, setProtein] = useState<BurgerProtein | typeof allValue>(allValue)
  const [flavor, setFlavor] = useState<BurgerFlavor | typeof allValue>(allValue)
  const [country, setCountry] = useState(allValue)
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [selectedBurger, setSelectedBurger] = useState<BurgerRecord | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    if (!selectedBurger) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectedBurger(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedBurger])

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
                  <button
                    className="archive-card-hit"
                    type="button"
                    onClick={() => setSelectedBurger(burger)}
                    aria-label={`打开 ${burger.name} 档案票`}
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
                      翻开档案
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

      {selectedBurger && (
        <div
          className="archive-sheet-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedBurger(null)
          }}
        >
          <section
            className="archive-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-sheet-title"
          >
            <div className="archive-sheet-top">
              <span>FILE NO. {selectedBurger.archiveNo}</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedBurger(null)}
                title="关闭档案"
                aria-label="关闭档案"
              >
                <X aria-hidden="true" size={24} strokeWidth={3} />
              </button>
            </div>

            <BurgerSpecimen burger={selectedBurger} large />

            <div className="archive-sheet-copy">
              <p className="archive-card-region">
                <MapPin aria-hidden="true" size={16} strokeWidth={3} />
                {selectedBurger.country} / {selectedBurger.protein}
              </p>
              <h2 id="archive-sheet-title">{selectedBurger.name}</h2>
              <p className="archive-sheet-english">{selectedBurger.englishName}</p>
              <div className="archive-flavors">
                {selectedBurger.flavors.map((item) => <span key={item}>{item}</span>)}
              </div>

              <div className="archive-sheet-section">
                <div className="archive-sheet-label">
                  <Layers3 aria-hidden="true" size={19} strokeWidth={3} />
                  <h3>配料层次</h3>
                </div>
                <ol className="archive-components">
                  {selectedBurger.components.map((item, index) => (
                    <li key={item}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="archive-sheet-section archive-pairing">
                <span>WHY IT WORKS</span>
                <p>{selectedBurger.pairing}</p>
              </div>

              <a
                className="archive-source"
                href={selectedBurger.reference.url}
                target="_blank"
                rel="noreferrer"
              >
                <span>对应资料</span>
                <strong>{selectedBurger.reference.label}</strong>
                <ExternalLink aria-hidden="true" size={18} strokeWidth={3} />
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
