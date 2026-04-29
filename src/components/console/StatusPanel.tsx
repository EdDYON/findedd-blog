'use client'

import { useEffect, useState } from 'react'
import { SystemLog } from '@/components/system/SystemLog'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { useVoidStore } from '@/store/useVoidStore'

export function StatusPanel() {
  const performanceMode = useVoidStore(state => state.performanceMode)
  const permissionLevel = useVoidStore(state => state.permissionLevel)
  const redAlert = useVoidStore(state => state.redAlert)
  const [visitorId, setVisitorId] = useState('VIS-0000')
  const modeLabel = performanceMode === 'high' ? '完整' : '轻量'

  useEffect(() => {
    queueMicrotask(() => {
      const existing = window.localStorage.getItem('void:visitor-id')
      if (existing) {
        setVisitorId(existing)
        return
      }
      const next = `VIS-${Math.random().toString(16).slice(2, 6).toUpperCase()}`
      window.localStorage.setItem('void:visitor-id', next)
      setVisitorId(next)
    })
  }, [])

  const rows = [
    ['访客编号', visitorId],
    ['节点状态', redAlert ? '红色警戒' : '在线'],
    ['权限等级', permissionLevel],
    ['运行模式', modeLabel],
  ]

  return (
    <GlassPanel intense className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-black tracking-[0.28em] text-cyan-200">状态</h2>
        <span className={redAlert ? 'h-2 w-2 rounded-full bg-red-300 shadow-[0_0_18px_rgba(251,44,54,0.9)]' : 'h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]'} />
      </div>
      <div className="grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="border border-white/[0.07] bg-black/25 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
            <p className="mt-1 font-mono text-sm font-bold text-zinc-100">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <SystemLog />
      </div>
    </GlassPanel>
  )
}
