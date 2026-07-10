import type { MetadataRoute } from 'next'
import { burgers } from '@/data/burgers'

const siteUrl = 'https://www.findedd.cn'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteUrl}/burgers`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...burgers.map((burger) => ({
      url: `${siteUrl}/burgers/${burger.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
