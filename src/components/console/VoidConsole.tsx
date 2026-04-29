'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { HudFrame } from '@/components/console/HudFrame'
import { ModuleContent } from '@/components/console/ModuleContent'
import { ModuleSelector } from '@/components/console/ModuleSelector'
import { StatusPanel } from '@/components/console/StatusPanel'
import { HudShake } from '@/components/system/HudShake'
import { SoundToggle } from '@/components/system/SoundToggle'
import { VoidCoreScene } from '@/components/three/VoidCoreScene'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'
import { cn } from '@/lib/cn'

export function VoidConsole() {
  const [time, setTime] = useState('--:--:--')
  const setTerminalOpen = useVoidStore(state => state.setTerminalOpen)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const redAlert = useVoidStore(state => state.redAlert)
  const permissionLevel = useVoidStore(state => state.permissionLevel)

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('zh-CN', { hour12: false }))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98, filter: 'blur(18px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0)' }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="relative z-10 mx-auto min-h-screen w-full max-w-[1760px] px-3 py-4 md:px-6 md:py-7"
    >
      <HudShake>
        <HudFrame>
          <header className={cn('grid gap-4 border-b border-white/10 p-4 md:grid-cols-[1fr_auto] md:p-5', redAlert && 'bg-red-950/10')}>
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.36em] text-cyan-200/70">VOID</p>
              <h1 className="mt-2 text-4xl font-black tracking-[0.08em] text-white md:text-7xl">
                数字异常界面
              </h1>
              <p className="mt-3 max-w-2xl font-mono text-xs tracking-[0.16em] text-zinc-500">
                接入层 / 数据流 / 权限桥 / 黑箱报告
              </p>
            </div>
            <div className="grid gap-2 text-left font-mono text-xs tracking-[0.16em] text-zinc-400 md:text-right">
              <span>{time}</span>
              <span className={redAlert ? 'text-red-200' : 'text-emerald-200'}>信号：{redAlert ? '警戒' : '稳定'}</span>
              <span>权限：{permissionLevel}</span>
              <SoundToggle />
              <button
                type="button"
                onClick={() => {
                  playVoidSound('click', soundEnabled)
                  setTerminalOpen(true)
                }}
                className="border border-cyan-300/30 bg-cyan-300/[0.06] px-3 py-2 text-cyan-100 transition hover:bg-cyan-300/15 hud-corners"
              >
                打开终端
              </button>
            </div>
          </header>

          <div className="grid gap-5 p-4 lg:grid-cols-[270px_minmax(520px,1fr)_280px] xl:grid-cols-[300px_minmax(640px,1fr)_320px]">
            <aside className="order-2 lg:order-1">
              <StatusPanel />
            </aside>

            <section className="order-1 grid gap-4 lg:order-2">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-4 z-10 border border-cyan-300/20 bg-black/40 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-cyan-100/70 backdrop-blur hud-corners">
                  主核心 / 可触碰 / {redAlert ? '红色警戒' : '稳定旋转'}
                </div>
                <VoidCoreScene />
              </div>
              <div className="border border-white/[0.07] bg-white/[0.025] p-3 font-mono text-[10px] tracking-[0.18em] text-zinc-500 hud-corners md:text-xs">
                &gt; 按 ~ 打开终端。试试 /扫描、/追踪、/解密、/突破。
              </div>
            </section>

            <aside className="order-3 grid content-start gap-4">
              <div className="border border-white/[0.08] bg-white/[0.035] p-4 hud-corners">
                <p className="font-mono text-xs font-black tracking-[0.28em] text-violet-200/70">模块</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">少说明，多触发。每个动作都会被 VOID 记录成一条痕迹。</p>
              </div>
              <ModuleSelector />
            </aside>
          </div>

          <div className="border-t border-white/10 p-4 md:p-5">
            <ModuleContent />
          </div>
        </HudFrame>
      </HudShake>
    </motion.section>
  )
}
