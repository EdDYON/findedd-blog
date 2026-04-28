import type { VoidModule } from '@/types/void'

export type TerminalCommandResult = {
  output: string[]
  module?: VoidModule
  glitch?: boolean
  clear?: boolean
}

export const terminalCommands = ['/help', '/about', '/archive', '/signal', '/lab', '/gate', '/void', '/echo', '/clear']
