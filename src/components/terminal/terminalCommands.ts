import type { VoidModule } from '@/types/void'

export type TerminalCommandResult = {
  output: string[]
  module?: VoidModule
  glitch?: boolean
  overdrive?: boolean
  clear?: boolean
}

export const terminalCommands = [
  '/help',
  '/帮助',
  '/about',
  '/关于',
  '/status',
  '/状态',
  '/archive',
  '/档案',
  '/signal',
  '/信号',
  '/lab',
  '/实验',
  '/gate',
  '/闸门',
  '/core',
  '/核心',
  '/void',
  '/虚空',
  '/achievements',
  '/成就',
  '/clear',
  '/清空',
  '/我是谁',
  '/逃离',
  '/镜子',
  '/红门',
  '/监听',
]
