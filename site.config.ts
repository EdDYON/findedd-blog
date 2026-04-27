import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYON Lab',
  subtitle: 'Useful little tools and tiny experiments',
  author: {
    name: 'EdDYON',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✦',
      message: 'EdDYON Lab',
    },
  },
  description: 'A small interactive lab with focus timer, notes, dice, mood pixels, and a tiny playfield.',
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
