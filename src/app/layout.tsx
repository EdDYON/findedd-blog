import type { Metadata, Viewport } from 'next'
import { Pangolin, ZCOOL_KuaiLe } from 'next/font/google'
import SiteLoader from './SiteLoader'
import './globals.css'
import './site-loader.css'

const crayonHan = ZCOOL_KuaiLe({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-crayon-han',
  display: 'swap',
})

const crayonLatin = Pangolin({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-crayon-latin',
  display: 'swap',
})

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
      <body className={`${crayonHan.variable} ${crayonLatin.variable}`}>
        <SiteLoader />
        {children}
      </body>
    </html>
  )
}
