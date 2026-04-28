'use client'

import { create } from 'zustand'
import type { PerformanceMode, VoidModule } from '@/types/void'

type VoidStore = {
  booted: boolean
  activeModule: VoidModule
  terminalOpen: boolean
  overdrive: boolean
  glitching: boolean
  performanceMode: PerformanceMode
  setBooted: (value: boolean) => void
  setActiveModule: (module: VoidModule) => void
  toggleTerminal: () => void
  setTerminalOpen: (value: boolean) => void
  triggerOverdrive: () => void
  triggerGlitch: () => void
  setPerformanceMode: (mode: PerformanceMode) => void
}

let overdriveTimer: ReturnType<typeof setTimeout> | null = null
let glitchTimer: ReturnType<typeof setTimeout> | null = null

export const useVoidStore = create<VoidStore>(set => ({
  booted: false,
  activeModule: 'archive',
  terminalOpen: false,
  overdrive: false,
  glitching: false,
  performanceMode: 'high',
  setBooted: value => set({ booted: value }),
  setActiveModule: module => set({ activeModule: module }),
  toggleTerminal: () => set(state => ({ terminalOpen: !state.terminalOpen })),
  setTerminalOpen: value => set({ terminalOpen: value }),
  triggerOverdrive: () => {
    if (overdriveTimer)
      clearTimeout(overdriveTimer)
    set({ overdrive: true })
    overdriveTimer = setTimeout(() => set({ overdrive: false }), 4200)
  },
  triggerGlitch: () => {
    if (glitchTimer)
      clearTimeout(glitchTimer)
    set({ glitching: true })
    glitchTimer = setTimeout(() => set({ glitching: false }), 900)
  },
  setPerformanceMode: mode => set({ performanceMode: mode }),
}))
