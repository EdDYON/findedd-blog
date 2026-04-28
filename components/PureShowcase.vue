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

interface HeroParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  pulse: number
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
const toolsRef = ref<HTMLElement | null>(null)
const heroCanvas = ref<HTMLCanvasElement | null>(null)
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
let heroRaf = 0
let heroCtx: CanvasRenderingContext2D | null = null
let heroWidth = 0
let heroHeight = 0
let heroParticles: HeroParticle[] = []
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

const heroModules = computed(() => [
  { key: 'PLAY', label: 'Arcade Field', value: playHighScore.value || playScore.value || 'READY', tone: 'cyan' },
  { key: 'FOCUS', label: 'Timer Core', value: formattedFocus.value, tone: 'gold' },
  { key: 'NOTES', label: 'Quick Cache', value: `${noteChars.value} CH`, tone: 'pink' },
  { key: 'MOOD', label: 'Pixel Log', value: `${moodStreak.value} DAY`, tone: 'green' },
])

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

function scrollToTools() {
  toolsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function resizeHeroCanvas() {
  const canvas = heroCanvas.value
  if (!canvas)
    return

  const bounds = canvas.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  heroWidth = Math.max(360, Math.floor(bounds.width))
  heroHeight = Math.max(360, Math.floor(bounds.height))
  canvas.width = Math.floor(heroWidth * ratio)
  canvas.height = Math.floor(heroHeight * ratio)
  heroCtx = canvas.getContext('2d')
  heroCtx?.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function createHeroParticle(): HeroParticle {
  const colors = ['#55d6ff', '#ff5d7a', '#f5c84c', '#78f0a8', '#9b8cff', '#ffffff']
  return {
    x: Math.random() * heroWidth,
    y: Math.random() * heroHeight,
    vx: (Math.random() - 0.5) * 0.62,
    vy: (Math.random() - 0.5) * 0.62,
    size: 1.2 + Math.random() * 3.8,
    color: colors[Math.floor(Math.random() * colors.length)],
    pulse: Math.random() * Math.PI * 2,
  }
}

function seedHeroParticles() {
  const count = window.innerWidth < 740 ? 64 : 126
  heroParticles = Array.from({ length: count }, createHeroParticle)
}

function drawHero(time: number) {
  if (!heroCtx) {
    heroRaf = requestAnimationFrame(drawHero)
    return
  }

  const pointerX = (stageCursor.value.x / 100) * heroWidth
  const pointerY = (stageCursor.value.y / 100) * heroHeight

  heroCtx.clearRect(0, 0, heroWidth, heroHeight)
  heroCtx.globalCompositeOperation = 'lighter'

  const wash = heroCtx.createLinearGradient(0, 0, heroWidth, heroHeight)
  wash.addColorStop(0, 'rgba(85, 214, 255, 0.06)')
  wash.addColorStop(0.5, 'rgba(255, 93, 122, 0.035)')
  wash.addColorStop(1, 'rgba(120, 240, 168, 0.045)')
  heroCtx.fillStyle = wash
  heroCtx.fillRect(0, 0, heroWidth, heroHeight)

  for (let i = 0; i < 9; i += 1) {
    const offset = ((time * 0.035 + i * 170) % (heroWidth + 420)) - 260
    heroCtx.strokeStyle = i % 2 ? 'rgba(255, 93, 122, 0.08)' : 'rgba(85, 214, 255, 0.08)'
    heroCtx.lineWidth = i % 3 === 0 ? 2.2 : 1
    heroCtx.beginPath()
    heroCtx.moveTo(offset, 0)
    heroCtx.lineTo(offset + 300, heroHeight)
    heroCtx.stroke()
  }

  heroParticles.forEach((particle, index) => {
    const dx = pointerX - particle.x
    const dy = pointerY - particle.y
    const dist = Math.hypot(dx, dy) || 1
    const pull = Math.max(0, 1 - dist / 420)

    particle.vx += (dx / dist) * pull * 0.045
    particle.vy += (dy / dist) * pull * 0.045
    particle.vx *= 0.988
    particle.vy *= 0.988
    particle.x += particle.vx
    particle.y += particle.vy
    particle.pulse += 0.035

    if (particle.x < -30)
      particle.x = heroWidth + 30
    if (particle.x > heroWidth + 30)
      particle.x = -30
    if (particle.y < -30)
      particle.y = heroHeight + 30
    if (particle.y > heroHeight + 30)
      particle.y = -30

    for (let otherIndex = index + 1; otherIndex < heroParticles.length; otherIndex += 1) {
      const other = heroParticles[otherIndex]
      const linkDistance = Math.hypot(other.x - particle.x, other.y - particle.y)
      if (linkDistance > 118)
        continue

      heroCtx.globalAlpha = (1 - linkDistance / 118) * 0.26
      heroCtx.strokeStyle = particle.color
      heroCtx.lineWidth = 0.8
      heroCtx.beginPath()
      heroCtx.moveTo(particle.x, particle.y)
      heroCtx.lineTo(other.x, other.y)
      heroCtx.stroke()
    }

    if (dist < 360) {
      heroCtx.globalAlpha = (1 - dist / 360) * 0.36
      heroCtx.strokeStyle = particle.color
      heroCtx.lineWidth = 1.1
      heroCtx.beginPath()
      heroCtx.moveTo(particle.x, particle.y)
      heroCtx.lineTo(pointerX, pointerY)
      heroCtx.stroke()
    }

    heroCtx.globalAlpha = 0.72 + Math.sin(particle.pulse) * 0.22
    heroCtx.shadowColor = particle.color
    heroCtx.shadowBlur = 20
    heroCtx.fillStyle = particle.color
    heroCtx.beginPath()
    heroCtx.arc(particle.x, particle.y, particle.size + pull * 3.5, 0, Math.PI * 2)
    heroCtx.fill()
  })

  heroCtx.shadowBlur = 0
  heroCtx.globalAlpha = 1

  heroCtx.strokeStyle = 'rgba(245, 200, 76, 0.42)'
  heroCtx.lineWidth = 1
  heroCtx.beginPath()
  heroCtx.arc(pointerX, pointerY, 52 + Math.sin(time / 130) * 10, 0, Math.PI * 2)
  heroCtx.stroke()

  if (Math.floor(time / 180) % 5 === 0) {
    for (let i = 0; i < 5; i += 1) {
      const y = Math.random() * heroHeight
      const h = 8 + Math.random() * 26
      heroCtx.fillStyle = i % 2 ? 'rgba(255, 93, 122, 0.12)' : 'rgba(85, 214, 255, 0.14)'
      heroCtx.fillRect(Math.random() * heroWidth * 0.6, y, 140 + Math.random() * heroWidth * 0.42, h)
    }
  }

  heroCtx.globalCompositeOperation = 'source-over'
  heroRaf = requestAnimationFrame(drawHero)
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
  resizeHeroCanvas()
  resizePlayCanvas()
  seedHeroParticles()
  seedPlayParticles()
  heroRaf = requestAnimationFrame(drawHero)
  playRaf = requestAnimationFrame(drawPlay)
  window.addEventListener('resize', resizeHeroCanvas, { passive: true })
  window.addEventListener('resize', resizePlayCanvas, { passive: true })
})

onBeforeUnmount(() => {
  if (clockTimer)
    clearInterval(clockTimer)
  if (focusTimer)
    clearInterval(focusTimer)
  cancelAnimationFrame(heroRaf)
  cancelAnimationFrame(playRaf)
  window.removeEventListener('resize', resizeHeroCanvas)
  window.removeEventListener('resize', resizePlayCanvas)
})
</script>

<template>
  <main ref="stageRef" class="lab-stage" :style="stageCursorStyle" @pointermove="handleStagePointerMove">
    <video autoplay loop muted playsinline class="lab-video">
      <source src="/bg.mp4" type="video/mp4">
    </video>
    <div class="lab-grid-bg" aria-hidden="true" />

    <section class="hero-stage" aria-label="EdDYON Lab home">
      <canvas ref="heroCanvas" class="hero-canvas" aria-hidden="true" />
      <div class="chaos-stack" aria-hidden="true">
        <span>RUNNING SIGNAL</span>
        <span>NOISY INTERFACE</span>
        <span>LIVE CONTROL</span>
      </div>

      <nav class="hero-nav" aria-label="Quick status">
        <span>EdDYON LAB</span>
        <div>
          <button type="button" @click="scrollToTools">
            ENTER
          </button>
          <time>{{ currentTime }}</time>
        </div>
      </nav>

      <div class="hero-layout">
        <div class="hero-copy">
          <p class="hero-kicker">
            PERSONAL INTERACTIVE CONTROL ROOM
          </p>
          <div class="hero-warning" aria-hidden="true">
            VISUAL OVERDRIVE / UNSTABLE HUD / SIGNAL LOCKED
          </div>
          <h1>
            Signal<br>
            Playground
          </h1>
          <p class="hero-subtitle">
            一个给自己打开的小型实验室：玩一局、记一笔、专注一轮，顺便让页面本身也动起来。
          </p>

          <div class="hero-actions">
            <button type="button" class="hero-primary" @click="scrollToTools">
              ENTER LAB
            </button>
            <button type="button" class="hero-secondary" @click="rollDice">
              SPIN A THOUGHT
            </button>
          </div>
        </div>

        <div class="hero-machine" aria-hidden="true">
          <div class="machine-halo halo-a" />
          <div class="machine-halo halo-b" />
          <div class="machine-ring ring-one" />
          <div class="machine-ring ring-two" />
          <div class="machine-ring ring-three" />
          <div class="machine-ring ring-four" />
          <div class="machine-core">
            <span>ED</span>
          </div>
          <i class="node node-a" />
          <i class="node node-b" />
          <i class="node node-c" />
          <i class="node node-d" />
          <div class="scan-panel">
            <strong>LIVE VECTOR</strong>
            <span />
            <span />
            <span />
            <span />
          </div>
          <div class="hero-readout readout-a">
            <span>CORE</span>
            <strong>{{ playStatusLabel }}</strong>
          </div>
          <div class="hero-readout readout-b">
            <span>BEST</span>
            <strong>{{ playHighScore }}</strong>
          </div>
        </div>
      </div>

      <div class="hero-dock" aria-label="Lab modules">
        <button
          v-for="module in heroModules"
          :key="module.key"
          type="button"
          :class="`tone-${module.tone}`"
          @click="scrollToTools"
        >
          <span>{{ module.key }}</span>
          <strong>{{ module.label }}</strong>
          <em>{{ module.value }}</em>
        </button>
      </div>

      <button type="button" class="scroll-cue" aria-label="Scroll to tools" @click="scrollToTools">
        <span />
      </button>
    </section>

    <header ref="toolsRef" class="lab-header">
      <div>
        <p>EDDYON LAB</p>
        <h1>Console</h1>
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

.hero-stage {
  position: relative;
  isolation: isolate;
  z-index: 2;
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: min(1560px, calc(100% - 32px));
  min-height: 100svh;
  margin-inline: auto;
  padding: 24px 0 28px;
  overflow: hidden;
  perspective: 1200px;
}

.hero-stage::before {
  position: absolute;
  inset: 70px -4vw 72px;
  z-index: 0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 34px;
  background:
    linear-gradient(108deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.018) 42%, rgba(85, 214, 255, 0.1)),
    conic-gradient(from 210deg at 66% 42%, rgba(85, 214, 255, 0.24), rgba(255, 93, 122, 0.12), rgba(245, 200, 76, 0.1), rgba(120, 240, 168, 0.16), rgba(85, 214, 255, 0.24));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 0 88px rgba(85, 214, 255, 0.08),
    0 50px 160px rgba(0, 0, 0, 0.58),
    0 0 120px rgba(85, 214, 255, 0.16);
  backdrop-filter: blur(20px);
  transform: rotate(-1.3deg) skewX(-3deg);
  content: '';
}

.hero-stage::after {
  position: absolute;
  inset: 48px -8vw 60px;
  z-index: 1;
  border-radius: 34px;
  background:
    repeating-linear-gradient(0deg, transparent 0 12px, rgba(255, 255, 255, 0.045) 12px 13px),
    repeating-linear-gradient(90deg, transparent 0 78px, rgba(85, 214, 255, 0.06) 78px 79px),
    linear-gradient(90deg, transparent 0 34%, rgba(255, 255, 255, 0.14) 36%, transparent 38% 100%);
  opacity: 0.58;
  mask-image: linear-gradient(90deg, transparent, black 16%, black 84%, transparent);
  animation: heroInterference 7s linear infinite;
  content: '';
}

.hero-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0.9;
  mix-blend-mode: screen;
  pointer-events: none;
}

.chaos-stack {
  position: absolute;
  top: 12%;
  right: -7%;
  z-index: 3;
  display: grid;
  gap: 12px;
  width: min(34vw, 520px);
  transform: rotate(14deg);
  pointer-events: none;
}

.chaos-stack span {
  display: block;
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(7, 9, 12, 0.42);
  color: rgba(247, 251, 255, 0.36);
  font-size: clamp(1rem, 2.2vw, 2.5rem);
  font-weight: 950;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
  animation: chaosSlide 6s ease-in-out infinite;
}

.chaos-stack span:nth-child(2) {
  margin-left: 14%;
  color: rgba(85, 214, 255, 0.5);
  animation-delay: 0.32s;
}

.chaos-stack span:nth-child(3) {
  margin-left: -8%;
  color: rgba(255, 93, 122, 0.5);
  animation-delay: 0.64s;
}

.hero-nav,
.hero-layout,
.hero-dock,
.scroll-cue {
  position: relative;
  z-index: 3;
}

.hero-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 50px;
  color: rgba(247, 251, 255, 0.72);
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.2em;
}

.hero-nav div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-nav button {
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  color: #071018;
  background: #f7fbff;
  font-size: 11px;
  font-weight: 950;
}

.hero-nav time {
  color: #f5c84c;
  font-size: 18px;
  letter-spacing: 0.06em;
}

.hero-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(380px, 0.86fr);
  align-items: center;
  gap: 16px;
  padding: 28px clamp(18px, 4vw, 72px) 10px;
  transform: rotate(-1.4deg);
}

.hero-copy {
  position: relative;
  transform: translateX(clamp(-34px, -2vw, -12px));
}

.hero-kicker {
  width: fit-content;
  margin: 0 0 16px;
  padding: 8px 12px;
  border: 1px solid rgba(85, 214, 255, 0.28);
  border-radius: 999px;
  background: rgba(85, 214, 255, 0.08);
  color: #55d6ff;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.hero-warning {
  width: min(580px, 86vw);
  margin: 0 0 8px;
  padding: 8px 12px;
  border-left: 4px solid #ff5d7a;
  background:
    linear-gradient(90deg, rgba(255, 93, 122, 0.2), transparent),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 12px);
  color: #ff8bac;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.16em;
  transform: skewX(-12deg);
  box-shadow: 0 0 24px rgba(255, 93, 122, 0.16);
}

.hero-copy h1 {
  position: relative;
  width: max-content;
  margin: 0;
  color: #fff;
  font-size: clamp(5.2rem, 15.4vw, 16rem);
  font-weight: 950;
  line-height: 0.66;
  letter-spacing: -0.12em;
  text-transform: uppercase;
  transform: translateX(-0.06em);
  text-shadow:
    0 0 22px rgba(255, 255, 255, 0.54),
    0 0 56px rgba(85, 214, 255, 0.5),
    0 0 140px rgba(255, 93, 122, 0.34);
  filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.48));
}

.hero-copy h1::before,
.hero-copy h1::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: 'Signal\A Playground';
  white-space: pre;
}

.hero-copy h1::before {
  color: rgba(85, 214, 255, 0.6);
  transform: translate(4px, -3px);
  mix-blend-mode: screen;
  animation: glitchA 3.8s steps(2, end) infinite;
}

.hero-copy h1::after {
  color: rgba(255, 93, 122, 0.48);
  transform: translate(-4px, 3px);
  mix-blend-mode: screen;
  animation: glitchB 4.5s steps(2, end) infinite;
}

.hero-subtitle {
  max-width: 720px;
  margin: 22px 0 0;
  padding-left: 18px;
  border-left: 2px solid rgba(85, 214, 255, 0.55);
  color: rgba(247, 251, 255, 0.72);
  font-size: clamp(1rem, 1.5vw, 1.32rem);
  line-height: 1.85;
  text-shadow: 0 0 18px rgba(85, 214, 255, 0.16);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-actions button {
  min-height: 54px;
  padding: 0 22px;
  border-radius: 4px;
  font-weight: 950;
  letter-spacing: 0.08em;
  transform: skewX(-10deg);
}

.hero-primary {
  border-color: transparent;
  background:
    linear-gradient(90deg, #55d6ff, #78f0a8),
    repeating-linear-gradient(90deg, transparent 0 8px, rgba(255, 255, 255, 0.2) 8px 9px);
  color: #061015;
  box-shadow:
    0 0 34px rgba(85, 214, 255, 0.34),
    8px 8px 0 rgba(255, 93, 122, 0.26);
}

.hero-secondary {
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 8px 8px 0 rgba(85, 214, 255, 0.15);
}

.hero-machine {
  position: relative;
  display: grid;
  place-items: center;
  min-height: min(64vw, 720px);
  isolation: isolate;
  transform: translate(5vw, -2vh) rotate(9deg) scale(1.08);
}

.machine-halo {
  position: absolute;
  width: min(54vw, 710px);
  aspect-ratio: 1;
  border-radius: 50%;
  filter: blur(18px);
  opacity: 0.38;
  background: conic-gradient(from 70deg, transparent, rgba(85, 214, 255, 0.56), transparent, rgba(255, 93, 122, 0.48), transparent);
  animation: orbitSpin 18s linear infinite;
}

.halo-b {
  width: min(42vw, 560px);
  opacity: 0.3;
  animation-duration: 13s;
  animation-direction: reverse;
}

.machine-ring {
  position: absolute;
  width: min(48vw, 650px);
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  box-shadow:
    inset 0 0 58px rgba(85, 214, 255, 0.12),
    0 0 64px rgba(85, 214, 255, 0.18);
}

.ring-one {
  background:
    conic-gradient(from 0deg, transparent 0 16%, rgba(85, 214, 255, 0.72) 17% 19%, transparent 20% 48%, rgba(255, 93, 122, 0.66) 49% 51%, transparent 52% 100%);
  mask-image: radial-gradient(circle, transparent 0 61%, black 62% 64%, transparent 65%);
  animation: orbitSpin 16s linear infinite;
}

.ring-two {
  width: min(38vw, 500px);
  border-style: dashed;
  border-color: rgba(245, 200, 76, 0.3);
  animation: orbitSpin 22s linear infinite reverse;
}

.ring-three {
  width: min(27vw, 360px);
  border-color: rgba(120, 240, 168, 0.35);
  animation: pulseRing 3.4s ease-in-out infinite;
}

.ring-four {
  width: min(58vw, 760px);
  border-color: rgba(255, 93, 122, 0.22);
  border-style: dotted;
  transform: rotateX(64deg);
  animation: orbitSpin 9s linear infinite;
}

.machine-core {
  position: relative;
  display: grid;
  place-items: center;
  width: min(22vw, 280px);
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 38px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.03)),
    rgba(7, 9, 12, 0.76);
  box-shadow:
    inset 0 0 56px rgba(85, 214, 255, 0.18),
    0 0 84px rgba(255, 93, 122, 0.28),
    18px 18px 0 rgba(85, 214, 255, 0.12);
  transform: rotate(45deg);
  animation: coreFloat 5s ease-in-out infinite;
}

.machine-core span {
  color: #fff;
  font-size: clamp(2.6rem, 6vw, 5rem);
  font-weight: 950;
  letter-spacing: -0.14em;
  text-shadow: 0 0 20px rgba(85, 214, 255, 0.72);
  transform: rotate(-45deg);
}

.node {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #55d6ff;
  box-shadow: 0 0 22px currentColor;
}

.node-a {
  top: 18%;
  right: 20%;
  color: #55d6ff;
  animation: nodeBlink 1.8s ease-in-out infinite;
}

.node-b {
  right: 9%;
  bottom: 32%;
  color: #ff5d7a;
  background: #ff5d7a;
  animation: nodeBlink 2.4s ease-in-out infinite 0.3s;
}

.node-c {
  left: 18%;
  bottom: 20%;
  color: #f5c84c;
  background: #f5c84c;
  animation: nodeBlink 2.1s ease-in-out infinite 0.7s;
}

.node-d {
  top: 34%;
  left: 8%;
  color: #78f0a8;
  background: #78f0a8;
  animation: nodeBlink 2.6s ease-in-out infinite 1s;
}

.scan-panel {
  position: absolute;
  right: -6%;
  bottom: 8%;
  display: grid;
  gap: 8px;
  width: min(22vw, 260px);
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  background: rgba(7, 9, 12, 0.52);
  backdrop-filter: blur(18px);
  transform: skewX(-10deg);
}

.scan-panel strong {
  color: #f5c84c;
  font-size: 11px;
  letter-spacing: 0.18em;
}

.scan-panel span {
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(85, 214, 255, 0.1), #55d6ff, rgba(120, 240, 168, 0.14));
  transform-origin: left;
  animation: scanBars 1.8s ease-in-out infinite;
}

.scan-panel span:nth-child(2) {
  width: 72%;
  animation-delay: 0.18s;
}

.scan-panel span:nth-child(3) {
  width: 88%;
  animation-delay: 0.36s;
}

.scan-panel span:nth-child(4) {
  width: 54%;
  animation-delay: 0.54s;
}

.hero-dock {
  display: flex;
  align-items: end;
  gap: 10px;
  width: min(1180px, calc(100% - 70px));
  margin-left: clamp(18px, 5vw, 86px);
  padding: 0;
  transform: translateY(-16px) rotate(-2deg);
}

.hero-dock button {
  position: relative;
  overflow: hidden;
  flex: 1 1 0;
  min-height: 122px;
  padding: 18px;
  text-align: left;
  border-radius: 6px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.035)),
    rgba(7, 9, 12, 0.66);
  clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 24px 100%, 0 calc(100% - 24px));
  transform: skewX(-8deg);
}

.hero-dock button:nth-child(2) {
  transform: translateY(28px) skewX(-8deg);
}

.hero-dock button:nth-child(3) {
  transform: translateY(-18px) skewX(-8deg);
}

.hero-dock button:nth-child(4) {
  transform: translateY(16px) skewX(-8deg);
}

.hero-dock button::before {
  position: absolute;
  inset: auto 18px 14px 18px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 22px currentColor;
  content: '';
}

.hero-dock span,
.hero-dock em {
  display: block;
  color: rgba(247, 251, 255, 0.58);
  font-size: 11px;
  font-style: normal;
  font-weight: 950;
  letter-spacing: 0.14em;
}

.hero-dock strong {
  display: block;
  margin: 10px 0 18px;
  color: #fff;
  font-size: clamp(1.1rem, 1.7vw, 1.6rem);
  font-weight: 950;
}

.tone-cyan {
  color: #55d6ff;
}

.tone-gold {
  color: #f5c84c;
}

.tone-pink {
  color: #ff5d7a;
}

.tone-green {
  color: #78f0a8;
}

.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 42px;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(-50%);
}

.hero-readout {
  position: absolute;
  display: grid;
  min-width: 132px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(8, 10, 14, 0.56);
  box-shadow: 0 0 28px rgba(85, 214, 255, 0.18);
  backdrop-filter: blur(18px);
  transform: skewX(-12deg);
}

.hero-readout span {
  color: rgba(247, 251, 255, 0.48);
  font-size: 10px;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.hero-readout strong {
  margin-top: 4px;
  color: #fff;
  font-size: 24px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.readout-a {
  top: 16%;
  left: -2%;
}

.readout-b {
  right: 9%;
  top: 8%;
}

.scroll-cue span {
  width: 12px;
  height: 12px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg);
  animation: cueDrop 1.4s ease-in-out infinite;
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

@keyframes heroInterference {
  0% {
    transform: translateY(-2%);
  }

  100% {
    transform: translateY(2%);
  }
}

@keyframes glitchA {
  0%,
  84%,
  100% {
    clip-path: inset(0 0 0 0);
  }

  86% {
    clip-path: inset(8% 0 68% 0);
    transform: translate(8px, -3px);
  }

  88% {
    clip-path: inset(62% 0 12% 0);
    transform: translate(-3px, 2px);
  }
}

@keyframes glitchB {
  0%,
  76%,
  100% {
    clip-path: inset(0 0 0 0);
  }

  78% {
    clip-path: inset(18% 0 58% 0);
    transform: translate(-7px, 4px);
  }

  80% {
    clip-path: inset(70% 0 8% 0);
    transform: translate(4px, -2px);
  }
}

@keyframes orbitSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulseRing {
  0%,
  100% {
    transform: scale(0.92);
    opacity: 0.42;
  }

  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

@keyframes coreFloat {
  0%,
  100% {
    transform: translateY(-8px) rotate(45deg);
  }

  50% {
    transform: translateY(10px) rotate(45deg);
  }
}

@keyframes nodeBlink {
  0%,
  100% {
    transform: scale(0.72);
    opacity: 0.42;
  }

  50% {
    transform: scale(1.28);
    opacity: 1;
  }
}

@keyframes scanBars {
  0%,
  100% {
    transform: scaleX(0.28);
    opacity: 0.42;
  }

  50% {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes cueDrop {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(-3px) rotate(45deg);
  }

  50% {
    opacity: 1;
    transform: translateY(4px) rotate(45deg);
  }
}

@keyframes chaosSlide {
  0%,
  100% {
    transform: translateX(0) skewX(-12deg);
    filter: brightness(0.9);
  }

  50% {
    transform: translateX(-28px) skewX(-12deg);
    filter: brightness(1.35);
  }
}

@media (max-width: 1100px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 8px;
    transform: rotate(-0.8deg);
  }

  .hero-machine {
    min-height: 420px;
    transform: translate(0, -2vh) rotate(7deg) scale(1);
  }

  .machine-ring {
    width: min(78vw, 520px);
  }

  .ring-two {
    width: min(58vw, 380px);
  }

  .ring-three,
  .machine-core {
    width: min(40vw, 260px);
  }

  .hero-dock {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: auto;
    margin-inline: 18px;
  }

  .hero-dock button,
  .hero-dock button:nth-child(2),
  .hero-dock button:nth-child(3),
  .hero-dock button:nth-child(4) {
    transform: skewX(-6deg);
  }

  .chaos-stack {
    right: -22%;
    width: min(58vw, 520px);
  }

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
  .hero-stage {
    width: calc(100% - 20px);
    min-height: auto;
    padding-bottom: 96px;
  }

  .hero-stage::before,
  .hero-stage::after {
    inset: 64px 0 88px;
    border-radius: 18px;
    transform: none;
  }

  .chaos-stack {
    display: none;
  }

  .hero-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-layout {
    padding: 28px 14px 22px;
    transform: none;
  }

  .hero-copy h1 {
    font-size: clamp(4rem, 24vw, 6.5rem);
  }

  .hero-copy h1::before,
  .hero-copy h1::after {
    display: none;
  }

  .hero-subtitle {
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .hero-actions button {
    width: 100%;
    transform: none;
  }

  .hero-machine {
    min-height: 300px;
    transform: rotate(4deg) scale(1.05);
  }

  .machine-halo {
    width: min(92vw, 400px);
  }

  .scan-panel {
    display: none;
  }

  .hero-readout {
    display: none;
  }

  .node {
    width: 12px;
    height: 12px;
  }

  .hero-dock {
    grid-template-columns: 1fr;
    padding: 0 14px;
    margin: 0;
    transform: none;
  }

  .hero-dock button {
    min-height: 96px;
    transform: none !important;
  }

  .scroll-cue {
    bottom: 34px;
  }

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
