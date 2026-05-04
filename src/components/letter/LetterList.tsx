import type { AccessRole } from '@/lib/access'
import type { Letter } from '@/lib/letter-store'
import Link from 'next/link'
import { formatDateTime, letterTypeLabel, personName, previewText } from '@/lib/letter-copy'

type LetterListProps = {
  role: AccessRole
  letters: Letter[]
  mode: 'received' | 'sent'
  nowIso: string
}

function groupLabel(letter: Letter, locked: boolean) {
  if (locked)
    return '未来的信'

  if (!letter.readAt)
    return '未读'

  const created = new Date(letter.createdAt)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000
  const time = created.getTime()

  if (time >= startOfToday)
    return '今天'

  if (time >= startOfYesterday)
    return '昨天'

  return '更早'
}

export function LetterList({ role, letters, mode, nowIso }: LetterListProps) {
  const relevant = letters.filter(letter => mode === 'received' ? letter.receiver === role : letter.sender === role)
  const groups = new Map<string, Letter[]>()

  for (const letter of relevant) {
    const locked = letter.deliverAt > nowIso
    const label = groupLabel(letter, locked)
    groups.set(label, [...(groups.get(label) ?? []), letter])
  }

  if (relevant.length === 0) {
    return (
      <section className="letter-card letter-empty-card">
        <p className="letter-card-title">{mode === 'received' ? '这里还没有收到的信。' : '你还没有寄出过信。'}</p>
        <p className="letter-soft-copy">{mode === 'received' ? '但也许很快，就会有一封落进来。' : '要不要写第一封？'}</p>
        <Link className="letter-primary-button" href="/void/write">{mode === 'received' ? '写第一封信' : '去写信'}</Link>
      </section>
    )
  }

  return (
    <div className="letter-list">
      {Array.from(groups.entries()).map(([label, items]) => (
        <section key={label} className="letter-list-group">
          <h2>{label}</h2>
          {items.map((letter) => {
            const locked = letter.deliverAt > nowIso
            const opened = Boolean(letter.readAt)
            const href = locked && mode === 'received' ? '/void/letters' : `/void/letters/${letter.id}`

            return (
              <Link key={letter.id} className="letter-row-card" href={href}>
                <div className="letter-card-head">
                  <p className="letter-card-title">
                    {mode === 'received' ? `来自 ${personName[letter.sender]}` : `寄给 ${personName[letter.receiver]}`}
                  </p>
                  <span>{locked ? '等待送达' : opened ? '已打开' : 'NEW'}</span>
                </div>
                <p className="letter-type-pill">{letterTypeLabel(letter.type)}</p>
                {locked
                  ? (
                      <>
                        <p className="letter-empty">这封信还没到打开的时候。</p>
                        <p className="letter-soft-copy">{mode === 'sent' ? `这封信会在 ${formatDateTime(letter.deliverAt)} 送达。` : '它还在路上，时间到了才会送达。'}</p>
                      </>
                    )
                  : (
                      <>
                        <p className="letter-preview">{`「${previewText(letter.content, 58)}」`}</p>
                        <p className="letter-soft-copy">
                          {mode === 'sent'
                            ? opened ? '对方已经打开了这封信。' : '信已经送到，还没有被打开。'
                            : opened ? '已打开' : '有一封新信在等你。'}
                        </p>
                      </>
                    )}
                <p className="letter-meta">{formatDateTime(letter.createdAt)}</p>
              </Link>
            )
          })}
        </section>
      ))}
    </div>
  )
}
