<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const notes = [
  '先把想写的东西摆上来，样子再慢慢收。',
  '有些页还空着，但我确实在一点点填。',
  '这个站对我来说，不是摆着看的，是会一直住下去的。',
]
const noteIndex = ref(0)

const heroChips = [
  '二次元风格',
  '动态壁纸保留',
  '手机端继续收',
  '还在慢慢补',
]

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
      note: '先把想记的慢慢攒起来',
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
      note: '能用的先做出来，细节后面再收',
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
      note: '暂时先别分太细，写多了再整理',
    },
  ]
})

const plans = [
  {
    title: '互动区继续补',
    copy: '先让人能顺手留话，再慢慢把最近来过、最近留言这些东西接进来。',
  },
  {
    title: '旧东西慢慢搬',
    copy: '想留下来的记录会一点点挪进来，不急着一次塞满。',
  },
  {
    title: '手机端再细收',
    copy: '希望随手拿手机打开的时候，也不会觉得哪块挤或者乱。',
  },
]

const quickLinks = [
  {
    title: '互动区',
    badge: '来玩一下',
    copy: '纸条、话题、签到、许愿都在这边，想说一句的时候可以直接进去。',
    to: '/interact/',
  },
  {
    title: '九机展示屏',
    badge: '展示入口',
    copy: '我自己做的门店展示页，明天要用，所以先放在这里方便打开。',
    to: '/jiuji',
  },
  {
    title: 'Data & Dev',
    badge: '开发记录',
    copy: '写代码、改站、工具流，还有那些以后自己也会回来翻的东西。',
    to: '/tech/',
  },
  {
    title: 'Life & Cat',
    badge: '生活区',
    copy: '普通日子、猫、碎碎念和一些不想就这么过去的小事。',
    to: '/life/',
  },
  {
    title: 'Japan & ACG',
    badge: '兴趣区',
    copy: '喜欢的作品、音乐和一些会让我反复回头看的东西。',
    to: '/hobbies/',
  },
  {
    title: '关于站点',
    badge: '站点说明',
    copy: '这站为什么会长成现在这样，还有我后面还想怎么改。',
    to: '/about/site/',
  },
]

function nextNote() {
  noteIndex.value = (noteIndex.value + 1) % notes.length
}
</script>

<template>
  <section class="home-board">
    <div class="hero-grid">
      <article class="home-panel hero-panel hero-panel-main">
        <p class="home-eyebrow">EdDYON の小站</p>
        <h2 class="home-title">喜欢的东西、普通日子，还有折腾过的痕迹，都想放在这里</h2>
        <p class="home-copy">
          这站还在收拾，但我不想把它做成那种只剩模板味的博客。先把想记的东西放进来，再慢慢让它长成自己的样子。
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
            <p class="mini-label">站点状态</p>
            <h3>最近在收的几块</h3>
          </div>
          <button type="button" class="note-switch" @click="nextNote">
            换一句
          </button>
        </div>

        <p class="note-quote">{{ notes[noteIndex] }}</p>

        <div class="metric-grid metric-grid-compact">
          <div v-for="metric in metrics" :key="metric.label" class="metric-card">
            <span class="metric-label">{{ metric.label }}</span>
            <strong class="metric-value">{{ metric.value }}</strong>
            <span class="metric-note">{{ metric.note }}</span>
          </div>
        </div>
      </article>
    </div>

    <div class="home-section-grid">
      <article class="home-panel">
        <div class="home-section-head">
          <div>
            <p class="mini-label">最近在弄</p>
            <h3>这几天主要在收什么</h3>
          </div>
          <p class="section-copy">先把互动、观感和手机端这些最容易被看到的地方收顺。</p>
        </div>

        <div class="plan-grid">
          <div v-for="plan in plans" :key="plan.title" class="plan-item">
            <h3>{{ plan.title }}</h3>
            <p>{{ plan.copy }}</p>
          </div>
        </div>
      </article>

      <article class="home-panel">
        <div class="home-section-head">
          <div>
            <p class="mini-label">快速入口</p>
            <h3>从这里进会省事一点</h3>
          </div>
          <p class="section-copy">常用页面先放前面，临时要展示的也先留着。</p>
        </div>

        <div class="quick-links">
          <AppLink v-for="link in quickLinks" :key="link.to" class="quick-link-card" :to="link.to">
            <span class="quick-link-badge">{{ link.badge }}</span>
            <strong>{{ link.title }}</strong>
            <span class="mini-copy">{{ link.copy }}</span>
          </AppLink>
        </div>
      </article>
    </div>
  </section>
</template>
