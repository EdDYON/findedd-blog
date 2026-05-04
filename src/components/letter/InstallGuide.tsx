import Link from 'next/link'

const steps = [
  ['1. 用 Safari 打开这个页面', '请确认不是从微信或其他浏览器里打开。'],
  ['2. 点击底部的分享按钮', '它看起来像一个向上的小箭头。'],
  ['3. 选择“添加到主屏幕”', '如果没有看到，可以在菜单里往下找一找。'],
  ['4. 点击“添加”', '之后桌面上就会出现一封信。'],
]

export function InstallGuide() {
  return (
    <>
      <div className="letter-list">
        {steps.map(([title, copy]) => (
          <section key={title} className="letter-card">
            <p className="letter-card-title">{title}</p>
            <p className="letter-soft-copy">{copy}</p>
          </section>
        ))}
      </div>
      <section className="letter-card">
        <p className="letter-soft-copy">以后点开桌面图标，就能直接打开一封信。</p>
        <Link className="letter-primary-button" href="/void/settings">我知道啦</Link>
        <Link className="letter-secondary-button" href="/void/settings">返回我的</Link>
      </section>
    </>
  )
}
