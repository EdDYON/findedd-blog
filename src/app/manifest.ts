import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '一封信',
    short_name: '一封信',
    description: '等待被打开。',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff7fb',
    theme_color: '#fff7fb',
    icons: [
      {
        src: '/pixel/pixel-letter.svg',
        sizes: '64x64',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/pixel/pixel-letter.svg',
        sizes: '64x64',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
