import { notFound } from 'next/navigation'
import { LetterDetailClient } from '@/components/letter/LetterDetailClient'
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

  return (
    <LetterDetailClient
      letter={letter}
      reactions={reactions}
      sessionRole={session.role}
    />
  )
}
