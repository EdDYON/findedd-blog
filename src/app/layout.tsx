import type { Metadata, Viewport } from 'next'
import SiteLoader from './SiteLoader'
import './globals.css'
import './site-loader.css'

export const metadata: Metadata = {
  title: '汉堡',
  description: '汉堡之神',
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
