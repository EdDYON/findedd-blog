import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYON',
  subtitle: 'Interactive Visual Showcase',
  author: {
    name: 'EdDYON',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✦',
      message: 'Interactive Visual Showcase',
    },
  },
  description: 'A full-screen interactive visual showcase by EdDYON.',
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
