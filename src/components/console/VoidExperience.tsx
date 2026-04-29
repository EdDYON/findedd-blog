'use client'

import { useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { BootScreen } from '@/components/boot/BootScreen'
import { VoidConsole } from '@/components/console/VoidConsole'
import { AnomalyRadar } from '@/components/effects/AnomalyRadar'
import { ClickRipples } from '@/components/effects/ClickRipples'
import { CustomCursor } from '@/components/effects/CustomCursor'
import { DeepSpaceBackground } from '@/components/effects/DeepSpaceBackground'
import { GlitchOverlay } from '@/components/effects/GlitchOverlay'
import { NoiseOverlay } from '@/components/effects/NoiseOverlay'
import { Scanlines } from '@/components/effects/Scanlines'
import { AchievementToast } from '@/components/system/AchievementToast'
import { GateResultOverlay } from '@/components/system/GateResultOverlay'
import { Terminal } from '@/components/terminal/Terminal'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

export function VoidExperience() {
  const booted = useVoidStore(state => state.booted)
  const terminalOpen = useVoidStore(state => state.terminalOpen)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const toggleTerminal = useVoidStore(state => state.toggleTerminal)
  const setPerformanceMode = useVoidStore(state => state.setPerformanceMode)

  useEffect(() => {
    const syncMode = () => setPerformanceMode(window.innerWidth < 768 ? 'low' : 'high')
    syncMode()
    window.addEventListener('resize', syncMode, { passive: true })
    return () => window.removeEventListener('resize', syncMode)
  }, [setPerformanceMode])

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === '`' || event.key === '~') {
        event.preventDefault()
        if (!terminalOpen)
          playVoidSound('terminal', soundEnabled)
        toggleTerminal()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [soundEnabled, terminalOpen, toggleTerminal])

  return (
    <main className="min-h-screen overflow-hidden bg-[#020207] text-zinc-100">
      <DeepSpaceBackground />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.18),transparent_32rem),radial-gradient(circle_at_78%_28%,rgba(34,211,238,0.14),transparent_34rem),radial-gradient(circle_at_50%_90%,rgba(251,44,54,0.11),transparent_28rem)]" />
      <div className="void-grid pointer-events-none fixed inset-0 z-0 opacity-40" />
      <AnimatePresence mode="wait">
        {!booted ? <BootScreen key="boot" /> : <VoidConsole key="console" />}
      </AnimatePresence>
      <Terminal />
      <AchievementToast />
      <GateResultOverlay />
      <AnomalyRadar />
      <CustomCursor />
      <ClickRipples />
      <GlitchOverlay />
      <NoiseOverlay />
      <Scanlines />
    </main>
  )
}
