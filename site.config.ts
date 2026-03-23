import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYON 和朋友们',
  subtitle: '日常、开发、ACG 与认真生活的记录',
  author: {
    name: 'EdDYON & Friends',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✨',
      message: '今天也在认真搭站'
    }
  },
  description: '这里会慢慢收集开发记录、生活碎片、猫、ACG 和一些值得反复回看的瞬间。',
  social: [],
  search: {
    enable: false,
  },
  sponsor: {
    enable: false,
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+SC:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Noto+Serif+SC:wght@700;900&display=swap' }],
  ]
})
