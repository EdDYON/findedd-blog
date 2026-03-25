import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'

export default defineValaxyConfig<UserThemeConfig>({
  devtools: false,

  siteConfig: {
    comment: {
      enable: true,
    },
  },

  addons: [
    addonWaline({
      serverURL: 'https://waline.findedd.cn',
      login: 'disable',
      meta: ['nick'],
      requiredMeta: ['nick'],
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
        '想记的都先记下来，技术也好，日常也好。',
        '比起像模板，我更希望它像一个真的有人住的小站。',
        '喜欢的东西、普通日子和写过的代码，都能在这里找到位置。',
      ],
    },
    notice: {
      enable: false,
      content: '',
    },
    fireworks: {
      enable: false,
      colors: ['#66CCFF', '#FFB3CC', '#99FF99', '#FFCC99', '#CCCCFF'],
    },
    nav: [
      {
        text: '文章',
        link: '/posts/',
        icon: 'i-ri-article-line',
      },
      {
        text: '互动',
        link: '/interact/',
        icon: 'i-ri-chat-smile-3-line',
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
        name: '互动区',
        url: '/interact/',
        icon: 'i-ri-chat-heart-line',
        color: '#ff9dc7',
      },
      {
        name: '九机展示屏',
        url: '/jiuji',
        icon: 'i-ri-bar-chart-box-line',
        color: '#54d2ff',
      },
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
        name: '收藏与清单',
        url: '/collection/',
        icon: 'i-ri-bookmark-3-line',
        color: '#9ad0f5',
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

