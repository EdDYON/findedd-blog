'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

const menuItems = [
  {
    id: 'classic',
    ticket: '001',
    stamp: 'HOUSE',
    name: '经典牛肉',
    note: '牛肉饼 / 切达 / 酸黄瓜 / 番茄酱',
    colors: ['#f4b43a', '#8d3f21', '#f7cf4b', '#4f9b46', '#d9472d'],
    layers: ['牛肉饼', '切达芝士', '酸黄瓜', '番茄酱'],
  },
  {
    id: 'spicy',
    ticket: '014',
    stamp: 'HOT',
    name: '辣鸡腿堡',
    note: '脆鸡排 / 生菜 / 辣酱 / 芝麻面包',
    colors: ['#e9582c', '#f8c34a', '#3f9a45', '#f7a722', '#fff1c9'],
    layers: ['脆鸡排', '生菜', '辣味酱', '芝麻面包'],
  },
  {
    id: 'double',
    ticket: '027',
    stamp: 'MELT',
    name: '双层芝士',
    note: '双肉饼 / 双芝士 / 洋葱圈 / 烟熏酱',
    colors: ['#9f4b24', '#fac13d', '#7b301c', '#f8d76b', '#c6462f'],
    layers: ['双层牛肉', '切达芝士', '洋葱圈', '烟熏酱'],
  },
  {
    id: 'breakfast',
    ticket: '039',
    stamp: 'MORN',
    name: '早餐堡',
    note: '煎蛋 / 培根 / 马苏里拉 / 黄芥末',
    colors: ['#fff0bf', '#e66f48', '#f8c43f', '#ffe29a', '#f3a24a'],
    layers: ['煎蛋', '培根', '马苏里拉', '黄芥末'],
  },
]

const tickerItems = [
  '汉堡',
  'OPEN',
  'CHEESE',
  'SAUCE',
  'CRAYON',
  'HOT GRILL',
  'PICKLES',
  '汉堡',
]

function BurgerVisual() {
  return (
    <div className="burger-frame shop-burger-frame" aria-label="汉堡 硬蜡笔汉堡主视觉">
      <div className="burger-sign-ribbon">汉堡</div>
      <svg className="burger-svg shop-burger-svg" viewBox="0 0 560 430" role="img">
        <title>硬蜡笔风格汉堡</title>
        <defs>
          <filter id="homeBurgerShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="8" dy="12" stdDeviation="0" floodColor="#2b120d" floodOpacity="0.42" />
          </filter>
        </defs>
        <ellipse className="burger-ground" cx="280" cy="380" rx="170" ry="22" />
        <g filter="url(#homeBurgerShadow)">
          <path
            className="bun bottom-bun"
            d="M112 326 C155 358 405 358 448 326 L436 374 C385 401 176 401 124 374 Z"
          />
          <path
            className="crayon-stroke bun-stroke"
            d="M132 356 C203 377 363 377 430 356"
          />
          <path
            className="patty"
            d="M98 272 C119 242 435 242 462 272 C477 289 462 317 438 322 C360 337 204 338 122 321 C94 315 81 291 98 272 Z"
          />
          <path className="grill-mark" d="M165 282 L205 312" />
          <path className="grill-mark" d="M252 277 L290 315" />
          <path className="grill-mark" d="M340 279 L378 309" />
          <path
            className="cheese"
            d="M104 230 L456 230 L431 272 L384 250 L342 278 L296 251 L248 279 L206 250 L158 276 Z"
          />
          <path
            className="lettuce"
            d="M106 202 L143 176 L184 205 L221 178 L263 207 L303 177 L346 205 L383 177 L421 204 L461 182 L475 220 L440 238 L397 218 L361 241 L316 216 L278 240 L235 216 L194 240 L155 217 L121 237 Z"
          />
          <path
            className="tomato tomato-one"
            d="M126 166 C176 145 235 151 267 171 C246 197 159 201 126 166 Z"
          />
          <path
            className="tomato tomato-two"
            d="M279 169 C333 145 401 153 436 176 C407 203 313 204 279 169 Z"
          />
          <path
            className="bun top-bun"
            d="M91 158 C106 62 451 47 476 160 C398 176 179 178 91 158 Z"
          />
          <path className="top-edge" d="M107 160 C171 184 396 184 461 162" />
          <g className="sesame">
            <rect x="153" y="112" width="14" height="12" rx="2" />
            <rect x="218" y="86" width="16" height="14" rx="2" />
            <rect x="288" y="115" width="12" height="10" rx="2" />
            <rect x="355" y="86" width="16" height="13" rx="2" />
            <rect x="418" y="124" width="14" height="12" rx="2" />
          </g>
          <g className="crayon-sprinkles" aria-hidden="true">
            <rect x="92" y="248" width="20" height="20" />
            <rect x="470" y="219" width="18" height="18" />
            <rect x="244" y="66" width="18" height="18" />
            <rect x="397" y="54" width="17" height="17" />
            <rect x="300" y="251" width="14" height="14" />
          </g>
        </g>
      </svg>
      <div className="burger-sticker sticker-left">OPEN</div>
      <div className="burger-sticker sticker-right">HOT</div>
    </div>
  )
}

export default function Home() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const popTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (popTimer.current) {
        window.clearTimeout(popTimer.current)
      }
    }
  }, [])

  function popTicket(id: string) {
    setActiveCard(id)

    if (popTimer.current) {
      window.clearTimeout(popTimer.current)
    }

    popTimer.current = window.setTimeout(() => {
      setActiveCard((current) => (current === id ? null : current))
    }, 1050)
  }

  return (
    <main className="site-shell home-shop-shell">
      <section className="hero sign-hero" id="top">
        <div className="grain sign-grain" />
        <nav className="topbar sign-topbar">
          <Link className="brand sign-brand" href="#top" aria-label="汉堡 首页">
            汉堡
          </Link>
          <div className="nav-links">
            <Link href="/burgers">菜单</Link>
          </div>
        </nav>

        <div className="hero-grid sign-board">
          <div className="hero-copy sign-copy">
            <p className="eyebrow">HARD CRAYON BURGER SHOP</p>
            <h1 aria-label="汉堡">
              <span>汉</span>
              <span>堡</span>
            </h1>
            <p className="lead">
              汉堡之神
            </p>
            <div className="hero-actions">
              <a className="button button-red shop-button" href="#menu">
                开饭
              </a>
              <Link className="button button-light shop-button" href="/burgers">
                看菜单
              </Link>
            </div>
          </div>

          <BurgerVisual />
        </div>
      </section>

      <div className="ticker ticker-conveyor" aria-label="汉堡 传送带">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="menu-strip menu-ticket-board" id="menu" aria-label="点菜单票据">
        <div className="menu-board-head">
          <p className="eyebrow">ORDER STICKERS</p>
          <h2>汉堡贴纸 / 点菜单票据</h2>
        </div>

        <div className="menu-ticket-grid">
          {menuItems.map((item, index) => (
            <button
              className={`menu-card menu-ticket ${activeCard === item.id ? 'is-popped' : ''}`}
              key={item.id}
              onClick={() => popTicket(item.id)}
              style={
                {
                  '--ticket-tilt': index % 2 === 0 ? '-1.5deg' : '1.5deg',
                  '--ticket-hover-tilt': index % 2 === 0 ? '1deg' : '-1deg',
                  '--ticket-accent': item.colors[0],
                  '--ticket-stamp': item.colors[2],
                } as CSSProperties
              }
              type="button"
            >
              <span className="ticket-number">NO. {item.ticket}</span>
              <span className="ticket-stamp">{item.stamp}</span>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
              <span className="ticket-layers" aria-hidden="true">
                {item.colors.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="ticket-pop-layers" aria-hidden="true">
                {item.layers.map((layer, layerIndex) => (
                  <span
                    key={layer}
                    style={{ '--layer-delay': `${layerIndex * 70}ms` } as CSSProperties}
                  >
                    {layer}
                  </span>
                ))}
              </span>
            </button>
          ))}
        </div>
      </section>

    </main>
  )
}
