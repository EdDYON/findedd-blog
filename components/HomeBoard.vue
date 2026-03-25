<script setup lang="ts">
import { computed } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const heroChips = [
  '个人小站',
  '日常记录',
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

const quickLinks = [
  {
    title: '互动区',
    badge: '来玩一下',
    copy: '纸条、话题、签到和许愿都在这边。',
    to: '/interact/',
  },
  {
    title: '九机展示屏',
    badge: '展示入口',
    copy: '门店展示页，临时先放在首页方便打开。',
    to: '/jiuji',
  },
  {
    title: 'Data & Dev',
    badge: '开发记录',
    copy: '写代码、改站和一些会回头翻的记录。',
    to: '/tech/',
  },
  {
    title: 'Life & Cat',
    badge: '生活区',
    copy: '普通日子、猫和想记住的小事。',
    to: '/life/',
  },
]
</script>

<template>
  <section class="home-board">
    <div class="hero-grid">
      <article class="home-panel hero-panel hero-panel-main">
        <p class="home-eyebrow">EdDYON の小站</p>
        <h2 class="home-title">喜欢的东西、普通日子，还有折腾过的痕迹，都想放在这里</h2>
        <p class="home-copy">
          这里会放日常、开发记录、ACG，还有那些以后自己也会回来翻的东西。页面先尽量收轻一点，让文章和内容本身站到前面。
        </p>

        <div class="hero-chip-row">
          <span v-for="chip in heroChips" :key="chip" class="inline-chip">{{ chip }}</span>
        </div>

        <div class="home-actions">
          <AppLink class="action-pill" to="/posts/">
            <span>先随便逛逛</span>
            <strong>看看最近写了什么</strong>
          </AppLink>
          <AppLink class="action-pill" to="/interact/">
            <span>和我互动</span>
            <strong>想留言、许愿、签到的话，从这里进</strong>
          </AppLink>
        </div>
      </article>

      <article class="home-panel hero-panel hero-panel-side">
        <div class="home-section-head compact">
          <div>
            <p class="mini-label">站点概览</p>
            <h3>轻一点就够了</h3>
          </div>
        </div>

        <p class="home-overview-copy">
          首页先留一句话和几个数字，剩下的交给文章、栏目页和导航慢慢展开。
        </p>

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
          <p class="mini-label">快速入口</p>
          <h3>先从常用的几个地方进去</h3>
        </div>
        <p class="section-copy">只留 4 个最常点开的入口，其他的交给导航。</p>
      </div>

      <div class="quick-links quick-links-compact">
        <AppLink v-for="link in quickLinks" :key="link.to" class="quick-link-card" :to="link.to">
          <span class="quick-link-badge">{{ link.badge }}</span>
          <strong>{{ link.title }}</strong>
          <span class="mini-copy">{{ link.copy }}</span>
        </AppLink>
      </div>
    </article>
  </section>
</template>
