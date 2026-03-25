<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')

const cursorX = ref(0)
const cursorY = ref(0)
const showCursorGlow = ref(false)
const showMascot = ref(false)
const showLive2d = ref(false)

const sakanaState = {
  scriptLoaded: false,
}

const live2dState = {
  scriptLoaded: false,
}

let cleanupPointer = () => {}
let cleanupResize = () => {}
let stopRouteWatch = () => {}
let sakanaTimer = 0
let live2dTimer = 0

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
  if (!showMascot.value || !isHome.value)
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
  if (!showLive2d.value || !isHome.value)
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

function clearAmbientTimers() {
  if (sakanaTimer) {
    window.clearTimeout(sakanaTimer)
    sakanaTimer = 0
  }

  if (live2dTimer) {
    window.clearTimeout(live2dTimer)
    live2dTimer = 0
  }
}

function scheduleAmbientAddons() {
  if (showMascot.value) {
    sakanaTimer = window.setTimeout(() => {
      requestAnimationFrame(loadSakana)
      sakanaTimer = 0
    }, 850)
  }

  if (showLive2d.value) {
    live2dTimer = window.setTimeout(() => {
      requestAnimationFrame(loadLive2d)
      live2dTimer = 0
    }, 1500)
  }
}

function syncRouteState() {
  document.body.classList.toggle('home-route', isHome.value)
  document.body.classList.toggle('inner-route', !isHome.value)
}

function updateExperience() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const largeScreen = window.matchMedia('(min-width: 1080px)').matches
  const extraWide = window.matchMedia('(min-width: 1320px)').matches
  const finePointer = window.matchMedia('(pointer: fine)').matches

  showMascot.value = isHome.value && largeScreen && !reducedMotion
  showLive2d.value = isHome.value && extraWide && !reducedMotion
  showCursorGlow.value = isHome.value && finePointer && !reducedMotion

  clearAmbientTimers()
  scheduleAmbientAddons()
}

onMounted(() => {
  const handlePointerMove = (event: PointerEvent) => {
    cursorX.value = event.clientX
    cursorY.value = event.clientY
  }

  syncRouteState()
  updateExperience()

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('resize', updateExperience, { passive: true })

  stopRouteWatch = watch(isHome, () => {
    syncRouteState()
    updateExperience()
  })

  cleanupPointer = () => window.removeEventListener('pointermove', handlePointerMove)
  cleanupResize = () => window.removeEventListener('resize', updateExperience)
})

onBeforeUnmount(() => {
  clearAmbientTimers()
  document.body.classList.remove('home-route', 'inner-route')
  cleanupPointer()
  cleanupResize()
  stopRouteWatch()
})
</script>

<template>
  <div class="site-chrome" :class="{ 'site-chrome-home': isHome, 'site-chrome-inner': !isHome }">
    <video v-if="isHome" autoplay loop muted playsinline class="site-video">
      <source src="/bg.mp4" type="video/mp4" />
    </video>

    <div class="site-overlay" />
    <div class="site-grid" />
    <div class="site-orb orb-a" />
    <div class="site-orb orb-b" />

    <div
      v-if="showCursorGlow"
      class="cursor-glow"
      :style="{ transform: `translate(${cursorX - 180}px, ${cursorY - 180}px)` }"
    />
  </div>

  <FloatingWidgets :is-home="isHome" :show-mascot="showMascot" />
  <VisitorWalineBridge />
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
.site-orb,
.cursor-glow {
  position: absolute;
  inset: 0;
}

.site-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.01) contrast(1.04) brightness(0.8);
}

.site-overlay {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 40%),
    linear-gradient(180deg, rgba(8, 12, 23, 0.08), rgba(8, 12, 23, 0.46));
}

.site-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.58), transparent 88%);
  opacity: 0.24;
}

.site-chrome-home .site-overlay {
  background:
    linear-gradient(180deg, rgba(5, 8, 18, 0.06), rgba(5, 8, 18, 0.14) 42%, rgba(5, 8, 18, 0.42));
}

.site-chrome-inner .site-overlay {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 36%),
    linear-gradient(180deg, rgba(8, 12, 23, 0.18), rgba(8, 12, 23, 0.92));
}

.site-chrome-inner .site-grid {
  opacity: 0.3;
}

.site-chrome-inner .site-video {
  display: none;
}

.site-orb {
  inset: auto;
  border-radius: 999px;
  filter: blur(72px);
  opacity: 0.46;
}

.orb-a {
  top: 10%;
  left: 6%;
  width: 24rem;
  height: 24rem;
  background: rgba(246, 135, 90, 0.32);
}

.orb-b {
  right: -8rem;
  top: 18%;
  width: 24rem;
  height: 24rem;
  background: rgba(79, 172, 254, 0.24);
}

.cursor-glow {
  width: 360px;
  height: 360px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 164, 206, 0.14), transparent 68%);
  filter: blur(24px);
  transition: transform 120ms ease-out;
}

:global(#live2d-widget) {
  left: 8px !important;
  right: auto !important;
  bottom: 0 !important;
  z-index: 35 !important;
  opacity: 0.94;
}

:global(body:not(.home-route) #live2d-widget) {
  display: none !important;
}

:global(#live2d-widget-bar),
:global(.sakana-widget-ctrl) {
  display: none !important;
}

@media (max-width: 960px) {
  .site-video {
    filter: saturate(0.95) contrast(1.02) brightness(0.68);
  }

  .site-grid {
    opacity: 0.16;
    background-size: 36px 36px;
  }

  .orb-a,
  .orb-b {
    filter: blur(58px);
  }

  :global(#live2d-widget) {
    display: none !important;
  }
}
</style>
