import Link from 'next/link'
import { PageHeader } from '@/components/letter/PageHeader'
import { requirePageSession } from '@/lib/server-auth'

const items = [
  '收到一封新信',
  '收到一封抱抱信',
  '有一封未来的信可以打开了',
  '距离下一次见面更近了',
]

export default async function NotificationsPage() {
  await requirePageSession()

  return (
    <>
      <PageHeader
        eyebrow="NOTICE"
        title="消息提醒"
        subtitle="有些信，应该被及时看见。"
      />
      <section className="letter-card">
        <p className="letter-card-title">需要先把一封信添加到 iPhone 主屏幕，才能开启提醒。</p>
        <p className="letter-soft-copy">开启后，你可能会收到这些提醒：</p>
        <div className="letter-rule-list">
          {items.map(item => <p key={item}>{item}</p>)}
        </div>
        <Link className="letter-primary-button" href="/void/install">查看安装方法</Link>
        <button className="letter-secondary-button" type="button" disabled>开启提醒</button>
      </section>
    </>
  )
}
