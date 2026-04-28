import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VOID — Digital Anomaly Interface',
  description: 'VOID is an interactive dark sci-fi anomaly interface beyond the screen.',
  icons: {
    icon: '/favicon.jpg',
    apple: '/avatar.jpg',
  },
  openGraph: {
    title: 'VOID — Digital Anomaly Interface',
    description: 'VOID is an interactive dark sci-fi anomaly interface beyond the screen.',
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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
