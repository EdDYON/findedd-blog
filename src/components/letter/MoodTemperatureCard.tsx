import type { DailyStatus } from '@/lib/letter-store'
import { moodTemperatureText } from '@/lib/letter-copy'

type MoodTemperatureCardProps = {
  statuses: DailyStatus[]
  subject: string
}

export function MoodTemperatureCard({ statuses, subject }: MoodTemperatureCardProps) {
  const moods = statuses.map(item => item.mood)

  return (
    <section className="letter-card">
      <div className="letter-card-head">
        <p className="letter-card-title">心情温度计</p>
        <span>TEMP</span>
      </div>
      <div className="letter-temp-bar" aria-label="最近心情温度">
        {Array.from({ length: 7 }).map((_, index) => {
          const mood = statuses[index]?.mood

          return (
            <span key={index} className={mood ? 'letter-temp-on' : ''}>
              {mood ? mood.split(' ').at(-1) : ''}
            </span>
          )
        })}
      </div>
      <p className="letter-soft-copy">{moodTemperatureText(moods, subject)}</p>
    </section>
  )
}
