<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')
const allowMascotRoute = computed(() => {
  const { path } = route
  return !path.startsWith('/posts')
    && !path.startsWith('/interact')
    && !path.startsWith('/archives')
    && !path.startsWith('/categories')
    && !path.startsWith('/tags')
    && path !== '/jiuji'
})

const showMascot = ref(false)

let cleanupResize = () => {}
let stopRouteWatch = () => {}

function syncRouteState() {
  document.body.classList.toggle('home-route', isHome.value)
  document.body.classList.toggle('inner-route', !isHome.value)
}

function updateExperience() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const largeScreen = window.matchMedia('(min-width: 1120px)').matches
  showMascot.value = allowMascotRoute.value && largeScreen && !reducedMotion
}

onMounted(() => {
  syncRouteState()
  updateExperience()

  window.addEventListener('resize', updateExperience, { passive: true })

  stopRouteWatch = watch(() => route.path, () => {
    syncRouteState()
    updateExperience()
  })

  cleanupResize = () => window.removeEventListener('resize', updateExperience)
})

onBeforeUnmount(() => {
  document.body.classList.remove('home-route', 'inner-route')
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
    <div v-if="isHome" class="site-grid" />
    <div v-if="isHome" class="site-orb orb-b" />
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
.site-orb {
  position: absolute;
  inset: 0;
}

.site-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1) contrast(1.03) brightness(0.82);
}

.site-overlay {
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.1), transparent 40%),
    linear-gradient(180deg, rgba(8, 12, 23, 0.06), rgba(8, 12, 23, 0.4));
}

.site-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.48), transparent 88%);
  opacity: 0.14;
}

.site-chrome-home .site-overlay {
  background:
    linear-gradient(180deg, rgba(5, 8, 18, 0.04), rgba(5, 8, 18, 0.12) 42%, rgba(5, 8, 18, 0.34));
}

.site-chrome-inner .site-overlay {
  background:
    linear-gradient(180deg, rgba(7, 12, 22, 0.28), rgba(7, 12, 22, 0.94)),
    radial-gradient(circle at top, rgba(120, 204, 255, 0.04), transparent 34%);
}

.site-chrome-inner .site-video {
  display: none;
}

.site-orb {
  inset: auto;
  border-radius: 999px;
  filter: blur(78px);
  opacity: 0.32;
}

.orb-b {
  right: -10rem;
  top: 20%;
  width: 22rem;
  height: 22rem;
  background: rgba(79, 172, 254, 0.18);
}

@media (max-width: 960px) {
  .site-video {
    filter: saturate(0.97) contrast(1.02) brightness(0.7);
  }

  .site-grid {
    opacity: 0.1;
    background-size: 42px 42px;
  }

  .orb-b {
    filter: blur(62px);
  }
}
</style>
