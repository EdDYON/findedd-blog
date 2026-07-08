import type { Metadata, Viewport } from 'next'
import SiteLoader from './SiteLoader'
import './globals.css'
import './site-loader.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.findedd.cn'),
  applicationName: '汉堡',
  title: '汉堡',
  description: '汉堡之神',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '汉堡',
    description: '汉堡之神',
    url: '/',
    siteName: '汉堡',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '汉堡',
    description: '汉堡之神',
  },
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
