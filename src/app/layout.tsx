import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VOID',
  description: 'A digital anomaly beyond the screen.',
  icons: {
    icon: '/favicon.jpg',
    apple: '/avatar.jpg',
  },
  openGraph: {
    title: 'VOID',
    description: 'This is not a website. This is an entry point.',
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
