import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'

export default defineValaxyConfig<UserThemeConfig>({
  devtools: false,

  siteConfig: {
    comment: {
      enable: false,
    },
  },

  addons: [],

  theme: 'yun',
  themeConfig: {
    banner: {
      enable: false,
    },
    bg_image: {
      enable: false,
    },
    say: {
      enable: false,
    },
    notice: {
      enable: false,
      content: '',
    },
    fireworks: {
      enable: false,
    },
    nav: [],
    pages: [],
    footer: {
      since: 2026,
      powered: false,
      icon: {
        enable: false,
      },
      beian: {
        enable: false,
      },
    },
  },
})
