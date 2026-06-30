const burgerCards = [
  {
    id: '001',
    name: '经典芝士堡',
    tag: 'CHEESE CORE',
    region: '美式快餐原点',
    flavor: '奶香 / 牛肉 / 酸黄瓜',
    rarity: '常见但永恒',
  },
  {
    id: '017',
    name: '双层猛兽堡',
    tag: 'DOUBLE STACK',
    region: '深夜档案',
    flavor: '焦香 / 油脂 / 黑胡椒',
    rarity: '高能量样本',
  },
  {
    id: '032',
    name: '辣酱鸡腿堡',
    tag: 'HOT SIGNAL',
    region: '街角补给站',
    flavor: '辣 / 脆 / 蜂蜜回甘',
    rarity: '危险诱惑',
  },
]

const anatomy = ['芝麻面包', '招牌酱', '融化芝士', '厚切肉饼', '酸黄瓜', '烘烤底胚']

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="site-title">
        <div className="grain" aria-hidden="true" />
        <nav className="topbar" aria-label="主导航">
          <a className="brand" href="#top" aria-label="汉堡首页">
            汉堡
          </a>
          <div className="nav-links">
            <a href="#dex">图鉴</a>
            <a href="#anatomy">拆解</a>
            <a href="#mission">计划</a>
          </div>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">BURGER ARCHIVE / ONLINE DEX</p>
            <h1 id="site-title">汉堡</h1>
            <p className="lead">
              这里将会是一座在线汉堡大全图鉴：记录每一种面包、酱汁、肉饼、芝士和奇怪但迷人的搭配。
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#dex">
                进入图鉴
              </a>
              <a className="button ghost" href="#anatomy">
                拆开看看
              </a>
            </div>
          </div>

          <div className="burger-stage" aria-label="一个由 CSS 绘制的汉堡图形">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="burger">
              <span className="bun top">
                <i />
                <i />
                <i />
              </span>
              <span className="sauce" />
              <span className="cheese" />
              <span className="patty" />
              <span className="lettuce" />
              <span className="bun bottom" />
            </div>
            <p className="stamp">NO.000 / READY TO COLLECT</p>
          </div>
        </div>
      </section>

      <section className="section dex-section" id="dex">
        <div className="section-heading">
          <p className="eyebrow">DEX PREVIEW</p>
          <h2>第一批档案样本</h2>
          <p>先放三枚占位汉堡。后面可以继续扩成真正的汉堡数据库、评分、筛选和详情页。</p>
        </div>

        <div className="card-grid">
          {burgerCards.map((burger) => (
            <article className="burger-card" key={burger.id}>
              <div className="card-number">#{burger.id}</div>
              <div className="mini-burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>{burger.tag}</p>
              <h3>{burger.name}</h3>
              <dl>
                <div>
                  <dt>产地</dt>
                  <dd>{burger.region}</dd>
                </div>
                <div>
                  <dt>风味</dt>
                  <dd>{burger.flavor}</dd>
                </div>
                <div>
                  <dt>稀有度</dt>
                  <dd>{burger.rarity}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="section anatomy-section" id="anatomy">
        <div className="comic-panel">
          <p className="eyebrow">ANATOMY</p>
          <h2>把汉堡拆成一页漫画</h2>
          <p>
            每个汉堡未来都会有自己的分层图、口味雷达、故事来源和推荐搭配。不是菜单，是一本能吃的百科。
          </p>
        </div>

        <ol className="anatomy-list" aria-label="汉堡结构层">
          {anatomy.map((item, index) => (
            <li key={item} style={{ '--delay': `${index * 80}ms` } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ol>
      </section>

      <section className="section mission" id="mission">
        <p className="eyebrow">NEXT QUEST</p>
        <h2>下一步：把它变成真正的汉堡大全</h2>
        <p>
          现在先让旧站下线，换成「汉堡」的第一版入口。随后可以继续加入搜索、分类、汉堡详情页、地图和收藏系统。
        </p>
      </section>
    </main>
  )
}
