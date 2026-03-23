<script setup lang="ts">
import { usePageList, usePostList } from 'valaxy'
import { computed, ref } from 'vue'

const posts = usePostList()
const pages = usePageList()

const notes = [
  '布局先舒服，内容才更愿意慢慢长出来。',
  '别急着一次把所有页面写满，先让每一页都像同一座站。',
  '保留一点有趣的东西，这样网站才会有人味。',
]
const noteIndex = ref(0)

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
      note: '已经能开始形成首页内容流了',
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
      note: '把站点结构先搭稳定，再慢慢补厚',
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
      note: '先有分类意识，后面整理会轻松很多',
    },
  ]
})

const quickLinks = [
  {
    title: 'Data & Dev',
    copy: '开发记录、工具流、建站过程和一些值得复用的方法。',
    to: '/tech/',
  },
  {
    title: 'Life & Cat',
    copy: '普通日子、慢节奏和那些不想被错过的陪伴感。',
    to: '/life/',
  },
  {
    title: 'Japan & ACG',
    copy: 'ACG、音乐、旅途想象和想认真保存的兴趣切片。',
    to: '/hobbies/',
  },
  {
    title: '关于站点',
    copy: '看看这次改版想把它做成什么样，以及后面要补什么。',
    to: '/about/site/',
  },
]

const plans = [
  {
    title: '首页更像入口，不只是海报',
    copy: '先告诉来访的人这里会写什么、现在在更新什么，再把他们自然带到文章区。',
  },
  {
    title: '每个栏目都有自己的语气',
    copy: '开发页偏整理和归档，生活页偏轻松和碎片，兴趣页偏收藏和分享。',
  },
  {
    title: '移动端不再是附带品',
    copy: '卡片、浮层和排版都按手机尺寸重新压过，让阅读和浏览都更轻一点。',
  },
]

function nextNote() {
  noteIndex.value = (noteIndex.value + 1) % notes.length
}
</script>

<template>
  <section class="home-board">
    <div class="home-board-grid">
      <article class="home-panel">
        <p class="home-eyebrow">Now Building</p>
        <h2 class="home-title">一个会继续长大的私人栖息地</h2>
        <p class="home-copy">
          这里会慢慢收集开发记录、生活碎片和兴趣角落。先把气质和结构打磨顺，再让内容自己一点点长出来。
        </p>

        <div class="home-actions">
          <AppLink class="action-pill" to="/posts/">
            <span>最近文章</span>
            <strong>Start Here</strong>
          </AppLink>
          <button type="button" class="action-pill" @click="nextNote">
            <span>今日便签</span>
            <strong>{{ notes[noteIndex] }}</strong>
          </button>
        </div>
      </article>

      <article class="home-panel">
        <p class="mini-label">Quick Notes</p>
        <div class="plan-grid">
          <div v-for="plan in plans" :key="plan.title" class="plan-item">
            <h3>{{ plan.title }}</h3>
            <p>{{ plan.copy }}</p>
          </div>
        </div>
      </article>
    </div>

    <div class="metric-grid">
      <div v-for="metric in metrics" :key="metric.label" class="metric-card">
        <span class="metric-label">{{ metric.label }}</span>
        <strong class="metric-value">{{ metric.value }}</strong>
        <span class="metric-note">{{ metric.note }}</span>
      </div>
    </div>

    <div class="quick-links">
      <AppLink v-for="link in quickLinks" :key="link.to" class="quick-link-card" :to="link.to">
        <strong>{{ link.title }}</strong>
        <span class="mini-copy">{{ link.copy }}</span>
      </AppLink>
    </div>
  </section>
</template>
