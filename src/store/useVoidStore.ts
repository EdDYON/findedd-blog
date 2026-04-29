'use client'

import { create } from 'zustand'
import type { AchievementId, AchievementToast, PerformanceMode, SystemLog, VoidModule } from '@/types/void'

type VoidStore = {
  booted: boolean
  activeModule: VoidModule
  terminalOpen: boolean
  overdrive: boolean
  glitching: boolean
  hudShaking: boolean
  soundEnabled: boolean
  performanceMode: PerformanceMode
  systemLogs: SystemLog[]
  unlockedAchievements: AchievementId[]
  achievementToasts: AchievementToast[]
  signalScanCount: number
  commandCount: number
  gateClickCount: number
  gateOpened: boolean
  gateResultOpen: boolean
  escapeAttemptCount: number
  setBooted: (value: boolean) => void
  setActiveModule: (module: VoidModule) => void
  toggleTerminal: () => void
  setTerminalOpen: (value: boolean) => void
  triggerOverdrive: () => void
  triggerGlitch: (duration?: number) => void
  triggerHudShake: (duration?: number) => void
  addSystemLog: (message: string) => void
  unlockAchievement: (id: AchievementId) => void
  dismissAchievementToast: (id: string) => void
  incrementSignalScan: () => void
  recordCommand: (command: string) => void
  attemptGate: () => void
  closeGateResult: () => void
  incrementEscapeAttempt: () => number
  toggleSound: () => void
  setPerformanceMode: (mode: PerformanceMode) => void
}

let overdriveTimer: ReturnType<typeof setTimeout> | null = null
let glitchTimer: ReturnType<typeof setTimeout> | null = null
let hudShakeTimer: ReturnType<typeof setTimeout> | null = null

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function gateAttemptLabel(value: number) {
  return value.toString().padStart(2, '0')
}

function moduleLabel(module: VoidModule) {
  const labels: Record<VoidModule, string> = {
    archive: '档案',
    signal: '信号',
    lab: '实验',
    gate: '闸门',
  }
  return labels[module]
}

export const useVoidStore = create<VoidStore>((set, get) => ({
  booted: false,
  activeModule: 'archive',
  terminalOpen: false,
  overdrive: false,
  glitching: false,
  hudShaking: false,
  soundEnabled: false,
  performanceMode: 'high',
  systemLogs: [],
  unlockedAchievements: [],
  achievementToasts: [],
  signalScanCount: 0,
  commandCount: 0,
  gateClickCount: 0,
  gateOpened: false,
  gateResultOpen: false,
  escapeAttemptCount: 0,

  setBooted: value => {
    set({ booted: value })
    if (value) {
      get().addSystemLog('访客信号已接入')
      get().unlockAchievement('FIRST_CONTACT')
    }
  },

  setActiveModule: module => {
    const current = get().activeModule
    set({ activeModule: module })
    if (current !== module)
      get().addSystemLog(`模块切换：${moduleLabel(module)}`)
  },

  toggleTerminal: () => {
    const next = !get().terminalOpen
    set({ terminalOpen: next })
    if (next) {
      get().addSystemLog('终端桥已开启')
      get().unlockAchievement('TERMINAL_USER')
    }
  },

  setTerminalOpen: value => {
    const current = get().terminalOpen
    set({ terminalOpen: value })
    if (!current && value) {
      get().addSystemLog('终端桥已开启')
      get().unlockAchievement('TERMINAL_USER')
    }
  },

  triggerOverdrive: () => {
    if (overdriveTimer)
      clearTimeout(overdriveTimer)
    set({ overdrive: true })
    get().triggerHudShake()
    get().addSystemLog('虚空核心过载启动')
    get().unlockAchievement('CORE_TOUCH')
    overdriveTimer = setTimeout(() => set({ overdrive: false }), 3000)
  },

  triggerGlitch: (duration = 900) => {
    if (glitchTimer)
      clearTimeout(glitchTimer)
    set({ glitching: true })
    glitchTimer = setTimeout(() => set({ glitching: false }), duration)
  },

  triggerHudShake: (duration = 560) => {
    if (hudShakeTimer)
      clearTimeout(hudShakeTimer)
    set({ hudShaking: true })
    hudShakeTimer = setTimeout(() => set({ hudShaking: false }), duration)
  },

  addSystemLog: message => {
    const log = {
      id: makeId('log'),
      message,
      timestamp: Date.now(),
    }
    set(state => ({ systemLogs: [...state.systemLogs, log].slice(-32) }))
  },

  unlockAchievement: id => {
    if (get().unlockedAchievements.includes(id))
      return
    const toast = {
      id: makeId('achievement'),
      achievementId: id,
      timestamp: Date.now(),
    }
    set(state => ({
      unlockedAchievements: [...state.unlockedAchievements, id],
      achievementToasts: [...state.achievementToasts, toast].slice(-4),
    }))
  },

  dismissAchievementToast: id => {
    set(state => ({ achievementToasts: state.achievementToasts.filter(toast => toast.id !== id) }))
  },

  incrementSignalScan: () => {
    const next = get().signalScanCount + 1
    set({ signalScanCount: next })
    get().addSystemLog('信号扫描完成')
    if (next >= 5)
      get().unlockAchievement('SIGNAL_HUNTER')
  },

  recordCommand: command => {
    const next = get().commandCount + 1
    set({ commandCount: next })
    get().addSystemLog(`收到终端指令：${command || '[空]'}`)
    if (next >= 5)
      get().unlockAchievement('COMMAND_SEEKER')
  },

  attemptGate: () => {
    const next = Math.min(get().gateClickCount + 1, 3)
    set({ gateClickCount: next })
    get().addSystemLog(`闸门访问尝试 ${gateAttemptLabel(next)}`)

    if (next >= 3 && !get().gateOpened) {
      set({ gateOpened: true, gateResultOpen: true })
      get().addSystemLog('闸门已打开')
      get().triggerGlitch(800)
      get().triggerHudShake(720)
      get().unlockAchievement('GATEBREAKER')
    }
  },

  closeGateResult: () => set({ gateResultOpen: false }),

  incrementEscapeAttempt: () => {
    const next = get().escapeAttemptCount + 1
    set({ escapeAttemptCount: next })
    return next
  },

  toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),

  setPerformanceMode: mode => set({ performanceMode: mode }),
}))
