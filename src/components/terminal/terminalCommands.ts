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
  '/about',
  '/status',
  '/archive',
  '/signal',
  '/lab',
  '/gate',
  '/core',
  '/void',
  '/achievements',
  '/clear',
]
