'use client'

import { Float, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { VoidCore } from '@/components/three/VoidCore'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'
import type { VoidModule } from '@/types/void'

const moduleGlow: Record<VoidModule, string> = {
  archive: 'rgba(34,211,238,0.24)',
  signal: 'rgba(167,139,250,0.26)',
  lab: 'rgba(103,232,249,0.22)',
  gate: 'rgba(251,44,54,0.28)',
}

export function VoidCoreScene() {
  const performanceMode = useVoidStore(state => state.performanceMode)
  const overdrive = useVoidStore(state => state.overdrive)
  const activeModule = useVoidStore(state => state.activeModule)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const triggerOverdrive = useVoidStore(state => state.triggerOverdrive)

  function activateCore() {
    playVoidSound('core', soundEnabled)
    triggerOverdrive()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="触发 VOID 核心过载"
      onClick={activateCore}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          activateCore()
        }
      }}
      className="relative h-[360px] cursor-crosshair overflow-hidden border border-cyan-300/15 bg-black/35 outline-none transition hover:border-cyan-300/40 hud-corners md:h-[640px] xl:h-[700px]"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${moduleGlow[activeModule]}, transparent 38%), radial-gradient(circle at 50% 52%, rgba(139,92,246,0.24), transparent 52%)`,
        }}
      />
      <div className="absolute inset-x-8 top-1/2 h-px bg-cyan-200/20 shadow-[0_0_48px_rgba(34,211,238,0.6)]" />
      <Canvas
        dpr={performanceMode === 'low' ? [1, 1.2] : [1, 1.9]}
        gl={{ antialias: performanceMode === 'high', alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.9]} fov={42} />
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 2, 4]} color="#22d3ee" intensity={overdrive ? 8 : 5.6} />
        <pointLight position={[-4, -2, 3]} color="#8b5cf6" intensity={overdrive ? 7 : 4.8} />
        <pointLight position={[0, 0, 2]} color="#ffffff" intensity={overdrive ? 2.6 : 1.2} />
        <Suspense fallback={null}>
          <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.7}>
            <VoidCore />
          </Float>
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_18px,rgba(255,255,255,0.035)_18px_19px)] opacity-50" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 grid gap-2 font-mono text-[10px] tracking-[0.22em] text-cyan-100/70 md:text-xs">
        <span>{overdrive ? 'VOID 核心 / 过载中 / 异常值上升' : 'VOID 核心 / 旋转稳定 / 异常已封存'}</span>
        <span className="text-violet-100/60">点击核心，触发回应</span>
      </div>
    </div>
  )
}
