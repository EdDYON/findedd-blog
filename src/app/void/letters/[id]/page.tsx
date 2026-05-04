import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LetterReactionBar } from '@/components/letter/LetterReactionBar'
import { LetterReadButton } from '@/components/letter/LetterReadButton'
import { PageHeader } from '@/components/letter/PageHeader'
import { formatFullDateTime, letterTypeLabel, personName } from '@/lib/letter-copy'
import { getLetterFor, listLetterReactions } from '@/lib/letter-store'
import { requirePageSession } from '@/lib/server-auth'

export default async function LetterDetailPage(
  context: { params: Promise<{ id: string }> },
) {
  const session = await requirePageSession()
  const { id } = await context.params
  const letter = await getLetterFor(session.role, id)

  if (!letter)
    notFound()

  const reactions = await listLetterReactions(letter.id)
  const locked = letter.deliverAt > new Date().toISOString()
  const contentHidden = letter.readOnce && letter.receiver === session.role && Boolean(letter.readAt)
  const canMarkRead = letter.receiver === session.role && !letter.readAt && !locked
  const canReact = letter.receiver === session.role && !locked && !contentHidden

  return (
    <>
      <PageHeader eyebrow="LETTER" title="一封信" />
      <article className="letter-card letter-detail-card">
        <div className="letter-detail-meta">
          <p>{`来自：${personName[letter.sender]}`}</p>
          <p>{`寄给：${personName[letter.receiver]}`}</p>
          <p>{`类型：${letterTypeLabel(letter.type)}`}</p>
          <p>{`时间：${formatFullDateTime(letter.createdAt)}`}</p>
          {letter.readOnce && <p>只显示一次</p>}
        </div>

        {locked
          ? (
              <div className="letter-locked">
                <p className="letter-card-title">这封信还没有到打开的时候。</p>
                <p className="letter-soft-copy">请再等等，它正在慢慢靠近。</p>
              </div>
            )
          : contentHidden
            ? (
                <div className="letter-locked">
                  <p className="letter-card-title">这封信已经被认真读过了。</p>
                  <p className="letter-soft-copy">它没有消失，只是被好好收起来了。</p>
                </div>
              )
            : (
                <div className="letter-body-text">
                  {letter.content.split('\n').map(line => (
                    <p key={line}>{line || '\u00a0'}</p>
                  ))}
                </div>
              )}
      </article>

      {!locked && <LetterReactionBar letterId={letter.id} reactions={reactions} canReact={canReact} />}
      {canMarkRead && <LetterReadButton id={letter.id} />}
      <Link className="letter-secondary-button" href="/void/letters">返回信箱</Link>
    </>
  )
}
