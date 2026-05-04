import type { StampCollectionItem } from '@/lib/letter-store'

type StampCollectionProps = {
  stamps: StampCollectionItem[]
}

export function StampCollection({ stamps }: StampCollectionProps) {
  return (
    <section className="letter-card">
      <div className="letter-card-head">
        <p className="letter-card-title">像素邮票</p>
        <span>STAMP</span>
      </div>
      <p className="letter-soft-copy">不是成就，只是慢慢攒下来的痕迹。</p>
      <div className="letter-stamp-grid">
        {stamps.map(stamp => (
          <div key={stamp.type} className={stamp.unlocked ? 'letter-stamp letter-stamp-on' : 'letter-stamp'}>
            <span>{stamp.unlocked ? stamp.label : '未解锁'}</span>
            <small>{stamp.unlocked ? `${stamp.count} 封` : stamp.locked}</small>
          </div>
        ))}
      </div>
    </section>
  )
}
