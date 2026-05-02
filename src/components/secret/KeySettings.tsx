'use client'

type KeySettingsProps = {
  role: 'her' | 'owner'
}

export function KeySettings({ role }: KeySettingsProps) {
  if (role !== 'owner')
    return null

  return (
    <section className="secret-card secret-mini-card">
      <p className="secret-card-title">维护模式</p>
      <p className="secret-card-copy">
        当前是主人密钥入口。改密钥时运行脚本生成 hash，然后更新 .env.local 或 Vercel 环境变量。
      </p>
      <div className="secret-code-block">
        node scripts/hash-key.mjs
      </div>
      <div className="secret-code-block">
        OWNER_KEY_HASH=...
        <br />
        HER_KEY_HASH=...
        <br />
        ACCESS_COOKIE_SECRET=...
      </div>
      <div className="secret-danger-button secret-status-pill">
        网页改密钥需要接入 KV
      </div>
    </section>
  )
}
