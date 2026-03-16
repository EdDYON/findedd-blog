import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYOn和他的朋友们',
  subtitle: '分享日常与开发记录 ヾ(≧▽≦*)o',
  author: {
    name: 'eddy1 & Friends',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✨',
      message: 'Happy Coding~'
    }
  },
  description: '这里记录了我们的开发点滴与生活日常，欢迎大家常来玩呀！(❁´◡`❁)',
  social: [
    {
      name: 'GitHub',
      link: 'https://github.com/',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
  ],
  search: {
    enable: false,
  },
  sponsor: {
    enable: false,
  },
  head: [
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/sakana-widget/2.7.0/sakana.min.js' }]
  ]
})