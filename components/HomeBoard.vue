<script setup lang="ts">
import { usePageList, usePostList } from 'valaxy'
import { computed, ref } from 'vue'

const posts = usePostList()
const pages = usePageList()

const notes = [
  '先把站搭顺眼，再慢慢把想写的东西放进来。',
  '我不想把这里做成模板样板间，所以会一直改。',
  '最近想补的是日常、ACG 和记一点开发折腾。',
]
const noteIndex = ref(0)

const metrics = computed(() => {
  const tagCount = new Set(posts.value.flatMap(post => post.tags || [])).size

  return [
    {
      label: '文章',
      value: String(posts.value.length).padStart(2, '0'),
      note: '先从零散记录开始攒',
    },
    {
      label: '页面',
      value: String(pages.value.length).padStart(2, '0'),
      note: '还在慢慢收拾成自己喜欢的样子',
    },
    {
      label: '标签',
      value: String(tagCount).padStart(2, '0'),
      note: '想到什么写什么，但还是想分清楚',
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
    title: '这站不是一次改完的',
    copy: '我会一点点收拾它，今天改布局，明天改配色，后天也可能突然删掉一个我不喜欢的区块。',
  },
  {
    title: '想写的东西其实挺杂',
    copy: '代码、日常、猫、ACG 都会有，不想把自己拆成很标准的几块。',
  },
  {
    title: '手机端我也在认真看',
    copy: '不想再出现电脑上能看、手机上就乱掉的情况，所以这轮会优先把阅读体验压顺。',
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
        <p class="home-eyebrow">EdDYON の小站</p>
        <h2 class="home-title">这里就是我最近慢慢搭起来的地方</h2>
        <p class="home-copy">
          现在还在建设中，但我希望它最后看起来像一个真正属于我的小站，不是套了模板就放着不动的那种。
        </p>

        <div class="home-actions">
          <AppLink class="action-pill" to="/posts/">
            <span>先随便逛逛</span>
            <strong>看看最近写了什么</strong>
          </AppLink>
          <button type="button" class="action-pill" @click="nextNote">
            <span>碎碎念</span>
            <strong>{{ notes[noteIndex] }}</strong>
          </button>
        </div>
      </article>

      <article class="home-panel">
        <p class="mini-label">最近在想</p>
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
