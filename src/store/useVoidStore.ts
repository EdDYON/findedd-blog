'use client'

import { create } from 'zustand'
import type {
  AchievementId,
  AchievementToast,
  DecryptOverlayState,
  PerformanceMode,
  PermissionLevel,
  SystemLog,
  VoidModule,
} from '@/types/void'

type VoidStore = {
  booted: boolean
  activeModule: VoidModule
  terminalOpen: boolean
  overdrive: boolean
  glitching: boolean
  splitGlitching: boolean
  hudShaking: boolean
  redAlert: boolean
  soundEnabled: boolean
  performanceMode: PerformanceMode
  permissionLevel: PermissionLevel
  systemLogs: SystemLog[]
  unlockedAchievements: AchievementId[]
  achievementToasts: AchievementToast[]
  signalScanCount: number
  commandCount: number
  gateClickCount: number
  gateOpened: boolean
  gateResultOpen: boolean
  escapeAttemptCount: number
  decryptOverlay: DecryptOverlayState | null
  setBooted: (value: boolean) => void
  setActiveModule: (module: VoidModule) => void
  toggleTerminal: () => void
  setTerminalOpen: (value: boolean) => void
  triggerOverdrive: () => void
  triggerGlitch: (duration?: number) => void
  triggerSplitGlitch: (duration?: number) => void
  triggerHudShake: (duration?: number) => void
  triggerRedAlert: (duration?: number) => void
  clearRedAlert: () => void
  setPermissionLevel: (level: PermissionLevel) => void
  triggerDecryptOverlay: (message: string) => void
  closeDecryptOverlay: () => void
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
let splitGlitchTimer: ReturnType<typeof setTimeout> | null = null
let hudShakeTimer: ReturnType<typeof setTimeout> | null = null
let redAlertTimer: ReturnType<typeof setTimeout> | null = null

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

const permissionRank: Record<PermissionLevel, number> = {
  GUEST: 0,
  SIGNAL: 1,
  OPERATOR: 2,
  ROOT: 3,
}

export const useVoidStore = create<VoidStore>((set, get) => ({
  booted: false,
  activeModule: 'archive',
  terminalOpen: false,
  overdrive: false,
  glitching: false,
  splitGlitching: false,
  hudShaking: false,
  redAlert: false,
  soundEnabled: false,
  performanceMode: 'high',
  permissionLevel: 'GUEST',
  systemLogs: [],
  unlockedAchievements: [],
  achievementToasts: [],
  signalScanCount: 0,
  commandCount: 0,
  gateClickCount: 0,
  gateOpened: false,
  gateResultOpen: false,
  escapeAttemptCount: 0,
  decryptOverlay: null,

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

  triggerSplitGlitch: (duration = 950) => {
    if (splitGlitchTimer)
      clearTimeout(splitGlitchTimer)
    set({ splitGlitching: true })
    get().triggerGlitch(duration)
    splitGlitchTimer = setTimeout(() => set({ splitGlitching: false }), duration)
  },

  triggerHudShake: (duration = 560) => {
    if (hudShakeTimer)
      clearTimeout(hudShakeTimer)
    set({ hudShaking: true })
    hudShakeTimer = setTimeout(() => set({ hudShaking: false }), duration)
  },

  triggerRedAlert: (duration = 9000) => {
    if (redAlertTimer)
      clearTimeout(redAlertTimer)
    set({ redAlert: true })
    get().triggerSplitGlitch(1100)
    get().triggerHudShake(900)
    get().addSystemLog('红色警戒模式启动')
    redAlertTimer = setTimeout(() => set({ redAlert: false }), duration)
  },

  clearRedAlert: () => {
    if (redAlertTimer)
      clearTimeout(redAlertTimer)
    set({ redAlert: false })
    get().addSystemLog('红色警戒已终止')
  },

  setPermissionLevel: level => {
    const current = get().permissionLevel
    if (permissionRank[level] <= permissionRank[current])
      return
    set({ permissionLevel: level })
    get().addSystemLog(`权限提升：${level}`)
  },

  triggerDecryptOverlay: message => {
    set({ decryptOverlay: { id: makeId('decrypt'), message } })
  },

  closeDecryptOverlay: () => set({ decryptOverlay: null }),

  addSystemLog: message => {
    const log = {
      id: makeId('log'),
      message,
      timestamp: Date.now(),
    }
    set(state => ({ systemLogs: [...state.systemLogs, log].slice(-42) }))
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
    get().addSystemLog('数据包监听完成')
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
    get().addSystemLog(`闸门突破阶段 ${gateAttemptLabel(next)}`)

    if (next >= 3 && !get().gateOpened) {
      set({ gateOpened: true, gateResultOpen: true })
      get().setPermissionLevel('OPERATOR')
      get().addSystemLog('闸门已接入')
      get().triggerRedAlert(8000)
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
