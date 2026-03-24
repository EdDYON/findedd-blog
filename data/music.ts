export type MusicTrack = {
  title: string
  artist: string
  album?: string
  cover?: string
  link?: string
}

export type MonthlyFavorite = {
  month: string
  title: string
  artist: string
  reason: string
  link?: string
}

export const musicConfig = {
  endpoint: import.meta.env.VITE_NETEASE_RECENT_API || '',
  profileUrl: 'https://music.163.com/#/user/home?id=1542825640',
  recentLimit: 6,
}

export const monthlyFavorites: MonthlyFavorite[] = []


