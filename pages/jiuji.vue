<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type StoreType = 'core' | 'standard'

interface RawStore {
  name: string
  loc: [number, number]
  address: string
  phone: string
  url: string
  type: StoreType
}

interface StoreRecord extends RawStore {
  id: number
  avgSales: string
  category: string
  techs: string
  traffic: number
  todaySales: number
  health: number
}

interface LeafletMarker {
  bindPopup: (content: string) => void
  on: (event: string, handler: () => void) => void
  isPopupOpen: () => boolean
  setPopupContent: (content: string) => void
}

interface LeafletMap {
  flyTo: (coords: [number, number], zoom: number, options?: Record<string, unknown>) => void
  remove: () => void
  invalidateSize: () => void
}

interface LeafletNamespace {
  map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap
  control: {
    zoom: (options?: Record<string, unknown>) => { addTo: (map: LeafletMap) => void }
  }
  tileLayer: (url: string, options?: Record<string, unknown>) => { addTo: (map: LeafletMap) => void }
  divIcon: (options: Record<string, unknown>) => unknown
  marker: (coords: [number, number], options?: Record<string, unknown>) => LeafletMarker & { addTo: (map: LeafletMap) => LeafletMarker }
}

const mapContainer = ref<HTMLElement | null>(null)
const isCollapsed = ref(false)
const isPresentationMode = ref(false)
const lastSync = ref('')
const storeData = ref<StoreRecord[]>([])

let mapInstance: LeafletMap | null = null
let timer: ReturnType<typeof setInterval> | null = null
let markerCache: Record<number, LeafletMarker> = {}
let cleanupResize = () => {}

const rawStores: RawStore[] = [
  { name: '昆明佰腾店', loc: [25.0458, 102.7135], address: '五华区圆通北路120号', phone: '0871-65141852', url: 'https://www.9ji.com/stores/26', type: 'core' },
  { name: '昆明关上汇溪大厦店', loc: [25.0196, 102.7452], address: '官渡区关上中路63号', phone: '0871-67012140', url: 'https://www.9ji.com/stores/28', type: 'core' },
  { name: '昆明兴苑路碧鸡广场店', loc: [25.0312, 102.6589], address: '西山区兴苑路150号', phone: '0871-68255039', url: 'https://www.9ji.com/stores/30', type: 'standard' },
  { name: '昆明小西门店', loc: [25.0405, 102.7102], address: '五华区人民中路175号', phone: '0871-65383839', url: 'https://www.9ji.com/stores/32', type: 'core' },
  { name: '昆明南亚店', loc: [24.9864, 102.6973], address: '西山区南亚风情第壹城', phone: '0871-64163939', url: 'https://www.9ji.com/stores/36', type: 'core' },
  { name: '昆明红锦路店', loc: [25.0789, 102.7215], address: '五华区红锦路15号', phone: '0871-64106139', url: 'https://www.9ji.com/stores/38', type: 'standard' },
  { name: '昆明世纪城店', loc: [24.9756, 102.7986], address: '官渡区世纪城金源大道', phone: '0871-68421039', url: 'https://www.9ji.com/stores/40', type: 'core' },
  { name: '昆明海乐城店', loc: [24.9587, 102.8012], address: '官渡区海乐城东门', phone: '0871-68307798', url: 'https://www.9ji.com/stores/52', type: 'core' },
  { name: '昆明北云66店', loc: [25.0589, 102.7236], address: '盘龙区白云路北云66', phone: '0871-63163328', url: 'https://www.9ji.com/stores/68', type: 'standard' },
  { name: '昆明欣都龙城店', loc: [25.0712, 102.7358], address: '盘龙区北京路延长线', phone: '0871-65615961', url: 'https://www.9ji.com/stores/70', type: 'core' },
  { name: '昆明黄土坡西口店', loc: [25.0563, 102.6789], address: '五华区滇缅大道2449号', phone: '0871-68333063', url: 'https://www.9ji.com/stores/72', type: 'standard' },
  { name: '昆明西昌路店', loc: [25.0325, 102.6987], address: '五华区西昌路848号', phone: '0871-64613039', url: 'https://www.9ji.com/stores/76', type: 'standard' },
  { name: '昆明玫瑰湾店', loc: [24.9963, 102.7658], address: '官渡区官城路39号', phone: '0871-63623939', url: 'https://www.9ji.com/stores/80', type: 'standard' },
  { name: '昆明东华店', loc: [25.0489, 102.7321], address: '盘龙区环城东路176号', phone: '0871-68102039', url: 'https://www.9ji.com/stores/82', type: 'standard' },
  { name: '昆明吴井路塘子巷店', loc: [25.0289, 102.7265], address: '官渡区吴井路131号', phone: '0871-63160076', url: 'https://www.9ji.com/stores/86', type: 'standard' },
  { name: '昆明云纺店', loc: [25.0156, 102.6987], address: '西山区海埂路32号', phone: '0871-63518839', url: 'https://www.9ji.com/stores/90', type: 'core' },
  { name: '昆明新螺蛳湾写字楼店', loc: [24.9215, 102.8563], address: '官渡区新螺蛳湾一期', phone: '0871-63350039', url: 'https://www.9ji.com/stores/92', type: 'standard' },
  { name: '昆明羊甫店', loc: [24.9187, 102.8236], address: '官渡区云大西路', phone: '0871-63361939', url: 'https://www.9ji.com/stores/96', type: 'standard' },
  { name: '昆明广福路金科爱琴海店', loc: [24.9632, 102.6859], address: '西山区广福路金科爱琴海', phone: '0871-67286339', url: 'https://www.9ji.com/stores/100', type: 'core' },
  { name: '昆明红云店', loc: [25.0896, 102.7058], address: '五华区红云路99号', phone: '0871-65039039', url: 'https://www.9ji.com/stores/102', type: 'standard' },
  { name: '昆明关上融城金阶店', loc: [25.0236, 102.7589], address: '官渡区民航路679号', phone: '0871-68393039', url: 'https://www.9ji.com/stores/106', type: 'standard' },
  { name: '昆明春城慧谷店', loc: [25.0689, 102.6452], address: '五华区海屯路', phone: '0871-68309057', url: 'https://www.9ji.com/stores/110', type: 'standard' },
  { name: '昆明大板桥店', loc: [25.1876, 102.8532], address: '官渡区大板桥镇', phone: '0871-64663039', url: 'https://www.9ji.com/stores/116', type: 'standard' },
  { name: '昆明前兴路店', loc: [24.9789, 102.6758], address: '西山区前兴路', phone: '0871-63393039', url: 'https://www.9ji.com/stores/120', type: 'standard' },
  { name: '昆明茨坝店', loc: [25.1236, 102.7089], address: '盘龙区茨坝北路', phone: '0871-65628339', url: 'https://www.9ji.com/stores/122', type: 'standard' },
  { name: '昆明朗悦湾店', loc: [25.0856, 102.6897], address: '五华区小康大道', phone: '0871-63373939', url: 'https://www.9ji.com/stores/126', type: 'standard' },
  { name: '昆明云路中心店', loc: [25.0312, 102.7215], address: '官渡区环城南路262号', phone: '0871-63139039', url: 'https://www.9ji.com/stores/130', type: 'core' },
  { name: '云南映象店', loc: [25.0789, 102.7456], address: '盘龙区穿金路', phone: '0871-63133939', url: 'https://www.9ji.com/stores/136', type: 'standard' },
  { name: '昆明威远街店', loc: [25.0421, 102.7189], address: '五华区威远街166号', phone: '0871-65879074', url: 'https://www.9ji.com/stores/138', type: 'core' },
  { name: '昆明万科魅力之城店', loc: [24.9365, 102.8321], address: '官渡区魅力之城', phone: '0871-63338439', url: 'https://www.9ji.com/stores/142', type: 'standard' },
  { name: '昆明新闻路店', loc: [25.0358, 102.6963], address: '五华区新闻路335号', phone: '0871-68193139', url: 'https://www.9ji.com/stores/146', type: 'standard' },
  { name: '昆明东寺街店', loc: [25.0321, 102.6987], address: '西山区东寺街', phone: '0871-64189039', url: 'https://www.9ji.com/stores/625', type: 'core' },
  { name: '昆明新迎新城店', loc: [25.0563, 102.7389], address: '盘龙区新迎新城', phone: '0871-63196039', url: 'https://www.9ji.com/stores/671', type: 'standard' },
  { name: '昆明大都摩天店', loc: [24.9689, 102.7856], address: '官渡区大都摩天', phone: '0871-67298039', url: 'https://www.9ji.com/stores/1037', type: 'core' },
  { name: '昆明瑞鼎城购物公园店', loc: [25.0632, 102.7315], address: '盘龙区白云路168号', phone: '0871-63187039', url: 'https://www.9ji.com/stores/1410', type: 'core' },
]

const totalStores = computed(() => storeData.value.length)
const totalCoreStores = computed(() => storeData.value.filter(store => store.type === 'core').length)
const totalTraffic = computed(() => storeData.value.reduce((sum, store) => sum + store.traffic, 0))
const totalSales = computed(() => storeData.value.reduce((sum, store) => sum + store.todaySales, 0))
const avgHealth = computed(() => {
  if (!storeData.value.length)
    return '0.0'
  return (storeData.value.reduce((sum, store) => sum + store.health, 0) / storeData.value.length).toFixed(1)
})

const topStores = computed(() =>
  [...storeData.value]
    .sort((a, b) => b.todaySales - a.todaySales)
    .slice(0, 5),
)

function formatSyncTime() {
  lastSync.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function initStoreData() {
  storeData.value = rawStores.map((store, index) => {
    const isCore = store.type === 'core'
    return {
      id: index,
      ...store,
      avgSales: isCore ? '800-1200' : '400-700',
      category: isCore ? '手机/平板/配件/维修' : '手机/配件/维修',
      techs: isCore ? '6-8' : '3-5',
      traffic: isCore ? Math.floor(Math.random() * 11 + 30) : Math.floor(Math.random() * 11 + 10),
      todaySales: isCore ? Math.floor(Math.random() * 11 + 40) : Math.floor(Math.random() * 11 + 15),
      health: isCore ? Math.floor(Math.random() * 3 + 96) : Math.floor(Math.random() * 4 + 92),
    }
  })
  formatSyncTime()
}

function toggleDash() {
  isCollapsed.value = !isCollapsed.value
}

function togglePresentationMode() {
  isPresentationMode.value = !isPresentationMode.value
}

function generateHTML(store: StoreRecord) {
  const isCore = store.type === 'core'
  const healthClass = store.health >= 95 ? 'text-green' : 'text-orange'

  return `
    <div class="popup-header ${isCore ? 'core-header' : 'standard-header'}">
      <div>
        ${store.name}
        <br />
        <a href="${store.url}" target="_blank" rel="noreferrer" class="store-link">官网详情 ↗</a>
      </div>
      <span class="badge ${isCore ? 'badge-core' : 'badge-standard'}">${isCore ? '★ Core Store' : 'Standard'}</span>
    </div>
    <div class="popup-body">
      <div class="col">
        <div class="col-title">Info / 基础</div>
        <div class="info-item"><span>Address</span>${store.address}</div>
        <div class="info-item"><span>Hours</span>09:00 - 22:00</div>
        <div class="info-item"><span>Phone</span>${store.phone}</div>
      </div>
      <div class="col">
        <div class="col-title">Profile / 画像</div>
        <div class="info-item"><span>Est. Monthly Sales</span><b>${store.avgSales}</b></div>
        <div class="info-item"><span>Category</span>${store.category}</div>
        <div class="info-item"><span>Technicians</span>${store.techs}</div>
      </div>
      <div class="col">
        <div class="col-title">Live / 实时</div>
        <div class="info-item"><span>Current Traffic</span><div class="data-value text-blue">${store.traffic} <small>人</small></div></div>
        <div class="info-item"><span>Today's Sales</span><div class="data-value">${store.todaySales} <small>台</small></div></div>
        <div class="info-item"><span>Health Index</span><div class="data-value ${healthClass}">${store.health}%</div></div>
      </div>
    </div>
    <div class="update-time">System Active | Last Sync: ${lastSync.value}</div>
  `
}

function triggerRealTimeUpdate() {
  storeData.value = storeData.value.map(store => ({
    ...store,
    traffic: Math.max(0, store.traffic + (Math.floor(Math.random() * 21) - 10)),
    todaySales: Math.max(0, store.todaySales + (Math.floor(Math.random() * 11) - 5)),
    health: Math.max(90, Math.min(100, store.health + (Math.floor(Math.random() * 3) - 1))),
  }))

  formatSyncTime()

  storeData.value.forEach((store) => {
    const marker = markerCache[store.id]
    if (marker?.isPopupOpen())
      marker.setPopupContent(generateHTML(store))
  })
}

function ensureLeafletStyle() {
  const existing = document.querySelector('link[data-jiuji-leaflet-style="true"]')
  if (existing)
    return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fastly.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
  link.dataset.jiujiLeafletStyle = 'true'
  document.head.appendChild(link)
}

function initMap() {
  const leaflet = (window as Window & { L?: LeafletNamespace }).L

  if (!leaflet || !mapContainer.value)
    return

  mapInstance = leaflet.map(mapContainer.value, { zoomControl: false }).setView([25.042, 102.714], 12)
  leaflet.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

  leaflet.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    maxZoom: 18,
    attribution: '© AutoNavi | 9JI Dashboard',
  }).addTo(mapInstance)

  const coreIcon = leaflet.divIcon({
    className: 'custom-icon-wrapper',
    html: '<div class="pulse-marker core-pulse"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  })

  const standardIcon = leaflet.divIcon({
    className: 'custom-icon-wrapper',
    html: '<div class="pulse-marker standard-pulse"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -8],
  })

  markerCache = {}

  storeData.value.forEach((store) => {
    const iconToUse = store.type === 'core' ? coreIcon : standardIcon
    const marker = leaflet.marker(store.loc, { icon: iconToUse, title: store.name }).addTo(mapInstance!)
    marker.bindPopup(generateHTML(store))

    marker.on('click', () => {
      if (!mapInstance)
        return
      const latOffset = window.innerWidth <= 768 ? -0.012 : 0.015
      mapInstance.flyTo([store.loc[0] + latOffset, store.loc[1]], 14, { duration: 1.35 })
    })

    markerCache[store.id] = marker
  })

  timer = setInterval(triggerRealTimeUpdate, 5000)
}

function ensureLeafletScript() {
  const leaflet = (window as Window & { L?: LeafletNamespace }).L
  if (leaflet) {
    initMap()
    return
  }

  const existing = document.querySelector('script[data-jiuji-leaflet-script="true"]') as HTMLScriptElement | null
  if (existing) {
    existing.addEventListener('load', initMap, { once: true })
    return
  }

  const script = document.createElement('script')
  script.src = 'https://fastly.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
  script.async = true
  script.dataset.jiujiLeafletScript = 'true'
  script.onload = initMap
  document.body.appendChild(script)
}

onMounted(() => {
  initStoreData()
  isCollapsed.value = window.innerWidth <= 768

  ensureLeafletStyle()
  ensureLeafletScript()

  const handleResize = () => {
    if (window.innerWidth <= 768)
      isCollapsed.value = true
    mapInstance?.invalidateSize()
  }

  window.addEventListener('resize', handleResize, { passive: true })
  cleanupResize = () => window.removeEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanupResize()
  if (timer)
    clearInterval(timer)
  if (mapInstance)
    mapInstance.remove()
})
</script>

<template>
  <div class="map-page-wrapper" :class="{ presentation: isPresentationMode }">
    <div class="top-toolbar">
      <div class="brand-block">
        <div class="brand-kicker">9JI / OPS BOARD</div>
        <h1>昆明门店运营展示屏</h1>
        <p>实时模拟数据面板</p>
      </div>

      <div class="toolbar-actions">
        <div class="legend-group">
          <span class="legend-item"><i class="legend-dot core" /> 核心门店</span>
          <span class="legend-item"><i class="legend-dot standard" /> 标准门店</span>
        </div>
        <button type="button" class="toolbar-btn" @click="togglePresentationMode">
          {{ isPresentationMode ? '退出展示模式' : '展示模式' }}
        </button>
        <a href="/" class="toolbar-btn ghost">返回主页</a>
      </div>
    </div>

    <div ref="mapContainer" class="map-container" />

    <div class="glass-dashboard" :class="{ collapsed: isCollapsed }">
      <div class="dash-toggle" @click="toggleDash">
        <span v-if="isCollapsed">展开数据面板</span>
        <span v-else>收起数据面板</span>
      </div>

      <div v-show="!isCollapsed" class="dash-content">
        <div class="dash-header">
          <div>
            <h2 class="dash-title">Kunming Operations</h2>
            <p class="dash-subtitle">昆明区域门店运营概览</p>
          </div>
          <div class="sync-info">
            <span>Last Sync</span>
            <strong>{{ lastSync }}</strong>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">门店总数</div>
            <div class="metric-value">{{ totalStores }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">核心门店</div>
            <div class="metric-value">{{ totalCoreStores }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">实时客流</div>
            <div class="metric-value text-blue">{{ totalTraffic }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">今日预估销量</div>
            <div class="metric-value text-orange">{{ totalSales }}</div>
          </div>
          <div class="metric-card span-2">
            <div class="metric-label">平均健康指数</div>
            <div class="metric-value text-green">{{ avgHealth }}%</div>
          </div>
        </div>

        <div class="rank-card">
          <div class="rank-title">TOP 5 门店销量</div>
          <div class="rank-list">
            <div v-for="store in topStores" :key="store.id" class="rank-item">
              <div>
                <strong>{{ store.name }}</strong>
                <span>{{ store.type === 'core' ? '核心店' : '标准店' }}</span>
              </div>
              <b>{{ store.todaySales }} 台</b>
            </div>
          </div>
        </div>

        <div class="dash-footer">
          数据每 5 秒刷新一次，点击地图门店可查看详情弹窗
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-page-wrapper {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #061120;
  color: #fff;
}

.map-page-wrapper.presentation .top-toolbar,
.map-page-wrapper.presentation .glass-dashboard {
  opacity: 0.2;
}

.map-page-wrapper.presentation .top-toolbar:hover,
.map-page-wrapper.presentation .glass-dashboard:hover {
  opacity: 1;
}

.top-toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 100001;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(5, 19, 39, 0.86), rgba(10, 30, 59, 0.72));
  border: 1px solid rgba(120, 194, 255, 0.18);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
  transition: opacity 0.2s ease;
}

.brand-kicker {
  color: #83d6ff;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.brand-block h1 {
  margin: 0.28rem 0 0.2rem;
  font-size: 30px;
  font-weight: 900;
}

.brand-block p {
  margin: 0;
  color: rgba(223, 237, 255, 0.72);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.legend-group {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-right: 0.25rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(227, 238, 255, 0.84);
  font-size: 13px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
  box-shadow: 0 0 10px currentColor;
}

.legend-dot.core {
  background: #fbc531;
  color: #fbc531;
}

.legend-dot.standard {
  background: #00a8ff;
  color: #00a8ff;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease;
}

.toolbar-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.14);
}

.toolbar-btn.ghost {
  background: rgba(8, 18, 36, 0.62);
}

.map-container {
  width: 100%;
  height: 100%;
}

.glass-dashboard {
  position: absolute;
  top: 120px;
  right: 20px;
  z-index: 100000;
  width: 360px;
  border-radius: 22px;
  background: rgba(6, 18, 34, 0.78);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(120, 194, 255, 0.18);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.24);
  overflow: hidden;
  transition: opacity 0.2s ease;
}

.dash-toggle {
  padding: 15px 18px;
  font-size: 14px;
  font-weight: 800;
  color: #dce9ff;
  cursor: pointer;
  text-align: center;
  background: rgba(255, 255, 255, 0.04);
}

.dash-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dash-content {
  padding: 18px;
}

.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dash-title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
}

.dash-subtitle {
  margin: 4px 0 0;
  color: rgba(220, 233, 255, 0.68);
  font-size: 13px;
}

.sync-info {
  text-align: right;
  font-size: 12px;
  color: rgba(220, 233, 255, 0.62);
}

.sync-info strong {
  display: block;
  margin-top: 2px;
  color: #fff;
  font-size: 16px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.metric-card {
  padding: 0.9rem 0.95rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.metric-card.span-2 {
  grid-column: span 2;
}

.metric-label {
  color: rgba(220, 233, 255, 0.62);
  font-size: 12px;
  margin-bottom: 6px;
}

.metric-value {
  font-size: 28px;
  font-weight: 900;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1;
}

.text-blue {
  color: #55c6ff;
}

.text-orange {
  color: #ffbe5c;
}

.text-green {
  color: #59e1a8;
}

.rank-card {
  margin-top: 0.95rem;
  padding: 0.9rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rank-title {
  font-size: 13px;
  color: rgba(220, 233, 255, 0.68);
  margin-bottom: 0.75rem;
  letter-spacing: 0.08em;
}

.rank-list {
  display: grid;
  gap: 0.65rem;
}

.rank-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 13px;
}

.rank-item strong {
  display: block;
  color: #fff;
}

.rank-item span {
  color: rgba(220, 233, 255, 0.58);
}

.rank-item b {
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
}

.dash-footer {
  margin-top: 0.95rem;
  text-align: center;
  font-size: 12px;
  color: rgba(220, 233, 255, 0.58);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
  padding: 0;
  overflow: hidden;
  background: #fff;
}

:deep(.leaflet-popup-tip-container) {
  display: none;
}

:deep(.leaflet-popup-content) {
  margin: 0;
  width: 500px !important;
}

:deep(.popup-header) {
  padding: 14px 18px;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

:deep(.core-header) {
  background: linear-gradient(135deg, #fbc531, #e1b12c);
}

:deep(.standard-header) {
  background: linear-gradient(135deg, #00a8ff, #0097e6);
}

:deep(.badge) {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.badge-core) {
  background: #fff;
  color: #e1b12c;
}

:deep(.badge-standard) {
  background: #fff;
  color: #0097e6;
}

:deep(.popup-body) {
  display: flex;
  padding: 16px;
  background: #fff;
}

:deep(.col) {
  flex: 1;
  padding: 0 12px;
  border-right: 1px solid #f1f2f6;
}

:deep(.col:last-child) {
  border-right: none;
}

:deep(.col-title) {
  font-size: 12px;
  color: #747d8c;
  margin-bottom: 12px;
  border-bottom: 2px solid #f1f2f6;
  padding-bottom: 4px;
  font-weight: 800;
  text-transform: uppercase;
}

:deep(.info-item) {
  font-size: 13px;
  color: #2f3542;
  margin-bottom: 10px;
  line-height: 1.4;
  font-weight: 500;
}

:deep(.info-item span) {
  color: #a4b0be;
  display: block;
  font-size: 11px;
  margin-bottom: 2px;
  font-weight: normal;
}

:deep(.data-value) {
  font-size: 22px;
  font-weight: 900;
  color: #2f3542;
  margin: 4px 0;
  font-family: 'JetBrains Mono', monospace;
}

:deep(.data-value small) {
  font-size: 12px;
  font-weight: normal;
  color: #a4b0be;
}

:deep(.update-time) {
  text-align: right;
  padding: 10px 18px;
  background: #f8f9fa;
  font-size: 11px;
  color: #a4b0be;
  border-top: 1px solid #f1f2f6;
}

:deep(a.store-link) {
  display: inline-block;
  margin-top: 5px;
  color: #fff !important;
  text-decoration: none;
  font-size: 11px;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 10px;
  border-radius: 4px;
  transition: 0.3s;
  backdrop-filter: blur(4px);
}

:deep(a.store-link:hover) {
  background: rgba(0, 0, 0, 0.4);
  transform: translateY(-1px);
}

:deep(.pulse-marker) {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #fff;
}

:deep(.core-pulse) {
  background: #fbc531;
  animation: pulse-core 2s infinite cubic-bezier(0.66, 0, 0, 1);
  box-shadow: 0 0 10px rgba(251, 197, 49, 0.8);
}

:deep(.standard-pulse) {
  background: #00a8ff;
  animation: pulse-standard 2.5s infinite cubic-bezier(0.66, 0, 0, 1);
  box-shadow: 0 0 8px rgba(0, 168, 255, 0.8);
}

@keyframes pulse-core {
  0% { box-shadow: 0 0 0 0 rgba(251, 197, 49, 0.6); }
  70% { box-shadow: 0 0 0 15px rgba(251, 197, 49, 0); }
  100% { box-shadow: 0 0 0 0 rgba(251, 197, 49, 0); }
}

@keyframes pulse-standard {
  0% { box-shadow: 0 0 0 0 rgba(0, 168, 255, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(0, 168, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 168, 255, 0); }
}

@media (max-width: 960px) {
  .top-toolbar {
    left: 12px;
    right: 12px;
    top: 12px;
    padding: 0.9rem;
    border-radius: 18px;
    flex-direction: column;
  }

  .brand-block h1 {
    font-size: 24px;
  }

  .toolbar-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .glass-dashboard {
    top: auto;
    bottom: 14px;
    right: 12px;
    left: 12px;
    width: auto;
  }

  :deep(.leaflet-popup-content) {
    width: 300px !important;
  }

  :deep(.popup-body) {
    flex-direction: column;
  }

  :deep(.col) {
    border-right: none;
    border-bottom: 1px solid #f1f2f6;
    padding: 10px 0;
  }

  :deep(.col:last-child) {
    border-bottom: none;
  }

  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
