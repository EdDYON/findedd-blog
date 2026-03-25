<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const notes = [
  '这个站对我来说，不是摆着看的，是会一直住下去的。',
  '想留住的东西都可以往这里放，不用非得分得那么开。',
  '比起像模板，我更希望它像一个会让我反复打开的小站。',
]
const noteIndex = ref(0)

const heroChips = [
  '个人小站',
  '夜色氛围',
  '互动已经上线',
  '日常和记录',
]

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
      note: '想留下来的东西都会往这里放',
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
      note: '常用入口和栏目已经分开了',
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
      note: '写得多了自然就会分得更清楚',
    },
  ]
})

const plans = [
  {
    title: '互动区',
    copy: '纸条、话题、签到、许愿和最近访客都已经接进来了，这边现在就是站里的会客厅。',
  },
  {
    title: '栏目内容',
    copy: '开发、生活和兴趣这几块已经分开，各自都有明确的位置和内容方向。',
  },
  {
    title: '整体观感',
    copy: '动态背景、夜色氛围和互动感都保留着，整体已经更像一个完整的小站。',
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
    copy: '这里会讲清楚这个站现在的样子、分区和整体气质。',
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
          这里会放日常、开发记录、ACG，还有那些我以后自己也会回来翻的东西。比起做成一个标准博客，我更想把它留成一个真的会反复打开的小站。
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
            <p class="mini-label">站点侧写</p>
            <h3>现在它更像什么</h3>
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
            <p class="mini-label">站点内容</p>
            <h3>现在这边主要能看到什么</h3>
          </div>
          <p class="section-copy">把内容、互动和观感都分开摆好之后，整个站终于开始像自己的地方了。</p>
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
