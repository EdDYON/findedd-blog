import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '有一封信',
  description: '等待被打开。',
  icons: {
    icon: '/favicon.jpg',
    apple: '/avatar.jpg',
  },
  openGraph: {
    title: '有一封信',
    description: '等待被打开。',
    type: 'website',
  },
  robots: {
    index: true,
    follow: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#fff7fb',
  colorScheme: 'light',
  viewportFit: 'cover',
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
