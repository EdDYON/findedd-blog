import type { Metadata } from 'next'
import Link from 'next/link'
import BurgerKitchen from './BurgerKitchen'

export const metadata: Metadata = {
  title: '汉堡厨房｜汉堡',
  description: '选择汉堡胚、酱料和食材，实时组装属于你的汉堡。',
}

export default function CookPage() {
  return (
    <main className="cook-shell">
      <div className="grain" aria-hidden="true" />

      <nav className="cook-topbar" aria-label="厨房导航">
        <Link className="brand" href="/">
          汉堡
        </Link>
        <div className="nav-links">
          <Link href="/">首页</Link>
          <a href="#recipes">配方</a>
          <a href="#basket">食材</a>
        </div>
      </nav>

      <section className="cook-hero">
        <p className="eyebrow">BURGER COOKBOOK</p>
        <h1>汉堡厨房</h1>
        <p>
          像整理冰箱一样选择你手上的材料：汉堡胚可以有，也可以没有；酱料、肉饼、蔬菜和加料会自动拼出可做的汉堡。
        </p>
      </section>

      <BurgerKitchen />
    </main>
  )
}
