'use client'

import { useMemo } from 'react'
import { useVoidStore } from '@/store/useVoidStore'
import { cn } from '@/lib/cn'

const baseLogs = [
  'PORT 443 :: HANDSHAKE OK',
  'NODE-07 :: CHECKSUM MATCH',
  'PACKET 0xA17F :: MIRRORED',
  'EDGE CACHE :: BYPASS SIM',
  'VOID_CORE :: HEARTBEAT',
  'AUTH LAYER :: GUEST',
  'ANOMALY PKT :: WATCH',
  'TRACE HOP :: LOCAL_SIGNAL',
  'MEMORY CELL :: SEALED',
  'RED GATE :: DORMANT',
  'HASH FRAG :: 9F2A',
  'SIGNAL BUS :: STABLE',
]

export function EdgeScanner() {
  const redAlert = useVoidStore(state => state.redAlert)
  const permissionLevel = useVoidStore(state => state.permissionLevel)
  const logs = useMemo(
    () => [...baseLogs, `PERMISSION :: ${permissionLevel}`, redAlert ? 'ALERT :: RED MODE ACTIVE' : 'ALERT :: COLD'],
    [permissionLevel, redAlert],
  )

  return (
    <div className="pointer-events-none fixed inset-y-20 left-3 z-[42] hidden w-72 overflow-hidden xl:block">
      <div
        className={cn(
          'edge-scanner-panel h-full border bg-black/35 p-3 font-mono text-[10px] font-black leading-5 tracking-[0.18em] backdrop-blur-xl hud-corners',
          redAlert
            ? 'border-red-400/35 text-red-100 shadow-[0_0_40px_rgba(251,44,54,0.18)]'
            : 'border-cyan-300/20 text-cyan-100/65 shadow-[0_0_40px_rgba(34,211,238,0.12)]',
        )}
      >
        <div className="mb-2 flex justify-between border-b border-white/10 pb-2">
          <span>EDGE SCANNER</span>
          <span>{redAlert ? 'DANGER' : 'LIVE'}</span>
        </div>
        <div className="edge-scanner-track grid gap-1">
          {[...logs, ...logs, ...logs].map((log, index) => (
            <span key={`${log}-${index}`} className={index % 7 === 0 ? 'text-red-200' : undefined}>
              &gt; {log}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
