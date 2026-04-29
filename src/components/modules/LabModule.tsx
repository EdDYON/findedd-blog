'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { NeonButton } from '@/components/ui/NeonButton'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

const fragments = ['A7F2', 'C0DE', '9B11', 'VOID', '3E7A', 'ROOT', 'NULL', 'ECHO']

function makeHash(seed: number) {
  return Array.from({ length: 4 }, (_, index) => fragments[(seed + index * 3) % fragments.length]).join('-')
}

function makeNoise(seed: number) {
  return Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 24 }, (_, col) => fragments[(seed + row * 5 + col) % fragments.length][col % 4]).join(''),
  )
}

export function LabModule() {
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)
  const triggerSplitGlitch = useVoidStore(state => state.triggerSplitGlitch)
  const triggerOverdrive = useVoidStore(state => state.triggerOverdrive)
  const triggerDecryptOverlay = useVoidStore(state => state.triggerDecryptOverlay)
  const addSystemLog = useVoidStore(state => state.addSystemLog)
  const setPermissionLevel = useVoidStore(state => state.setPermissionLevel)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const [burst, setBurst] = useState(0)
  const [output, setOutput] = useState<string[]>(['等待实验输入。', '所有破解器玩具都只在 VOID 沙箱内模拟。'])

  function triggerBurst() {
    setBurst(value => value + 1)
    addSystemLog('粒子爆发已释放')
    setOutput(['PARTICLE_BURST :: OK', `HASH_FRAGMENT :: ${makeHash(burst + 2)}`])
  }

  function distortField() {
    triggerGlitch()
    addSystemLog('异常场发生扰动')
    setOutput(makeNoise(burst + 1))
  }

  function overdriveCore() {
    playVoidSound('core', soundEnabled)
    triggerOverdrive()
    setOutput(['CORE_OVERDRIVE :: ACTIVE', 'ANOMALY_RISING :: 73%', 'COOL DOWN :: 3s'])
  }

  function decryptToy() {
    triggerDecryptOverlay('破解器回显：真正的钥匙不在门上，在你点开的路径里。')
    addSystemLog('破解器玩具完成一次解码')
    setPermissionLevel('SIGNAL')
    setOutput(['DECRYPT_TOY :: ACCEPTED', 'KEY_FRAGMENT :: SIG-7A-VOID', 'MESSAGE :: 正在显示到覆盖层'])
  }

  function reportToy() {
    triggerSplitGlitch(900)
    addSystemLog('伪漏洞报告生成')
    setPermissionLevel('OPERATOR')
    setOutput([
      'FAKE_VULN_REPORT :: VOID-2026-0429',
      'SEVERITY :: THEATRICAL',
      'VECTOR :: CURSOR_CONTACT',
      'PATCH :: KEEP EXPLORING',
    ])
  }

  return (
    <section className="relative overflow-hidden">
      <div className="mb-6">
        <p className="text-xs font-black tracking-[0.28em] text-violet-200/70">破解器实验舱</p>
        <h2 className="mt-2 text-3xl font-black tracking-[0.04em] text-white">沙箱内的危险玩具</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <NeonButton onClick={distortField}>乱码注入</NeonButton>
        <NeonButton onClick={triggerBurst}>Hash 碎片</NeonButton>
        <NeonButton onClick={decryptToy}>伪解密</NeonButton>
        <NeonButton onClick={reportToy}>漏洞报告</NeonButton>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <NeonButton variant="ghost" onClick={overdriveCore}>核心过载</NeonButton>
        <NeonButton variant="ghost" onClick={triggerBurst}>光粒爆发</NeonButton>
      </div>
      <div className="relative mt-7 min-h-[300px] overflow-hidden border border-white/[0.08] bg-black/35 hud-corners">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.22),transparent_42%)]" />
        {Array.from({ length: 26 }).map((_, index) => (
          <motion.span
            key={`${burst}-${index}`}
            initial={{ opacity: 0, x: '50%', y: '50%', scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              x: `${50 + Math.cos(index) * (20 + (index % 6) * 8)}%`,
              y: `${50 + Math.sin(index * 1.8) * (20 + (index % 5) * 9)}%`,
              scale: [0, 1.2, 0.2],
            }}
            transition={{ duration: 0.9, delay: index * 0.012 }}
            className="absolute size-3 rounded-full bg-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.9)]"
          />
        ))}
        <div className="relative z-10 grid h-full place-items-center p-8">
          <div className="w-full max-w-3xl border border-cyan-300/15 bg-black/45 p-5 font-mono text-xs leading-6 tracking-[0.14em] text-zinc-300 hud-corners">
            <p className="mb-3 text-[10px] font-black tracking-[0.28em] text-cyan-200/70">CURRENT OUTPUT</p>
            {output.map(line => (
              <p key={line} className={line.includes('VOID') || line.includes('FAKE') ? 'text-red-100' : undefined}>
                &gt; {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
