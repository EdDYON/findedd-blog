import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'

export default defineValaxyConfig<UserThemeConfig>({
  devtools: false,

  siteConfig: {
    comment: {
      enable: true
    }
  },

  addons: [
    addonWaline({
      serverURL: 'https://waline.findedd.cn',
    }),
  ],

  theme: 'yun',
  themeConfig: {
    banner: {
      enable: true,
      title: 'EdDYON 和朋友们',
    },
    bg_image: {
      enable: false,
    },
    say: {
      enable: true,
      api: '',
      content: [
        '站点改版中，但会越变越像自己。',
        '慢慢写，认真写，也认真生活。',
        '开发、日常、猫、ACG，都准备留在这里。',
      ],
    },
    notice: {
      enable: true,
      content: '这座小站刚完成一轮改版，移动端和桌面端都在继续打磨中。',
    },
    fireworks: {
      enable: false,
      colors: ['#66CCFF', '#FFB3CC', '#99FF99', '#FFCC99', '#CCCCFF']
    },
    nav: [
      {
        text: '文章',
        link: '/posts/',
        icon: 'i-ri-article-line',
      },
      {
        text: '关于',
        link: '/about/',
        icon: 'i-ri-user-heart-line',
      },
      {
        text: '友邻',
        link: '/links/',
        icon: 'i-ri-links-line',
      },
      {
        text: '站点',
        link: '/about/site/',
        icon: 'i-ri-layout-masonry-line',
      },
    ],
    pages: [
      {
        name: '关于我',
        url: '/about/',
        icon: 'i-ri-user-smile-line',
        color: '#ff8a65',
      },
      {
        name: '关于站点',
        url: '/about/site/',
        icon: 'i-ri-layout-grid-line',
        color: '#f7b731',
      },
      {
        name: 'Data & Dev',
        url: '/tech/',
        icon: 'i-ri-database-2-line',
        color: '#4facfe',
      },
      {
        name: 'Life & Cat',
        url: '/life/',
        icon: 'i-ri-cat-line',
        color: '#ffb347',
      },
      {
        name: 'Japan & ACG',
        url: '/hobbies/',
        icon: 'i-ri-flight-takeoff-line',
        color: '#ff6f91',
      },
      {
        name: '友邻收藏',
        url: '/links/',
        icon: 'i-ri-links-line',
        color: '#7ed6df',
      },
    ],
    footer: {
      since: 2026,
      powered: false,
      icon: {
        enable: true,
        name: 'i-ri-sparkling-2-line',
        animated: false,
        color: '#ff8a65',
        url: 'https://findedd.cn',
        title: 'Back Home',
      },
      beian: {
        enable: false,
      },
    },
  },
})
