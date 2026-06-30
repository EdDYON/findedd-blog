const menuItems = ['经典牛肉', '芝士爆浆', '辣鸡腿', '双层肉饼']

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="site-title">
        <div className="noise" aria-hidden="true" />
        <div className="blob blob-red" aria-hidden="true" />
        <div className="blob blob-yellow" aria-hidden="true" />

        <nav className="topbar" aria-label="主导航">
          <a className="brand" href="#top">
            汉堡
          </a>
          <a className="order-link" href="#menu">
            看菜单
          </a>
        </nav>

        <div className="hero-content" id="top">
          <p className="eyebrow">ONLINE BURGER DEX</p>
          <h1 id="site-title">汉堡</h1>
          <p className="lead">一个会动、会馋人、会慢慢长大的汉堡图鉴。</p>

          <div className="hero-actions">
            <a className="button button-red" href="#menu">
              开吃
            </a>
            <a className="button button-cream" href="#story">
              这是什么
            </a>
          </div>
        </div>

        <div className="burger-hero" aria-label="动画汉堡">
          <span className="bun bun-top">
            <i />
            <i />
            <i />
          </span>
          <span className="tomato" />
          <span className="cheese" />
          <span className="patty" />
          <span className="lettuce" />
          <span className="bun bun-bottom" />
        </div>

        <div className="ticker" aria-hidden="true">
          <div>
            <span>CHEESE</span>
            <span>JUICY</span>
            <span>CRISPY</span>
            <span>SAUCE</span>
            <span>CHEESE</span>
            <span>JUICY</span>
            <span>CRISPY</span>
            <span>SAUCE</span>
          </div>
        </div>
      </section>

      <section className="menu-strip" id="menu" aria-label="汉堡菜单">
        {menuItems.map((item, index) => (
          <article className="menu-card" key={item}>
            <p>NO. {String(index + 1).padStart(2, '0')}</p>
            <h2>{item}</h2>
            <span>加入图鉴</span>
          </article>
        ))}
      </section>

      <section className="story" id="story">
        <p>不是普通博客。</p>
        <h2>这里以后只认真研究一件事：汉堡。</h2>
      </section>
    </main>
  )
}
