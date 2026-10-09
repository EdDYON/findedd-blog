import type { Metadata } from 'next'
import Link from 'next/link'
import { Archive, ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { dinerMenuBurgers } from '@/data/dinerMenu'
import BurgerSpecimen from '../burgers/BurgerSpecimen'
import '../burgers/burger-archive.css'
import './menu.css'

export const metadata: Metadata = {
  title: '今日菜单 | 汉堡',
  description: 'Find Burger 今日汉堡菜单。',
  alternates: {
    canonical: '/menu',
  },
}

export default function MenuPage() {
  const featuredBurger = dinerMenuBurgers[0]

  return (
    <main className="menu-page-shell">
      <header className="menu-page-topbar">
        <Link href="/">
          <ArrowLeft aria-hidden="true" size={20} strokeWidth={3} />
          汉堡
        </Link>
        <Link href="/burgers">
          档案馆
          <Archive aria-hidden="true" size={18} strokeWidth={3} />
        </Link>
      </header>

      <section className="menu-page-heading" aria-labelledby="menu-page-title">
        <div>
          <p>FIND BURGER / DINER MENU</p>
          <h1 id="menu-page-title">今日菜单</h1>
          <div className="menu-page-meta">
            <span>8 PLATES</span>
            <span>OPEN DAILY</span>
            <span>HARD CRAYON</span>
          </div>
        </div>
        <div className="menu-page-featured">
          <span>HOUSE NO. {featuredBurger.archiveNo}</span>
          <BurgerSpecimen burger={featuredBurger} large />
        </div>
      </section>

      <section className="diner-menu menu-page-menu" aria-label="今日汉堡菜单">
        <div className="diner-menu-head">
          <div>
            <p className="eyebrow">ORDER BOARD / 8 FILES</p>
            <h2>开饭</h2>
          </div>
          <Link className="diner-menu-all" href="/burgers">
            全部 60 份
            <ArrowUpRight aria-hidden="true" size={20} strokeWidth={3} />
          </Link>
        </div>

        <div className="diner-menu-list">
          {dinerMenuBurgers.map((burger) => (
            <Link
              className="diner-menu-row"
              href={`/burgers/${burger.slug}`}
              key={burger.slug}
              style={
                {
                  '--menu-accent': burger.visual.bun,
                } as CSSProperties
              }
            >
              <span className="diner-menu-number">NO. {burger.archiveNo}</span>
              <div className="diner-menu-copy">
                <span>{burger.countryCode} / {burger.protein}</span>
                <h3>{burger.name}</h3>
                <p>{burger.englishName}</p>
                <small>{burger.components.join(' / ')}</small>
              </div>
              <span className="diner-menu-layers" aria-hidden="true">
                {[
                  burger.visual.bun,
                  burger.visual.main,
                  burger.visual.cheese,
                  burger.visual.greens,
                  burger.visual.sauce,
                ].map((color, index) => (
                  <span key={`${color}-${index}`} style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="diner-menu-open" aria-hidden="true">
                OPEN FILE
                <ArrowUpRight size={22} strokeWidth={3} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="menu-page-footer">FIND BURGER / ORDER UP</footer>
    </main>
  )
}
