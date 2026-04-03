<script setup lang="ts">
import { computed } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const heroChips = [
  '主页入口',
  '内容单独一页',
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
        <p class="home-eyebrow">EdDYON の小站</p>
        <h2 class="home-title">主页只负责把你带进来，内容和文章单独放到另一页</h2>
        <p class="home-copy">
          这次把首页和内容页彻底拆开了。首页只保留气质、入口和分区，真正要读的文章统一去内容页，阅读时不会再被首页那套展示感带着走。
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
            <span>先看我是谁</span>
            <strong>关于我、关于站点和整个分区都在这边</strong>
          </AppLink>
        </div>
      </article>

      <article class="home-panel hero-panel hero-panel-side">
        <div class="home-section-head compact">
          <div>
            <p class="mini-label">现在的分工</p>
            <h3>主页和内容页分开了</h3>
          </div>
        </div>

        <div class="home-role-list">
          <div class="home-role-item">
            <strong>主页</strong>
            <span>保留入口、气质和栏目分区。</span>
          </div>
          <div class="home-role-item">
            <strong>内容页</strong>
            <span>只负责文章、阅读和评论，不再承担展示任务。</span>
          </div>
          <div class="home-role-item">
            <strong>栏目页</strong>
            <span>每一块单独展开，不再都挤在首页首屏。</span>
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
          <h3>从这里决定你想先看哪一边</h3>
        </div>
        <p class="section-copy">首页不再挂文章流，栏目和内容分开走。</p>
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
