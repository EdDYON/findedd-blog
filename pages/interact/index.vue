<route lang="yaml">
meta:
  frontmatter:
    title: 互动区
    comment: false
</route>

<script setup lang="ts">
import { siteAnnouncement, weeklyTopic } from '../../data/interactions'

const primaryWalls = [
  {
    title: '匿名小纸条',
    badge: '轻留言',
    copy: '路过的话，留一句短短的话就够了。',
    to: '/interact/notes',
    icon: 'i-ri-quill-pen-line',
  },
  {
    title: '本周话题墙',
    badge: '一起聊',
    copy: '围着同一个题目聊一聊，会比空评论区更有意思。',
    to: '/interact/topic',
    icon: 'i-ri-chat-1-line',
  },
  {
    title: '签到墙',
    badge: '今天来过',
    copy: '来过就按一下，顺手留个脚印。',
    to: '/interact/checkin',
    icon: 'i-ri-footprint-line',
  },
  {
    title: '许愿池',
    badge: '随手丢愿望',
    copy: '想许什么都可以，认真一点或随便一点都行。',
    to: '/interact/wishes',
    icon: 'i-ri-send-plane-line',
  },
]

const secondaryWalls = [
  {
    title: '友邻留言墙',
    to: '/interact/friends',
  },
  {
    title: '公告回应区',
    to: '/interact/notice',
  },
]
</script>

<template>
  <section class="interaction-hub">
    <article class="hub-hero">
      <div class="hub-hero-copy">
        <p class="eyebrow">Interaction Hub</p>
        <h2>想说一句、留个脚印，或者随手丢个愿望，都从这里进</h2>
        <p>
          这页先把最常用的互动入口放在前面，其他的留在下面，不再一上来把所有东西都摊满。
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

    <div class="hub-core-grid">
      <article class="hub-highlight-card">
        <p class="mini-label">本周话题</p>
        <h3>{{ weeklyTopic.title }}</h3>
        <p>{{ weeklyTopic.prompt }}</p>
        <AppLink class="inline-chip" to="/interact/topic">去接话</AppLink>
      </article>

      <RecentVisitorsBoard compact />

      <article class="hub-highlight-card notice-card">
        <p class="mini-label">站内公告</p>
        <h3>{{ siteAnnouncement.title }}</h3>
        <p>{{ siteAnnouncement.content }}</p>
        <AppLink class="inline-chip" to="/interact/notice">去看看</AppLink>
      </article>
    </div>

    <article class="hub-section-card">
      <div class="home-section-head">
        <div>
          <p class="mini-label">主要入口</p>
          <h3>先玩这些就够了</h3>
        </div>
        <p class="section-copy">把最常用的四个入口留在前面，剩下的放后面。</p>
      </div>

      <div class="hub-wall-grid">
        <AppLink v-for="wall in primaryWalls" :key="wall.to" class="hub-wall-card" :to="wall.to">
          <span class="hub-wall-icon" :class="wall.icon" />
          <span class="quick-link-badge">{{ wall.badge }}</span>
          <strong>{{ wall.title }}</strong>
          <span class="mini-copy">{{ wall.copy }}</span>
        </AppLink>
      </div>
    </article>

    <div class="hub-live-grid">
      <WishPoolCard compact />

      <article class="hub-secondary-card">
        <p class="mini-label">其他入口</p>
        <div class="secondary-links">
          <AppLink v-for="wall in secondaryWalls" :key="wall.to" class="secondary-link" :to="wall.to">
            <span>{{ wall.title }}</span>
            <span class="i-ri-arrow-right-up-line" />
          </AppLink>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.interaction-hub {
  display: grid;
  gap: 1rem;
}

.hub-hero,
.hub-highlight-card,
.hub-wall-card,
.hub-section-card,
.hub-secondary-card {
  position: relative;
  overflow: hidden;
}

.hub-hero {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 1rem;
  padding: 1.3rem;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(255, 174, 210, 0.14), transparent 28%),
    radial-gradient(circle at bottom left, rgba(118, 213, 255, 0.12), transparent 34%),
    rgba(8, 14, 25, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.hub-hero-copy h2,
.hub-highlight-card h3,
.hub-wall-card strong,
.hub-section-card h3,
.hub-secondary-card h3 {
  color: #fff;
}

.hub-hero-copy p,
.hub-highlight-card p,
.hub-secondary-card p {
  color: rgba(240, 244, 255, 0.76);
  line-height: 1.8;
}

.hub-hero-copy h2 {
  margin: 0.4rem 0 0.75rem;
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.08;
}

.hub-hero-badges {
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  justify-content: flex-end;
  gap: 0.8rem;
}

.hub-core-grid,
.hub-wall-grid,
.hub-live-grid,
.secondary-links {
  display: grid;
  gap: 1rem;
}

.hub-core-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.hub-live-grid {
  grid-template-columns: 1.15fr 0.85fr;
}

.hub-wall-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.hub-highlight-card,
.hub-section-card,
.hub-secondary-card {
  border-radius: 26px;
  padding: 1.2rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.hub-wall-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-height: 180px;
  padding: 1.1rem;
  border-radius: 24px;
  text-decoration: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.hub-wall-card:hover,
.secondary-link:hover {
  transform: translateY(-3px);
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

.notice-card,
.hub-secondary-card {
  min-height: 100%;
}

.secondary-links {
  margin-top: 0.8rem;
}

.secondary-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.95rem 1rem;
  border-radius: 18px;
  text-decoration: none;
  color: rgba(244, 247, 255, 0.88);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 1100px) {
  .hub-core-grid,
  .hub-live-grid,
  .hub-wall-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hub-hero,
  .hub-core-grid,
  .hub-live-grid,
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
