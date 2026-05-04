'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type LetterReadButtonProps = {
  id: string
}

export function LetterReadButton({ id }: LetterReadButtonProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function markRead() {
    setSaving(true)
    await fetch(`/api/letters/${id}/read`, { method: 'POST' })
    setSaving(false)
    router.refresh()
  }

  return (
    <button className="letter-primary-button" type="button" onClick={() => void markRead()} disabled={saving}>
      {saving ? '正在更新像素小信箱...' : '我看完了'}
    </button>
  )
}
