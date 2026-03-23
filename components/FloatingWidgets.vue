<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  isHome: boolean
  showMascot: boolean
}>()

const mounted = ref(false)
const now = ref(new Date())
const scrollProgress = ref(0)
const messageIndex = ref(0)

const messages = [
  '慢慢写，反而更容易留下真正想说的话。',
  '今天也适合补一篇短记录，而不是只想着大工程。',
  '页面可以继续改，但生活也值得顺手记一下。',
  '如果你已经看到这里，这座站就算开始有访客了。',
]

let timer: ReturnType<typeof setInterval> | null = null

const localeTime = computed(() => {
  if (!mounted.value)
    return '--:--'

  return now.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
})

const dayProgress = computed(() => {
  if (!mounted.value)
    return 0

  const current = now.value.getHours() * 3600 + now.value.getMinutes() * 60 + now.value.getSeconds()
  return Math.min(100, Math.round((current / 86400) * 100))
})

const currentMessage = computed(() => messages[messageIndex.value])

function updateScrollProgress() {
  const scrollTop = window.scrollY
  const total = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = total > 0 ? Math.min(100, Math.round((scrollTop / total) * 100)) : 0
}

function nextMessage() {
  messageIndex.value = (messageIndex.value + 1) % messages.length
}

onMounted(() => {
  mounted.value = true
  now.value = new Date()
  updateScrollProgress()

  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)

  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress, { passive: true })
})

onBeforeUnmount(() => {
  if (timer)
    clearInterval(timer)

  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
})
</script>

<template>
  <aside class="floating-widgets" :class="{ compact: !props.isHome }">
    <div class="widget-card">
      <div class="widget-topline">
        <span class="status-dot" />
        <span>Site Online</span>
      </div>

      <div class="widget-clock">{{ localeTime }}</div>
      <div class="widget-subline">今天已经走过 {{ dayProgress }}%</div>

      <div class="progress-track">
        <div class="progress-fill" :style="{ width: `${dayProgress}%` }" />
      </div>

      <div class="scroll-row">
        <span>页面进度</span>
        <strong>{{ scrollProgress }}%</strong>
      </div>

      <p class="widget-message">{{ currentMessage }}</p>

      <div class="widget-actions">
        <button type="button" class="widget-btn" @click="nextMessage">
          换一句
        </button>
        <AppLink class="widget-btn ghost" to="/posts/">
          去看文章
        </AppLink>
      </div>
    </div>

    <div v-if="props.showMascot" id="sakana-widget" class="sakana-shell" />
  </aside>
</template>

<style scoped>
.floating-widgets {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 42;
  display: grid;
  gap: 0.8rem;
  width: min(320px, calc(100vw - 1rem));
}

.floating-widgets.compact {
  width: min(300px, calc(100vw - 1rem));
}

.widget-card {
  border-radius: 24px;
  padding: 1rem;
  background: rgba(10, 16, 28, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 60px rgba(5, 10, 20, 0.25);
  color: #fff;
}

.widget-topline,
.scroll-row,
.widget-actions {
  display: flex;
  align-items: center;
}

.widget-topline,
.scroll-row {
  justify-content: space-between;
  color: rgba(240, 244, 255, 0.7);
  font-size: 0.82rem;
}

.status-dot {
  width: 0.58rem;
  height: 0.58rem;
  border-radius: 999px;
  background: #6ee7b7;
  box-shadow: 0 0 16px rgba(110, 231, 183, 0.7);
}

.widget-clock {
  margin-top: 0.6rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 600;
}

.widget-subline {
  color: rgba(240, 244, 255, 0.68);
}

.progress-track {
  width: 100%;
  height: 0.5rem;
  margin: 0.9rem 0 0.75rem;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff9a6c, #ffd27d);
}

.widget-message {
  margin: 0.95rem 0;
  line-height: 1.7;
  color: rgba(244, 247, 255, 0.84);
}

.widget-actions {
  gap: 0.6rem;
}

.widget-btn {
  border: 0;
  border-radius: 999px;
  padding: 0.68rem 0.9rem;
  background: linear-gradient(135deg, #ff8a65, #f6ad55);
  color: #09111f;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.widget-btn.ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.sakana-shell {
  min-height: 220px;
  border-radius: 28px;
  background: rgba(10, 16, 28, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px rgba(5, 10, 20, 0.22);
  overflow: hidden;
}

@media (max-width: 900px) {
  .floating-widgets {
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    width: auto;
  }

  .widget-card {
    border-radius: 20px;
    padding: 0.9rem;
  }

  .widget-clock {
    font-size: 1.65rem;
  }
}
</style>
