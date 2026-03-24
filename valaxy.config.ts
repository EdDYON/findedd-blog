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
        '这站我还会继续改，隔两天回来看可能又不一样。',
        '代码会记，日常会放，喜欢的东西也会慢慢补上。',
        '先把它搭成我愿意一直打开的样子，再慢慢把内容塞满。',
      ],
    },
    notice: {
      enable: false,
      content: '',
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
