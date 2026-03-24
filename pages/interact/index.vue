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
    icon: 'i-ri-quill-pen-line',
  },
  {
    title: '本周话题墙',
    badge: '一起聊',
    copy: '这周的问题已经挂上去了，大家可以围着同一个题目慢慢聊。',
    to: '/interact/topic',
    icon: 'i-ri-chat-1-line',
  },
  {
    title: '签到墙',
    badge: '今天来过',
    copy: '来过就按一下，顺手留个脚印，也会变成最近来过的人。',
    to: '/interact/checkin',
    icon: 'i-ri-footprint-line',
  },
  {
    title: '许愿池',
    badge: '随手丢愿望',
    copy: '想许什么都可以，认真一点、随便一点都行。',
    to: '/interact/wishes',
    icon: 'i-ri-send-plane-line',
  },
  {
    title: '友邻留言墙',
    badge: '串门用',
    copy: '如果是路过的博主或者朋友，可以从这里留个门牌和一句话。',
    to: '/interact/friends',
    icon: 'i-ri-links-line',
  },
  {
    title: '公告回应区',
    badge: '站内广播',
    copy: '站里最近的小动静会放这里，你也可以直接回应。',
    to: '/interact/notice',
    icon: 'i-ri-notification-2-line',
  },
]
</script>

<template>
  <section class="interaction-hub">
    <article class="hub-hero">
      <div class="hub-hero-copy">
        <p class="eyebrow">Interaction Hub</p>
        <h2>这里更像站里专门留出来的会客厅</h2>
        <p>
          不想把互动做成很重的社区，所以这里更偏“可以顺手开口”的感觉。你可以留纸条、接话题、签到、许愿，也可以先玩一下再走。
        </p>
      </div>

      <div class="hub-hero-badges">
        <span class="inline-chip">匿名小纸条</span>
        <span class="inline-chip">本周话题</span>
        <span class="inline-chip">签到墙</span>
        <span class="inline-chip">许愿池</span>
      </div>
    </article>

    <VisitorLoginCard />

    <div class="hub-top-grid">
      <article class="hub-highlight-card">
        <p class="mini-label">站内公告</p>
        <h3>{{ siteAnnouncement.title }}</h3>
        <p>{{ siteAnnouncement.content }}</p>
        <span class="inline-chip">更新于 {{ siteAnnouncement.updatedAt }}</span>
      </article>

      <article class="hub-highlight-card">
        <p class="mini-label">本周话题</p>
        <h3>{{ weeklyTopic.title }}</h3>
        <p>{{ weeklyTopic.prompt }}</p>
        <AppLink class="inline-chip" to="/interact/topic">去接话</AppLink>
      </article>
    </div>

    <div class="hub-play-grid">
      <GachaMachine />
      <RoleQuizCard />
    </div>

    <div class="hub-wall-grid">
      <AppLink v-for="wall in walls" :key="wall.to" class="hub-wall-card" :to="wall.to">
        <span class="hub-wall-icon" :class="wall.icon" />
        <span class="quick-link-badge">{{ wall.badge }}</span>
        <strong>{{ wall.title }}</strong>
        <span class="mini-copy">{{ wall.copy }}</span>
      </AppLink>
    </div>
  </section>
</template>

<style scoped>
.interaction-hub {
  display: grid;
  gap: 1.15rem;
}

.hub-hero,
.hub-highlight-card,
.hub-wall-card {
  position: relative;
  overflow: hidden;
}

.hub-hero {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 1rem;
  padding: 1.4rem;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(255, 174, 210, 0.16), transparent 28%),
    radial-gradient(circle at bottom left, rgba(118, 213, 255, 0.14), transparent 34%),
    rgba(8, 14, 25, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.hub-hero-copy h2,
.hub-highlight-card h3,
.hub-wall-card strong {
  color: #fff;
}

.hub-hero-copy p,
.hub-highlight-card p {
  color: rgba(240, 244, 255, 0.76);
  line-height: 1.85;
}

.hub-hero-copy h2 {
  margin: 0.4rem 0 0.8rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.05;
}

.hub-hero-badges {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  justify-content: flex-end;
  gap: 0.8rem;
}

.hub-top-grid,
.hub-play-grid,
.hub-wall-grid {
  display: grid;
  gap: 1rem;
}

.hub-top-grid,
.hub-play-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.hub-wall-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hub-highlight-card {
  border-radius: 26px;
  padding: 1.2rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.hub-highlight-card::after,
.hub-wall-card::after {
  content: '';
  position: absolute;
  inset: auto -12% -22% auto;
  width: 8rem;
  height: 8rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(145, 215, 255, 0.18), transparent 70%);
}

.hub-wall-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 220px;
  padding: 1.15rem;
  border-radius: 26px;
  text-decoration: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.hub-wall-card:hover {
  transform: translateY(-4px);
}

.hub-wall-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.07);
  color: #fff6fb;
  font-size: 1.2rem;
}

@media (max-width: 1100px) {
  .hub-wall-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hub-hero,
  .hub-top-grid,
  .hub-play-grid,
  .hub-wall-grid {
    grid-template-columns: 1fr;
  }

  .hub-hero {
    padding: 1rem;
  }

  .hub-hero-badges {
    justify-content: flex-start;
  }

  .hub-wall-card {
    min-height: auto;
  }
}
</style>
