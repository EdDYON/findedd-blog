'use client'

import type { Wish } from '@/lib/letter-store'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { wishCategories, wishCategoryLabel, type WishCategory } from '@/lib/letter-copy'

type WishDrawerCardProps = {
  wish: Wish | null
}

export function WishDrawerCard({ wish }: WishDrawerCardProps) {
  const router = useRouter()
  const [category, setCategory] = useState<WishCategory>('todo')
  const [content, setContent] = useState('')
  const [toast, setToast] = useState('')
  const [saving, setSaving] = useState(false)
  const placeholder = useMemo(() => wishCategories.find(item => item.value === category)?.placeholder ?? '写下一个很小的愿望。', [category])

  async function saveWish() {
    setSaving(true)
    setToast('')

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, content }),
      })
      const data = await response.json().catch(() => ({})) as { message?: string }

      if (!response.ok)
        throw new Error(data.message ?? '这个小愿望暂时没有放进去。')

      setContent('')
      setToast('这个小愿望已经放进抽屉。')
      router.refresh()
    }
    catch (error) {
      setToast(error instanceof Error ? error.message : '这个小愿望暂时没有放进去。')
    }
    finally {
      setSaving(false)
    }
  }

  return (
    <section className="letter-card">
      <div className="letter-card-head">
        <p className="letter-card-title">愿望小抽屉</p>
        <span>WISH</span>
      </div>
      {wish
        ? (
            <div className="letter-wish-preview">
              <span>{wishCategoryLabel(wish.category)}</span>
              <p>{wish.content}</p>
              <small>下次见面，也许可以一起做这个。</small>
            </div>
          )
        : <p className="letter-empty">抽屉里还没有小愿望。</p>}

      <div className="letter-chip-row">
        {wishCategories.map(item => (
          <button
            key={item.value}
            type="button"
            className={category === item.value ? 'letter-mini-chip letter-mini-chip-active' : 'letter-mini-chip'}
            onClick={() => setCategory(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <textarea
        className="letter-textarea letter-textarea-small"
        value={content}
        onChange={event => setContent(event.target.value)}
        placeholder={placeholder}
        maxLength={240}
      />
      <button className="letter-secondary-button" type="button" onClick={() => void saveWish()} disabled={saving}>
        {saving ? '正在更新像素小信箱...' : '放进小抽屉'}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="letter-toast"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            onAnimationComplete={() => window.setTimeout(() => setToast(''), 2600)}
          >
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
