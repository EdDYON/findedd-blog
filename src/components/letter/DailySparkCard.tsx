import type { DailySpark } from '@/lib/daily-spark'
import { Sparkles } from 'lucide-react'

type DailySparkCardProps = {
  spark: DailySpark | null
}

const kindLabel: Record<DailySpark['kind'], string> = {
  challenge: 'CHALLENGE',
  sweet: 'SWEET',
  question: 'QUESTION',
  tiny: 'TINY',
}

export function DailySparkCard({ spark }: DailySparkCardProps) {
  return (
    <section className="letter-card letter-daily-spark">
      <div className="letter-card-head">
        <p className="letter-card-title">{spark?.title ?? '今日小纸条'}</p>
        <span>{spark ? kindLabel[spark.kind] : 'WAIT'}</span>
      </div>
      <p className="letter-soft-copy">
        {spark?.content ?? '今日未刷新。'}
      </p>
      <div className="letter-spark-footer">
        <span>
          <Sparkles size={14} aria-hidden />
          {spark?.actionLabel ?? '晚点再看'}
        </span>
      </div>
    </section>
  )
}
