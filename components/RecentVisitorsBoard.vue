<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVisitorAuth } from '../composables/useVisitorAuth'
import { formatAbsoluteTime, formatRelativeTime, useVisitorHub } from '../composables/useVisitorHub'

const props = withDefaults(defineProps<{
  compact?: boolean
}>(), {
  compact: false,
})

const { loadSummary, loadingSummary, recentVisitors } = useVisitorHub()
const { loadVisitor, user } = useVisitorAuth()
const wallReady = ref(false)

const featuredVisitors = computed(() => recentVisitors.value.slice(0, props.compact ? 6 : 8))
const feedVisitors = computed(() => props.compact ? [] : recentVisitors.value.slice(0, 8))

function isCurrentVisitor(openid: string) {
  return Boolean(user.value?.openid) && user.value?.openid === openid
}

function nicknameInitial(name: string) {
  return (name || '路').slice(0, 1)
}

onMounted(async () => {
  await loadVisitor()
  await loadSummary()
  requestAnimationFrame(() => {
    wallReady.value = true
  })
})
</script>

<template>
  <article class="visitor-panel">
    <div class="panel-head">
      <div>
        <p class="mini-label">最近访客</p>
        <h3>{{ compact ? '最近来过的人' : '最近在这里留下脚印的人' }}</h3>
      </div>
      <span class="inline-chip">{{ recentVisitors.length }} 人</span>
    </div>

    <p class="panel-copy">
      {{ loadingSummary ? '正在看最近谁来过...' : '来过的人会先挂在上面，像一面慢慢亮起来的头像墙。' }}
    </p>

    <div v-if="featuredVisitors.length" class="avatar-wall" :class="{ 'is-ready': wallReady }">
      <div
        v-for="(item, index) in featuredVisitors"
        :key="`${item.visitor.openid}-${item.updated_at}`"
        class="avatar-card"
        :class="{ 'is-me': isCurrentVisitor(item.visitor.openid) }"
        :style="{ '--card-index': index }"
      >
        <div class="avatar-shell">
          <span class="avatar-ring avatar-ring-a" />
          <span class="avatar-ring avatar-ring-b" />
          <span class="avatar-glow" />
          <img v-if="item.visitor.avatar" :src="item.visitor.avatar" :alt="item.visitor.nickname" class="visitor-avatar" />
          <span v-else class="visitor-avatar visitor-fallback">{{ nicknameInitial(item.visitor.nickname) }}</span>
          <span class="avatar-spark" />
        </div>
        <div class="avatar-copy">
          <strong>{{ item.visitor.nickname }}</strong>
          <span class="avatar-time">{{ formatRelativeTime(item.updated_at) }}</span>
        </div>
        <span v-if="isCurrentVisitor(item.visitor.openid)" class="avatar-chip">就是你</span>
      </div>
    </div>

    <div v-if="feedVisitors.length" class="visitor-feed">
      <div
        v-for="item in feedVisitors"
        :key="`${item.visitor.openid}-${item.updated_at}-feed`"
        class="visitor-item"
        :class="{ 'is-me': isCurrentVisitor(item.visitor.openid) }"
      >
        <img v-if="item.visitor.avatar" :src="item.visitor.avatar" :alt="item.visitor.nickname" class="feed-avatar" />
        <span v-else class="feed-avatar visitor-fallback">{{ nicknameInitial(item.visitor.nickname) }}</span>

        <div class="visitor-body">
          <div class="visitor-meta">
            <strong>{{ item.visitor.nickname }}</strong>
            <span>{{ formatAbsoluteTime(item.updated_at) }}</span>
          </div>
          <p>{{ item.message }}</p>
        </div>
      </div>
    </div>

    <p v-else-if="!featuredVisitors.length" class="panel-empty">这里还空着，等第一个人来按一下签到。</p>
  </article>
</template>

<style scoped>
.visitor-panel {
  border-radius: 26px;
  padding: 1.1rem;
  background:
    radial-gradient(circle at top right, rgba(145, 215, 255, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.panel-head h3,
.avatar-card strong,
.visitor-meta strong {
  color: #fff;
}

.panel-copy,
.avatar-time,
.visitor-meta span,
.visitor-item p,
.panel-empty {
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.75;
}

.panel-copy {
  margin: 0.7rem 0 0;
}

.avatar-wall {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  gap: 0.85rem;
  margin-top: 1rem;
  align-items: stretch;
}

.avatar-card {
  --card-delay: calc(var(--card-index) * 0.12s);
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  padding: 0.9rem 0.55rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  isolation: isolate;
  opacity: 0;
  transform: translateY(22px) scale(0.94);
  filter: saturate(0.82) blur(6px);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  animation: avatar-card-enter 0.88s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--card-delay);
}

.avatar-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(135deg, rgba(255, 196, 230, 0.12), transparent 38%),
    linear-gradient(200deg, transparent 52%, rgba(145, 215, 255, 0.1));
  opacity: 0.8;
  z-index: -1;
}

.avatar-card::after {
  content: '';
  position: absolute;
  inset: auto 14% -28% 14%;
  height: 1.2rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(118, 213, 255, 0.32), transparent 72%);
  filter: blur(12px);
  opacity: 0.8;
  z-index: -1;
}

.avatar-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(255, 196, 230, 0.28);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 18px 36px rgba(4, 10, 20, 0.28);
}

.avatar-card.is-me,
.visitor-item.is-me {
  border-color: rgba(255, 196, 230, 0.38);
  box-shadow: 0 0 0 1px rgba(255, 196, 230, 0.12), 0 18px 32px rgba(4, 10, 20, 0.22);
}

.avatar-shell {
  position: relative;
  display: grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
}

.avatar-wall.is-ready .avatar-shell {
  animation: avatar-card-float 5.8s ease-in-out infinite;
  animation-delay: calc(var(--card-delay) + 0.72s);
}

.avatar-copy {
  display: grid;
  gap: 0.2rem;
  width: 100%;
}

.avatar-ring,
.avatar-glow,
.avatar-spark {
  position: absolute;
  pointer-events: none;
}

.avatar-ring {
  inset: 0.15rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  opacity: 0.18;
}

.avatar-wall.is-ready .avatar-ring-a {
  animation: avatar-ring-spin 9s linear infinite;
  animation-delay: calc(var(--card-delay) + 0.6s);
}

.avatar-ring-b {
  inset: 0.42rem;
  border-style: dashed;
  border-color: rgba(145, 215, 255, 0.22);
  opacity: 0.12;
}

.avatar-wall.is-ready .avatar-ring-b {
  animation: avatar-ring-spin-reverse 12s linear infinite;
  animation-delay: calc(var(--card-delay) + 0.6s);
}

.avatar-glow {
  inset: 0.55rem;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 196, 230, 0.26), transparent 70%);
  filter: blur(8px);
  opacity: 0;
  animation: avatar-glow-enter 0.85s ease forwards;
  animation-delay: calc(var(--card-delay) + 0.18s);
}

.avatar-spark {
  top: 0.15rem;
  right: 0.25rem;
  width: 0.62rem;
  height: 0.62rem;
  border-radius: 999px;
  background: radial-gradient(circle, #fff, rgba(255, 255, 255, 0.2) 70%, transparent 72%);
  box-shadow: 0 0 14px rgba(255, 255, 255, 0.45);
  opacity: 0;
}

.avatar-wall.is-ready .avatar-spark {
  animation: avatar-sparkle 2.8s ease-in-out infinite;
  animation-delay: calc(var(--card-delay) + 1s);
}

.visitor-avatar,
.feed-avatar {
  width: 3.7rem;
  height: 3.7rem;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.07);
}

.feed-avatar {
  width: 2.9rem;
  height: 2.9rem;
  flex: 0 0 auto;
}

.visitor-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
}

.avatar-card strong {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-time {
  font-size: 0.82rem;
}

.avatar-chip {
  padding: 0.18rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 196, 230, 0.14);
  border: 1px solid rgba(255, 196, 230, 0.22);
  color: rgba(255, 238, 247, 0.92);
  font-size: 0.74rem;
  line-height: 1.2;
  opacity: 0;
  animation: avatar-chip-enter 0.55s ease forwards;
  animation-delay: calc(var(--card-delay) + 0.45s);
}

.visitor-feed {
  display: grid;
  gap: 0.85rem;
  margin-top: 1rem;
}

.visitor-item {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  padding: 0.85rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.visitor-body {
  min-width: 0;
  flex: 1;
}

.visitor-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: center;
}

.visitor-item p {
  margin: 0.3rem 0 0;
}

.panel-empty {
  margin: 1rem 0 0;
}

@media (max-width: 720px) {
  .avatar-wall {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .visitor-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

@keyframes avatar-card-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes avatar-card-enter {
  0% {
    opacity: 0;
    transform: translateY(22px) scale(0.94);
    filter: saturate(0.82) blur(6px);
  }
  55% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: saturate(1) blur(0);
  }
}

@keyframes avatar-ring-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes avatar-ring-spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes avatar-glow-enter {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 0.85;
    transform: scale(1);
  }
}

@keyframes avatar-sparkle {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.35;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: scale(1.18);
    opacity: 1;
  }
}

@keyframes avatar-chip-enter {
  0% {
    opacity: 0;
    transform: translateY(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
