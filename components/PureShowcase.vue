<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  life: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const mode = ref(0)
const pulse = ref(62)
const cursorX = ref(50)
const cursorY = ref(50)

const palettes = [
  {
    name: 'cyan',
    label: '01',
    a: '#4fe7ff',
    b: '#ff4fa3',
    c: '#f7d154',
    bg: '#050814',
  },
  {
    name: 'lime',
    label: '02',
    a: '#64ffb7',
    b: '#72a8ff',
    c: '#ff6e8d',
    bg: '#060b10',
  },
  {
    name: 'amber',
    label: '03',
    a: '#ffc857',
    b: '#5de3ff',
    c: '#ff7ab6',
    bg: '#0b0712',
  },
]

const activePalette = computed(() => palettes[mode.value])
const letters = 'EdDYON'.split('')

let ctx: CanvasRenderingContext2D | null = null
let frame = 0
let raf = 0
let sparks: Spark[] = []
let width = 0
let height = 0
let pointer = { x: 0, y: 0, active: false }

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas)
    return

  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = Math.floor(width * ratio)
  canvas.height = Math.floor(height * ratio)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx = canvas.getContext('2d')
  ctx?.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function createSpark(x = Math.random() * width, y = Math.random() * height): Spark {
  const angle = Math.random() * Math.PI * 2
  const speed = 0.25 + Math.random() * 1.35

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: 1 + Math.random() * 2.6,
    hue: Math.random(),
    life: 0.45 + Math.random() * 0.55,
  }
}

function seedSparks() {
  const count = Math.min(140, Math.max(72, Math.floor((window.innerWidth * window.innerHeight) / 15000)))
  sparks = Array.from({ length: count }, () => createSpark())
}

function draw() {
  if (!ctx) {
    raf = requestAnimationFrame(draw)
    return
  }

  frame += 1
  ctx.clearRect(0, 0, width, height)

  const palette = activePalette.value
  const grd = ctx.createLinearGradient(0, 0, width, height)
  grd.addColorStop(0, 'rgba(79, 231, 255, 0.08)')
  grd.addColorStop(0.55, 'rgba(255, 79, 163, 0.035)')
  grd.addColorStop(1, 'rgba(247, 209, 84, 0.06)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, width, height)

  sparks.forEach((spark, index) => {
    spark.x += spark.vx
    spark.y += spark.vy
    spark.life -= 0.0018

    if (pointer.active) {
      const dx = pointer.x - spark.x
      const dy = pointer.y - spark.y
      const dist = Math.hypot(dx, dy)

      if (dist < 180) {
        spark.vx -= dx * 0.00006
        spark.vy -= dy * 0.00006
      }
    }

    if (spark.x < -30 || spark.x > width + 30 || spark.y < -30 || spark.y > height + 30 || spark.life <= 0)
      sparks[index] = createSpark()

    const color = spark.hue > 0.66 ? palette.c : spark.hue > 0.33 ? palette.b : palette.a
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.globalAlpha = 0.35 + spark.life * 0.45
    ctx.shadowColor = color
    ctx.shadowBlur = 12
    ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.shadowBlur = 0
  ctx.globalAlpha = 1

  for (let i = 0; i < sparks.length; i += 1) {
    for (let j = i + 1; j < sparks.length; j += 1) {
      const a = sparks[i]
      const b = sparks[j]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)

      if (dist > 118)
        continue

      ctx.beginPath()
      ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 118)})`
      ctx.lineWidth = 1
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  if (pointer.active) {
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255,255,255,0.28)'
    ctx.lineWidth = 1
    ctx.arc(pointer.x, pointer.y, 28 + Math.sin(frame / 18) * 8, 0, Math.PI * 2)
    ctx.stroke()
  }

  pulse.value = Math.round(58 + Math.sin(frame / 24) * 18 + (pointer.active ? 12 : 0))
  raf = requestAnimationFrame(draw)
}

function handlePointerMove(event: PointerEvent) {
  pointer = { x: event.clientX, y: event.clientY, active: true }
  cursorX.value = Number(((event.clientX / window.innerWidth) * 100).toFixed(2))
  cursorY.value = Number(((event.clientY / window.innerHeight) * 100).toFixed(2))
  stageRef.value?.style.setProperty('--cursor-x', `${cursorX.value}%`)
  stageRef.value?.style.setProperty('--cursor-y', `${cursorY.value}%`)
}

function handlePointerLeave() {
  pointer.active = false
}

function burst(event: PointerEvent) {
  for (let i = 0; i < 32; i += 1)
    sparks.push(createSpark(event.clientX, event.clientY))

  sparks = sparks.slice(-190)
}

function switchMode() {
  mode.value = (mode.value + 1) % palettes.length
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Space') {
    event.preventDefault()
    switchMode()
  }
}

onMounted(() => {
  resizeCanvas()
  seedSparks()
  draw()

  window.addEventListener('resize', resizeCanvas, { passive: true })
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
  window.addEventListener('pointerdown', burst, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)
  window.removeEventListener('pointerdown', burst)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <main
    ref="stageRef"
    class="pure-stage"
    :style="{
      '--tone-a': activePalette.a,
      '--tone-b': activePalette.b,
      '--tone-c': activePalette.c,
      '--stage-bg': activePalette.bg,
    }"
  >
    <video autoplay loop muted playsinline class="stage-video">
      <source src="/bg.mp4" type="video/mp4">
    </video>

    <canvas ref="canvasRef" class="signal-canvas" aria-hidden="true" />

    <div class="scan-layer" aria-hidden="true" />
    <div class="cursor-light" aria-hidden="true" />

    <div class="stage-ui">
      <header class="stage-toolbar" aria-label="Showcase controls">
        <a class="icon-link" href="/" title="Home" aria-label="Home">
          <span aria-hidden="true">⌂</span>
        </a>
        <button class="icon-link" type="button" title="Switch palette" aria-label="Switch palette" @click="switchMode">
          <span aria-hidden="true">{{ activePalette.label }}</span>
        </button>
      </header>

      <section class="hero-field" aria-label="EdDYON visual showcase">
        <div class="identity-mark">
          <span class="mark-line" />
          <span>VISUAL SYSTEM</span>
          <span class="mark-line" />
        </div>

        <h1 class="kinetic-title" aria-label="EdDYON">
          <span
            v-for="(letter, index) in letters"
            :key="`${letter}-${index}`"
            :style="{ '--i': index }"
          >
            {{ letter }}
          </span>
        </h1>

        <div class="signal-readout" aria-label="Live signal readout">
          <div>
            <span>MODE</span>
            <strong>{{ activePalette.name }}</strong>
          </div>
          <div>
            <span>PULSE</span>
            <strong>{{ pulse }}</strong>
          </div>
          <div>
            <span>X</span>
            <strong>{{ cursorX }}</strong>
          </div>
          <div>
            <span>Y</span>
            <strong>{{ cursorY }}</strong>
          </div>
        </div>
      </section>

      <section class="visual-dock" aria-label="Visual modules">
        <button
          v-for="item in ['Motion', 'Canvas', 'Light', 'Signal']"
          :key="item"
          type="button"
          class="dock-tile"
          @click="switchMode"
        >
          <span>{{ item }}</span>
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.pure-stage {
  --cursor-x: 50%;
  --cursor-y: 50%;
  position: fixed;
  inset: 0;
  isolation: isolate;
  overflow: hidden;
  min-height: 100svh;
  background: var(--stage-bg);
  color: #fff;
}

.stage-video,
.signal-canvas,
.scan-layer,
.cursor-light {
  position: absolute;
  inset: 0;
}

.stage-video {
  z-index: -4;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.16) contrast(1.08) brightness(0.46);
  transform: scale(1.04);
}

.signal-canvas {
  z-index: -2;
  mix-blend-mode: screen;
}

.scan-layer {
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0 1px, transparent 1px 7px);
  background-size: 76px 76px, 76px 76px, 100% 8px;
  opacity: 0.26;
  mask-image: radial-gradient(circle at var(--cursor-x) var(--cursor-y), black, transparent 72%);
}

.cursor-light {
  z-index: -1;
  background:
    radial-gradient(circle at var(--cursor-x) var(--cursor-y), color-mix(in srgb, var(--tone-a) 48%, transparent), transparent 22rem),
    radial-gradient(circle at 72% 28%, color-mix(in srgb, var(--tone-b) 34%, transparent), transparent 26rem),
    linear-gradient(135deg, rgba(2, 5, 12, 0.62), rgba(2, 5, 12, 0.18) 45%, rgba(2, 5, 12, 0.72));
}

.stage-ui {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100svh;
  padding: clamp(18px, 2.5vw, 36px);
}

.stage-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-link {
  display: inline-grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
  font: 800 14px/1 'JetBrains Mono', monospace;
  text-decoration: none;
  cursor: pointer;
  backdrop-filter: blur(16px);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.icon-link:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--tone-a) 72%, white);
  background: rgba(255, 255, 255, 0.16);
}

.hero-field {
  align-self: center;
  max-width: 1200px;
}

.identity-mark {
  display: flex;
  align-items: center;
  gap: 18px;
  color: color-mix(in srgb, var(--tone-a) 72%, white);
  font: 700 12px/1 'JetBrains Mono', monospace;
  letter-spacing: 0.22em;
}

.mark-line {
  display: block;
  width: min(120px, 18vw);
  height: 1px;
  background: currentColor;
  opacity: 0.64;
}

.kinetic-title {
  display: flex;
  flex-wrap: wrap;
  gap: 0.02em;
  margin: clamp(16px, 3vw, 32px) 0;
  font-size: clamp(4.8rem, 17vw, 17rem);
  font-weight: 950;
  line-height: 0.82;
  letter-spacing: 0;
  text-transform: uppercase;
}

.kinetic-title span {
  display: inline-block;
  color: #fff;
  text-shadow:
    0 0 18px color-mix(in srgb, var(--tone-a) 62%, transparent),
    0 0 58px color-mix(in srgb, var(--tone-b) 40%, transparent);
  transform-origin: center bottom;
  animation: letterFloat 3.6s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.12s);
}

.kinetic-title span:nth-child(even) {
  color: color-mix(in srgb, var(--tone-c) 40%, white);
}

.signal-readout {
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  gap: 1px;
  max-width: 760px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
}

.signal-readout div {
  min-height: 76px;
  padding: 12px 14px;
  background: rgba(3, 7, 15, 0.48);
}

.signal-readout span {
  display: block;
  color: rgba(255, 255, 255, 0.54);
  font: 700 11px/1 'JetBrains Mono', monospace;
}

.signal-readout strong {
  display: block;
  margin-top: 12px;
  color: #fff;
  font: 900 22px/1 'JetBrains Mono', monospace;
  text-transform: uppercase;
}

.visual-dock {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  width: min(920px, 100%);
}

.dock-tile {
  min-height: 72px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04)),
    rgba(3, 8, 16, 0.54);
  color: #fff;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  text-align: left;
  backdrop-filter: blur(18px);
}

.dock-tile::before {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--tone-a) 38%, transparent), transparent);
  transform: translateX(-100%);
  transition: transform 0.55s ease;
  content: '';
}

.dock-tile:hover::before {
  transform: translateX(100%);
}

.dock-tile span {
  position: relative;
  z-index: 1;
  display: block;
  padding: 18px;
  font: 900 20px/1 'JetBrains Mono', monospace;
}

@keyframes letterFloat {
  0%,
  100% {
    transform: translateY(0) skewX(0deg);
  }

  45% {
    transform: translateY(-0.08em) skewX(-2deg);
  }
}

@media (max-width: 760px) {
  .stage-ui {
    padding: 16px;
  }

  .hero-field {
    align-self: center;
  }

  .kinetic-title {
    font-size: clamp(4rem, 23vw, 8rem);
  }

  .signal-readout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .visual-dock {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .kinetic-title span,
  .dock-tile::before {
    animation: none;
    transition: none;
  }
}
</style>
