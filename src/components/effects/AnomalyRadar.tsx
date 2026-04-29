'use client'

import { useVoidStore } from '@/store/useVoidStore'
import { cn } from '@/lib/cn'

const moduleLabel = {
  archive: '档案',
  signal: '信号',
  lab: '实验',
  gate: '闸门',
}

export function AnomalyRadar() {
  const activeModule = useVoidStore(state => state.activeModule)
  const unlockedAchievements = useVoidStore(state => state.unlockedAchievements)
  const gateOpened = useVoidStore(state => state.gateOpened)
  const redAlert = useVoidStore(state => state.redAlert)
  const permissionLevel = useVoidStore(state => state.permissionLevel)

  return (
    <aside
      className={cn(
        'pointer-events-none fixed bottom-4 right-4 z-[60] hidden w-48 border bg-black/50 p-3 backdrop-blur-xl hud-corners md:block',
        redAlert
          ? 'border-red-400/35 shadow-[0_0_46px_rgba(251,44,54,0.24)]'
          : 'border-cyan-300/20 shadow-[0_0_40px_rgba(34,211,238,0.15)]',
      )}
    >
      <div className={cn('mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em]', redAlert ? 'text-red-100' : 'text-cyan-100/70')}>
        <span>异常雷达</span>
        <span>{redAlert ? '危险' : gateOpened ? '红门' : '巡航'}</span>
      </div>
      <div className={cn('radar-dial relative mx-auto size-32 overflow-hidden rounded-full border bg-cyan-300/[0.035]', redAlert ? 'border-red-200/30 radar-danger' : 'border-cyan-200/25')}>
        <span className={cn('absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full', redAlert ? 'bg-red-100 shadow-[0_0_18px_rgba(251,44,54,0.9)]' : 'bg-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.9)]')} />
        <span className={cn('radar-sweep absolute left-1/2 top-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t', redAlert ? 'from-red-200/0 via-red-200/80 to-red-100' : 'from-cyan-200/0 via-cyan-200/80 to-cyan-100')} />
        <span className="radar-dot absolute left-[28%] top-[34%]" />
        <span className="radar-dot absolute left-[68%] top-[56%]" />
        {(gateOpened || redAlert) && <span className="radar-dot radar-dot-red absolute left-[54%] top-[22%]" />}
      </div>
      <div className="mt-3 grid gap-1 font-mono text-[10px] tracking-[0.14em] text-zinc-500">
        <span>区域：{moduleLabel[activeModule]}</span>
        <span>权限：{permissionLevel}</span>
        <span>成就：{unlockedAchievements.length}/17</span>
      </div>
    </aside>
  )
}
