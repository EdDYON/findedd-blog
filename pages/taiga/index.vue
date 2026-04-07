<route lang="yaml">
meta:
  frontmatter:
    title: Taiga
    layout: taiga
    comment: false
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'

type ModeId = 'rose' | 'sky' | 'night' | 'snow'
type PoseId = 'main' | 'side'

const stageRef = ref<HTMLElement | null>(null)
const activeMode = ref<ModeId>('rose')
const activePose = ref<PoseId>('main')
const activeCard = ref(0)
const pointerX = ref(0.5)
const pointerY = ref(0.5)
const shimmerKey = ref(0)

const modeButtons: Array<{
  id: ModeId
  icon: string
  tone: string
  nextPose: PoseId
}> = [
  { id: 'rose', icon: 'i-ri-heart-3-fill', tone: '#ff7bab', nextPose: 'main' },
  { id: 'sky', icon: 'i-ri-bubble-chart-fill', tone: '#7ac7ff', nextPose: 'side' },
  { id: 'night', icon: 'i-ri-moon-clear-fill', tone: '#7a7bff', nextPose: 'main' },
  { id: 'snow', icon: 'i-ri-snowflake-fill', tone: '#9fdcfb', nextPose: 'side' },
]

const dockCards = [
  {
    image: '/taiga-route-main.jpg',
    icon: 'i-ri-play-circle-fill',
    pose: 'main' as const,
    mode: 'rose' as const,
  },
  {
    image: '/taiga-route-side.jpg',
    icon: 'i-ri-focus-3-fill',
    pose: 'side' as const,
    mode: 'sky' as const,
  },
  {
    image: '/taiga-route-main.jpg',
    icon: 'i-ri-contrast-2-fill',
    pose: 'main' as const,
    mode: 'night' as const,
  },
  {
    image: '/taiga-route-side.jpg',
    icon: 'i-ri-sparkling-2-fill',
    pose: 'side' as const,
    mode: 'snow' as const,
  },
]

const mosaicCards = [
  {
    image: '/taiga-route-side.jpg',
    style: 'mosaic-card-a',
    pose: 'side' as const,
  },
  {
    image: '/taiga-route-main.jpg',
    style: 'mosaic-card-b',
    pose: 'main' as const,
  },
  {
    image: '/taiga-route-side.jpg',
    style: 'mosaic-card-c',
    pose: 'side' as const,
  },
]

const currentImage = computed(() =>
  activePose.value === 'main' ? '/taiga-route-main.jpg' : '/taiga-route-side.jpg',
)

const stageStyle = computed(() => ({
  '--pointer-x': `${(pointerX.value * 100).toFixed(2)}%`,
  '--pointer-y': `${(pointerY.value * 100).toFixed(2)}%`,
}) as Record<string, string>)

function setMode(modeId: ModeId, pose?: PoseId) {
  activeMode.value = modeId
  if (pose)
    activePose.value = pose
  shimmerKey.value += 1
}

function selectCard(index: number) {
  const card = dockCards[index]
  activeCard.value = index
  activePose.value = card.pose
  activeMode.value = card.mode
  shimmerKey.value += 1
}

function selectMosaic(index: number) {
  const card = mosaicCards[index]
  activeCard.value = index
  activePose.value = card.pose
  shimmerKey.value += 1
}

function togglePose() {
  activePose.value = activePose.value === 'main' ? 'side' : 'main'
  shimmerKey.value += 1
}

function updatePointer(event: PointerEvent) {
  if (!stageRef.value)
    return

  const rect = stageRef.value.getBoundingClientRect()
  pointerX.value = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
  pointerY.value = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1)
}

function resetPointer() {
  pointerX.value = 0.5
  pointerY.value = 0.5
}
</script>

<template>
  <main class="taiga-vision-page">
    <section
      ref="stageRef"
      class="vision-stage"
      :class="`mode-${activeMode}`"
      :style="stageStyle"
      @pointermove="updatePointer"
      @pointerleave="resetPointer"
    >
      <div class="stage-shell" :class="[`focus-${activeCard}`]">
        <div class="stage-noise" />
        <div class="stage-spotlight" />

        <div :key="shimmerKey" class="stage-rings">
          <span class="ring ring-a" />
          <span class="ring ring-b" />
          <span class="ring ring-c" />
        </div>

        <div class="utility-cluster">
          <AppLink class="utility-chip" to="/" aria-label="Home">
            <span class="i-ri-home-5-line" />
          </AppLink>
          <AppLink class="utility-chip" to="/hobbies/" aria-label="Hobbies">
            <span class="i-ri-heart-3-line" />
          </AppLink>
          <AppLink class="utility-chip" to="/collection/" aria-label="Collection">
            <span class="i-ri-bookmark-3-line" />
          </AppLink>
        </div>

        <div class="mode-cluster">
          <button
            v-for="mode in modeButtons"
            :key="mode.id"
            type="button"
            class="mode-orb"
            :class="{ active: activeMode === mode.id }"
            :style="{ '--mode-tone': mode.tone }"
            :aria-label="mode.id"
            @click="setMode(mode.id, mode.nextPose)"
          >
            <span :class="mode.icon" />
          </button>
        </div>

        <div class="mosaic-panel">
          <button
            v-for="(card, index) in mosaicCards"
            :key="card.style"
            type="button"
            class="mosaic-card"
            :class="[card.style, { active: activeCard === index }]"
            :aria-label="`visual-${index + 1}`"
            @click="selectMosaic(index)"
          >
            <img :src="card.image" alt="" />
          </button>
        </div>

        <div class="ambient-tracks">
          <span class="track track-a" />
          <span class="track track-b" />
          <span class="track track-c" />
        </div>

        <button type="button" class="character-zone" aria-label="switch pose" @click="togglePose">
          <div class="character-halo" />
          <div class="character-shell">
            <img :src="currentImage" alt="" class="character-art" :class="{ 'character-art-side': activePose === 'side' }" />
          </div>
          <div class="character-shadow" />
        </button>

        <div class="gesture-stack">
          <button type="button" class="gesture-chip" aria-label="main pose" @click="setMode('rose', 'main')">
            <span class="i-ri-flashlight-fill" />
          </button>
          <button type="button" class="gesture-chip" aria-label="side pose" @click="setMode('sky', 'side')">
            <span class="i-ri-camera-lens-fill" />
          </button>
        </div>

        <div class="bottom-dock">
          <button
            v-for="(card, index) in dockCards"
            :key="`${card.mode}-${index}`"
            type="button"
            class="dock-card"
            :class="{ active: activeCard === index }"
            :aria-label="card.mode"
            @click="selectCard(index)"
          >
            <img :src="card.image" alt="" />
            <span class="dock-icon">
              <span :class="card.icon" />
            </span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.taiga-vision-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(255, 214, 236, 0.78), transparent 48%),
    linear-gradient(180deg, #fff8fc 0%, #ffeef7 45%, #f4dde9 100%);
}

.vision-stage {
  min-height: 100vh;
  padding: 20px;
  --accent-primary: #ff81b0;
  --accent-secondary: #7ebfff;
  --accent-glow: rgba(255, 128, 175, 0.4);
}

.mode-rose {
  --accent-primary: #ff81b0;
  --accent-secondary: #7ebfff;
  --accent-glow: rgba(255, 128, 175, 0.4);
}

.mode-sky {
  --accent-primary: #7fbfff;
  --accent-secondary: #ff9bc2;
  --accent-glow: rgba(123, 195, 255, 0.38);
}

.mode-night {
  --accent-primary: #8e94ff;
  --accent-secondary: #ff9ebf;
  --accent-glow: rgba(110, 119, 255, 0.35);
}

.mode-snow {
  --accent-primary: #9ddcf8;
  --accent-secondary: #ffc0d8;
  --accent-glow: rgba(164, 225, 255, 0.34);
}

.stage-shell {
  position: relative;
  min-height: calc(100vh - 40px);
  overflow: hidden;
  border-radius: 38px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0.08)),
    url('/taiga-ui/stage-board.webp') center / cover no-repeat;
  box-shadow:
    0 30px 80px rgba(132, 84, 111, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.66);
  isolation: isolate;
}

.stage-shell::before {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255, 255, 255, 0.56), transparent 22%),
    radial-gradient(circle at 70% 22%, var(--accent-glow), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.02));
  content: '';
  pointer-events: none;
}

.stage-noise,
.stage-spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.stage-noise {
  background:
    linear-gradient(115deg, rgba(255, 255, 255, 0.15) 0%, transparent 28%),
    radial-gradient(circle at 78% 16%, rgba(255, 255, 255, 0.48), transparent 24%);
  mix-blend-mode: screen;
  opacity: 0.8;
}

.stage-spotlight {
  background:
    radial-gradient(circle at 62% 58%, rgba(255, 255, 255, 0.2), transparent 28%),
    radial-gradient(circle at 32% 34%, rgba(255, 255, 255, 0.16), transparent 24%);
  opacity: 0.95;
}

.stage-rings {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ring {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;
  animation: ringFloat 16s ease-in-out infinite;
}

.ring-a {
  top: 12%;
  left: 14%;
  width: 38vw;
  max-width: 580px;
  aspect-ratio: 1;
}

.ring-b {
  right: 10%;
  top: 18%;
  width: 26vw;
  max-width: 360px;
  aspect-ratio: 1;
  animation-delay: -6s;
}

.ring-c {
  left: 22%;
  bottom: 12%;
  width: 24vw;
  max-width: 320px;
  aspect-ratio: 1;
  animation-delay: -10s;
}

.utility-cluster,
.mode-cluster,
.gesture-stack,
.bottom-dock,
.mosaic-panel,
.ambient-tracks,
.character-zone {
  position: absolute;
  z-index: 2;
}

.utility-cluster {
  top: 28px;
  left: 28px;
  display: flex;
  gap: 14px;
}

.utility-chip,
.gesture-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border: 0;
  border-radius: 28px;
  background: url('/taiga-ui/utility-button.png') center / 100% 100% no-repeat;
  box-shadow: 0 18px 36px rgba(255, 145, 192, 0.18);
  color: rgba(104, 112, 145, 0.88);
  font-size: 1.85rem;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease;
}

.utility-chip:hover,
.gesture-chip:hover,
.mode-orb:hover,
.dock-card:hover,
.mosaic-card:hover,
.character-zone:hover {
  transform: translateY(-5px);
}

.utility-chip:hover,
.gesture-chip:hover {
  box-shadow: 0 24px 42px rgba(255, 132, 187, 0.24);
  color: var(--accent-primary);
}

.mode-cluster {
  left: 34px;
  bottom: 36px;
  display: flex;
  gap: 14px;
}

.mode-orb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 66px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow:
    0 16px 34px rgba(214, 151, 183, 0.22),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  color: rgba(121, 129, 160, 0.9);
  font-size: 1.6rem;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease,
    background 180ms ease;
}

.mode-orb.active {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.74));
  box-shadow:
    0 20px 44px rgba(214, 151, 183, 0.28),
    0 0 0 6px rgba(255, 255, 255, 0.24);
  color: var(--mode-tone);
  transform: translateY(-8px) scale(1.04);
}

.mosaic-panel {
  top: 124px;
  left: clamp(34px, 5vw, 92px);
  width: clamp(200px, 24vw, 360px);
  height: clamp(290px, 54vh, 520px);
  pointer-events: none;
}

.mosaic-card {
  position: absolute;
  overflow: hidden;
  padding: 10px;
  border: 0;
  border-radius: 28px;
  background: url('/taiga-ui/panel-soft.png') center / 100% 100% no-repeat;
  box-shadow: 0 24px 46px rgba(160, 114, 136, 0.2);
  pointer-events: auto;
  transition:
    transform 220ms ease,
    box-shadow 220ms ease,
    filter 220ms ease;
}

.mosaic-card img,
.dock-card img {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  object-fit: cover;
}

.mosaic-card.active {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 30px 56px rgba(160, 114, 136, 0.28);
  filter: saturate(1.08);
}

.mosaic-card-a {
  top: 0;
  left: 0;
  width: 58%;
  aspect-ratio: 0.85;
  transform: rotate(-10deg);
}

.mosaic-card-b {
  top: 16%;
  right: 2%;
  width: 48%;
  aspect-ratio: 0.82;
  transform: rotate(8deg);
}

.mosaic-card-c {
  bottom: 0;
  left: 12%;
  width: 54%;
  aspect-ratio: 0.86;
  transform: rotate(-3deg);
}

.ambient-tracks {
  inset: 0;
  pointer-events: none;
}

.track {
  position: absolute;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  opacity: 0.75;
}

.track-a {
  top: 18%;
  left: 22%;
  width: 26vw;
  height: 2px;
}

.track-b {
  top: 62%;
  left: 18%;
  width: 30vw;
  height: 2px;
}

.track-c {
  top: 78%;
  right: 16%;
  width: 20vw;
  height: 2px;
}

.character-zone {
  right: clamp(12px, 5vw, 88px);
  bottom: clamp(112px, 10vw, 150px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: min(45vw, 760px);
  aspect-ratio: 0.82;
  border: 0;
  background: transparent;
  cursor: pointer;
  transform: translate3d(
    calc((var(--pointer-x) - 50%) / 36),
    calc((var(--pointer-y) - 50%) / 28),
    0
  );
  transition: transform 180ms ease;
}

.character-halo {
  position: absolute;
  inset: 10% 8% 18%;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.18) 45%, transparent 72%),
    radial-gradient(circle at 50% 36%, var(--accent-glow), transparent 46%);
  filter: blur(12px);
  opacity: 0.95;
}

.character-shell {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.character-art {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 26px 44px rgba(161, 122, 143, 0.28));
  animation: breathe 5.6s ease-in-out infinite;
}

.character-art-side {
  width: 88%;
}

.character-shadow {
  position: absolute;
  bottom: 6%;
  left: 18%;
  right: 18%;
  height: 18%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(152, 113, 139, 0.24), transparent 72%);
  filter: blur(18px);
}

.gesture-stack {
  top: 124px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bottom-dock {
  left: 28px;
  right: clamp(210px, 26vw, 380px);
  bottom: 26px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.dock-card {
  position: relative;
  overflow: hidden;
  height: 116px;
  padding: 10px;
  border: 0;
  border-radius: 26px;
  background: url('/taiga-ui/menu-default.png') center / 100% 100% no-repeat;
  box-shadow: 0 20px 40px rgba(175, 133, 151, 0.18);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    filter 180ms ease,
    background-image 180ms ease;
}

.dock-card.active {
  background-image: url('/taiga-ui/menu-active.png');
  box-shadow: 0 26px 50px rgba(255, 130, 182, 0.28);
  filter: saturate(1.05);
}

.dock-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: rgba(125, 131, 168, 0.92);
  font-size: 1.05rem;
  box-shadow: 0 8px 20px rgba(167, 124, 151, 0.14);
}

.focus-0 .character-halo {
  transform: scale(1.02);
}

.focus-1 .track-a,
.focus-1 .track-c {
  opacity: 1;
}

.focus-2 .stage-spotlight {
  opacity: 1.08;
}

.focus-3 .character-halo {
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.84) 0%, rgba(255, 255, 255, 0.14) 44%, transparent 72%),
    radial-gradient(circle at 50% 36%, rgba(161, 225, 255, 0.34), transparent 48%);
}

@keyframes breathe {
  0%,
  100% {
    transform: translateY(0) rotate(-1deg);
  }

  50% {
    transform: translateY(-10px) rotate(1deg);
  }
}

@keyframes ringFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.65;
  }

  50% {
    transform: translateY(-14px) scale(1.04);
    opacity: 0.9;
  }
}

@media (max-width: 1180px) {
  .stage-shell {
    min-height: auto;
    padding-bottom: 420px;
  }

  .character-zone {
    right: 50%;
    bottom: 168px;
    width: min(74vw, 560px);
    transform: translate3d(
      50%,
      calc((var(--pointer-y) - 50%) / 22),
      0
    );
  }

  .bottom-dock {
    right: 26px;
  }

  .mosaic-panel {
    width: clamp(180px, 28vw, 280px);
    height: 360px;
  }
}

@media (max-width: 820px) {
  .taiga-vision-page,
  .vision-stage {
    min-height: 100svh;
  }

  .vision-stage {
    padding: 10px;
  }

  .stage-shell {
    min-height: calc(100svh - 20px);
    padding-bottom: 250px;
    border-radius: 28px;
  }

  .utility-chip,
  .gesture-chip {
    width: 56px;
    height: 56px;
    border-radius: 22px;
    font-size: 1.45rem;
  }

  .utility-cluster {
    top: 14px;
    left: 14px;
    gap: 10px;
  }

  .gesture-stack {
    top: 14px;
    right: 14px;
    gap: 10px;
  }

  .mode-cluster {
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    gap: 10px;
  }

  .mode-orb {
    width: 54px;
    height: 54px;
    font-size: 1.25rem;
  }

  .mosaic-panel {
    top: 84px;
    left: 12px;
    width: 42vw;
    height: 30vh;
    min-height: 220px;
  }

  .mosaic-card {
    padding: 7px;
    border-radius: 18px;
  }

  .character-zone {
    bottom: 176px;
    width: 88vw;
  }

  .bottom-dock {
    left: 12px;
    right: 12px;
    bottom: 78px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }

  .dock-card {
    height: 72px;
    padding: 6px;
    border-radius: 18px;
  }

  .dock-icon {
    top: 6px;
    right: 6px;
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }

  .track-a,
  .track-b,
  .track-c {
    width: 28vw;
  }
}
</style>
