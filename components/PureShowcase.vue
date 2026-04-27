<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type ThreeModule = typeof import('three')
type WebGLRenderer = import('three').WebGLRenderer
type Scene = import('three').Scene
type PerspectiveCamera = import('three').PerspectiveCamera
type Group = import('three').Group
type Mesh = import('three').Mesh
type Points = import('three').Points
type LineSegments = import('three').LineSegments
type InstancedMesh = import('three').InstancedMesh
type ShaderMaterial = import('three').ShaderMaterial
type BufferGeometry = import('three').BufferGeometry
type Color = import('three').Color
type Object3D = import('three').Object3D

interface Palette {
  id: string
  primary: string
  secondary: string
  accent: string
  hot: string
  ink: string
}

interface Shockwave {
  mesh: Mesh
  age: number
}

interface ShardState {
  radius: number
  speed: number
  phase: number
  height: number
}

const stageRef = ref<HTMLElement | null>(null)
const webglHost = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const charge = ref(0)
const isReady = ref(false)

const palettes: Palette[] = [
  {
    id: '01',
    primary: '#58f7ff',
    secondary: '#ff4fa3',
    accent: '#f9d65c',
    hot: '#ffffff',
    ink: '#040710',
  },
  {
    id: '02',
    primary: '#7cff9d',
    secondary: '#4d8dff',
    accent: '#ff6f61',
    hot: '#f8fff9',
    ink: '#030a08',
  },
  {
    id: '03',
    primary: '#ffca57',
    secondary: '#67e8ff',
    accent: '#b27cff',
    hot: '#fff7df',
    ink: '#0b0604',
  },
]

const activePalette = computed(() => palettes[activeIndex.value])
const paletteStyle = computed(() => ({
  '--primary': activePalette.value.primary,
  '--secondary': activePalette.value.secondary,
  '--accent': activePalette.value.accent,
  '--hot': activePalette.value.hot,
  '--ink': activePalette.value.ink,
}))

let THREE: ThreeModule | null = null
let renderer: WebGLRenderer | null = null
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let root: Group | null = null
let core: Mesh | null = null
let coreWire: Mesh | null = null
let particleField: Points | null = null
let tunnel: LineSegments | null = null
let shards: InstancedMesh | null = null
let coreMaterial: ShaderMaterial | null = null
let ringMaterials: import('three').MeshBasicMaterial[] = []
let rings: Mesh[] = []
let shardStates: ShardState[] = []
let shockwaves: Shockwave[] = []
let raf = 0
let start = 0
let targetMouse = { x: 0, y: 0 }
let currentMouse = { x: 0, y: 0 }
let lastTime = 0

function color(hex: string) {
  return new THREE!.Color(hex)
}

function nextPalette() {
  activeIndex.value = (activeIndex.value + 1) % palettes.length
  applyPalette()
}

function applyPalette() {
  if (!THREE || !coreMaterial)
    return

  const palette = activePalette.value
  const primary = color(palette.primary)
  const secondary = color(palette.secondary)
  const accent = color(palette.accent)

  coreMaterial.uniforms.uColorA.value = primary
  coreMaterial.uniforms.uColorB.value = secondary

  ringMaterials.forEach((material, index) => {
    material.color = index % 3 === 0 ? primary : index % 3 === 1 ? secondary : accent
  })

  if (particleField && 'color' in particleField.material)
    particleField.material.color = primary

  if (tunnel && 'color' in tunnel.material)
    tunnel.material.color = secondary

  if (shards && 'color' in shards.material)
    shards.material.color = accent
}

function createParticleField() {
  const count = window.innerWidth < 720 ? 1800 : 4200
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const primary = color(activePalette.value.primary)
  const secondary = color(activePalette.value.secondary)
  const accent = color(activePalette.value.accent)
  const mixed = new THREE!.Color()

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3
    const arm = i % 5
    const radius = 2.8 + Math.random() * 9.5
    const angle = radius * 0.72 + arm * ((Math.PI * 2) / 5) + (Math.random() - 0.5) * 0.55
    const vertical = (Math.random() - 0.5) * (1.2 + radius * 0.12)

    positions[i3] = Math.cos(angle) * radius
    positions[i3 + 1] = vertical
    positions[i3 + 2] = Math.sin(angle) * radius

    mixed.copy(i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent)
    mixed.lerp(color(activePalette.value.hot), Math.random() * 0.16)
    colors[i3] = mixed.r
    colors[i3 + 1] = mixed.g
    colors[i3 + 2] = mixed.b
  }

  const geometry = new THREE!.BufferGeometry()
  geometry.setAttribute('position', new THREE!.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE!.BufferAttribute(colors, 3))

  const material = new THREE!.PointsMaterial({
    size: window.innerWidth < 720 ? 0.035 : 0.026,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    blending: THREE!.AdditiveBlending,
  })

  particleField = new THREE!.Points(geometry, material)
  root!.add(particleField)
}

function createTunnel() {
  const ringsCount = 34
  const segments = 96
  const vertices: number[] = []

  for (let r = 0; r < ringsCount; r += 1) {
    const z = -22 + r * 1.35
    const radius = 4.2 + Math.sin(r * 0.7) * 0.28

    for (let s = 0; s < segments; s += 1) {
      const a1 = (s / segments) * Math.PI * 2
      const a2 = ((s + 1) / segments) * Math.PI * 2
      vertices.push(Math.cos(a1) * radius, Math.sin(a1) * radius * 0.48, z)
      vertices.push(Math.cos(a2) * radius, Math.sin(a2) * radius * 0.48, z)
    }
  }

  const geometry = new THREE!.BufferGeometry()
  geometry.setAttribute('position', new THREE!.Float32BufferAttribute(vertices, 3))

  const material = new THREE!.LineBasicMaterial({
    color: color(activePalette.value.secondary),
    transparent: true,
    opacity: 0.2,
    blending: THREE!.AdditiveBlending,
  })

  tunnel = new THREE!.LineSegments(geometry, material)
  tunnel.rotation.x = Math.PI / 2.9
  tunnel.position.z = -4.5
  root!.add(tunnel)
}

function createCore() {
  const geometry = new THREE!.IcosahedronGeometry(1.32, 7)
  coreMaterial = new THREE!.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE!.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: color(activePalette.value.primary) },
      uColorB: { value: color(activePalette.value.secondary) },
      uPower: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uPower;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        float wave = sin((position.x * 3.0) + (position.y * 4.0) + (position.z * 2.4) + uTime * 2.6);
        vec3 warped = position + normal * (wave * 0.06 + uPower * 0.12);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(warped, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uPower;
      varying vec3 vNormal;
      varying vec3 vPosition;

      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
        float lines = smoothstep(0.32, 0.92, sin((vPosition.y + vPosition.x) * 11.0 + uTime * 5.0) * 0.5 + 0.5);
        vec3 color = mix(uColorA, uColorB, fresnel + lines * 0.25);
        float alpha = 0.3 + fresnel * 0.72 + lines * 0.16 + uPower * 0.28;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  })

  core = new THREE!.Mesh(geometry, coreMaterial)
  core.scale.set(1.4, 1.4, 1.4)
  root!.add(core)

  coreWire = new THREE!.Mesh(
    geometry,
    new THREE!.MeshBasicMaterial({
      color: color(activePalette.value.hot),
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE!.AdditiveBlending,
    }),
  )
  coreWire.scale.set(1.48, 1.48, 1.48)
  root!.add(coreWire)
}

function createRings() {
  const configs = [
    { r: 2.15, t: 0.012, x: 0.95, y: 0.2, z: 0.1 },
    { r: 2.7, t: 0.009, x: 0.2, y: 1.18, z: -0.35 },
    { r: 3.28, t: 0.008, x: -0.35, y: 0.52, z: 1.12 },
    { r: 3.92, t: 0.007, x: 1.38, y: -0.3, z: 0.45 },
    { r: 4.65, t: 0.006, x: -0.58, y: 0.18, z: -0.9 },
  ]

  configs.forEach((config, index) => {
    const geometry = new THREE!.TorusGeometry(config.r, config.t, 12, 192)
    const material = new THREE!.MeshBasicMaterial({
      color: color(index % 3 === 0 ? activePalette.value.primary : index % 3 === 1 ? activePalette.value.secondary : activePalette.value.accent),
      transparent: true,
      opacity: 0.52 - index * 0.055,
      blending: THREE!.AdditiveBlending,
    })

    const ring = new THREE!.Mesh(geometry, material)
    ring.rotation.set(config.x, config.y, config.z)
    rings.push(ring)
    ringMaterials.push(material)
    root!.add(ring)
  })
}

function createShards() {
  const count = window.innerWidth < 720 ? 42 : 92
  const geometry = new THREE!.TetrahedronGeometry(0.075, 0)
  const material = new THREE!.MeshBasicMaterial({
    color: color(activePalette.value.accent),
    transparent: true,
    opacity: 0.7,
    blending: THREE!.AdditiveBlending,
  })
  const dummy = new THREE!.Object3D()

  shards = new THREE!.InstancedMesh(geometry, material, count)
  shardStates = Array.from({ length: count }, (_, index) => ({
    radius: 2.2 + Math.random() * 4.8,
    speed: 0.22 + Math.random() * 0.78,
    phase: (index / count) * Math.PI * 2,
    height: (Math.random() - 0.5) * 1.9,
  }))

  shardStates.forEach((state, index) => {
    dummy.position.set(Math.cos(state.phase) * state.radius, state.height, Math.sin(state.phase) * state.radius)
    dummy.rotation.set(state.phase, state.phase * 0.7, state.phase * 0.4)
    dummy.updateMatrix()
    shards!.setMatrixAt(index, dummy.matrix)
  })

  root!.add(shards)
}

function createShockwave() {
  if (!THREE || !root)
    return

  const geometry = new THREE.TorusGeometry(1.6, 0.012, 8, 192)
  const material = new THREE.MeshBasicMaterial({
    color: color(activePalette.value.hot),
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.set(Math.PI / 2, currentMouse.x * 0.6, currentMouse.y * 0.6)
  root.add(mesh)
  shockwaves.push({ mesh, age: 0 })
}

function initThree(three: ThreeModule) {
  if (!webglHost.value)
    return

  THREE = three
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(activePalette.value.ink, 8, 28)

  camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 80)
  camera.position.set(0, 0.2, 10.8)

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  webglHost.value.replaceChildren(renderer.domElement)

  root = new THREE.Group()
  scene.add(root)

  const ambient = new THREE.AmbientLight(0xffffff, 0.45)
  const key = new THREE.PointLight(color(activePalette.value.primary), 2.3, 26)
  key.position.set(4, 3, 5)
  const rim = new THREE.PointLight(color(activePalette.value.secondary), 2, 24)
  rim.position.set(-4, -2, 4)
  scene.add(ambient, key, rim)

  createTunnel()
  createParticleField()
  createCore()
  createRings()
  createShards()
  applyPalette()
  isReady.value = true
}

function resizeScene() {
  if (!renderer || !camera)
    return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.fov = window.innerWidth < 720 ? 58 : 46
  camera.position.z = window.innerWidth < 720 ? 12.2 : 10.8
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate(time: number) {
  if (!THREE || !renderer || !scene || !camera || !root) {
    raf = requestAnimationFrame(animate)
    return
  }

  const elapsed = (time - start) * 0.001
  const delta = Math.min(0.04, (time - lastTime) * 0.001 || 0.016)
  lastTime = time

  currentMouse.x += (targetMouse.x - currentMouse.x) * 0.075
  currentMouse.y += (targetMouse.y - currentMouse.y) * 0.075

  charge.value = Math.round(58 + Math.sin(elapsed * 2.6) * 16 + Math.abs(currentMouse.x) * 18 + shockwaves.length * 9)

  root.rotation.y = elapsed * 0.08 + currentMouse.x * 0.26
  root.rotation.x = currentMouse.y * 0.16
  root.position.x = currentMouse.x * 0.22
  root.position.y = -currentMouse.y * 0.12

  if (coreMaterial) {
    coreMaterial.uniforms.uTime.value = elapsed
    coreMaterial.uniforms.uPower.value = Math.min(1, shockwaves.length * 0.24 + Math.abs(currentMouse.x) * 0.35)
  }

  if (core) {
    core.rotation.x = elapsed * 0.32
    core.rotation.y = elapsed * 0.46
  }

  if (coreWire) {
    coreWire.rotation.x = -elapsed * 0.22
    coreWire.rotation.z = elapsed * 0.4
  }

  rings.forEach((ring, index) => {
    ring.rotation.x += delta * (0.18 + index * 0.04)
    ring.rotation.y -= delta * (0.12 + index * 0.025)
    ring.scale.setScalar(1 + Math.sin(elapsed * 1.8 + index) * 0.02)
  })

  if (particleField) {
    particleField.rotation.y = -elapsed * 0.035
    particleField.rotation.z = elapsed * 0.018
  }

  if (tunnel) {
    tunnel.rotation.z = elapsed * 0.045
    tunnel.position.z = -4.5 + Math.sin(elapsed * 0.7) * 0.35
  }

  if (shards) {
    const dummy = new THREE.Object3D()
    shardStates.forEach((state, index) => {
      const angle = state.phase + elapsed * state.speed
      dummy.position.set(
        Math.cos(angle) * state.radius,
        state.height + Math.sin(elapsed * 1.7 + state.phase) * 0.28,
        Math.sin(angle) * state.radius,
      )
      dummy.rotation.set(elapsed * state.speed, angle, elapsed * 0.35 + state.phase)
      dummy.scale.setScalar(0.75 + Math.sin(elapsed * 2.4 + state.phase) * 0.22)
      dummy.updateMatrix()
      shards!.setMatrixAt(index, dummy.matrix)
    })
    shards.instanceMatrix.needsUpdate = true
  }

  shockwaves.forEach((wave) => {
    wave.age += delta
    const scale = 1 + wave.age * 3.8
    wave.mesh.scale.setScalar(scale)
    const material = wave.mesh.material as import('three').MeshBasicMaterial
    material.opacity = Math.max(0, 0.72 - wave.age * 0.82)
  })

  shockwaves = shockwaves.filter((wave) => {
    if (wave.age <= 0.9)
      return true
    wave.mesh.geometry.dispose()
    ;(wave.mesh.material as import('three').Material).dispose()
    root!.remove(wave.mesh)
    return false
  })

  camera.position.x += (currentMouse.x * 0.7 - camera.position.x) * 0.045
  camera.position.y += (-currentMouse.y * 0.45 - camera.position.y) * 0.045
  camera.lookAt(0, 0, 0)

  renderer.render(scene, camera)
  raf = requestAnimationFrame(animate)
}

function handlePointerMove(event: PointerEvent) {
  const x = (event.clientX / window.innerWidth) * 2 - 1
  const y = (event.clientY / window.innerHeight) * 2 - 1
  targetMouse = { x, y }
  stageRef.value?.style.setProperty('--mx', `${event.clientX}px`)
  stageRef.value?.style.setProperty('--my', `${event.clientY}px`)
}

function handlePointerDown() {
  createShockwave()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.code === 'Space') {
    event.preventDefault()
    nextPalette()
  }
}

function disposeObject(object: Object3D) {
  object.traverse((child) => {
    const mesh = child as Mesh
    if ('geometry' in mesh && mesh.geometry)
      mesh.geometry.dispose()

    if ('material' in mesh && mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach(material => material.dispose())
    }
  })
}

onMounted(async () => {
  start = performance.now()
  lastTime = start
  const three = await import('three')
  initThree(three)
  resizeScene()
  raf = requestAnimationFrame(animate)

  window.addEventListener('resize', resizeScene, { passive: true })
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerdown', handlePointerDown, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resizeScene)
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerdown', handlePointerDown)
  window.removeEventListener('keydown', handleKeydown)

  if (root)
    disposeObject(root)

  renderer?.dispose()
  webglHost.value?.replaceChildren()
})
</script>

<template>
  <main ref="stageRef" class="pure-stage" :class="{ ready: isReady }" :style="paletteStyle">
    <video autoplay loop muted playsinline class="stage-video">
      <source src="/bg.mp4" type="video/mp4">
    </video>

    <div ref="webglHost" class="webgl-stage" aria-hidden="true" />
    <div class="noise-field" aria-hidden="true" />
    <div class="edge-frame" aria-hidden="true" />
    <div class="cursor-slice" aria-hidden="true" />

    <section class="identity" aria-label="EdDYON visual showcase">
      <p class="eyebrow">EDDYON / INTERACTIVE FIELD</p>
      <h1 data-text="EdDYON">EdDYON</h1>
      <div class="charge-line">
        <span :style="{ width: `${Math.min(100, charge)}%` }" />
      </div>
    </section>

    <nav class="mode-switch" aria-label="Palette modes">
      <button
        v-for="(palette, index) in palettes"
        :key="palette.id"
        type="button"
        :class="{ active: activeIndex === index }"
        :aria-label="`Mode ${palette.id}`"
        @click="activeIndex = index; applyPalette()"
      >
        {{ palette.id }}
      </button>
    </nav>

    <div class="corner-readout" aria-label="Scene readout">
      <span>{{ charge }}</span>
      <i />
    </div>
  </main>
</template>

<style scoped>
.pure-stage {
  --mx: 50vw;
  --my: 50vh;
  position: fixed;
  inset: 0;
  isolation: isolate;
  overflow: hidden;
  min-height: 100svh;
  background: var(--ink);
  color: #fff;
}

.stage-video,
.webgl-stage,
.noise-field,
.edge-frame,
.cursor-slice {
  position: absolute;
  inset: 0;
}

.stage-video {
  z-index: -5;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.2) contrast(1.15) brightness(0.24);
  transform: scale(1.04);
}

.webgl-stage {
  z-index: -2;
  opacity: 0;
  transition: opacity 0.7s ease;
}

.ready .webgl-stage {
  opacity: 1;
}

.webgl-stage :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.noise-field {
  z-index: -1;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.045) 0 1px, transparent 1px 120px),
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.034) 0 1px, transparent 1px 90px),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0 1px, transparent 1px 7px);
  opacity: 0.28;
  mask-image: linear-gradient(180deg, black, rgba(0, 0, 0, 0.24));
}

.noise-field::after {
  position: absolute;
  inset: -20%;
  background-image:
    linear-gradient(115deg, transparent 0 46%, color-mix(in srgb, var(--primary) 32%, transparent) 47% 48%, transparent 49%),
    linear-gradient(65deg, transparent 0 51%, color-mix(in srgb, var(--secondary) 24%, transparent) 52% 53%, transparent 54%);
  transform: translate3d(0, 0, 0);
  animation: scanSweep 7s linear infinite;
  content: '';
}

.edge-frame {
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(90deg, var(--primary), transparent 26%, transparent 74%, var(--secondary)) top / 100% 1px no-repeat,
    linear-gradient(90deg, var(--accent), transparent 32%, transparent 68%, var(--primary)) bottom / 100% 1px no-repeat,
    linear-gradient(180deg, var(--primary), transparent 35%, transparent 65%, var(--accent)) left / 1px 100% no-repeat,
    linear-gradient(180deg, var(--secondary), transparent 35%, transparent 65%, var(--primary)) right / 1px 100% no-repeat;
  opacity: 0.9;
}

.cursor-slice {
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent) var(--mx) 0 / 1px 100% no-repeat,
    linear-gradient(0deg, transparent, rgba(255, 255, 255, 0.13), transparent) 0 var(--my) / 100% 1px no-repeat;
  mix-blend-mode: screen;
}

.identity {
  position: absolute;
  left: clamp(18px, 5vw, 84px);
  bottom: clamp(92px, 12vh, 150px);
  z-index: 4;
  width: min(880px, calc(100vw - 36px));
  pointer-events: none;
}

.eyebrow {
  margin: 0 0 12px;
  color: color-mix(in srgb, var(--primary) 74%, white);
  font: 800 12px/1 'JetBrains Mono', monospace;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.identity h1 {
  position: relative;
  margin: 0;
  color: #fff;
  font-size: clamp(5.4rem, 18vw, 17.5rem);
  font-weight: 950;
  line-height: 0.78;
  letter-spacing: 0;
  text-transform: none;
  text-shadow:
    0 0 16px color-mix(in srgb, var(--hot) 70%, transparent),
    0 0 44px color-mix(in srgb, var(--primary) 58%, transparent),
    0 0 92px color-mix(in srgb, var(--secondary) 42%, transparent);
  animation: titleBreathe 3.8s ease-in-out infinite;
}

.identity h1::before,
.identity h1::after {
  position: absolute;
  inset: 0;
  content: attr(data-text);
  opacity: 0.62;
  mix-blend-mode: screen;
  pointer-events: none;
}

.identity h1::before {
  color: var(--primary);
  transform: translate(-0.035em, -0.015em);
  clip-path: polygon(0 9%, 100% 0, 100% 34%, 0 42%);
  animation: glitchA 2.4s steps(2, end) infinite;
}

.identity h1::after {
  color: var(--secondary);
  transform: translate(0.028em, 0.02em);
  clip-path: polygon(0 58%, 100% 48%, 100% 100%, 0 88%);
  animation: glitchB 2.9s steps(2, end) infinite;
}

.charge-line {
  width: min(620px, 72vw);
  height: 3px;
  margin-top: 22px;
  background: rgba(255, 255, 255, 0.14);
  overflow: hidden;
}

.charge-line span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent));
  box-shadow: 0 0 22px var(--primary);
  transition: width 0.18s ease;
}

.mode-switch {
  position: absolute;
  right: clamp(18px, 4vw, 60px);
  bottom: clamp(22px, 5vh, 54px);
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(3, 52px);
  gap: 8px;
}

.mode-switch button {
  width: 52px;
  height: 52px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.055);
  color: #fff;
  font: 900 14px/1 'JetBrains Mono', monospace;
  cursor: pointer;
  backdrop-filter: blur(18px);
  transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease;
}

.mode-switch button:hover,
.mode-switch button.active {
  transform: translateY(-3px);
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 22%, transparent);
}

.corner-readout {
  position: absolute;
  right: clamp(18px, 4vw, 60px);
  top: clamp(18px, 4vw, 52px);
  z-index: 5;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background:
    conic-gradient(from 0deg, var(--primary), var(--secondary), var(--accent), var(--primary));
  box-shadow: 0 0 28px color-mix(in srgb, var(--primary) 34%, transparent);
}

.corner-readout::before {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: rgba(5, 8, 16, 0.82);
  content: '';
}

.corner-readout span {
  position: relative;
  z-index: 1;
  font: 950 22px/1 'JetBrains Mono', monospace;
}

.corner-readout i {
  position: absolute;
  inset: -8px;
  border: 1px solid color-mix(in srgb, var(--accent) 60%, transparent);
  border-radius: 50%;
  animation: readoutSpin 4.6s linear infinite;
}

@keyframes scanSweep {
  0% {
    transform: translateX(-12%) translateY(-6%);
  }

  100% {
    transform: translateX(12%) translateY(6%);
  }
}

@keyframes titleBreathe {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-0.035em);
  }
}

@keyframes glitchA {
  0%,
  84%,
  100% {
    transform: translate(-0.035em, -0.015em);
  }

  86% {
    transform: translate(0.045em, -0.01em);
  }

  88% {
    transform: translate(-0.02em, 0.02em);
  }
}

@keyframes glitchB {
  0%,
  78%,
  100% {
    transform: translate(0.028em, 0.02em);
  }

  80% {
    transform: translate(-0.045em, 0.01em);
  }

  82% {
    transform: translate(0.02em, -0.02em);
  }
}

@keyframes readoutSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .identity {
    left: 16px;
    right: 16px;
    bottom: 104px;
    width: auto;
  }

  .eyebrow {
    font-size: 10px;
    letter-spacing: 0.18em;
  }

  .identity h1 {
    font-size: clamp(4.2rem, 24vw, 7.6rem);
  }

  .charge-line {
    width: 82vw;
  }

  .mode-switch {
    left: 16px;
    right: auto;
    bottom: 24px;
  }

  .corner-readout {
    width: 62px;
    height: 62px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .identity h1,
  .identity h1::before,
  .identity h1::after,
  .corner-readout i,
  .noise-field::after {
    animation: none;
  }
}
</style>
