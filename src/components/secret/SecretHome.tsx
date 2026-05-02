'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { CountdownCard } from '@/components/secret/CountdownCard'
import { HugButton } from '@/components/secret/HugButton'
import { KeySettings } from '@/components/secret/KeySettings'
import { MobileShell } from '@/components/secret/MobileShell'
import { PaperNote } from '@/components/secret/PaperNote'

type SecretHomeProps = {
  role: 'her' | 'owner'
}

export function SecretHome({ role }: SecretHomeProps) {
  const router = useRouter()

  async function leave() {
    await fetch('/api/access', { method: 'DELETE' })
    router.replace('/')
  }

  return (
    <MobileShell>
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="secret-card"
      >
        <p className="secret-kicker">{role === 'owner' ? 'owner access' : 'private access'}</p>
        <h1 className="secret-title">欢迎回来</h1>
        <p className="secret-copy">
          门已经合上了。现在这里才开始展示真正的内容。
        </p>
      </motion.section>

      <HugButton />
      <PaperNote />
      <CountdownCard />
      <KeySettings role={role} />

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => void leave()}
        className="secret-secondary-button"
      >
        暂时离开
      </motion.button>
    </MobileShell>
  )
}
