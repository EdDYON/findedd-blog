<route lang="yaml">
meta:
  frontmatter:
    title: 互动区
    comment: false
</route>
<script setup lang="ts">
import { siteAnnouncement, weeklyTopic } from '../../data/interactions'

const walls = [
  {
    title: '匿名小纸条',
    badge: '轻留言',
    copy: '路过的话，留一句短短的话就够了。公开显示一部分，不用写成长评。',
    to: '/interact/notes',
  },
  {
    title: '本周话题墙',
    badge: '一起聊',
    copy: '这周的问题已经挂上去了，大家可以围着同一个题目慢慢聊。',
    to: '/interact/topic',
  },
  {
    title: '签到墙',
    badge: '今天来过',
    copy: '来过就按一下，顺手留个脚印，也会变成最近来过的人。',
    to: '/interact/checkin',
  },
  {
    title: '许愿池',
    badge: '随手丢愿望',
    copy: '想许什么都可以，认真一点、随便一点都行。',
    to: '/interact/wishes',
  },
  {
    title: '友邻留言墙',
    badge: '串门用',
    copy: '如果是路过的博主或者朋友，可以从这里留个门牌和一句话。',
    to: '/interact/friends',
  },
  {
    title: '公告回应区',
    badge: '站内广播',
    copy: '站里最近的小动静会放这里，你也可以直接回应。',
    to: '/interact/notice',
  },
]
</script>

<template>
  <div class="page-intro">
    <p class="eyebrow">Interaction Hub</p>
    <h2>互动区</h2>
    <p>这里不想做成很正式的社区，更像一个可以随手开口、留痕、掉点小彩蛋的角落。</p>
  </div>

  <div class="feature-grid">
    <article class="feature-card">
      <p class="mini-label">站内公告</p>
      <h3>{{ siteAnnouncement.title }}</h3>
      <p>{{ siteAnnouncement.content }}</p>
      <span class="inline-chip">更新于 {{ siteAnnouncement.updatedAt }}</span>
    </article>

    <article class="feature-card">
      <p class="mini-label">本周话题</p>
      <h3>{{ weeklyTopic.title }}</h3>
      <p>{{ weeklyTopic.prompt }}</p>
      <AppLink class="inline-chip" to="/interact/topic">去接话</AppLink>
    </article>
  </div>

  <div class="feature-grid">
    <GachaMachine />
    <RoleQuizCard />
  </div>

  <div class="quick-links mt-6">
    <AppLink v-for="wall in walls" :key="wall.to" class="quick-link-card" :to="wall.to">
      <span class="quick-link-badge">{{ wall.badge }}</span>
      <strong>{{ wall.title }}</strong>
      <span class="mini-copy">{{ wall.copy }}</span>
    </AppLink>
  </div>
</template>

