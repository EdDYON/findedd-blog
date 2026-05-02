import type { ReactNode } from 'react'

type MobileShellProps = {
  children: ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  return (
    <main className="secret-page">
      <div className="secret-shell">
        {children}
      </div>
    </main>
  )
}
