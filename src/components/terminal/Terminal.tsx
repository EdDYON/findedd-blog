'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TerminalInput } from '@/components/terminal/TerminalInput'
import type { TerminalCommandResult } from '@/components/terminal/terminalCommands'
import { achievements } from '@/data/achievements'
import { signalMessages, terminalHelp } from '@/data/signals'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'
import type { AchievementId, VoidModule } from '@/types/void'

type CommandContext = {
  activeModule: VoidModule
  gateOpened: boolean
  overdrive: boolean
  soundEnabled: boolean
  unlockedAchievements: AchievementId[]
  escapeAttemptCount: number
}

type CommandResult = TerminalCommandResult & {
  achievement?: AchievementId
  log?: string
  shake?: boolean
  redAlert?: boolean
  escapeAttempt?: boolean
}

const moduleNames: Record<VoidModule, string> = {
  archive: '档案',
  signal: '信号',
  lab: '实验',
  gate: '闸门',
}

function isCommand(command: string, commands: string[]) {
  return commands.includes(command.trim().toLowerCase())
}

function evaluateCommand(command: string, context: CommandContext): CommandResult {
  const normalized = command.trim().toLowerCase()

  if (!normalized)
    return { output: [] }

  if (isCommand(normalized, ['/help', '/帮助']))
    return { output: terminalHelp }
  if (isCommand(normalized, ['/about', '/关于']))
    return { output: ['VOID 不是主页，而是一段可以被触发、记录和回响的数字异常界面。'] }
  if (isCommand(normalized, ['/status', '/状态']))
    return {
      output: [
        `当前模块：${moduleNames[context.activeModule]}`,
        `闸门状态：${context.gateOpened ? '已打开' : '已封锁'}`,
        `核心状态：${context.overdrive ? '过载中' : '稳定旋转'}`,
        `声音状态：${context.soundEnabled ? '已开启' : '已关闭'}`,
      ],
    }
  if (isCommand(normalized, ['/archive', '/档案']))
    return { output: ['档案模块已接入。'], module: 'archive' }
  if (isCommand(normalized, ['/signal', '/信号']))
    return { output: ['信号模块已接入。'], module: 'signal' }
  if (isCommand(normalized, ['/lab', '/实验']))
    return { output: ['实验模块已接入。'], module: 'lab' }
  if (isCommand(normalized, ['/gate', '/闸门']))
    return { output: ['闸门模块已接入。请保持距离。'], module: 'gate' }
  if (isCommand(normalized, ['/core', '/核心']))
    return { output: ['虚空核心过载启动。'], overdrive: true }
  if (isCommand(normalized, ['/void', '/虚空']))
    return { output: ['异常脉冲已释放。'], glitch: true, achievement: 'VOID_TOUCHED', log: '异常场发生扭曲' }
  if (isCommand(normalized, ['/achievements', '/成就'])) {
    if (!context.unlockedAchievements.length)
      return { output: ['尚未解锁任何成就。'] }
    return {
      output: context.unlockedAchievements.map(id => `${achievements[id].title}：${achievements[id].description}`),
    }
  }
  if (isCommand(normalized, ['/clear', '/清空']))
    return { output: [], clear: true }

  if (normalized === '/我是谁')
    return {
      output: ['身份校验失败。', '你现在只是一段被 VOID 捕获的信号。'],
      achievement: 'LOST_SIGNAL',
      log: '隐藏路线：身份校验失败',
      shake: true,
    }

  if (normalized === '/逃离') {
    const next = context.escapeAttemptCount + 1
    if (next === 1)
      return { output: ['未找到出口路径。'], escapeAttempt: true, log: '逃离尝试 01' }
    if (next === 2)
      return { output: ['停止寻找出口。'], escapeAttempt: true, log: '逃离尝试 02', shake: true }
    return {
      output: ['VOID 不释放已经接入的访客。'],
      escapeAttempt: true,
      glitch: true,
      achievement: 'NO_EXIT',
      log: '逃离尝试被拦截',
      shake: true,
    }
  }

  if (normalized === '/镜子')
    return {
      output: ['镜像引擎启动。', '未检测到人类形态。'],
      achievement: 'MIRROR_ERROR',
      log: '镜像引擎返回异常',
      glitch: true,
    }

  if (normalized === '/红门') {
    if (!context.gateOpened)
      return { output: ['红门未响应。', '请先打开闸门。'], log: '红门信号被封锁' }
    return {
      output: ['红门正在回应。', '不要继续靠近。'],
      achievement: 'REDGATE_WITNESS',
      log: '红门信号已检测',
      glitch: true,
      redAlert: true,
      shake: true,
    }
  }

  if (normalized === '/监听')
    return {
      output: [`收到静噪回声：“${signalMessages[Math.floor(Math.random() * signalMessages.length)]}”`],
      achievement: 'LISTENER',
      log: '静噪监听完成',
    }

  return { output: [`未知指令：${command}`, '输入 /帮助 查看已公开指令。'] }
}

export function Terminal() {
  const terminalOpen = useVoidStore(state => state.terminalOpen)
  const activeModule = useVoidStore(state => state.activeModule)
  const gateOpened = useVoidStore(state => state.gateOpened)
  const overdrive = useVoidStore(state => state.overdrive)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const unlockedAchievements = useVoidStore(state => state.unlockedAchievements)
  const escapeAttemptCount = useVoidStore(state => state.escapeAttemptCount)
  const setActiveModule = useVoidStore(state => state.setActiveModule)
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)
  const triggerOverdrive = useVoidStore(state => state.triggerOverdrive)
  const triggerHudShake = useVoidStore(state => state.triggerHudShake)
  const addSystemLog = useVoidStore(state => state.addSystemLog)
  const unlockAchievement = useVoidStore(state => state.unlockAchievement)
  const recordCommand = useVoidStore(state => state.recordCommand)
  const incrementEscapeAttempt = useVoidStore(state => state.incrementEscapeAttempt)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>(['VOID 终端休眠中。按 ~ 可随时唤醒。', '输入 /帮助 查看公开指令。'])

  function submit() {
    const command = input.trim()
    if (!command)
      return

    const result = evaluateCommand(command, {
      activeModule,
      gateOpened,
      overdrive,
      soundEnabled,
      unlockedAchievements,
      escapeAttemptCount,
    })

    setInput('')
    recordCommand(command)
    playVoidSound('terminal', soundEnabled)

    if (result.clear) {
      setLines([])
      return
    }

    if (result.escapeAttempt)
      incrementEscapeAttempt()
    if (result.module)
      setActiveModule(result.module)
    if (result.overdrive) {
      playVoidSound('core', soundEnabled)
      triggerOverdrive()
    }
    if (result.glitch)
      triggerGlitch(result.redAlert ? 1200 : 900)
    if (result.shake)
      triggerHudShake(result.redAlert ? 900 : 560)
    if (result.log)
      addSystemLog(result.log)
    if (result.achievement)
      unlockAchievement(result.achievement)

    setLines(current => [...current, `> ${command}`, ...result.output].slice(-24))
  }

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.aside
          initial={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          exit={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
          className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-5xl overflow-hidden border border-cyan-300/30 bg-black/80 shadow-[0_0_60px_rgba(34,211,238,0.18)] backdrop-blur-2xl hud-corners md:bottom-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-xs tracking-[0.18em]">
            <span className="text-cyan-100">VOID / 终端</span>
            <span className="text-zinc-500">按 ~ 关闭</span>
          </div>
          <div className="max-h-72 overflow-auto p-4 font-mono text-xs leading-6 tracking-[0.12em] text-zinc-300">
            {lines.length ? lines.map((line, index) => (
              <p key={`${line}-${index}`} className={line.startsWith('>') ? 'text-cyan-100' : 'text-zinc-400'}>
                {line}
              </p>
            )) : <p className="text-zinc-600">缓冲区已清空。</p>}
          </div>
          <TerminalInput value={input} onChange={setInput} onSubmit={submit} />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
