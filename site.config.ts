import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://findedd.cn',
  lang: 'zh-CN',
  title: 'EdDYON 和朋友们',
  subtitle: '日常、开发、ACG，还有一点慢慢搭站的执念',
  author: {
    name: 'EdDYON',
    avatar: '/avatar.jpg',
    status: {
      emoji: '✨',
      message: '今天也在慢慢改'
    }
  },
  description: '想把喜欢的东西、写过的代码和普通日子都放进来，慢慢搭成一个真的会让我反复打开的站。',
  social: [],
  search: {
    enable: false,
  },
  sponsor: {
    enable: false,
  },
  head: []
})
