'use client'

import type { AccessRole } from '@/lib/access'
import type { AssuranceRequest } from '@/lib/letter-store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { assuranceResponses, otherName, personName } from '@/lib/letter-copy'

type AssuranceCardProps = {
  role: AccessRole
  openRequest: AssuranceRequest | null
  latestRequest: AssuranceRequest | null
}

export function AssuranceCard({ role, openRequest, latestRequest }: AssuranceCardProps) {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [busy, setBusy] = useState(false)

  async function requestAssurance() {
    setBusy(true)
    setToast('')

    try {
      const response = await fetch('/api/assurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request' }),
      })

      if (!response.ok)
        throw new Error('failed')

      setToast('这点安全感已经轻轻送出。')
      router.refresh()
    }
    catch {
      setToast('这句话暂时没有送出去。')
    }
    finally {
      setBusy(false)
    }
  }

  async function respond(responseText: string) {
    if (!openRequest)
      return

    setBusy(true)
    setToast('')

    try {
      const response = await fetch('/api/assurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'respond', id: openRequest.id, response: responseText }),
      })

      if (!response.ok)
        throw new Error('failed')

      setToast('这句话已经送到对方那里。')
      router.refresh()
    }
    catch {
      setToast('这句话暂时没有送出去。')
    }
    finally {
      setBusy(false)
    }
  }

  return (
    <section className="letter-card">
      <div className="letter-card-head">
        <p className="letter-card-title">安全感按钮</p>
        <span>SAFE</span>
      </div>

      {openRequest
        ? (
            <>
              <p className="letter-soft-copy">{`${personName[openRequest.requester]}想要一点安全感。`}</p>
              <div className="letter-action-grid">
                {assuranceResponses.map(item => (
                  <button key={item} type="button" onClick={() => void respond(item)} disabled={busy}>
                    {item}
                  </button>
                ))}
              </div>
            </>
          )
        : (
            <>
              <p className="letter-soft-copy">有时候不需要解释很多，只需要一句“我在”。</p>
              {latestRequest?.requester === role && latestRequest.response
                ? <p className="letter-pixel-note">{`${otherName(role)}回应你：${latestRequest.response}`}</p>
                : latestRequest?.requester === role && !latestRequest.response
                  ? <p className="letter-empty">已经送出啦，正在等对方靠近一点。</p>
                  : null}
              <button className="letter-secondary-button" type="button" onClick={() => void requestAssurance()} disabled={busy}>
                给我一点安全感
              </button>
            </>
          )}

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
