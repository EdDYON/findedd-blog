'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Mailbox, PenLine, SmilePlus, UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { PixelDecor } from '@/components/letter/PixelDecor'
import { InteractivePixelCat } from '@/components/pixel/InteractivePixelCat'

const navItems = [
  { href: '/void', label: '首页', hint: 'HOME', icon: Home },
  { href: '/void/letters', label: '信箱', hint: 'LETTERS', icon: Mailbox },
  { href: '/void/write', label: '写信', hint: 'WRITE', icon: PenLine },
  { href: '/void/status', label: '状态', hint: 'STATUS', icon: SmilePlus },
  { href: '/void/settings', label: '我的', hint: 'ME', icon: UserRound },
]

type AppShellProps = {
  children: ReactNode
}

type CatPresence = {
  coPresent: boolean
  moodBubble?: string
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [catPresence, setCatPresence] = useState<CatPresence | null>(null)

  const refreshCatPresence = useCallback(async () => {
    try {
      const response = await fetch('/api/cat-presence')
      const data = await response.json().catch(() => ({})) as {
        ok?: boolean
        coPresent?: boolean
        moodBubble?: string
      }

      if (response.ok && data.ok) {
        setCatPresence({
          coPresent: Boolean(data.coPresent),
          moodBubble: data.moodBubble,
        })
      }
    }
    catch {
      // Presence is decorative, so failures should not interrupt the app.
    }
  }, [])

  useEffect(() => {
    const initial = window.setTimeout(() => {
      void refreshCatPresence()
    }, 0)
    const timer = window.setInterval(() => {
      void refreshCatPresence()
    }, 45_000)

    return () => {
      window.clearTimeout(initial)
      window.clearInterval(timer)
    }
  }, [refreshCatPresence])

  return (
    <main className="letter-page">
      <PixelDecor />
      <InteractivePixelCat presence={catPresence} />
      <motion.div
        className="letter-shell"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <div className="letter-content">
          {children}
        </div>

        <nav className="letter-bottom-nav" aria-label="一封信底部导航">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.href === '/void'
              ? pathname === '/void'
              : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'letter-nav-item letter-nav-item-active' : 'letter-nav-item'}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden />
                <span>{item.label}</span>
                <small>{item.hint}</small>
              </Link>
            )
          })}
        </nav>
      </motion.div>
    </main>
  )
}
