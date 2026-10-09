import type { AchievementId } from '@/types/void'

export const achievements: Record<AchievementId, { title: string; description: string }> = {
  FIRST_CONTACT: {
    title: 'FIRST CONTACT',
    description: 'Entered the VOID interface.',
  },
  TERMINAL_USER: {
    title: 'TERMINAL USER',
    description: 'Opened the hidden terminal bridge.',
  },
  SIGNAL_HUNTER: {
    title: 'SIGNAL HUNTER',
    description: 'Scanned unstable transmissions.',
  },
  CORE_TOUCH: {
    title: 'CORE TOUCH',
    description: 'Touched the anomaly core.',
  },
  GATEBREAKER: {
    title: 'GATEBREAKER',
    description: 'Opened the restricted gate.',
  },
  VOID_TOUCHED: {
    title: 'VOID TOUCHED',
    description: 'Distorted the anomaly field.',
  },
  COMMAND_SEEKER: {
    title: 'COMMAND SEEKER',
    description: 'The terminal remembers your input.',
  },
}
