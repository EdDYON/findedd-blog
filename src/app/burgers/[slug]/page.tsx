import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getBurgerRecipeSteps,
  getBurgerStory,
  getBurgerTasteRatings,
  getSimilarBurgers,
} from '@/data/burgerDetails'
import { burgers } from '@/data/burgers'
import BurgerDetailView from './BurgerDetailView'
import '../burger-archive.css'
import './burger-detail.css'

type BurgerDetailPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return burgers.map((burger) => ({ slug: burger.slug }))
}

export async function generateMetadata({ params }: BurgerDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const burger = burgers.find((item) => item.slug === slug)

  if (!burger) return {}

  const title = `${burger.name} | 汉堡档案馆`

  return {
    title,
    description: burger.summary,
    alternates: {
      canonical: `/burgers/${burger.slug}`,
    },
    openGraph: {
      title,
      description: burger.summary,
      url: `/burgers/${burger.slug}`,
      type: 'article',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: burger.summary,
    },
  }
}

export default async function BurgerDetailPage({ params }: BurgerDetailPageProps) {
  const { slug } = await params
  const burger = burgers.find((item) => item.slug === slug)

  if (!burger) notFound()

  const story = getBurgerStory(burger)
  const tasteRatings = getBurgerTasteRatings(burger)
  const recipeSteps = getBurgerRecipeSteps(burger)
  const similarBurgers = getSimilarBurgers(burger, burgers)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: burger.name,
    alternativeHeadline: burger.englishName,
    description: burger.summary,
    inLanguage: 'zh-CN',
    mainEntityOfPage: `https://www.findedd.cn/burgers/${burger.slug}`,
    about: [burger.country, burger.protein, ...burger.flavors],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BurgerDetailView
        burger={burger}
        story={story}
        tasteRatings={tasteRatings}
        recipeSteps={recipeSteps}
        similarBurgers={similarBurgers}
      />
    </>
  )
}
