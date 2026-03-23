import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYON 和朋友们',
  subtitle: '日常、折腾、ACG，还有一些不想忘掉的东西',
  author: {
    name: 'EdDYON & Friends',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✨',
      message: '还在慢慢建设中'
    }
  },
  description: '想把喜欢的东西、写过的代码和普通日子都放进来，慢慢搭成一个更像自己的站。',
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
