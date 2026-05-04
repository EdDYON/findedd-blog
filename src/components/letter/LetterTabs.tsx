'use client'

import type { AccessRole } from '@/lib/access'
import type { Letter } from '@/lib/letter-store'
import { useState } from 'react'
import { LetterList } from '@/components/letter/LetterList'

type LetterTabsProps = {
  role: AccessRole
  letters: Letter[]
  nowIso: string
}

export function LetterTabs({ role, letters, nowIso }: LetterTabsProps) {
  const [tab, setTab] = useState<'received' | 'sent'>('received')

  return (
    <>
      <div className="letter-tabs" role="tablist" aria-label="信箱分类">
        <button
          type="button"
          className={tab === 'received' ? 'letter-tab-active' : ''}
          onClick={() => setTab('received')}
        >
          收到的
        </button>
        <button
          type="button"
          className={tab === 'sent' ? 'letter-tab-active' : ''}
          onClick={() => setTab('sent')}
        >
          寄出的
        </button>
      </div>
      <LetterList role={role} letters={letters} mode={tab} nowIso={nowIso} />
    </>
  )
}
