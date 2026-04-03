<script setup lang="ts">
import { computed } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const heroChips = [
  '个人小站',
  '日常与记录',
]

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
    },
  ]
})

const sectionLinks = [
  {
    title: 'Data & Dev',
    badge: '开发记录',
    copy: '改站、写代码和那些以后还会回来翻的判断。',
    to: '/tech/',
  },
  {
    title: 'Life & Cat',
    badge: '生活区',
    copy: '普通日子、猫和想留下来的小事。',
    to: '/life/',
  },
  {
    title: 'Japan & ACG',
    badge: '兴趣区',
    copy: '作品、音乐和会反复回头看的东西。',
    to: '/hobbies/',
  },
  {
    title: '互动区',
    badge: '来玩一下',
    copy: '纸条、话题、签到和许愿都在这边。',
    to: '/interact/',
  },
]
</script>

<template>
  <section class="home-board home-board--landing">
    <div class="hero-grid">
      <article class="home-panel hero-panel hero-panel-main">
        <p class="home-eyebrow">EdDYON 和朋友们</p>
        <h2 class="home-title">把想留住的东西都放进来，之后再慢慢回头看</h2>
        <p class="home-copy">
          这里有日常、写过的代码、喜欢的作品，也有一些当下不想弄丢的情绪和片段。不是每一篇都很重要，但都是我愿意留在这里的东西。
        </p>

        <div class="hero-chip-row">
          <span v-for="chip in heroChips" :key="chip" class="inline-chip">{{ chip }}</span>
        </div>

        <div class="home-actions">
          <AppLink class="action-pill" to="/posts/">
            <span>进入内容页</span>
            <strong>文章、更新和阅读都从这里开始</strong>
          </AppLink>
          <AppLink class="action-pill" to="/about/">
            <span>关于这里</span>
            <strong>关于我、关于站点和整个分区都在这边</strong>
          </AppLink>
        </div>
      </article>

      <article class="home-panel hero-panel hero-panel-side">
        <div class="home-section-head compact">
          <div>
            <p class="mini-label">站点一眼看完</p>
            <h3>更像一个会一直住下去的小站</h3>
          </div>
        </div>

        <div class="home-role-list">
          <div class="home-role-item">
            <strong>会写下来</strong>
            <span>技术、日常和一些很普通的小事，只要想留住，就都会慢慢放进来。</span>
          </div>
          <div class="home-role-item">
            <strong>会分开放</strong>
            <span>开发、生活和兴趣各有各的位置，逛的时候不会全都挤在一起。</span>
          </div>
          <div class="home-role-item">
            <strong>也欢迎路过</strong>
            <span>如果只是想留一句话、签个到，或者随便看看，也都能找到自己的角落。</span>
          </div>
        </div>

        <div class="metric-strip">
          <div v-for="metric in metrics" :key="metric.label" class="metric-inline">
            <span class="metric-label">{{ metric.label }}</span>
            <strong class="metric-value">{{ metric.value }}</strong>
          </div>
        </div>
      </article>
    </div>

    <article class="home-panel">
      <div class="home-section-head">
        <div>
          <p class="mini-label">栏目入口</p>
          <h3>先看哪一边，都可以从这里走</h3>
        </div>
        <p class="section-copy">四个常用入口留在这里，剩下的交给导航慢慢展开。</p>
      </div>

      <div class="quick-links quick-links-compact">
        <AppLink v-for="link in sectionLinks" :key="link.to" class="quick-link-card" :to="link.to">
          <span class="quick-link-badge">{{ link.badge }}</span>
          <strong>{{ link.title }}</strong>
          <span class="mini-copy">{{ link.copy }}</span>
        </AppLink>
      </div>
    </article>
  </section>
</template>
