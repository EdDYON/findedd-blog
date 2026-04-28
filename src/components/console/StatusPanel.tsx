'use client'

import { useEffect, useState } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { useVoidStore } from '@/store/useVoidStore'

export function StatusPanel() {
  const performanceMode = useVoidStore(state => state.performanceMode)
  const [visitorId, setVisitorId] = useState('VIS-0000')

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
    ['VISITOR ID', visitorId],
    ['NODE', 'ONLINE'],
    ['RISK', 'UNKNOWN'],
    ['MODE', performanceMode.toUpperCase()],
  ]

  return (
    <GlassPanel intense className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">Status</h2>
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
      </div>
      <div className="grid gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="border border-white/[0.07] bg-black/25 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
            <p className="mt-1 font-mono text-sm font-bold text-zinc-100">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 h-24 overflow-hidden border border-cyan-300/15 bg-cyan-300/[0.025] p-3 font-mono text-[10px] uppercase leading-5 text-cyan-100/55">
        <p>&gt; signal carrier stable</p>
        <p>&gt; anomaly surface detected</p>
        <p>&gt; observer heartbeat synced</p>
        <p>&gt; terminal bridge sleeping</p>
      </div>
    </GlassPanel>
  )
}
