export type VoidModule = 'archive' | 'signal' | 'lab' | 'gate'

export type PerformanceMode = 'high' | 'low'

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
