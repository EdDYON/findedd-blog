<script setup lang="ts">
import { computed } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const heroChips = [
  '个人小站',
  '日常记录',
  '开发和兴趣',
]

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
      note: '文章和日志都在这里',
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
      note: '常用入口已经分开摆好',
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
      note: '写得多了自然会更清楚',
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
  {
    title: 'Japan & ACG',
    badge: '兴趣区',
    copy: '作品、音乐和会反复回头看的东西。',
    to: '/hobbies/',
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
            <h3>先看这里就够了</h3>
          </div>
        </div>

        <p class="note-quote">
          这里不再把所有东西都堆在首页，而是把常用入口和最近会看的内容先留出来，剩下的交给文章和栏目页慢慢展开。
        </p>

        <div class="metric-grid metric-grid-side">
          <div v-for="metric in metrics" :key="metric.label" class="metric-card">
            <span class="metric-label">{{ metric.label }}</span>
            <strong class="metric-value">{{ metric.value }}</strong>
            <span class="metric-note">{{ metric.note }}</span>
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
        <p class="section-copy">只留最常点开的几个，首页不再铺太满。</p>
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
