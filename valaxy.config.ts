import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'
import { addonWaline } from 'valaxy-addon-waline'

export default defineValaxyConfig<UserThemeConfig>({
  devtools: false,
  
  addons: [
    addonWaline({
      serverURL: 'https://把你刚复制的Waline域名粘贴在这里',
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
        'Easy Adventure & Ocular Nexus 持续更新中！',
        '既然决定了，就要像逢坂大河一样勇往直前！',
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
