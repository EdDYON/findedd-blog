'use client'

import { useVoidStore } from '@/store/useVoidStore'

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

  return (
    <aside className="pointer-events-none fixed bottom-4 right-4 z-[60] hidden w-44 border border-cyan-300/20 bg-black/50 p-3 shadow-[0_0_40px_rgba(34,211,238,0.15)] backdrop-blur-xl hud-corners md:block">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-cyan-100/70">
        <span>异常雷达</span>
        <span>{gateOpened ? '红门' : '巡航'}</span>
      </div>
      <div className="radar-dial relative mx-auto size-32 overflow-hidden rounded-full border border-cyan-200/25 bg-cyan-300/[0.035]">
        <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
        <span className="radar-sweep absolute left-1/2 top-1/2 h-1/2 w-px origin-bottom bg-gradient-to-t from-cyan-200/0 via-cyan-200/80 to-cyan-100" />
        <span className="radar-dot absolute left-[28%] top-[34%]" />
        <span className="radar-dot absolute left-[68%] top-[56%]" />
        {gateOpened && <span className="radar-dot radar-dot-red absolute left-[54%] top-[22%]" />}
      </div>
      <div className="mt-3 grid gap-1 font-mono text-[10px] tracking-[0.14em] text-zinc-500">
        <span>区域：{moduleLabel[activeModule]}</span>
        <span>成就：{unlockedAchievements.length}/12</span>
      </div>
    </aside>
  )
}
