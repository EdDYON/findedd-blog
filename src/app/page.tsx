const menuItems = [
  { name: '经典牛肉', note: '牛肉 / 芝士 / 酸黄瓜' },
  { name: '辣鸡腿', note: '脆皮鸡腿 / 辣酱 / 生菜' },
  { name: '双层芝士', note: '双肉饼 / 双芝士 / 洋葱' },
  { name: '早餐堡', note: '鸡蛋 / 培根 / 黄油面包' },
]

function BurgerVisual() {
  return (
    <div className="burger-frame" aria-label="精致汉堡插画">
      <div className="price-tag">
        <span>NO. 001</span>
        今日样本
      </div>

      <svg className="burger-svg" viewBox="0 0 720 560" role="img" aria-labelledby="burger-title">
        <title id="burger-title">一枚分层的芝士汉堡</title>
        <defs>
          <linearGradient id="bunTop" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#F9B84A" />
            <stop offset="70%" stopColor="#D77A27" />
            <stop offset="100%" stopColor="#B85F1C" />
          </linearGradient>
          <linearGradient id="bunBottom" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#DF8930" />
            <stop offset="100%" stopColor="#A8551C" />
          </linearGradient>
          <linearGradient id="patty" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#7A371A" />
            <stop offset="100%" stopColor="#3F1A0E" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="16" dy="18" stdDeviation="0" floodColor="#281109" floodOpacity="0.92" />
          </filter>
        </defs>

        <path
          className="splash"
          d="M221 107C291 35 455 33 536 94C626 162 626 330 547 419C471 505 284 505 198 421C116 341 135 195 221 107Z"
        />
        <ellipse className="plate" cx="360" cy="492" rx="254" ry="34" />

        <g className="burger-stack" filter="url(#softShadow)">
          <path
            className="bun-bottom"
            d="M130 426H590V458C590 517 540 535 360 535C180 535 130 517 130 458Z"
          />
          <path
            className="lettuce"
            d="M150 392C181 369 211 409 243 386C276 363 306 409 339 386C371 364 403 409 435 386C470 363 500 409 531 386C553 371 574 380 592 402V440H128V405C135 400 142 396 150 392Z"
          />
          <path
            className="patty"
            d="M138 326C138 291 170 274 223 276H498C552 274 582 291 582 326C582 363 549 380 498 378H223C171 380 138 363 138 326Z"
          />
          <path
            className="cheese"
            d="M154 275H573V331H501L466 369L430 331H321L286 369L248 331H154Z"
          />
          <path
            className="sauce"
            d="M139 246C174 230 207 236 241 248C278 260 307 260 339 244C381 222 421 232 461 248C505 266 544 260 583 239L595 281C549 299 501 300 457 281C418 264 384 262 345 282C302 304 253 300 214 282C183 268 160 268 132 283Z"
          />
          <path
            className="bun-top"
            d="M124 207C139 110 219 64 360 64C501 64 580 111 596 207C603 247 573 265 519 260H201C146 265 117 247 124 207Z"
          />
          <g className="sesame">
            <ellipse cx="235" cy="126" rx="17" ry="8" transform="rotate(-18 235 126)" />
            <ellipse cx="315" cy="101" rx="15" ry="8" transform="rotate(8 315 101)" />
            <ellipse cx="405" cy="116" rx="17" ry="8" transform="rotate(16 405 116)" />
            <ellipse cx="483" cy="152" rx="14" ry="7" transform="rotate(-12 483 152)" />
          </g>
        </g>
      </svg>

      <div className="floating-chip chip-one">cheese</div>
      <div className="floating-chip chip-two">juicy</div>
      <div className="floating-chip chip-three">sauce</div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="site-title">
        <div className="grain" aria-hidden="true" />

        <nav className="topbar" aria-label="主导航">
          <a className="brand" href="#top">
            汉堡
          </a>
          <div className="nav-links">
            <a href="#menu">菜单</a>
            <a href="#story">计划</a>
          </div>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">BURGER INDEX</p>
            <h1 id="site-title">汉堡</h1>
            <p className="lead">把全世界好吃的汉堡，做成一本轻巧、有趣、会动的在线菜单。</p>
            <div className="hero-actions">
              <a className="button button-red" href="#menu">
                看菜单
              </a>
              <a className="button button-light" href="#story">
                了解计划
              </a>
            </div>
          </div>

          <BurgerVisual />
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div>
          <span>CHEESE</span>
          <span>SAUCE</span>
          <span>JUICY</span>
          <span>CRISPY</span>
          <span>CHEESE</span>
          <span>SAUCE</span>
          <span>JUICY</span>
          <span>CRISPY</span>
        </div>
      </div>

      <section className="menu-strip" id="menu" aria-label="汉堡菜单">
        {menuItems.map((item, index) => (
          <article className="menu-card" key={item.name}>
            <p>NO. {String(index + 1).padStart(2, '0')}</p>
            <h2>{item.name}</h2>
            <span>{item.note}</span>
          </article>
        ))}
      </section>

      <section className="story" id="story">
        <p>COMING SOON</p>
        <h2>不是草稿菜单，是一个慢慢长大的汉堡图鉴。</h2>
      </section>
    </main>
  )
}
