<script setup lang="ts">
import { ref } from 'vue'
import { gachaPool } from '../data/interactions'

const result = ref('')
const spinning = ref(false)

function roll() {
  spinning.value = true
  const next = gachaPool[Math.floor(Math.random() * gachaPool.length)]

  window.setTimeout(() => {
    result.value = next
    spinning.value = false
  }, 420)
}
</script>

<template>
  <article class="toy-panel">
    <div class="toy-head">
      <div>
        <p class="mini-label">扭蛋机</p>
        <h3>点一下会掉一句话</h3>
      </div>
      <button type="button" class="toy-button" @click="roll">
        {{ spinning ? '转一下...' : '来一颗' }}
      </button>
    </div>

    <p class="toy-copy">可能会掉一句碎碎念，也可能掉个推荐或者半句站长心情。</p>

    <div class="toy-result" :class="{ 'toy-result-active': result }">
      <span v-if="result">{{ result }}</span>
      <span v-else>还没掉出来，先按一下试试。</span>
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
.toy-result {
  color: #fff;
}

.toy-copy {
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.8;
}

.toy-button {
  min-width: 6rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 196, 230, 0.18);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  padding: 0.65rem 1rem;
}

.toy-result {
  margin-top: 1rem;
  min-height: 5.5rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  border-radius: 22px;
  text-align: center;
  line-height: 1.8;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.14);
}

.toy-result-active {
  border-style: solid;
  border-color: rgba(145, 215, 255, 0.24);
}
</style>
