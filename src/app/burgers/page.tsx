import type { Metadata } from 'next'
import BurgerArchive from './BurgerArchive'
import './burger-archive.css'

export const metadata: Metadata = {
  title: '汉堡档案馆',
  description: '从世界各地收集汉堡风味、配料层次与搭配逻辑。',
  alternates: {
    canonical: '/burgers',
  },
}

export default function BurgersPage() {
  return <BurgerArchive />
}

