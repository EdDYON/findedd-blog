<script setup lang="ts">
import { computed, ref } from 'vue'
import { roleQuiz } from '../data/interactions'

type RoleType = 'tech' | 'life' | 'acg'

const answers = ref<RoleType[]>([])
const currentIndex = ref(0)

const currentQuestion = computed(() => roleQuiz.questions[currentIndex.value])
const finished = computed(() => answers.value.length === roleQuiz.questions.length)
const result = computed(() => {
  if (!finished.value)
    return null

  const score = answers.value.reduce<Record<RoleType, number>>((acc, type) => {
    acc[type] += 1
    return acc
  }, {
    tech: 0,
    life: 0,
    acg: 0,
  })

  return Object.entries(score)
    .sort((a, b) => b[1] - a[1])[0][0] as RoleType
})

function choose(type: RoleType) {
  answers.value.push(type)
  currentIndex.value += 1
}

function resetQuiz() {
  answers.value = []
  currentIndex.value = 0
}
</script>

<template>
  <article class="toy-panel">
    <div class="toy-head">
      <div>
        <p class="mini-label">角色测试</p>
        <h3>{{ roleQuiz.title }}</h3>
      </div>
      <button v-if="finished" type="button" class="toy-button" @click="resetQuiz">
        再测一次
      </button>
    </div>

    <div v-if="!finished && currentQuestion" class="quiz-block">
      <p class="quiz-title">{{ currentQuestion.title }}</p>
      <div class="quiz-options">
        <button
          v-for="option in currentQuestion.options"
          :key="option.label"
          type="button"
          class="quiz-option"
          @click="choose(option.type as RoleType)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div v-else-if="result" class="quiz-result">
      <strong>{{ roleQuiz.results[result].title }}</strong>
      <p>{{ roleQuiz.results[result].copy }}</p>
    </div>
  </article>
</template>

<style scoped>
.toy-panel {
  border-radius: 28px;
  padding: 1.25rem;
  background: rgba(8, 14, 25, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.toy-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.toy-head h3,
.quiz-result strong {
  color: #fff;
}

.toy-button,
.quiz-option {
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.toy-button {
  padding: 0.65rem 1rem;
}

.quiz-block,
.quiz-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.quiz-title,
.quiz-result p {
  color: rgba(240, 244, 255, 0.74);
  line-height: 1.8;
}

.quiz-options {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.quiz-option {
  text-align: left;
  padding: 0.9rem 1rem;
}
</style>
