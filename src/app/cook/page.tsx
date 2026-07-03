import type { Metadata } from 'next'
import Link from 'next/link'
import BurgerKitchen from './BurgerKitchen'
import './hybrid-burger.css'

export const metadata: Metadata = {
  title: '汉堡厨房｜find burger',
  description: '打开冰箱，挑选食材，在操作台上叠出属于你的汉堡。',
}

export default function CookPage() {
  return (
    <main className="cook-shell cook-workbench-shell">
      <div className="grain" aria-hidden="true" />

      <nav className="cook-topbar workbench-topbar" aria-label="厨房导航">
        <Link className="brand" href="/">
          Find Burger
        </Link>
        <div className="nav-links">
          <span>OPEN KITCHEN</span>
          <Link href="/">离开厨房</Link>
        </div>
      </nav>

      <BurgerKitchen />
    </main>
  )
}
