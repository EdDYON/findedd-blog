import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'

const menuItems = [
  {
    id: 'classic-cheeseburger',
    ticket: '001',
    stamp: 'HOUSE',
    name: '经典芝士牛肉堡',
    englishName: 'CLASSIC CHEESEBURGER',
    note: '牛肉饼 / 切达 / 酸黄瓜 / 番茄酱',
    colors: ['#f4b43a', '#8d3f21', '#f7cf4b', '#4f9b46', '#d9472d'],
  },
  {
    id: 'gochujang-fried-chicken',
    ticket: '021',
    stamp: 'HOT',
    name: '韩式辣酱脆鸡堡',
    englishName: 'GOCHUJANG CRUNCH',
    note: '脆炸鸡腿 / 韩式辣酱 / 泡菜 / 芝麻卷心菜',
    colors: ['#e9582c', '#f8c34a', '#3f9a45', '#f7a722', '#fff1c9'],
  },
  {
    id: 'teriyaki-chicken',
    ticket: '014',
    stamp: 'TOKYO',
    name: '照烧鸡腿堡',
    englishName: 'TERIYAKI CHICKEN',
    note: '照烧鸡腿 / 卷心菜 / 日式蛋黄酱 / 海苔碎',
    colors: ['#edac4b', '#8b3e21', '#88ad53', '#f1b53a', '#5f2b1c'],
  },
  {
    id: 'guacamole-jalapeno',
    ticket: '033',
    stamp: 'FRESH',
    name: '牛油果墨西哥辣堡',
    englishName: 'GUACAMOLE JALAPENO',
    note: '牛肉饼 / 牛油果酱 / 墨西哥辣椒 / 番茄莎莎',
    colors: ['#e6a238', '#633019', '#579444', '#f6b934', '#d94a29'],
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
      <div className="burger-sign-ribbon">FIND BURGER</div>
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
        </g>
      </svg>
      <div className="burger-sticker sticker-left">OPEN</div>
      <div className="burger-sticker sticker-right">HOT</div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="site-shell home-shop-shell">
      <section className="hero sign-hero" id="top">
        <div className="grain sign-grain" />
        <nav className="topbar sign-topbar">
          <Link className="brand sign-brand" href="#top" aria-label="汉堡 首页">
            汉堡
          </Link>
          <div className="nav-links">
            <Link href="#menu">菜单</Link>
            <Link href="/burgers">档案馆</Link>
          </div>
        </nav>

        <div className="hero-grid sign-board">
          <div className="hero-copy sign-copy">
            <p className="eyebrow">FIND BURGER / HARD CRAYON DINER</p>
            <h1 aria-label="汉堡">
              <span>汉堡</span>
            </h1>
            <p className="lead">汉堡之神</p>
            <div className="hero-actions">
              <a className="button button-red shop-button" href="#menu">
                开饭
              </a>
              <Link className="button button-light shop-button" href="/burgers">
                汉堡档案
              </Link>
            </div>
            <div className="hero-shop-meta" aria-label="店铺信息">
              <span>60 WORLD FILES</span>
              <span>OPEN DAILY</span>
              <span>NO. 001</span>
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

      <section className="diner-menu" id="menu" aria-label="汉堡菜单">
        <div className="diner-menu-head">
          <div>
            <p className="eyebrow">FIND BURGER / DINER MENU</p>
            <h2>今日菜单</h2>
          </div>
          <Link className="diner-menu-all" href="/burgers">
            全部 60 份
            <ArrowUpRight aria-hidden="true" size={20} strokeWidth={3} />
          </Link>
        </div>

        <div className="diner-menu-list">
          {menuItems.map((item, index) => (
            <Link
              className="diner-menu-row"
              href={`/burgers/${item.id}`}
              key={item.id}
              style={
                {
                  '--menu-accent': item.colors[0],
                  '--menu-index': index,
                } as CSSProperties
              }
            >
              <span className="diner-menu-number">NO. {item.ticket}</span>
              <div className="diner-menu-copy">
                <span>{item.stamp}</span>
                <h3>{item.name}</h3>
                <p>{item.englishName}</p>
                <small>{item.note}</small>
              </div>
              <span className="diner-menu-layers" aria-hidden="true">
                {item.colors.map((color) => (
                  <span key={color} style={{ backgroundColor: color }} />
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

    </main>
  )
}
