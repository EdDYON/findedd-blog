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
      serverURL: 'https://findedd-waline.vercel.app',
    }),
  ],

  theme: 'yun',
  themeConfig: {
    banner: {
      enable: true,
      title: 'EdDYON和他的朋友们',
    },
    bg_image: {
      enable: false,
    },
    say: {
      enable: true,
      api: '',
      content: [
        '分享日常与开发记录 ヾ(≧▽≦*)o',
        '既然决定了，就一直前进吧',
      ],
    },
    notice: {
      enable: false,
    },
    fireworks: {
      enable: true,
      colors: ['#66CCFF', '#FFB3CC', '#99FF99', '#FFCC99', '#CCCCFF']
    },
    pages: [
      {
        name: '后台撰稿',
        url: 'https://admin.findedd.cn',
        icon: 'i-ri-quill-pen-line',
        color: '#8e44ad',
      },
      {
        name: '九机数据大屏',
        url: '/jiuji',
        icon: 'i-ri-bar-chart-box-line',
        color: '#00f2fe',
      },
      {
        name: 'Mods (中/En)',
        url: '/docs/',
        icon: 'i-ri-gamepad-line',
        color: '#10b981',
      },
      {
        name: 'Data & Dev',
        url: '/tech/',
        icon: 'i-ri-database-2-line',
        color: '#3b82f6',
      },
      {
        name: 'Life & Cat',
        url: '/life/',
        icon: 'i-ri-cat-line',
        color: '#f59e0b',
      },
      {
        name: 'Japan & ACG',
        url: '/hobbies/',
        icon: 'i-ri-flight-takeoff-line',
        color: '#ec4899',
      },
    ],
    footer: {
      since: 2026,
      powered: false,
      beian: {
        enable: false,
      },
    },
  },
})