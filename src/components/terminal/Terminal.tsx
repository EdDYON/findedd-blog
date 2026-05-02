'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TerminalInput } from '@/components/terminal/TerminalInput'
import { achievements } from '@/data/achievements'
import { signalMessages, terminalHelp } from '@/data/signals'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'
import type { AchievementId, PermissionLevel, VoidModule } from '@/types/void'

type CommandContext = {
  activeModule: VoidModule
  gateOpened: boolean
  overdrive: boolean
  soundEnabled: boolean
  redAlert: boolean
  permissionLevel: PermissionLevel
  unlockedAchievements: AchievementId[]
  escapeAttemptCount: number
}

type TerminalCard = {
  title: string
  meta: string
  description: string
  command: string
  tone: 'cyan' | 'violet' | 'magenta'
}

type CommandResult = {
  output: string[]
  cards?: TerminalCard[]
  module?: VoidModule
  glitch?: boolean
  splitGlitch?: boolean
  overdrive?: boolean
  clear?: boolean
  achievement?: AchievementId
  log?: string
  logs?: string[]
  shake?: boolean
  redAlert?: boolean
  clearAlert?: boolean
  escapeAttempt?: boolean
  permission?: PermissionLevel
  decryptMessage?: string
}

type TerminalEntry =
  | { id: string; kind: 'line'; text: string }
  | { id: string; kind: 'cards'; cards: TerminalCard[] }

const moduleNames: Record<VoidModule, string> = {
  archive: '档案',
  signal: '信号',
  lab: '实验',
  gate: '闸门',
}

const projectCards: TerminalCard[] = [
  {
    title: 'VOID 控制台',
    meta: 'Next.js / Motion / Three.js',
    description: '当前这个可进入、可扫描、可触发异常事件的暗色科幻入口。',
    command: '/status',
    tone: 'cyan',
  },
  {
    title: '黑箱档案',
    meta: 'Interactive Archive',
    description: '一组被 VOID 标记的视觉实验、信号残片和隐藏物件。',
    command: '/archive',
    tone: 'violet',
  },
  {
    title: '信号监听',
    meta: 'Packet Feed',
    description: '读取异常信号、伪造扫描结果，并把访客行动写入系统日志。',
    command: 'scan',
    tone: 'magenta',
  },
]

function isCommand(command: string, commands: string[]) {
  return commands.includes(command.trim().toLowerCase())
}

function canRoot(level: PermissionLevel) {
  return level === 'OPERATOR' || level === 'ROOT'
}

function randomSignal() {
  return signalMessages[Math.floor(Math.random() * signalMessages.length)]
}

function makeEntryId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function lineEntry(text: string): TerminalEntry {
  return { id: makeEntryId('line'), kind: 'line', text }
}

function cardEntry(cards: TerminalCard[]): TerminalEntry {
  return { id: makeEntryId('cards'), kind: 'cards', cards }
}

function evaluateCommand(command: string, context: CommandContext): CommandResult {
  const normalized = command.trim().toLowerCase()

  if (!normalized)
    return { output: [] }

  if (isCommand(normalized, ['help', '/help', '/帮助']))
    return { output: terminalHelp }

  if (isCommand(normalized, ['about', '/about', '/关于']))
    return { output: ['VOID 不是主页，是一套会记录、反馈、解锁和误导访客的数字异界。'] }

  if (isCommand(normalized, ['whoami', '/whoami', '/我是谁']))
    return {
      output: [
        'IDENTITY CHECK...',
        '站点身份：EdDYON / VOID_OPERATOR',
        '访客身份：未登记信号体',
        '权限建议：运行 projects 或 scan 继续入侵。',
      ],
      achievement: 'LOST_SIGNAL',
      log: '身份校验完成：访客信号体',
      splitGlitch: true,
    }

  if (isCommand(normalized, ['projects', '/projects', '/作品']))
    return {
      output: ['PROJECT INDEX UNSEALED.', '已加载 03 个可探索节点。'],
      cards: projectCards,
      log: '作品索引已展开',
      permission: 'SIGNAL',
    }

  if (isCommand(normalized, ['contact', '/contact', '/联系']))
    return {
      output: [
        'CONTACT CHANNEL DECRYPTED.',
        'GITHUB: https://github.com/EdDYON',
        'REPO: https://github.com/EdDYON/findedd-blog',
        'MAIL: encrypted::eddy0n[at]void.local',
        'NOTE: 邮箱仍是占位密文，可替换成真实联系方式。',
      ],
      decryptMessage: '联系通道已解密：GitHub 已接入，邮箱密文等待替换。',
      log: '加密联系通道已打开',
    }

  if (isCommand(normalized, ['status', '/status', '/状态']))
    return {
      output: [
        `当前模块：${moduleNames[context.activeModule]}`,
        `权限等级：${context.permissionLevel}`,
        `红色警戒：${context.redAlert ? '启动中' : '未启动'}`,
        `闸门状态：${context.gateOpened ? '已接入' : '已封锁'}`,
        `核心状态：${context.overdrive ? '过载中' : '稳定旋转'}`,
        `声音状态：${context.soundEnabled ? '已开启' : '已关闭'}`,
      ],
    }

  if (isCommand(normalized, ['archive', '/archive', '/档案']))
    return { output: ['黑箱档案模块已接入。'], module: 'archive' }
  if (isCommand(normalized, ['signal', '/signal', '/信号']))
    return { output: ['数据包监听模块已接入。'], module: 'signal' }
  if (isCommand(normalized, ['lab', '/lab', '/实验']))
    return { output: ['破解器实验舱已接入。'], module: 'lab' }
  if (isCommand(normalized, ['gate', '/gate', '/闸门']))
    return { output: ['权限闸门模块已接入。请保持距离。'], module: 'gate' }

  if (isCommand(normalized, ['scan', '/scan', '/扫描']))
    return {
      output: [
        'SCAN STARTED...',
        `LOCAL PORTS: ${3 + Math.floor(Math.random() * 4)} OPEN / 11 SHADOWED`,
        `ANOMALY PACKETS: ${7 + Math.floor(Math.random() * 9)}`,
        `SIGNAL SAMPLE: ${randomSignal()}`,
        'RESULT: VOID 接入层仍在观察你。',
      ],
      module: 'signal',
      permission: 'SIGNAL',
      logs: ['站内伪扫描完成', '数据雨密度上升', '异常警告：低频回声接近'],
      splitGlitch: true,
      shake: true,
    }

  if (isCommand(normalized, ['trace', '/trace', '/追踪']))
    return {
      output: [
        'TRACE ROUTE:',
        'LOCAL_SIGNAL -> EDGE_NODE_07',
        'EDGE_NODE_07 -> NULL_RELAY',
        'NULL_RELAY -> RED_GATE_CACHE',
        'RED_GATE_CACHE -> VOID_CORE',
        'TRACE COMPLETE: 目标指向 VOID_CORE。',
      ],
      permission: 'OPERATOR',
      achievement: 'TRACE_COMPLETE',
      log: '节点追踪完成：VOID_CORE',
      splitGlitch: true,
    }

  if (isCommand(normalized, ['decrypt', '/decrypt', '/解密']))
    return {
      output: ['DECRYPT QUEUE ACCEPTED.', '乱码流正在被还原。'],
      decryptMessage: '隐藏信号：红门不是出口，是权限测试。',
      achievement: 'DECRYPTED_SIGNAL',
      log: '密文解码完成',
    }

  if (isCommand(normalized, ['breach', '/breach', '/突破']))
    return {
      output: [
        'BREACH SIMULATION ONLY.',
        'LAYER 01: CHECKSUM SPOOFED',
        'LAYER 02: SANDBOX LOOPED',
        'LAYER 03: RED ALERT ROUTED',
        'ACCESS: OPERATOR',
      ],
      permission: 'OPERATOR',
      achievement: 'BREACH_INITIATED',
      log: '权限突破事件启动',
      redAlert: true,
      shake: true,
    }

  if (isCommand(normalized, ['root', '/root', '/权限'])) {
    if (!canRoot(context.permissionLevel))
      return {
        output: ['ROOT REQUEST DENIED.', '当前权限不足。先尝试 /追踪 或 /突破。'],
        log: 'ROOT 请求被拒绝',
        shake: true,
      }

    return {
      output: ['ROOT ACCESS GRANTED.', 'VOID 暂时把最高权限借给了你。'],
      permission: 'ROOT',
      achievement: 'ROOT_GRANTED',
      log: 'ROOT 权限已授予',
      splitGlitch: true,
    }
  }

  if (isCommand(normalized, ['kill', '/kill', '/终止'])) {
    if (!context.redAlert && context.permissionLevel !== 'ROOT')
      return { output: ['KILL SWITCH IDLE.', '当前没有需要终止的警戒。'] }

    return {
      output: ['KILL SWITCH ACCEPTED.', '红色警戒已终止。'],
      clearAlert: true,
      achievement: 'KILL_SWITCH',
      log: '终止开关已执行',
    }
  }

  if (isCommand(normalized, ['core', '/core', '/核心']))
    return { output: ['虚空核心过载启动。'], overdrive: true }

  if (isCommand(normalized, ['void', '/void', '/虚空']))
    return { output: ['异常脉冲已释放。'], glitch: true, achievement: 'VOID_TOUCHED', log: '异常场发生扰动' }

  if (isCommand(normalized, ['achievements', '/achievements', '/成就'])) {
    if (!context.unlockedAchievements.length)
      return { output: ['尚未解锁任何成就。'] }
    return {
      output: context.unlockedAchievements.map(id => `${achievements[id].title}：${achievements[id].description}`),
    }
  }

  if (isCommand(normalized, ['clear', '/clear', '/清空']))
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
      output: [`收到静噪回声：“${randomSignal()}”`],
      achievement: 'LISTENER',
      log: '静噪监听完成',
    }

  return { output: [`未知指令：${command}`, '输入 help 查看公开命令。'] }
}

function terminalLineClass(text: string) {
  if (text.startsWith('>'))
    return 'text-cyan-100'
  if (text.includes('DENIED') || text.includes('RED') || text.includes('警告'))
    return 'text-rose-200'
  if (text.includes('PROJECT') || text.includes('CONTACT') || text.includes('IDENTITY') || text.includes('SCAN'))
    return 'text-fuchsia-100'
  return 'text-cyan-100/72'
}

export function Terminal() {
  const terminalOpen = useVoidStore(state => state.terminalOpen)
  const activeModule = useVoidStore(state => state.activeModule)
  const gateOpened = useVoidStore(state => state.gateOpened)
  const overdrive = useVoidStore(state => state.overdrive)
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const redAlert = useVoidStore(state => state.redAlert)
  const permissionLevel = useVoidStore(state => state.permissionLevel)
  const unlockedAchievements = useVoidStore(state => state.unlockedAchievements)
  const escapeAttemptCount = useVoidStore(state => state.escapeAttemptCount)
  const setActiveModule = useVoidStore(state => state.setActiveModule)
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)
  const triggerSplitGlitch = useVoidStore(state => state.triggerSplitGlitch)
  const triggerOverdrive = useVoidStore(state => state.triggerOverdrive)
  const triggerHudShake = useVoidStore(state => state.triggerHudShake)
  const triggerRedAlert = useVoidStore(state => state.triggerRedAlert)
  const clearRedAlert = useVoidStore(state => state.clearRedAlert)
  const setPermissionLevel = useVoidStore(state => state.setPermissionLevel)
  const triggerDecryptOverlay = useVoidStore(state => state.triggerDecryptOverlay)
  const addSystemLog = useVoidStore(state => state.addSystemLog)
  const unlockAchievement = useVoidStore(state => state.unlockAchievement)
  const recordCommand = useVoidStore(state => state.recordCommand)
  const incrementEscapeAttempt = useVoidStore(state => state.incrementEscapeAttempt)
  const [input, setInput] = useState('')
  const [entries, setEntries] = useState<TerminalEntry[]>([
    lineEntry('VOID 终端休眠中。按 ~ 可随时唤醒。'),
    lineEntry('输入 help / whoami / projects / scan / contact 开始入侵。'),
  ])

  function submit() {
    const command = input.trim()
    if (!command)
      return

    const result = evaluateCommand(command, {
      activeModule,
      gateOpened,
      overdrive,
      soundEnabled,
      redAlert,
      permissionLevel,
      unlockedAchievements,
      escapeAttemptCount,
    })

    setInput('')
    recordCommand(command)
    playVoidSound('terminal', soundEnabled)

    if (result.clear) {
      setEntries([])
      return
    }

    if (result.escapeAttempt)
      incrementEscapeAttempt()
    if (result.module)
      setActiveModule(result.module)
    if (result.permission)
      setPermissionLevel(result.permission)
    if (result.overdrive) {
      playVoidSound('core', soundEnabled)
      triggerOverdrive()
    }
    if (result.redAlert) {
      playVoidSound('gate', soundEnabled)
      triggerRedAlert(9000)
    }
    if (result.clearAlert)
      clearRedAlert()
    if (result.glitch)
      triggerGlitch(result.redAlert ? 1200 : 900)
    if (result.splitGlitch)
      triggerSplitGlitch(1100)
    if (result.shake)
      triggerHudShake(result.redAlert ? 900 : 560)
    if (result.decryptMessage)
      triggerDecryptOverlay(result.decryptMessage)
    if (result.log)
      addSystemLog(result.log)
    result.logs?.forEach(addSystemLog)
    if (result.achievement)
      unlockAchievement(result.achievement)

    setEntries((current) => {
      const nextEntries: TerminalEntry[] = [
        ...current,
        lineEntry(`> ${command}`),
        ...result.output.map(lineEntry),
      ]

      if (result.cards)
        nextEntries.push(cardEntry(result.cards))

      return nextEntries.slice(-34)
    })
  }

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.aside
          initial={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          exit={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
          className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-h-[82vh] max-w-5xl overflow-hidden border border-cyan-300/30 bg-black/85 shadow-[0_0_60px_rgba(34,211,238,0.22),0_0_90px_rgba(236,72,153,0.1)] backdrop-blur-2xl hud-corners md:bottom-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-xs tracking-[0.18em]">
            <span className="neon-text text-cyan-100">VOID / 终端桥</span>
            <span className="text-zinc-500">权限 {permissionLevel} / 按 ~ 关闭</span>
          </div>
          <div className="max-h-[54vh] overflow-auto p-4 font-mono text-[11px] leading-6 tracking-[0.1em] text-zinc-300 md:max-h-80 md:text-xs">
            {entries.length ? entries.map(entry => (
              entry.kind === 'line' ? (
                <p key={entry.id} className={`terminal-line break-words ${terminalLineClass(entry.text)}`}>
                  {entry.text}
                </p>
              ) : (
                <div key={entry.id} className="my-3 grid gap-3 md:grid-cols-3">
                  {entry.cards.map(card => (
                    <div key={card.title} className="terminal-card hud-corners p-3">
                      <p className={card.tone === 'magenta' ? 'text-fuchsia-200' : card.tone === 'violet' ? 'text-violet-200' : 'text-cyan-100'}>
                        {card.title}
                      </p>
                      <p className="mt-1 text-[9px] uppercase text-zinc-500">{card.meta}</p>
                      <p className="mt-3 min-h-12 text-[10px] leading-5 tracking-[0.06em] text-zinc-400">{card.description}</p>
                      <p className="mt-3 border-t border-white/10 pt-2 text-[9px] uppercase text-cyan-200/70">RUN {card.command}</p>
                    </div>
                  ))}
                </div>
              )
            )) : <p className="text-zinc-600">缓冲区已清空。</p>}
          </div>
          <TerminalInput value={input} onChange={setInput} onSubmit={submit} />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
