<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePageList, usePostList } from 'valaxy'

const posts = usePostList()
const pages = usePageList()

const notes = [
  '先把首页住舒服，再慢慢往里放内容。',
  '这里会写代码，也会记普通日子。',
  '比起模板站，我更想把它搭成真的会反复打开的小地方。',
]
const noteIndex = ref(0)

const heroChips = [
  '二次元风格',
  '动态壁纸保留',
  '移动端重排',
  '继续施工中',
]

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
      note: '先把想记的东西一点点攒起来',
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
      note: '页面也在慢慢收成同一种气质',
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
      note: '现在先别分太死，写着写着再整理',
    },
  ]
})

const plans = [
  {
    title: '首页先顺眼',
    copy: '这一轮先把第一眼做舒服，别再像很多区块简单叠起来。',
  },
  {
    title: '内容不想太正经',
    copy: '技术会写，日常也会放，喜欢的东西也不准备藏着。',
  },
  {
    title: '手机端别凑合',
    copy: '希望在手机上打开也顺手，不是只能电脑上看着还行。',
  },
]

const quickLinks = [
  {
    title: '九机展示屏',
    badge: '展示入口',
    copy: '我自己做的门店运营展示页，临时放在首页这边，打开会更顺手。',
    to: '/jiuji',
  },
  {
    title: 'Data & Dev',
    badge: '开发记录',
    copy: '代码、工具流、建站过程，还有那些值得以后复用的办法。',
    to: '/tech/',
  },
  {
    title: 'Life & Cat',
    badge: '生活区',
    copy: '普通日子、陪伴感和想留下来的碎片，不想只剩技术内容。',
    to: '/life/',
  },
  {
    title: 'Japan & ACG',
    badge: '兴趣区',
    copy: 'ACG、音乐、旅途想象，还有会让我反复回头看的东西。',
    to: '/hobbies/',
  },
  {
    title: '关于站点',
    badge: '施工记录',
    copy: '这里会慢慢记下这次改版到底想做成什么样。',
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
        <h2 class="home-title">把喜欢的东西、普通日子和折腾记录都放在这里</h2>
        <p class="home-copy">
          这里还在慢慢施工，但不是那种只把模板架起来就放着的站。我想一边写，一边把它改成自己真的会反复打开的样子。
        </p>

        <div class="hero-chip-row">
          <span v-for="chip in heroChips" :key="chip" class="inline-chip">{{ chip }}</span>
        </div>

        <div class="home-actions">
          <AppLink class="action-pill" to="/posts/">
            <span>先随便逛逛</span>
            <strong>看看最近写了什么</strong>
          </AppLink>
          <AppLink class="action-pill" to="/about/">
            <span>认识一下我</span>
            <strong>顺便看看这站为什么会长这样</strong>
          </AppLink>
        </div>
      </article>

      <article class="home-panel hero-panel hero-panel-side">
        <div class="home-section-head compact">
          <div>
            <p class="mini-label">站点状态</p>
            <h3>最近在收的几个地方</h3>
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
            <p class="mini-label">目前进度</p>
            <h3>最近在折腾什么</h3>
          </div>
          <p class="section-copy">这轮主要先把首页、观感和加载速度理顺。</p>
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
            <h3>从这里进会更顺手</h3>
          </div>
          <p class="section-copy">常用页面先放前面，临时展示入口也先留着。</p>
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
