<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')

const cursorX = ref(0)
const cursorY = ref(0)
const showCursorGlow = ref(false)
const showMascot = ref(false)
const showLive2d = ref(false)
const petalCount = 12

const sakanaState = {
  scriptLoaded: false,
}

const live2dState = {
  scriptLoaded: false,
}

let cleanupPointer = () => {}
let cleanupResize = () => {}
let cleanupClick = () => {}

function mountSakana() {
  const win = window as Window & {
    SakanaWidget?: new (options?: Record<string, unknown>) => { mount: (selector: string) => void }
  }
  const host = document.getElementById('sakana-widget')

  if (!host || !win.SakanaWidget)
    return

  host.innerHTML = ''
  new win.SakanaWidget({
    autoFit: true,
    size: 220,
  }).mount('#sakana-widget')
}

function loadSakana() {
  if (!showMascot.value)
    return

  const existingStyle = document.querySelector('link[data-sakana-style="true"]')
  if (!existingStyle) {
    const style = document.createElement('link')
    style.rel = 'stylesheet'
    style.href = 'https://fastly.jsdelivr.net/npm/sakana-widget@2.7.1/lib/sakana.min.css'
    style.dataset.sakanaStyle = 'true'
    document.head.appendChild(style)
  }

  const win = window as Window & {
    SakanaWidget?: new (options?: Record<string, unknown>) => { mount: (selector: string) => void }
  }

  if (win.SakanaWidget) {
    mountSakana()
    return
  }

  if (sakanaState.scriptLoaded)
    return

  const script = document.createElement('script')
  script.src = 'https://fastly.jsdelivr.net/npm/sakana-widget@2.7.1/lib/sakana.min.js'
  script.async = true
  script.dataset.sakanaScript = 'true'
  script.onload = () => {
    sakanaState.scriptLoaded = true
    mountSakana()
  }
  document.body.appendChild(script)
}

function loadLive2d() {
  if (!showLive2d.value)
    return

  const existingScript = document.querySelector('script[data-live2d-script="true"]')
  if (existingScript || live2dState.scriptLoaded)
    return

  const script = document.createElement('script')
  script.src = 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js'
  script.async = true
  script.dataset.live2dScript = 'true'
  script.onload = () => {
    live2dState.scriptLoaded = true
  }
  document.body.appendChild(script)
}

function spawnStar(event: MouseEvent) {
  const star = document.createElement('span')
  star.className = 'click-star'
  star.textContent = ['✦', '✧', '✶'][Math.floor(Math.random() * 3)]
  star.style.left = `${event.clientX}px`
  star.style.top = `${event.clientY}px`
  document.body.appendChild(star)

  window.setTimeout(() => {
    star.remove()
  }, 900)
}

function updateExperience() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const largeScreen = window.matchMedia('(min-width: 1080px)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches

  showMascot.value = largeScreen && !reducedMotion
  showLive2d.value = largeScreen && !reducedMotion
  showCursorGlow.value = finePointer && !reducedMotion

  if (showMascot.value)
    requestAnimationFrame(loadSakana)

  if (showLive2d.value)
    requestAnimationFrame(loadLive2d)
}

onMounted(() => {
  const handlePointerMove = (event: PointerEvent) => {
    cursorX.value = event.clientX
    cursorY.value = event.clientY
  }
  const handleClick = (event: MouseEvent) => {
    if (!showCursorGlow.value)
      return
    spawnStar(event)
  }

  updateExperience()

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('resize', updateExperience, { passive: true })
  window.addEventListener('click', handleClick, { passive: true })

  cleanupPointer = () => window.removeEventListener('pointermove', handlePointerMove)
  cleanupResize = () => window.removeEventListener('resize', updateExperience)
  cleanupClick = () => window.removeEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  cleanupPointer()
  cleanupResize()
  cleanupClick()
})
</script>

<template>
  <div class="site-chrome">
    <video v-if="isHome" autoplay loop muted playsinline class="site-video">
      <source src="/bg.mp4" type="video/mp4" />
    </video>

    <div class="site-overlay" />
    <div class="site-grid" />
    <div class="sakura-layer">
      <span v-for="index in petalCount" :key="index" class="petal" :style="{ '--petal-index': index }" />
    </div>
    <div class="site-orb orb-a" />
    <div class="site-orb orb-b" />
    <div class="site-orb orb-c" />

    <div
      v-if="showCursorGlow"
      class="cursor-glow"
      :style="{ transform: `translate(${cursorX - 180}px, ${cursorY - 180}px)` }"
    />
  </div>

  <FloatingWidgets :is-home="isHome" :show-mascot="showMascot" />
</template>

<style scoped>
.site-chrome {
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  overflow: hidden;
}

.site-video,
.site-overlay,
.site-grid,
.sakura-layer,
.site-orb,
.cursor-glow {
  position: absolute;
  inset: 0;
}

.site-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.05) brightness(0.45);
}

.site-overlay {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 42%),
    linear-gradient(180deg, rgba(8, 12, 23, 0.2), rgba(8, 12, 23, 0.92));
}

.site-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.65), transparent 88%);
  opacity: 0.4;
}

.sakura-layer {
  overflow: hidden;
}

.petal {
  --size: 14px;
  --duration: 15s;

  position: absolute;
  top: -8%;
  left: calc((var(--petal-index) - 1) * 9%);
  width: var(--size);
  height: calc(var(--size) * 0.72);
  border-radius: 100% 0 100% 0;
  background: linear-gradient(135deg, rgba(255, 214, 236, 0.95), rgba(255, 162, 202, 0.7));
  box-shadow: 0 0 12px rgba(255, 181, 213, 0.28);
  opacity: 0.72;
  animation:
    petal-fall calc(var(--duration) + var(--petal-index) * 0.7s) linear infinite,
    petal-sway calc(3s + var(--petal-index) * 0.18s) ease-in-out infinite alternate;
  animation-delay: calc(var(--petal-index) * -1.5s);
}

.site-orb {
  inset: auto;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.58;
}

.orb-a {
  top: 10%;
  left: 6%;
  width: 26rem;
  height: 26rem;
  background: rgba(246, 135, 90, 0.38);
}

.orb-b {
  right: -8rem;
  top: 18%;
  width: 24rem;
  height: 24rem;
  background: rgba(79, 172, 254, 0.26);
}

.orb-c {
  left: 25%;
  bottom: -10rem;
  width: 28rem;
  height: 28rem;
  background: rgba(255, 220, 110, 0.24);
}

.cursor-glow {
  width: 360px;
  height: 360px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 164, 206, 0.16), transparent 68%);
  filter: blur(22px);
  transition: transform 120ms ease-out;
}

:global(.click-star) {
  position: fixed;
  z-index: 80;
  pointer-events: none;
  color: #ffd6ec;
  text-shadow: 0 0 12px rgba(255, 208, 230, 0.9);
  transform: translate(-50%, -50%);
  animation: star-burst 900ms ease-out forwards;
}

:global(#live2d-widget) {
  left: 8px !important;
  right: auto !important;
  bottom: 0 !important;
  z-index: 35 !important;
  opacity: 0.94;
}

:global(#live2d-widget-bar),
:global(.sakana-widget-ctrl) {
  display: none !important;
}

@keyframes petal-fall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(0deg);
  }

  100% {
    transform: translate3d(10vw, 110vh, 0) rotate(320deg);
  }
}

@keyframes petal-sway {
  0% {
    margin-left: -1rem;
  }

  100% {
    margin-left: 1rem;
  }
}

@keyframes star-burst {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1.6);
  }
}

@media (max-width: 960px) {
  .site-video {
    filter: saturate(0.85) contrast(1) brightness(0.32);
  }

  .site-grid {
    opacity: 0.24;
    background-size: 32px 32px;
  }

  .orb-a,
  .orb-b,
  .orb-c {
    filter: blur(58px);
  }

  :global(#live2d-widget) {
    display: none !important;
  }

  .petal {
    opacity: 0.42;
  }
}
</style>
