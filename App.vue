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
  <video v-if="route.path === '/'" autoplay loop muted playsinline class="custom-bg">
    <source src="/bg.mp4" type="video/mp4" />
  </video>
  
  <img v-else src="/other-bg.jpg" class="custom-bg" />

  <div id="sakana-widget" class="sakana-container"></div>
</template>

<style>
.custom-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: -999;
  pointer-events: none;
}

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