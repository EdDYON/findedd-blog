import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/void', '/api', '/posts', '/articles', '/archive', '/tags', '/categories'],
    },
    sitemap: '/sitemap.xml',
  }
}
