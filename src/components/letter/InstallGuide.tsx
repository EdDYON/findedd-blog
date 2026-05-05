import Link from 'next/link'

const steps = [
  ['1. Safari 打开', ''],
  ['2. 分享按钮', ''],
  ['3. 添加到主屏幕', ''],
  ['4. 添加', ''],
]

export function InstallGuide() {
  return (
    <>
      <div className="letter-list">
        {steps.map(([title, copy]) => (
          <section key={title} className="letter-card">
            <p className="letter-card-title">{title}</p>
            {copy && <p className="letter-soft-copy">{copy}</p>}
          </section>
        ))}
      </div>
      <section className="letter-card">
        <Link className="letter-primary-button" href="/void/settings">我知道啦</Link>
        <Link className="letter-secondary-button" href="/void/settings">返回我的</Link>
      </section>
    </>
  )
}
