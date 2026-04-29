'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { signalRecords } from '@/data/signals'
import { NeonButton } from '@/components/ui/NeonButton'
import { useVoidStore } from '@/store/useVoidStore'
import { cn } from '@/lib/cn'

const riskLabel = {
  LOW: '低',
  MED: '中',
  HIGH: '高',
  CRITICAL: '临界',
}

export function SignalModule() {
  const [record, setRecord] = useState(signalRecords[0])
  const incrementSignalScan = useVoidStore(state => state.incrementSignalScan)
  const setPermissionLevel = useVoidStore(state => state.setPermissionLevel)
  const frequency = useMemo(() => {
    const index = signalRecords.indexOf(record)
    return (77.03 + Math.max(index, 0) * 1.37).toFixed(2)
  }, [record])

  function scanAgain() {
    const next = signalRecords[Math.floor(Math.random() * signalRecords.length)]
    setRecord(next === record ? signalRecords[(signalRecords.indexOf(next) + 1) % signalRecords.length] : next)
    incrementSignalScan()
    setPermissionLevel('SIGNAL')
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <p className="text-xs font-black tracking-[0.28em] text-cyan-200/70">数据包监听</p>
        <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.07em] text-white">{frequency} MHz</h2>
        <div className="mt-7 grid gap-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-400 sm:grid-cols-2">
          <p>来源：{record.source}</p>
          <p>坐标：{record.coordinate}</p>
          <p>IP：{record.ip}</p>
          <p>延迟：{record.latency}</p>
          <p>协议：{record.protocol}</p>
          <p className={cn(record.risk === 'CRITICAL' || record.risk === 'HIGH' ? 'text-red-200' : 'text-cyan-100')}>
            风险：{riskLabel[record.risk]}
          </p>
        </div>
        <motion.div
          key={record.message}
          initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          className="mt-8 border border-cyan-300/20 bg-cyan-300/[0.045] p-5 text-2xl font-black leading-tight tracking-[0.04em] text-cyan-50 hud-corners"
        >
          {record.message}
          <p className="mt-4 font-mono text-xs tracking-[0.18em] text-zinc-500">TRUST {record.trust} / PACKET CAPTURED</p>
        </motion.div>
        <NeonButton onClick={scanAgain} className="mt-6">
          重新抓包
        </NeonButton>
      </div>
      <div className="relative min-h-[330px] overflow-hidden border border-white/[0.08] bg-black/35 p-5 hud-corners">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_48%)]" />
        <div className="absolute inset-x-5 top-5 z-10 grid gap-1 font-mono text-[10px] tracking-[0.18em] text-cyan-100/60">
          {['PKT_STREAM', 'SYN_ACK', 'PAYLOAD_HASH', 'VOID_ROUTE'].map((label, index) => (
            <span key={label} className={index === 2 ? 'text-red-200/70' : undefined}>
              &gt; {label} :: {((index + 1) * 17 + record.message.length).toString(16).toUpperCase()}
            </span>
          ))}
        </div>
        <div className="relative z-10 flex h-full items-center gap-2 pt-16">
          {Array.from({ length: 44 }).map((_, index) => (
            <span
              key={index}
              className={cn(
                'block flex-1 origin-center shadow-[0_0_18px_rgba(34,211,238,0.6)]',
                index % 9 === 0 ? 'bg-red-300/80' : 'bg-cyan-200/70',
              )}
              style={{
                height: `${12 + ((index * 17 + record.message.length) % 82)}%`,
                animation: `waveform ${0.8 + (index % 7) * 0.12}s ease-in-out infinite`,
                animationDelay: `${index * 0.035}s`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
