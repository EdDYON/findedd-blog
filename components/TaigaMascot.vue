<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  isHome: boolean
}>()

const shellRef = ref<HTMLElement | null>(null)
const isAwake = ref(false)
const isReacting = ref(false)
const shiftX = ref(0)
const shiftY = ref(0)
const rotateX = ref(0)
const rotateY = ref(0)
const glow = ref(0)

let reactionTimer = 0
let cleanupPointer = () => {}

const shellStyle = computed(() => ({
  '--pet-shift-x': `${shiftX.value.toFixed(2)}px`,
  '--pet-shift-y': `${shiftY.value.toFixed(2)}px`,
  '--pet-rotate-x': `${rotateX.value.toFixed(2)}deg`,
  '--pet-rotate-y': `${rotateY.value.toFixed(2)}deg`,
  '--pet-glow': glow.value.toFixed(3),
}))

function resetPose() {
  isAwake.value = false
  shiftX.value = 0
  shiftY.value = 0
  rotateX.value = 0
  rotateY.value = 0
  glow.value = 0
}

function updatePose(clientX: number, clientY: number) {
  const shell = shellRef.value

  if (!shell) {
    resetPose()
    return
  }

  const rect = shell.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const deltaX = clientX - centerX
  const deltaY = clientY - centerY
  const distance = Math.hypot(deltaX, deltaY)
  const near = Math.max(0, 1 - distance / 320)

  isAwake.value = near > 0.12
  glow.value = near
  shiftX.value = Math.max(-10, Math.min(10, deltaX * 0.045 * near))
  shiftY.value = Math.max(-8, Math.min(8, deltaY * 0.03 * near))
  rotateY.value = Math.max(-8, Math.min(8, deltaX * 0.05 * near))
  rotateX.value = Math.max(-6, Math.min(6, -deltaY * 0.035 * near))
}

function triggerReaction() {
  if (reactionTimer)
    window.clearTimeout(reactionTimer)

  isReacting.value = true
  reactionTimer = window.setTimeout(() => {
    isReacting.value = false
    reactionTimer = 0
  }, 2200)
}

onMounted(() => {
  const handlePointerMove = (event: PointerEvent) => updatePose(event.clientX, event.clientY)
  const handlePointerLeave = () => resetPose()

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave)

  cleanupPointer = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerleave', handlePointerLeave)
  }
})

onBeforeUnmount(() => {
  if (reactionTimer)
    window.clearTimeout(reactionTimer)
  cleanupPointer()
})
</script>

<template>
  <section
    ref="shellRef"
    class="taiga-mascot"
    :class="{ awake: isAwake, compact: !props.isHome, reacting: isReacting }"
    :style="shellStyle"
    @click="triggerReaction"
  >
    <div class="taiga-aura" />

    <div class="taiga-bubble">
      <strong>逢坂大河</strong>
      <span>Toradora!</span>
    </div>

    <div class="taiga-alt-shot">
      <img src="/taiga-pet-alt.jpg" alt="逢坂大河" />
    </div>

    <div class="taiga-stand" />

    <div class="taiga-card">
      <div class="taiga-card-gloss" />
      <img class="taiga-main-shot" src="/taiga-pet-main.jpg" alt="逢坂大河站宠" />
    </div>
  </section>
</template>

<style scoped>
.taiga-mascot {
  --pet-width: 220px;
  position: relative;
  width: var(--pet-width);
  padding-top: 3rem;
  cursor: pointer;
  user-select: none;
}

.taiga-mascot.compact {
  --pet-width: 192px;
}

.taiga-aura {
  position: absolute;
  right: 20px;
  bottom: 44px;
  width: calc(var(--pet-width) * 0.72);
  height: calc(var(--pet-width) * 0.72);
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 168, 152, calc(0.16 + var(--pet-glow) * 0.12)), transparent 62%),
    radial-gradient(circle at 30% 30%, rgba(126, 216, 255, calc(0.14 + var(--pet-glow) * 0.12)), transparent 56%);
  filter: blur(28px);
  pointer-events: none;
}

.taiga-card,
.taiga-alt-shot,
.taiga-bubble {
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 60px rgba(5, 10, 20, 0.22);
  backdrop-filter: blur(18px);
}

.taiga-card {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
    rgba(10, 14, 25, 0.72);
  transform:
    translate3d(var(--pet-shift-x), var(--pet-shift-y), 0)
    perspective(900px)
    rotateX(var(--pet-rotate-x))
    rotateY(var(--pet-rotate-y));
  transform-style: preserve-3d;
  transition: transform 0.18s ease, box-shadow 0.2s ease;
  animation: taiga-float 4.4s ease-in-out infinite, taiga-breathe 3.2s ease-in-out infinite;
}

.taiga-card-gloss {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.18), transparent 24%, transparent 72%, rgba(255, 255, 255, 0.08)),
    radial-gradient(circle at top right, rgba(255, 214, 173, 0.18), transparent 30%);
  pointer-events: none;
}

.taiga-main-shot {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  transform: scale(1.04);
  filter: saturate(1.05) contrast(1.04);
}

.taiga-stand {
  position: absolute;
  right: 12%;
  bottom: -4px;
  width: 62%;
  height: 16px;
  border-radius: 999px;
  background: rgba(3, 7, 17, 0.46);
  filter: blur(10px);
  opacity: 0.8;
}

.taiga-bubble {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  display: grid;
  gap: 0.1rem;
  padding: 0.7rem 0.9rem;
  border-radius: 20px;
  background: rgba(9, 14, 25, 0.72);
  transform: translateY(4px);
  opacity: 0.72;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.taiga-bubble strong {
  color: #fff;
  font-size: 0.98rem;
}

.taiga-bubble span {
  color: rgba(243, 246, 255, 0.62);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.taiga-alt-shot {
  position: absolute;
  top: 0.35rem;
  right: -0.25rem;
  z-index: 4;
  width: 108px;
  padding: 0.28rem;
  border-radius: 24px;
  background: rgba(9, 14, 25, 0.62);
  transform: translate3d(8px, 10px, 0) rotate(7deg) scale(0.92);
  opacity: 0;
  transition: transform 0.24s ease, opacity 0.24s ease;
}

.taiga-alt-shot img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  object-fit: cover;
}

.taiga-mascot.awake .taiga-card,
.taiga-mascot.reacting .taiga-card {
  box-shadow: 0 28px 72px rgba(5, 10, 20, 0.28);
}

.taiga-mascot.awake .taiga-bubble,
.taiga-mascot.reacting .taiga-bubble {
  opacity: 1;
  transform: translateY(0);
}

.taiga-mascot.awake .taiga-alt-shot,
.taiga-mascot.reacting .taiga-alt-shot {
  opacity: 1;
  transform: translate3d(0, 0, 0) rotate(3deg) scale(1);
}

@keyframes taiga-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}

@keyframes taiga-breathe {
  0%,
  100% {
    scale: 1 1;
  }
  50% {
    scale: 1.015 0.992;
  }
}
</style>
