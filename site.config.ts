import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYON 和朋友们',
  subtitle: '日常、开发、ACG，还有我想认真留住的东西',
  author: {
    name: 'EdDYON',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✨',
      message: '今天也在这里留下点什么',
    },
  },
  description: '这里放着我喜欢的东西、写过的代码和普通日子，是一个我自己也会反复打开的小站。',
  social: [],
  search: {
    enable: false,
  },
  sponsor: {
    enable: false,
  },
  head: [
    ['link', { rel: 'icon', type: 'image/jpeg', href: '/favicon.jpg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.jpg' }],
    ['link', { rel: 'apple-touch-icon', href: '/avatar.jpg' }],
  ],
})
