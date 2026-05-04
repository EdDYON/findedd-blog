'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, PenLine, ShieldCheck, Sparkles, Wand2, X } from 'lucide-react'
import { PixelCat } from '@/components/pixel/PixelCat'

type CatKind = 'sweet' | 'challenge' | 'comfort' | 'letter' | 'random'

type CatWhisper = {
  kind: CatKind
  title: string
  content: string
  actionLabel: string
  source: 'deepseek' | 'fallback'
}

const actions: Array<{ kind: CatKind, label: string, icon: typeof Sparkles }> = [
  { kind: 'sweet', label: '甜话', icon: Heart },
  { kind: 'challenge', label: '挑战', icon: Wand2 },
  { kind: 'comfort', label: '安全感', icon: ShieldCheck },
  { kind: 'letter', label: '灵感', icon: PenLine },
]

const defaultWhisper: CatWhisper = {
  kind: 'random',
  title: '像素小猫',
  content: '点一点小猫的口袋，抽一张只在这里出现的小纸条。',
  actionLabel: '轻轻点',
  source: 'fallback',
}

export function InteractivePixelCat() {
  const [open, setOpen] = useState(false)
  const [loadingKind, setLoadingKind] = useState<CatKind | null>(null)
  const [whisper, setWhisper] = useState<CatWhisper>(defaultWhisper)

  async function askCat(kind: CatKind) {
    setOpen(true)
    setLoadingKind(kind)

    try {
      const response = await fetch('/api/cat-whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind }),
      })
      const data = await response.json().catch(() => ({})) as {
        whisper?: CatWhisper
      }

      if (!response.ok || !data.whisper)
        throw new Error('failed')

      setWhisper(data.whisper)
    }
    catch {
      setWhisper({
        kind,
        title: '小猫打盹',
        content: '小猫刚刚眯了一下眼。先收下这句：你们的想念正在慢慢送达。',
        actionLabel: '摸摸头',
        source: 'fallback',
      })
    }
    finally {
      setLoadingKind(null)
    }
  }

  return (
    <div className={open ? 'pixel-cat-companion pixel-cat-companion-open' : 'pixel-cat-companion'}>
      <PixelCat
        mode="inside"
        button
        active={open}
        label={open ? '收起像素小猫' : '打开像素小猫'}
        onClick={() => setOpen(value => !value)}
      />

      <section className="pixel-cat-panel" aria-label="像素小猫小信使">
        <div className="pixel-cat-panel-head">
          <div>
            <p>{whisper.title}</p>
            <span>{whisper.source === 'deepseek' ? 'DEEPSEEK' : 'PIXEL'}</span>
          </div>
          <button type="button" aria-label="收起像素小猫" onClick={() => setOpen(false)}>
            <X size={15} aria-hidden />
          </button>
        </div>

        <p className="pixel-cat-message">
          {loadingKind ? '小猫正在翻口袋...' : whisper.content}
        </p>

        <div className="pixel-cat-actions">
          {actions.map((item) => {
            const Icon = item.icon
            const loading = loadingKind === item.kind

            return (
              <button
                key={item.kind}
                type="button"
                disabled={Boolean(loadingKind)}
                onClick={() => void askCat(item.kind)}
              >
                <Icon size={14} aria-hidden />
                {loading ? '...' : item.label}
              </button>
            )
          })}
        </div>

        <div className="pixel-cat-links">
          <Link href="/void/write">写一封信</Link>
          <Link href="/void/status">留个状态</Link>
        </div>
      </section>
    </div>
  )
}
