'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChefHat,
  ExternalLink,
  Layers3,
  MapPin,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { BurgerRecord } from '@/data/burgers'
import type {
  BurgerRecipeStep,
  BurgerTasteRating,
} from '@/data/burgerDetails'
import BurgerSpecimen from '../BurgerSpecimen'

type BurgerDetailViewProps = {
  burger: BurgerRecord
  story: string[]
  tasteRatings: BurgerTasteRating[]
  recipeSteps: BurgerRecipeStep[]
  similarBurgers: BurgerRecord[]
}

function BurgerLayerBreakdown({ burger }: { burger: BurgerRecord }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0

    function updateLayers() {
      if (!section) return

      const bounds = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const distance = Math.max(viewportHeight * 0.72, bounds.height)
      const rawProgress = (viewportHeight * 0.72 - bounds.top) / distance
      const progress = reducedMotion ? 1 : Math.min(1, Math.max(0, rawProgress))

      section.style.setProperty('--explode-top', `${progress * -92}px`)
      section.style.setProperty('--explode-fresh', `${progress * -48}px`)
      section.style.setProperty('--explode-cheese', `${progress * -18}px`)
      section.style.setProperty('--explode-sauce', `${progress * 8}px`)
      section.style.setProperty('--explode-main', `${progress * 38}px`)
      section.style.setProperty('--explode-bottom', `${progress * 72}px`)
      section.style.setProperty('--explode-shadow', `${progress * 84}px`)
      section.style.setProperty('--explode-progress', `${progress * 100}%`)
    }

    function requestUpdate() {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(updateLayers)
    }

    updateLayers()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  return (
    <section className="detail-breakdown" ref={sectionRef} aria-labelledby="detail-layers-title">
      <div className="detail-breakdown-visual">
        <div className="detail-exploded-stage">
          <div className="detail-progress" aria-hidden="true">
            <span />
          </div>
          <BurgerSpecimen burger={burger} large />
        </div>
      </div>

      <div className="detail-layer-copy">
        <p className="detail-kicker">REAL INGREDIENT STACK</p>
        <h2 id="detail-layers-title">配料层次</h2>

        <ol className="detail-layer-list">
          {burger.components.map((component, index) => (
            <li key={component}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong>{component}</strong>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function BurgerDetailView({
  burger,
  story,
  tasteRatings,
  recipeSteps,
  similarBurgers,
}: BurgerDetailViewProps) {
  return (
    <main className="burger-detail-shell">
      <header className="detail-topbar">
        <Link className="detail-back" href="/burgers">
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={3} />
          <span>返回档案馆</span>
        </Link>
        <Link className="detail-home" href="/" aria-label="返回汉堡首页">
          汉堡
        </Link>
        <span className="detail-file-tag">FILE NO. {burger.archiveNo}</span>
      </header>

      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="detail-hero-copy">
          <p className="detail-kicker">WORLD BURGER FILE / {burger.countryCode}</p>
          <p className="detail-location">
            <MapPin aria-hidden="true" size={18} strokeWidth={3} />
            {burger.country} · {burger.protein}
          </p>
          <h1 id="detail-title">{burger.name}</h1>
          <p className="detail-english">{burger.englishName}</p>
          <p className="detail-summary">{burger.summary}</p>

          <div className="detail-flavors" aria-label="风味标签">
            {burger.flavors.map((flavor) => <span key={flavor}>{flavor}</span>)}
          </div>

          <a
            className="detail-source-button"
            href={burger.reference.url}
            target="_blank"
            rel="noreferrer"
          >
            对应资料
            <ExternalLink aria-hidden="true" size={18} strokeWidth={3} />
          </a>
        </div>

        <div className="detail-hero-visual">
          <span className="detail-hero-stamp">{burger.countryCode}</span>
          <BurgerSpecimen burger={burger} large />
          <span className="detail-hero-caption">ARCHIVE SPECIMEN / {burger.archiveNo}</span>
        </div>
      </section>

      <section className="detail-story" aria-labelledby="detail-story-title">
        <div className="detail-section-heading">
          <BookOpen aria-hidden="true" size={25} strokeWidth={3} />
          <div>
            <p className="detail-kicker">ORIGIN & CHARACTER</p>
            <h2 id="detail-story-title">起源故事</h2>
          </div>
        </div>
        <div className="detail-story-copy">
          {story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="detail-taste" aria-labelledby="detail-taste-title">
        <div>
          <p className="detail-kicker">TASTE CARD</p>
          <h2 id="detail-taste-title">风味强度</h2>
        </div>
        <div className="detail-taste-grid">
          {tasteRatings.map((rating) => (
            <div className="detail-taste-row" key={rating.key} aria-label={`${rating.label} ${rating.score} 分，满分 5 分`}>
              <span>{rating.label}</span>
              <div aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                  <i className={index < rating.score ? 'is-active' : ''} key={index} />
                ))}
              </div>
              <strong>{rating.score}/5</strong>
            </div>
          ))}
        </div>
      </section>

      <BurgerLayerBreakdown burger={burger} />

      <section className="detail-recipe" aria-labelledby="detail-recipe-title">
        <div className="detail-section-heading">
          <ChefHat aria-hidden="true" size={27} strokeWidth={3} />
          <div>
            <p className="detail-kicker">BUILD METHOD</p>
            <h2 id="detail-recipe-title">制作方法</h2>
          </div>
        </div>
        <div className="detail-recipe-grid">
          {recipeSteps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <small>{step.meta}</small>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-source" aria-labelledby="detail-source-title">
        <div>
          <p className="detail-kicker">REFERENCE DESK</p>
          <h2 id="detail-source-title">资料来源</h2>
        </div>
        <a href={burger.reference.url} target="_blank" rel="noreferrer">
          <span>资料来源</span>
          <strong>{burger.reference.label}</strong>
          <ExternalLink aria-hidden="true" size={21} strokeWidth={3} />
        </a>
      </section>

      <section className="detail-related" aria-labelledby="detail-related-title">
        <div className="detail-related-head">
          <div>
            <p className="detail-kicker">NEXT FILES</p>
            <h2 id="detail-related-title">相似汉堡</h2>
          </div>
          <Link href="/burgers">
            查看全部
            <ArrowUpRight aria-hidden="true" size={18} strokeWidth={3} />
          </Link>
        </div>

        <div className="detail-related-grid">
          {similarBurgers.map((similar) => (
            <article className="detail-related-card" key={similar.slug}>
              <Link href={`/burgers/${similar.slug}`} aria-label={`阅读 ${similar.name} 完整档案`} />
              <div className="detail-related-number">FILE NO. {similar.archiveNo}</div>
              <BurgerSpecimen burger={similar} />
              <div className="detail-related-copy">
                <span>{similar.country} / {similar.protein}</span>
                <h3>{similar.name}</h3>
                <p>{similar.englishName}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="detail-footer">
        <Layers3 aria-hidden="true" size={20} strokeWidth={3} />
        <span>FIND BURGER · WORLD BURGER FILES</span>
      </footer>
    </main>
  )
}
