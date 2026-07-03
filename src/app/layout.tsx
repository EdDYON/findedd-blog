import type { Metadata, Viewport } from 'next'
import SiteLoader from './SiteLoader'
import './globals.css'
import './site-loader.css'

export const metadata: Metadata = {
  title: 'find burger',
  description: '一个硬蜡笔风格的互动汉堡网站。',
}

export const viewport: Viewport = {
  themeColor: '#f91814',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteLoader />
        {children}
      </body>
    </html>
  )
}
