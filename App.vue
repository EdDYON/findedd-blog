<script setup>
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()

onMounted(() => {
  const live2d = document.createElement('script')
  live2d.src = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js'
  document.body.appendChild(live2d)

  const sakanaCss = document.createElement('link')
  sakanaCss.rel = 'stylesheet'
  sakanaCss.href = 'https://fastly.jsdelivr.net/npm/sakana-widget@2.7.1/lib/sakana.min.css'
  document.head.appendChild(sakanaCss)

  const sakanaJs = document.createElement('script')
  sakanaJs.src = 'https://fastly.jsdelivr.net/npm/sakana-widget@2.7.1/lib/sakana.min.js'
  sakanaJs.onload = () => {
    if (typeof SakanaWidget !== 'undefined') {
      new SakanaWidget().mount('#sakana-widget')
    }
  }
  document.body.appendChild(sakanaJs)
})
</script>

<template>
  <div id="sakana-widget" class="sakana-container"></div>
</template>

<style>
.sakana-container {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 999;
}

#live2d-widget-bar {
  display: none !important;
}

.sakana-widget-ctrl {
  display: none !important;
}
</style>