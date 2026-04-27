<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface MoodOption {
  key: string
  label: string
  color: string
}

interface MoodDay {
  key: string
  label: string
  value: string
}

type PlayKind = 'orb' | 'bonus' | 'hazard'

interface PlayParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  value: number
  color: string
  life: number
  kind: PlayKind
  spin: number
  phase: number
}

const storagePrefix = 'eddyon-lab-v1'
const focusPresets = [5, 15, 25, 45]
const defaultDiceInput = [
  '先做最轻的一件事',
  '把一个小问题解决掉',
  '出去走 10 分钟',
  '开一轮 Focus',
  '写下现在脑子里最吵的想法',
].join('\n')

const moodOptions: MoodOption[] = [
  { key: 'clear', label: 'CLEAR', color: '#55d6ff' },
  { key: 'fire', label: 'FIRE', color: '#ff5d7a' },
  { key: 'slow', label: 'SLOW', color: '#f5c84c' },
  { key: 'green', label: 'GREEN', color: '#78f0a8' },
  { key: 'void', label: 'VOID', color: '#9b8cff' },
]

const stageRef = ref<HTMLElement | null>(null)
const playCanvas = ref<HTMLCanvasElement | null>(null)
const stageCursor = ref({ x: 50, y: 50 })
const currentTime = ref('--:--')
const focusMinutes = ref(25)
const focusLeft = ref(25 * 60)
const focusRunning = ref(false)
const focusSessions = ref(0)
const focusTotalSeconds = ref(0)
const focusTask = ref('')
const noteText = ref('')
const diceInput = ref(defaultDiceInput)
const diceResult = ref('READY')
const diceHistory = ref<string[]>([])
const selectedMood = ref('clear')
const moodMap = ref<Record<string, string>>({})
const playScore = ref(0)
const playHighScore = ref(0)
const playCombo = ref(0)
const playRunning = ref(true)
const playLives = ref(3)
const playEnergy = ref(0)
const feverMode = ref(false)
const playStatus = ref('READY')
const hydrated = ref(false)

let clockTimer: ReturnType<typeof setInterval> | null = null
let focusTimer: ReturnType<typeof setInterval> | null = null
let playRaf = 0
let playCtx: CanvasRenderingContext2D | null = null
let playWidth = 0
let playHeight = 0
let playParticles: PlayParticle[] = []
let playPointer = { x: 0, y: 0, active: false }
let lastPlayTime = 0
let feverUntil = 0

const formattedFocus = computed(() => {
  const minutes = Math.floor(focusLeft.value / 60)
  const seconds = focusLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const focusProgress = computed(() => {
  const total = focusMinutes.value * 60
  if (!total)
    return 0
  return 1 - focusLeft.value / total
})

const focusRingOffset = computed(() => `${314 - focusProgress.value * 314}`)

const noteLines = computed(() => noteText.value.split('\n').filter(Boolean).length)
const noteChars = computed(() => noteText.value.length)

const diceOptions = computed(() =>
  diceInput.value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean),
)

const todayKey = computed(() => formatDateKey(new Date()))

const moodDays = computed<MoodDay[]>(() => {
  const days: MoodDay[] = []
  const formatter = new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' })

  for (let index = 27; index >= 0; index -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - index)
    const key = formatDateKey(date)
    days.push({
      key,
      label: formatter.format(date),
      value: moodMap.value[key] || '',
    })
  }

  return days
})

const activeMood = computed(() =>
  moodOptions.find(option => option.key === selectedMood.value) || moodOptions[0],
)

const moodStreak = computed(() => {
  let streak = 0
  const cursor = new Date()

  for (;;) {
    const key = formatDateKey(cursor)
    if (!moodMap.value[key])
      break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
})

const focusHours = computed(() => (focusTotalSeconds.value / 3600).toFixed(1))

const playLevel = computed(() => Math.min(9, Math.floor(playScore.value / 160) + 1))
const playEnergyPercent = computed(() => `${Math.min(100, playEnergy.value)}%`)
const playStatusLabel = computed(() => feverMode.value ? 'FEVER' : playRunning.value ? playStatus.value : 'HOLD')
const playMessage = computed(() => {
  if (playLives.value <= 0)
    return 'FIELD LOST / HIT RETRY'
  if (feverMode.value)
    return 'FEVER MODE / ABSORB EVERYTHING'
  if (playEnergy.value >= 100)
    return 'BURST READY / PRESS THE SWITCH'
  return 'DODGE RED / CATCH LIGHT'
})
const stageCursorStyle = computed(() => ({
  '--cursor-x': `${stageCursor.value.x}%`,
  '--cursor-y': `${stageCursor.value.y}%`,
}))

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(`${storagePrefix}:${key}`)
    return raw ? JSON.parse(raw) as T : fallback
  }
  catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown) {
  if (!hydrated.value)
    return

  window.localStorage.setItem(`${storagePrefix}:${key}`, JSON.stringify(value))
}

function updateClock() {
  currentTime.value = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function handleStagePointerMove(event: PointerEvent) {
  const target = stageRef.value
  if (!target)
    return

  const bounds = target.getBoundingClientRect()
  stageCursor.value = {
    x: Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100)),
    y: Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100)),
  }
}

function setFocusPreset(minutes: number) {
  focusMinutes.value = minutes
  if (!focusRunning.value)
    focusLeft.value = minutes * 60
}

function startFocusTimer() {
  if (focusTimer)
    return

  focusRunning.value = true
  focusTimer = setInterval(() => {
    focusLeft.value -= 1

    if (focusLeft.value > 0)
      return

    focusSessions.value += 1
    focusTotalSeconds.value += focusMinutes.value * 60
    focusLeft.value = focusMinutes.value * 60
    pauseFocusTimer()
    flashStage('focus')
  }, 1000)
}

function pauseFocusTimer() {
  focusRunning.value = false
  if (focusTimer) {
    clearInterval(focusTimer)
    focusTimer = null
  }
}

function toggleFocusTimer() {
  if (focusRunning.value)
    pauseFocusTimer()
  else
    startFocusTimer()
}

function resetFocusTimer() {
  pauseFocusTimer()
  focusLeft.value = focusMinutes.value * 60
}

function rollDice() {
  const options = diceOptions.value
  if (!options.length) {
    diceResult.value = 'EMPTY'
    return
  }

  const result = options[Math.floor(Math.random() * options.length)]
  diceResult.value = result
  diceHistory.value = [result, ...diceHistory.value.filter(item => item !== result)].slice(0, 5)
  flashStage('dice')
}

function appendTimestamp() {
  const stamp = new Date().toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  noteText.value = `${noteText.value}${noteText.value ? '\n' : ''}[${stamp}] `
  flashStage('note')
}

function clearNotes() {
  noteText.value = ''
  flashStage('note')
}

function clearDiceHistory() {
  diceHistory.value = []
  diceResult.value = 'READY'
}

function setMood(dayKey = todayKey.value) {
  moodMap.value = {
    ...moodMap.value,
    [dayKey]: selectedMood.value,
  }
  flashStage('mood')
}

function clearMood(dayKey = todayKey.value) {
  const nextMap = { ...moodMap.value }
  delete nextMap[dayKey]
  moodMap.value = nextMap
  flashStage('mood')
}

function getMoodColor(key: string) {
  return moodOptions.find(option => option.key === key)?.color || 'rgba(255,255,255,0.12)'
}

function flashStage(kind: string) {
  stageRef.value?.setAttribute('data-flash', kind)
  window.setTimeout(() => stageRef.value?.removeAttribute('data-flash'), 260)
}

function resizePlayCanvas() {
  const canvas = playCanvas.value
  if (!canvas)
    return

  const bounds = canvas.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  playWidth = Math.max(320, Math.floor(bounds.width))
  playHeight = Math.max(260, Math.floor(bounds.height))
  canvas.width = Math.floor(playWidth * ratio)
  canvas.height = Math.floor(playHeight * ratio)
  playCtx = canvas.getContext('2d')
  playCtx?.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function createPlayParticle(): PlayParticle {
  const roll = Math.random()
  const kind: PlayKind = roll > 0.84 ? 'hazard' : roll > 0.72 ? 'bonus' : 'orb'
  const colors = kind === 'hazard'
    ? ['#ff355d', '#ff7b35']
    : kind === 'bonus'
      ? ['#f5c84c', '#ffffff']
      : ['#55d6ff', '#78f0a8', '#9b8cff', '#ff5d7a']
  const value = kind === 'hazard' ? -12 : kind === 'bonus' ? 18 : Math.random() > 0.76 ? 5 : Math.random() > 0.44 ? 3 : 1
  const radius = kind === 'hazard' ? 10 : kind === 'bonus' ? 9 : value === 5 ? 7 : value === 3 ? 5.5 : 4
  const speedBoost = 1 + playLevel.value * 0.08

  return {
    x: Math.random() * playWidth,
    y: Math.random() * playHeight,
    vx: (Math.random() - 0.5) * 0.7 * speedBoost,
    vy: (Math.random() - 0.5) * 0.7 * speedBoost,
    radius,
    value,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 0.65 + Math.random() * 0.35,
    kind,
    spin: (Math.random() - 0.5) * 0.08,
    phase: Math.random() * Math.PI * 2,
  }
}

function seedPlayParticles() {
  const count = window.innerWidth < 740 ? 34 : 58
  playParticles = Array.from({ length: count }, createPlayParticle)
}

function drawPlay(time: number) {
  if (!playCtx) {
    playRaf = requestAnimationFrame(drawPlay)
    return
  }

  const delta = Math.min(32, time - lastPlayTime || 16) / 16
  lastPlayTime = time

  if (feverMode.value && time > feverUntil) {
    feverMode.value = false
    playStatus.value = 'RUN'
  }

  playCtx.clearRect(0, 0, playWidth, playHeight)

  const gradient = playCtx.createLinearGradient(0, 0, playWidth, playHeight)
  gradient.addColorStop(0, feverMode.value ? 'rgba(245, 200, 76, 0.22)' : 'rgba(85, 214, 255, 0.13)')
  gradient.addColorStop(0.52, feverMode.value ? 'rgba(255, 93, 122, 0.2)' : 'rgba(255, 93, 122, 0.08)')
  gradient.addColorStop(1, feverMode.value ? 'rgba(120, 240, 168, 0.2)' : 'rgba(120, 240, 168, 0.11)')
  playCtx.fillStyle = gradient
  playCtx.fillRect(0, 0, playWidth, playHeight)

  for (let x = 0; x < playWidth; x += 34) {
    playCtx.strokeStyle = feverMode.value ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.035)'
    playCtx.beginPath()
    playCtx.moveTo(x, 0)
    playCtx.lineTo(x, playHeight)
    playCtx.stroke()
  }

  for (let y = 0; y < playHeight; y += 34) {
    playCtx.strokeStyle = feverMode.value ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'
    playCtx.beginPath()
    playCtx.moveTo(0, y)
    playCtx.lineTo(playWidth, y)
    playCtx.stroke()
  }

  playParticles.forEach((particle, index) => {
    if (playRunning.value) {
      particle.x += particle.vx * delta
      particle.y += particle.vy * delta
      particle.life -= 0.0015 * delta
      particle.phase += particle.spin * delta
    }

    if (particle.x < -20 || particle.x > playWidth + 20 || particle.y < -20 || particle.y > playHeight + 20 || particle.life <= 0)
      playParticles[index] = createPlayParticle()

    if (playPointer.active && playRunning.value) {
      const dx = playPointer.x - particle.x
      const dy = playPointer.y - particle.y
      const dist = Math.hypot(dx, dy)

      const magnetRange = feverMode.value ? 132 : 72

      if (particle.kind !== 'hazard' && dist < magnetRange) {
        particle.vx += dx * (feverMode.value ? 0.0028 : 0.0018)
        particle.vy += dy * (feverMode.value ? 0.0028 : 0.0018)
      }

      if (particle.kind === 'hazard' && dist < 86) {
        particle.vx -= dx * 0.0012
        particle.vy -= dy * 0.0012
      }

      if (dist < particle.radius + 18) {
        if (particle.kind === 'hazard') {
          if (!feverMode.value) {
            playLives.value -= 1
            playCombo.value = 0
            playStatus.value = playLives.value <= 0 ? 'CRASH' : 'HIT'
            flashStage('hit')
          }
          else {
            playScore.value += 8
            playCombo.value += 1
          }
        }
        else {
          const comboBonus = Math.floor(playCombo.value / 5)
          const feverBonus = feverMode.value ? 2 : 1
          playScore.value += (particle.value + comboBonus) * feverBonus
          playHighScore.value = Math.max(playHighScore.value, playScore.value)
          playCombo.value += particle.kind === 'bonus' ? 3 : 1
          playEnergy.value = Math.min(100, playEnergy.value + (particle.kind === 'bonus' ? 22 : 5))
          playStatus.value = particle.kind === 'bonus' ? 'BOOST' : 'RUN'

          if (playEnergy.value >= 100)
            activateFever(time)
        }

        if (playLives.value <= 0)
          playRunning.value = false

        playParticles[index] = createPlayParticle()
      }
    }

    playCtx.globalAlpha = 0.38 + particle.life * 0.58
    playCtx.shadowColor = particle.color
    playCtx.shadowBlur = particle.kind === 'bonus' || feverMode.value ? 28 : 18
    playCtx.fillStyle = particle.color

    if (particle.kind === 'hazard') {
      playCtx.save()
      playCtx.translate(particle.x, particle.y)
      playCtx.rotate(particle.phase)
      playCtx.beginPath()
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2
        const radius = i % 2 === 0 ? particle.radius * 1.35 : particle.radius * 0.58
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        if (i === 0)
          playCtx.moveTo(x, y)
        else
          playCtx.lineTo(x, y)
      }
      playCtx.closePath()
      playCtx.fill()
      playCtx.restore()
    }
    else if (particle.kind === 'bonus') {
      playCtx.save()
      playCtx.translate(particle.x, particle.y)
      playCtx.rotate(particle.phase)
      playCtx.fillRect(-particle.radius, -particle.radius, particle.radius * 2, particle.radius * 2)
      playCtx.restore()
    }
    else {
      playCtx.beginPath()
      playCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      playCtx.fill()
    }
  })

  playCtx.shadowBlur = 0
  playCtx.globalAlpha = 1

  if (playPointer.active) {
    playCtx.strokeStyle = feverMode.value ? 'rgba(245,200,76,0.92)' : 'rgba(255,255,255,0.72)'
    playCtx.lineWidth = 1
    playCtx.beginPath()
    playCtx.arc(playPointer.x, playPointer.y, (feverMode.value ? 34 : 20) + Math.sin(time / 120) * 5, 0, Math.PI * 2)
    playCtx.stroke()
  }

  playRaf = requestAnimationFrame(drawPlay)
}

function activateFever(time = performance.now()) {
  feverMode.value = true
  feverUntil = time + 6500
  playEnergy.value = 0
  playStatus.value = 'FEVER'
  flashStage('fever')
}

function handlePlayPointerMove(event: PointerEvent) {
  const canvas = playCanvas.value
  if (!canvas)
    return

  const rect = canvas.getBoundingClientRect()
  playPointer = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    active: true,
  }
}

function handlePlayPointerDown(event: PointerEvent) {
  handlePlayPointerMove(event)
  const canvas = event.currentTarget as HTMLCanvasElement | null
  canvas?.setPointerCapture?.(event.pointerId)
}

function handlePlayPointerLeave() {
  playPointer.active = false
  playCombo.value = 0
}

function togglePlay() {
  if (playLives.value <= 0)
    resetPlay()
  else
    playRunning.value = !playRunning.value
}

function resetPlay() {
  playScore.value = 0
  playCombo.value = 0
  playLives.value = 3
  playEnergy.value = 0
  feverMode.value = false
  feverUntil = 0
  playStatus.value = 'READY'
  playRunning.value = true
  seedPlayParticles()
}

function hydrateState() {
  focusMinutes.value = readStorage('focusMinutes', 25)
  focusLeft.value = focusMinutes.value * 60
  focusSessions.value = readStorage('focusSessions', 0)
  focusTotalSeconds.value = readStorage('focusTotalSeconds', 0)
  focusTask.value = readStorage('focusTask', '')
  noteText.value = readStorage('noteText', '')
  diceInput.value = readStorage('diceInput', defaultDiceInput)
  diceHistory.value = readStorage('diceHistory', [])
  selectedMood.value = readStorage('selectedMood', 'clear')
  moodMap.value = readStorage('moodMap', {})
  playScore.value = readStorage('playScore', 0)
  playHighScore.value = readStorage('playHighScore', 0)
  hydrated.value = true
}

watch(focusMinutes, value => writeStorage('focusMinutes', value))
watch(focusSessions, value => writeStorage('focusSessions', value))
watch(focusTotalSeconds, value => writeStorage('focusTotalSeconds', value))
watch(focusTask, value => writeStorage('focusTask', value))
watch(noteText, value => writeStorage('noteText', value))
watch(diceInput, value => writeStorage('diceInput', value))
watch(diceHistory, value => writeStorage('diceHistory', value), { deep: true })
watch(selectedMood, value => writeStorage('selectedMood', value))
watch(moodMap, value => writeStorage('moodMap', value), { deep: true })
watch(playScore, value => writeStorage('playScore', value))
watch(playHighScore, value => writeStorage('playHighScore', value))

onMounted(async () => {
  hydrateState()
  updateClock()
  clockTimer = setInterval(updateClock, 1000)

  await nextTick()
  resizePlayCanvas()
  seedPlayParticles()
  playRaf = requestAnimationFrame(drawPlay)
  window.addEventListener('resize', resizePlayCanvas, { passive: true })
})

onBeforeUnmount(() => {
  if (clockTimer)
    clearInterval(clockTimer)
  if (focusTimer)
    clearInterval(focusTimer)
  cancelAnimationFrame(playRaf)
  window.removeEventListener('resize', resizePlayCanvas)
})
</script>

<template>
  <main ref="stageRef" class="lab-stage" :style="stageCursorStyle" @pointermove="handleStagePointerMove">
    <video autoplay loop muted playsinline class="lab-video">
      <source src="/bg.mp4" type="video/mp4">
    </video>
    <div class="lab-grid-bg" aria-hidden="true" />

    <header class="lab-header">
      <div>
        <p>EDDYON LAB</p>
        <h1>Playground</h1>
      </div>
      <time>{{ currentTime }}</time>
    </header>

    <section class="lab-shell" aria-label="EdDYON Lab tools">
      <article class="tool-panel focus-panel" :class="{ running: focusRunning }">
        <div class="panel-head">
          <span>Focus</span>
          <strong>{{ formattedFocus }}</strong>
        </div>

        <div class="focus-wrap">
          <svg viewBox="0 0 120 120" class="focus-ring" aria-hidden="true">
            <circle cx="60" cy="60" r="50" class="ring-track" />
            <circle cx="60" cy="60" r="50" class="ring-value" :style="{ strokeDashoffset: focusRingOffset }" />
          </svg>
          <button type="button" class="primary-action" @click="toggleFocusTimer">
            {{ focusRunning ? 'PAUSE' : 'START' }}
          </button>
        </div>

        <input
          v-model="focusTask"
          class="focus-task"
          spellcheck="false"
          placeholder="Focus target for this round."
        >

        <div class="preset-row">
          <button
            v-for="minutes in focusPresets"
            :key="minutes"
            type="button"
            :class="{ active: focusMinutes === minutes }"
            @click="setFocusPreset(minutes)"
          >
            {{ minutes }}
          </button>
          <button type="button" @click="resetFocusTimer">
            RESET
          </button>
        </div>
      </article>

      <article class="tool-panel play-panel" :class="{ fever: feverMode, crashed: playLives <= 0 }">
        <div class="panel-head">
          <span>Play</span>
          <strong>{{ playStatusLabel }}</strong>
        </div>

        <div class="play-hud">
          <div>
            <span>SCORE</span>
            <strong>{{ playScore }}</strong>
          </div>
          <div>
            <span>HIGH</span>
            <strong>{{ playHighScore }}</strong>
          </div>
          <div>
            <span>LV</span>
            <strong>{{ playLevel }}</strong>
          </div>
          <div class="life-stack" aria-label="Lives">
            <i v-for="life in 3" :key="life" :class="{ lost: life > playLives }" />
          </div>
        </div>

        <div class="energy-track" aria-label="Energy">
          <span :style="{ width: playEnergyPercent }" />
        </div>

        <canvas
          ref="playCanvas"
          class="play-canvas"
          @pointerdown="handlePlayPointerDown"
          @pointermove="handlePlayPointerMove"
          @pointerleave="handlePlayPointerLeave"
        />

        <p class="play-tip">
          {{ playMessage }}
        </p>

        <div class="play-controls">
          <button type="button" @click="togglePlay">
            {{ playLives <= 0 ? 'RETRY' : playRunning ? 'HOLD' : 'RUN' }}
          </button>
          <button type="button" @click="resetPlay">
            RESET
          </button>
          <button type="button" :disabled="playEnergy < 100" @click="activateFever()">
            BURST
          </button>
          <span>COMBO {{ playCombo }}</span>
        </div>
      </article>

      <article class="tool-panel notes-panel">
        <div class="panel-head">
          <span>Notes</span>
          <strong>{{ noteLines }} / {{ noteChars }}</strong>
        </div>

        <textarea v-model="noteText" spellcheck="false" placeholder="Drop something here." />
        <div class="note-actions">
          <button type="button" @click="appendTimestamp">
            STAMP
          </button>
          <button type="button" @click="clearNotes">
            CLEAR
          </button>
        </div>
      </article>

      <article class="tool-panel dice-panel">
        <div class="panel-head">
          <span>Dice</span>
          <strong>{{ diceOptions.length }}</strong>
        </div>

        <textarea v-model="diceInput" spellcheck="false" />
        <button type="button" class="wide-action" @click="rollDice">
          ROLL
        </button>
        <output>{{ diceResult }}</output>

        <div class="history-line">
          <span v-for="item in diceHistory" :key="item">{{ item }}</span>
        </div>
        <button type="button" class="ghost-action" @click="clearDiceHistory">
          CLEAR HISTORY
        </button>
      </article>

      <article class="tool-panel mood-panel">
        <div class="panel-head">
          <span>Mood</span>
          <strong>{{ moodStreak }}</strong>
        </div>

        <div class="mood-picker">
          <button
            v-for="mood in moodOptions"
            :key="mood.key"
            type="button"
            :class="{ active: selectedMood === mood.key }"
            :style="{ '--mood': mood.color }"
            @click="selectedMood = mood.key"
          >
            {{ mood.label }}
          </button>
        </div>

        <div class="mood-actions">
          <button type="button" class="wide-action" @click="setMood()">
            MARK TODAY
          </button>
          <button type="button" class="wide-action secondary" @click="clearMood()">
            CLEAR TODAY
          </button>
        </div>

        <div class="mood-grid">
          <button
            v-for="day in moodDays"
            :key="day.key"
            type="button"
            :title="day.label"
            :class="{ today: day.key === todayKey }"
            :style="{ backgroundColor: getMoodColor(day.value) }"
            @click="setMood(day.key)"
          />
        </div>
      </article>

      <article class="tool-panel stats-panel">
        <div class="panel-head">
          <span>Stats</span>
          <strong>LIVE</strong>
        </div>

        <dl>
          <div>
            <dt>SESSIONS</dt>
            <dd>{{ focusSessions }}</dd>
          </div>
          <div>
            <dt>HOURS</dt>
            <dd>{{ focusHours }}</dd>
          </div>
          <div>
            <dt>MOOD</dt>
            <dd>{{ activeMood.label }}</dd>
          </div>
          <div>
            <dt>SCORE</dt>
            <dd>{{ playScore }}</dd>
          </div>
          <div>
            <dt>BEST</dt>
            <dd>{{ playHighScore }}</dd>
          </div>
          <div>
            <dt>LEVEL</dt>
            <dd>{{ playLevel }}</dd>
          </div>
        </dl>
      </article>
    </section>
  </main>
</template>

<style scoped>
.lab-stage {
  position: fixed;
  inset: 0;
  overflow: auto;
  min-height: 100svh;
  background: #070709;
  color: #f7fbff;
  font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
}

.lab-stage::before,
.lab-stage::after {
  position: fixed;
  z-index: 1;
  pointer-events: none;
  content: '';
}

.lab-stage::before {
  inset: 0;
  background:
    linear-gradient(115deg, transparent 0 42%, rgba(85, 214, 255, 0.16) 43% 44%, transparent 45% 100%),
    linear-gradient(62deg, transparent 0 58%, rgba(245, 200, 76, 0.11) 59% 60%, transparent 61% 100%);
  opacity: 0.55;
  mix-blend-mode: screen;
  animation: stageScan 9s linear infinite;
}

.lab-stage::after {
  left: 0;
  right: 0;
  bottom: 0;
  height: 34vh;
  background:
    linear-gradient(180deg, transparent, rgba(7, 7, 9, 0.72)),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.055) 0 1px, transparent 1px 20px);
  mask-image: linear-gradient(180deg, transparent, black 26%);
}

.lab-video,
.lab-grid-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.lab-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.86) contrast(1.1) brightness(0.18);
  transform: scale(1.04);
}

.lab-grid-bg {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, transparent 1px),
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    radial-gradient(circle at 18% 24%, rgba(85, 214, 255, 0.2), transparent 26rem),
    radial-gradient(circle at 88% 76%, rgba(255, 93, 122, 0.16), transparent 25rem),
    linear-gradient(135deg, rgba(7, 7, 9, 0.72), rgba(7, 7, 9, 0.92));
  background-size: 68px 68px, 68px 68px, auto, auto, auto;
}

.lab-grid-bg::before,
.lab-grid-bg::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: '';
}

.lab-grid-bg::before {
  background:
    radial-gradient(circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(85, 214, 255, 0.24), transparent 22rem),
    radial-gradient(circle at calc(100% - var(--cursor-x, 50%)) calc(100% - var(--cursor-y, 50%)), rgba(255, 93, 122, 0.14), transparent 18rem);
  mix-blend-mode: screen;
  transition: background-position 0.08s linear;
}

.lab-grid-bg::after {
  background:
    repeating-linear-gradient(120deg, transparent 0 22px, rgba(255, 255, 255, 0.028) 22px 23px, transparent 23px 46px);
  opacity: 0.8;
  animation: dataRain 12s linear infinite;
}

.lab-stage[data-flash] .lab-grid-bg {
  animation: stageFlash 0.26s ease;
}

.lab-stage[data-flash='hit'] .lab-grid-bg {
  animation: dangerFlash 0.28s ease;
}

.lab-stage[data-flash='fever'] .lab-grid-bg {
  animation: feverFlash 0.42s ease;
}

.lab-header,
.lab-shell {
  position: relative;
  z-index: 2;
  width: min(1480px, calc(100% - 32px));
  margin-inline: auto;
}

.lab-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  padding: 28px 0 18px;
}

.lab-header p {
  margin: 0 0 6px;
  color: #55d6ff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.22em;
}

.lab-header h1 {
  margin: 0;
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 0.82;
  letter-spacing: 0;
  text-shadow: 0 0 28px rgba(85, 214, 255, 0.42);
}

.lab-header time {
  color: #f5c84c;
  font-size: clamp(2rem, 4vw, 4.8rem);
  font-weight: 950;
  line-height: 1;
}

.lab-shell {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(380px, 1.35fr) minmax(300px, 0.95fr);
  grid-template-areas:
    'focus play notes'
    'dice play mood'
    'stats play mood';
  gap: 12px;
  padding-bottom: 24px;
}

.tool-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.025)),
    rgba(8, 9, 12, 0.78);
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(22px);
}

.tool-panel::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, transparent, rgba(85, 214, 255, 0.16), transparent) -120% 0 / 80% 100% no-repeat,
    radial-gradient(circle at top right, rgba(255, 93, 122, 0.12), transparent 46%);
  opacity: 0.72;
  transition: opacity 0.2s ease;
  content: '';
}

.tool-panel:hover::before {
  opacity: 1;
  animation: panelSweep 1.15s ease;
}

.focus-panel {
  grid-area: focus;
}

.focus-panel.running {
  border-color: rgba(85, 214, 255, 0.42);
  box-shadow:
    0 20px 52px rgba(0, 0, 0, 0.28),
    0 0 38px rgba(85, 214, 255, 0.14);
}

.play-panel {
  grid-area: play;
  min-height: 620px;
}

.play-panel.fever {
  border-color: rgba(245, 200, 76, 0.62);
  box-shadow:
    0 20px 52px rgba(0, 0, 0, 0.28),
    0 0 54px rgba(245, 200, 76, 0.2);
}

.play-panel.crashed {
  border-color: rgba(255, 93, 122, 0.62);
}

.notes-panel {
  grid-area: notes;
}

.dice-panel {
  grid-area: dice;
}

.mood-panel {
  grid-area: mood;
}

.stats-panel {
  grid-area: stats;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-head span {
  color: rgba(247, 251, 255, 0.62);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.panel-head strong {
  color: #fff;
  font-size: 22px;
  font-weight: 950;
}

.focus-wrap {
  display: grid;
  place-items: center;
  padding: 20px 16px 10px;
}

.focus-ring {
  width: 172px;
  height: 172px;
  transform: rotate(-90deg);
}

.ring-track,
.ring-value {
  fill: none;
  stroke-width: 8;
}

.ring-track {
  stroke: rgba(255, 255, 255, 0.1);
}

.ring-value {
  stroke: #55d6ff;
  stroke-linecap: round;
  stroke-dasharray: 314;
  filter: drop-shadow(0 0 10px rgba(85, 214, 255, 0.85));
  transition: stroke-dashoffset 0.25s ease;
}

button,
input,
textarea {
  font: inherit;
}

button {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.07);
  color: #f7fbff;
  cursor: pointer;
  transition: transform 0.16s ease, border-color 0.16s ease, background 0.16s ease;
}

button:hover {
  transform: translateY(-1px);
  border-color: rgba(85, 214, 255, 0.65);
  background: rgba(85, 214, 255, 0.12);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
}

.primary-action {
  min-width: 138px;
  min-height: 46px;
  margin-top: -72px;
  background: #55d6ff;
  color: #071018;
  font-weight: 950;
}

.focus-task {
  display: block;
  width: calc(100% - 32px);
  min-height: 42px;
  margin: 0 16px 2px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  outline: none;
  background: rgba(0, 0, 0, 0.22);
  color: #f7fbff;
  padding: 0 12px;
}

.focus-task:focus {
  border-color: rgba(85, 214, 255, 0.7);
  box-shadow: 0 0 0 2px rgba(85, 214, 255, 0.12);
}

.preset-row,
.play-controls,
.mood-picker,
.note-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 16px 16px;
}

.preset-row button,
.play-controls button,
.mood-picker button,
.note-actions button {
  min-height: 38px;
  padding: 0 12px;
}

.preset-row button.active {
  border-color: #f5c84c;
  background: rgba(245, 200, 76, 0.16);
}

.play-canvas {
  display: block;
  width: calc(100% - 32px);
  height: 500px;
  margin: 16px 16px 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background: #08090c;
  touch-action: none;
}

.play-hud {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  padding: 14px 16px 0;
}

.play-hud div {
  min-height: 62px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.045);
}

.play-hud span {
  display: block;
  color: rgba(247, 251, 255, 0.52);
  font-size: 10px;
  font-weight: 900;
}

.play-hud strong {
  display: block;
  margin-top: 8px;
  font-size: 22px;
  font-weight: 950;
}

.life-stack {
  display: flex !important;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.life-stack i {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff5d7a;
  box-shadow: 0 0 16px rgba(255, 93, 122, 0.75);
}

.life-stack i.lost {
  background: rgba(255, 255, 255, 0.14);
  box-shadow: none;
}

.energy-track {
  height: 5px;
  margin: 12px 16px 0;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
}

.energy-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #55d6ff, #f5c84c, #ff5d7a);
  box-shadow: 0 0 18px rgba(245, 200, 76, 0.66);
  transition: width 0.2s ease;
}

.play-controls {
  align-items: center;
  justify-content: space-between;
  padding-top: 0;
}

.play-controls span {
  color: #78f0a8;
  font-size: 13px;
  font-weight: 900;
}

.play-tip {
  min-height: 20px;
  margin: 0 16px 10px;
  color: rgba(247, 251, 255, 0.58);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
}

textarea {
  display: block;
  width: calc(100% - 32px);
  min-height: 220px;
  margin: 16px;
  resize: vertical;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  outline: none;
  background: rgba(0, 0, 0, 0.24);
  color: #f7fbff;
  line-height: 1.6;
  padding: 12px;
}

textarea:focus {
  border-color: rgba(85, 214, 255, 0.7);
  box-shadow: 0 0 0 2px rgba(85, 214, 255, 0.12);
}

.note-actions {
  padding-top: 0;
}

.wide-action {
  width: calc(100% - 32px);
  min-height: 42px;
  margin: 0 16px 12px;
  font-weight: 950;
}

output {
  display: block;
  min-height: 54px;
  margin: 0 16px 12px;
  color: #f5c84c;
  font-size: 20px;
  font-weight: 950;
  line-height: 1.4;
}

.history-line {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 16px;
}

.history-line span {
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 5px;
  color: rgba(247, 251, 255, 0.72);
  font-size: 12px;
}

.ghost-action {
  min-height: 34px;
  margin: 0 16px 16px;
  padding: 0 10px;
  color: rgba(247, 251, 255, 0.66);
  font-size: 12px;
}

.mood-picker button {
  border-color: color-mix(in srgb, var(--mood) 60%, transparent);
}

.mood-picker button.active {
  background: color-mix(in srgb, var(--mood) 28%, transparent);
  box-shadow: 0 0 18px color-mix(in srgb, var(--mood) 34%, transparent);
}

.mood-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 0 16px 12px;
}

.mood-actions .wide-action {
  width: auto;
  margin: 0;
}

.mood-actions .secondary {
  color: rgba(247, 251, 255, 0.68);
  font-size: 12px;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 7px;
  padding: 4px 16px 16px;
}

.mood-grid button {
  aspect-ratio: 1;
  min-width: 0;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.09);
}

.mood-grid button.today {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

dl {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  padding: 16px;
}

dl div {
  min-height: 86px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.045);
}

dt {
  color: rgba(247, 251, 255, 0.52);
  font-size: 11px;
  font-weight: 900;
}

dd {
  margin: 12px 0 0;
  color: #fff;
  font-size: 26px;
  font-weight: 950;
}

@keyframes stageFlash {
  0%,
  100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.65) saturate(1.35);
  }
}

@keyframes dangerFlash {
  0%,
  100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(1.85) saturate(1.45) hue-rotate(-22deg);
  }
}

@keyframes feverFlash {
  0%,
  100% {
    filter: brightness(1);
  }

  50% {
    filter: brightness(2.1) saturate(1.8) hue-rotate(32deg);
  }
}

@keyframes stageScan {
  0% {
    transform: translateX(-10%) translateY(-6%);
  }

  100% {
    transform: translateX(10%) translateY(6%);
  }
}

@keyframes panelSweep {
  0% {
    background-position: -120% 0, 0 0;
  }

  100% {
    background-position: 220% 0, 0 0;
  }
}

@keyframes dataRain {
  0% {
    transform: translate3d(-2%, -2%, 0);
  }

  100% {
    transform: translate3d(2%, 2%, 0);
  }
}

@media (max-width: 1100px) {
  .lab-shell {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-areas:
      'play play'
      'focus notes'
      'dice mood'
      'stats stats';
  }

  .play-panel {
    min-height: auto;
  }
}

@media (max-width: 720px) {
  .lab-header {
    align-items: start;
    flex-direction: column;
  }

  .lab-shell {
    width: calc(100% - 24px);
    grid-template-columns: 1fr;
    grid-template-areas:
      'play'
      'focus'
      'notes'
      'dice'
      'mood'
      'stats';
  }

  .play-canvas {
    height: 360px;
  }

  textarea {
    min-height: 180px;
  }
}
</style>
