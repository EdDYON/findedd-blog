export type VoidModule = 'archive' | 'signal' | 'lab' | 'gate'

export type PerformanceMode = 'high' | 'low'

export type PermissionLevel = 'GUEST' | 'SIGNAL' | 'OPERATOR' | 'ROOT'

export type AchievementId =
  | 'FIRST_CONTACT'
  | 'TERMINAL_USER'
  | 'SIGNAL_HUNTER'
  | 'CORE_TOUCH'
  | 'GATEBREAKER'
  | 'VOID_TOUCHED'
  | 'COMMAND_SEEKER'
  | 'LOST_SIGNAL'
  | 'NO_EXIT'
  | 'MIRROR_ERROR'
  | 'REDGATE_WITNESS'
  | 'LISTENER'
  | 'TRACE_COMPLETE'
  | 'DECRYPTED_SIGNAL'
  | 'BREACH_INITIATED'
  | 'ROOT_GRANTED'
  | 'KILL_SWITCH'

export type DecryptOverlayState = {
  id: string
  message: string
}

export type SystemLog = {
  id: string
  message: string
  timestamp: number
}

export type AchievementToast = {
  id: string
  achievementId: AchievementId
  timestamp: number
}

export type ArchiveStatus = 'Active' | 'Dormant' | 'Unstable' | 'Corrupted' | 'Unknown'

export type DangerLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN'

export type ArchiveItem = {
  id: string
  title: string
  type: string
  status: ArchiveStatus
  danger: DangerLevel
  description: string
  tags: string[]
}
