import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VOID - 数字异常控制台',
  description: 'VOID 是一个可以进入、扫描、解密、触发和探索的暗色科幻互动界面。',
  icons: {
    icon: '/favicon.jpg',
    apple: '/avatar.jpg',
  },
  openGraph: {
    title: 'VOID - 数字异常控制台',
    description: 'VOID 是一个可以进入、扫描、解密、触发和探索的暗色科幻互动界面。',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#020207',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
