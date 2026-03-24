<script setup lang="ts">
import { computed } from 'vue'
import { useFrontmatter } from 'valaxy'
import { useRoute } from 'vue-router'
import { defaultPostQuestion, reactionOptions } from '../data/interactions'

const frontmatter = useFrontmatter<any>()
const route = useRoute()

const question = computed(() => frontmatter.value.question || defaultPostQuestion)

function focusComment(message: string) {
  const host = document.querySelector('.wl-editor textarea') as HTMLTextAreaElement | null

  if (host) {
    if (!host.value.trim())
      host.value = message

    host.dispatchEvent(new Event('input', { bubbles: true }))
    host.focus()
    host.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }

  const commentBlock = document.querySelector('.yun-comment') as HTMLElement | null
  commentBlock?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  navigator.clipboard?.writeText(message).catch(() => {})
}

function saveReaction(label: string) {
  try {
    localStorage.setItem(`post-reaction:${route.path}`, label)
  }
  catch {}
}

function react(option: { label: string, message: string }) {
  saveReaction(option.label)
  focusComment(option.message)
}
</script>

<template>
  <section class="article-interaction">
    <article class="article-question-card">
      <p class="mini-label">先留个问题</p>
      <h3>看到这里时，想不想回一句？</h3>
      <p class="article-question">{{ question }}</p>

      <div class="article-reactions">
        <button
          v-for="option in reactionOptions"
          :key="option.label"
          type="button"
          class="article-reaction-chip"
          @click="react(option)"
        >
          {{ option.label }}
        </button>
      </div>

      <p class="article-tip">点上面的按钮会直接把一句开头带到评论区，你只要顺手接着写就行。</p>
    </article>
  </section>
</template>

<style scoped>
.article-interaction {
  margin-top: 1rem;
}

.article-question-card {
  border-radius: 26px;
  padding: 1.15rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.article-question-card h3,
.article-question {
  color: #fff;
}

.article-question {
  margin: 0.75rem 0 0;
  line-height: 1.8;
}

.article-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1rem;
}

.article-reaction-chip {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  padding: 0.65rem 1rem;
}

.article-tip {
  margin: 0.85rem 0 0;
  color: rgba(240, 244, 255, 0.68);
  line-height: 1.7;
}
</style>

