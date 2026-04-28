'use client'

import { Float, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { VoidCore } from '@/components/three/VoidCore'
import { useVoidStore } from '@/store/useVoidStore'

export function VoidCoreScene() {
  const performanceMode = useVoidStore(state => state.performanceMode)

  return (
    <div className="relative h-[360px] overflow-hidden border border-cyan-300/10 bg-black/35 hud-corners md:h-[520px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_45%)]" />
      <Canvas
        dpr={performanceMode === 'low' ? [1, 1.2] : [1, 1.8]}
        gl={{ antialias: performanceMode === 'high', alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5.8]} fov={45} />
        <ambientLight intensity={0.45} />
        <pointLight position={[3, 2, 4]} color="#22d3ee" intensity={5} />
        <pointLight position={[-4, -2, 3]} color="#8b5cf6" intensity={4} />
        <Suspense fallback={null}>
          <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.7}>
            <VoidCore />
          </Float>
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_18px,rgba(255,255,255,0.035)_18px_19px)] opacity-50" />
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100/55">
        VOID CORE / rotation stable / anomaly sealed
      </div>
    </div>
  )
}
