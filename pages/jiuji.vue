<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

type ECharts = import('echarts').ECharts
type EChartsOption = import('echarts').EChartsOption
type StoreType = 'core' | 'standard'
type AlertLevel = 'high' | 'medium' | 'info'

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
  district: string
  avgSales: string
  category: string
  techs: string
  traffic: number
  todaySales: number
  health: number
  repairOrders: number
  smartShare: number
  accessoryShare: number
  serviceScore: number
  serviceTag: string
}

interface AlertRecord {
  id: string
  title: string
  detail: string
  level: AlertLevel
}

interface LeafletMarker {
  bindPopup: (content: string) => void
  on: (event: string, handler: () => void) => void
  isPopupOpen: () => boolean
  setPopupContent: (content: string) => void
  openPopup?: () => void
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
const trendChartEl = ref<HTMLElement | null>(null)
const districtChartEl = ref<HTMLElement | null>(null)
const categoryChartEl = ref<HTMLElement | null>(null)

const isPresentationMode = ref(false)
const lastSync = ref('--:--:--')
const currentTime = ref('--:--:--')
const storeData = ref<StoreRecord[]>([])
const selectedStoreId = ref<number | null>(null)
const trendSales = ref<number[]>([])
const trendTraffic = ref<number[]>([])

let mapInstance: LeafletMap | null = null
let markerCache: Record<number, LeafletMarker> = {}
let refreshTimer: ReturnType<typeof setInterval> | null = null
let clockTimer: ReturnType<typeof setInterval> | null = null
let presentationTimer: ReturnType<typeof setInterval> | null = null
let cleanupResize = () => {}

let echartsLib: typeof import('echarts') | null = null
let trendChart: ECharts | null = null
let districtChart: ECharts | null = null
let categoryChart: ECharts | null = null

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

function pickDistrict(address: string) {
  if (address.includes('五华区'))
    return '五华区'
  if (address.includes('盘龙区'))
    return '盘龙区'
  if (address.includes('官渡区'))
    return '官渡区'
  if (address.includes('西山区'))
    return '西山区'
  return '其他'
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function updateClock() {
  const now = new Date()
  currentTime.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

function updateSyncTime() {
  lastSync.value = new Date().toLocaleTimeString('zh-CN', { hour12: false })
}

function createSeries(base: number, multipliers: number[]) {
  return multipliers.map(multiplier => Math.round(base * multiplier))
}

function initStoreData() {
  storeData.value = rawStores.map((store, index) => {
    const isCore = store.type === 'core'
    const seed = index + 1
    const traffic = isCore ? 28 + (seed * 7) % 15 : 12 + (seed * 5) % 12
    const todaySales = isCore ? 36 + (seed * 9) % 16 : 14 + (seed * 4) % 10
    const health = isCore ? 95 + (seed % 4) : 91 + (seed % 6)
    const repairOrders = isCore ? 8 + (seed * 3) % 11 : 4 + (seed * 2) % 7
    const smartShare = 14 + (seed * 3) % 12
    const accessoryShare = 24 + (seed * 5) % 18
    const serviceScore = Number((4.4 + (seed % 5) * 0.08).toFixed(2))

    return {
      id: index,
      ...store,
      district: pickDistrict(store.address),
      avgSales: isCore ? '¥120万 - ¥180万' : '¥45万 - ¥85万',
      category: isCore ? '手机 / 平板 / 配件 / 维修 / 以旧换新' : '手机 / 配件 / 维修',
      techs: isCore ? '6 - 8人' : '3 - 5人',
      traffic,
      todaySales,
      health,
      repairOrders,
      smartShare,
      accessoryShare,
      serviceScore,
      serviceTag: isCore ? '旗舰服务覆盖' : '社区便捷服务',
    }
  })

  const sorted = [...storeData.value].sort((a, b) => b.todaySales - a.todaySales)
  selectedStoreId.value = sorted[0]?.id ?? 0
  updateSyncTime()
}

const totalStores = computed(() => storeData.value.length)
const totalCoreStores = computed(() => storeData.value.filter(store => store.type === 'core').length)
const totalTraffic = computed(() => storeData.value.reduce((sum, store) => sum + store.traffic, 0))
const totalSales = computed(() => storeData.value.reduce((sum, store) => sum + store.todaySales, 0))
const totalRepairs = computed(() => storeData.value.reduce((sum, store) => sum + store.repairOrders, 0))
const avgHealth = computed(() => {
  if (!storeData.value.length)
    return '0.0'
  return (storeData.value.reduce((sum, store) => sum + store.health, 0) / storeData.value.length).toFixed(1)
})
const avgServiceScore = computed(() => {
  if (!storeData.value.length)
    return '0.00'
  return (storeData.value.reduce((sum, store) => sum + store.serviceScore, 0) / storeData.value.length).toFixed(2)
})
const coreCoverage = computed(() => {
  if (!storeData.value.length)
    return '0'
  return ((totalCoreStores.value / totalStores.value) * 100).toFixed(0)
})

const topStores = computed(() =>
  [...storeData.value]
    .sort((a, b) => b.todaySales - a.todaySales)
    .slice(0, 6),
)

const selectedStore = computed(() =>
  storeData.value.find(store => store.id === selectedStoreId.value) || topStores.value[0] || null,
)

const districtStats = computed(() => {
  const map = new Map<string, { district: string, stores: number, sales: number }>()
  storeData.value.forEach((store) => {
    const current = map.get(store.district) || { district: store.district, stores: 0, sales: 0 }
    current.stores += 1
    current.sales += store.todaySales
    map.set(store.district, current)
  })
  return [...map.values()].sort((a, b) => b.sales - a.sales)
})

const categoryMix = computed(() => {
  const phone = storeData.value.reduce((sum, store) => sum + store.todaySales * Math.max(0.28, (100 - store.accessoryShare - store.smartShare) / 100), 0)
  const accessory = storeData.value.reduce((sum, store) => sum + store.todaySales * (store.accessoryShare / 100), 0)
  const smart = storeData.value.reduce((sum, store) => sum + store.todaySales * (store.smartShare / 100), 0)
  const service = totalRepairs.value * 1.6

  return [
    { name: '手机', value: Number(phone.toFixed(1)) },
    { name: '配件', value: Number(accessory.toFixed(1)) },
    { name: '智能设备', value: Number(smart.toFixed(1)) },
    { name: '服务工单', value: Number(service.toFixed(1)) },
  ]
})

const alertFeed = computed<AlertRecord[]>(() => {
  if (!storeData.value.length)
    return []

  const busiest = [...storeData.value].sort((a, b) => b.traffic - a.traffic)[0]
  const lowestHealth = [...storeData.value].sort((a, b) => a.health - b.health)[0]
  const heavyRepair = [...storeData.value].sort((a, b) => b.repairOrders - a.repairOrders)[0]

  return [
    {
      id: 'busy',
      title: `${busiest.name} 客流峰值`,
      detail: `当前客流 ${busiest.traffic} 人，建议优先补位导购与收银支援。`,
      level: busiest.traffic >= 40 ? 'high' : 'medium',
    },
    {
      id: 'health',
      title: `${lowestHealth.name} 健康度偏低`,
      detail: `门店健康指数 ${lowestHealth.health}% ，建议检查陈列、排队和售后响应。`,
      level: lowestHealth.health <= 93 ? 'high' : 'medium',
    },
    {
      id: 'repair',
      title: `${heavyRepair.name} 维修工单堆积`,
      detail: `当前工单 ${heavyRepair.repairOrders} 单，可考虑调配维修技师或分流到附近门店。`,
      level: heavyRepair.repairOrders >= 12 ? 'high' : 'info',
    },
  ]
})

function seedTrendSeries() {
  const salesBase = totalSales.value
  const trafficBase = totalTraffic.value
  trendSales.value = createSeries(salesBase, [0.82, 0.86, 0.91, 0.95, 0.99, 1.03, 1.0])
  trendTraffic.value = createSeries(trafficBase, [0.78, 0.83, 0.89, 0.92, 0.98, 1.02, 1.0])
}

function updateTrendSeries() {
  if (!trendSales.value.length || !trendTraffic.value.length) {
    seedTrendSeries()
    return
  }

  trendSales.value = [...trendSales.value.slice(1), totalSales.value]
  trendTraffic.value = [...trendTraffic.value.slice(1), totalTraffic.value]
}

function levelText(level: AlertLevel) {
  if (level === 'high')
    return '高优先级'
  if (level === 'medium')
    return '关注'
  return '观察'
}

function metricTone(value: number, warnValue: number, highValue: number) {
  if (value >= highValue)
    return 'tone-hot'
  if (value >= warnValue)
    return 'tone-warn'
  return 'tone-safe'
}

function generateHTML(store: StoreRecord) {
  const isCore = store.type === 'core'
  const healthClass = store.health >= 95 ? 'text-green' : store.health >= 93 ? 'text-cyan' : 'text-orange'

  return `
    <div class="popup-shell">
      <div class="popup-header ${isCore ? 'core-header' : 'standard-header'}">
        <div class="popup-title-group">
          <strong>${store.name}</strong>
          <span>${store.district} · ${store.serviceTag}</span>
        </div>
        <span class="badge ${isCore ? 'badge-core' : 'badge-standard'}">${isCore ? 'CORE STORE' : 'STANDARD'}</span>
      </div>
      <div class="popup-body">
        <div class="popup-metric-grid">
          <div class="popup-metric-card">
            <span>实时客流</span>
            <b>${store.traffic}<small>人</small></b>
          </div>
          <div class="popup-metric-card">
            <span>今日销量</span>
            <b>${store.todaySales}<small>台</small></b>
          </div>
          <div class="popup-metric-card">
            <span>健康指数</span>
            <b class="${healthClass}">${store.health}<small>%</small></b>
          </div>
          <div class="popup-metric-card">
            <span>维修工单</span>
            <b>${store.repairOrders}<small>单</small></b>
          </div>
        </div>
        <div class="popup-info-list">
          <div class="info-item"><span>地址</span>${store.address}</div>
          <div class="info-item"><span>电话</span>${store.phone}</div>
          <div class="info-item"><span>经营范围</span>${store.category}</div>
          <div class="info-item"><span>月销区间</span>${store.avgSales}</div>
        </div>
      </div>
      <div class="popup-footer">
        <span>Last Sync ${lastSync.value}</span>
        <a href="${store.url}" target="_blank" rel="noreferrer" class="store-link">官网详情 ↗</a>
      </div>
    </div>
  `
}

function selectStore(storeId: number, shouldFly = true) {
  selectedStoreId.value = storeId
  const store = storeData.value.find(item => item.id === storeId)
  const marker = markerCache[storeId]

  if (store && shouldFly && mapInstance) {
    const latOffset = window.innerWidth <= 1024 ? -0.015 : 0.012
    mapInstance.flyTo([store.loc[0] + latOffset, store.loc[1]], window.innerWidth <= 1024 ? 13 : 14, { duration: 1.15 })
  }

  marker?.openPopup?.()
}

function triggerRealTimeUpdate() {
  storeData.value = storeData.value.map((store, index) => {
    const deltaTraffic = (index % 2 === 0 ? 1 : -1) * ((index % 3) + 1)
    const deltaSales = index % 4 === 0 ? 2 : index % 3 === 0 ? -1 : 1
    const deltaHealth = index % 5 === 0 ? -1 : 0
    const deltaRepair = index % 6 === 0 ? 1 : index % 4 === 0 ? -1 : 0

    return {
      ...store,
      traffic: Math.max(6, Math.min(56, store.traffic + deltaTraffic)),
      todaySales: Math.max(8, Math.min(68, store.todaySales + deltaSales)),
      health: Math.max(90, Math.min(99, store.health + deltaHealth)),
      repairOrders: Math.max(1, Math.min(18, store.repairOrders + deltaRepair)),
    }
  })

  updateSyncTime()
  updateTrendSeries()
  updateCharts()

  storeData.value.forEach((store) => {
    const marker = markerCache[store.id]
    if (marker?.isPopupOpen())
      marker.setPopupContent(generateHTML(store))
  })
}

function setupPresentationRotation() {
  if (presentationTimer) {
    clearInterval(presentationTimer)
    presentationTimer = null
  }

  if (!isPresentationMode.value || !topStores.value.length)
    return

  presentationTimer = setInterval(() => {
    const ranking = topStores.value
    const currentIndex = ranking.findIndex(store => store.id === selectedStoreId.value)
    const nextStore = ranking[(currentIndex + 1) % ranking.length]
    if (nextStore)
      selectStore(nextStore.id)
  }, 4800)
}

function togglePresentationMode() {
  isPresentationMode.value = !isPresentationMode.value
}

watch(isPresentationMode, setupPresentationRotation)

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

  mapInstance = leaflet.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView([25.042, 102.714], 12)

  leaflet.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

  leaflet.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    maxZoom: 18,
  }).addTo(mapInstance)

  const coreIcon = leaflet.divIcon({
    className: 'ops-marker-wrapper',
    html: '<div class="ops-marker core"><span></span></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -10],
  })

  const standardIcon = leaflet.divIcon({
    className: 'ops-marker-wrapper',
    html: '<div class="ops-marker standard"><span></span></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  })

  markerCache = {}

  storeData.value.forEach((store) => {
    const marker = leaflet
      .marker(store.loc, { icon: store.type === 'core' ? coreIcon : standardIcon, title: store.name })
      .addTo(mapInstance!)

    marker.bindPopup(generateHTML(store))
    marker.on('click', () => selectStore(store.id))
    markerCache[store.id] = marker
  })

  nextTick(() => {
    if (selectedStoreId.value !== null)
      selectStore(selectedStoreId.value, false)
  })
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

async function initCharts() {
  if (!trendChartEl.value || !districtChartEl.value || !categoryChartEl.value)
    return

  if (!echartsLib)
    echartsLib = await import('echarts')

  trendChart ??= echartsLib.init(trendChartEl.value)
  districtChart ??= echartsLib.init(districtChartEl.value)
  categoryChart ??= echartsLib.init(categoryChartEl.value)

  updateCharts()
}

function createTrendOption(): EChartsOption {
  return {
    animationDuration: 700,
    grid: { left: 18, right: 18, top: 28, bottom: 22, containLabel: true },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6, 15, 28, 0.94)',
      borderColor: 'rgba(84, 211, 255, 0.22)',
      textStyle: { color: '#f8fcff' },
    },
    legend: {
      right: 0,
      top: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: 'rgba(225, 236, 255, 0.72)' },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1', 'Today'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisLabel: { color: 'rgba(220,233,255,0.58)' },
    },
    yAxis: [
      {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
        axisLabel: { color: 'rgba(220,233,255,0.48)' },
      },
      {
        type: 'value',
        splitLine: { show: false },
        axisLabel: { color: 'rgba(220,233,255,0.48)' },
      },
    ],
    series: [
      {
        name: '销量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: trendSales.value,
        lineStyle: { width: 3, color: '#56d7ff' },
        itemStyle: { color: '#56d7ff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(86, 215, 255, 0.30)' },
              { offset: 1, color: 'rgba(86, 215, 255, 0.02)' },
            ],
          },
        },
      },
      {
        name: '客流',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'none',
        data: trendTraffic.value,
        lineStyle: { width: 2, color: '#fbc531' },
      },
    ],
  }
}

function createDistrictOption(): EChartsOption {
  return {
    animationDuration: 700,
    grid: { left: 16, right: 20, top: 18, bottom: 12, containLabel: true },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(6, 15, 28, 0.94)',
      borderColor: 'rgba(84, 211, 255, 0.22)',
      textStyle: { color: '#f8fcff' },
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
      axisLabel: { color: 'rgba(220,233,255,0.48)' },
    },
    yAxis: {
      type: 'category',
      data: districtStats.value.map(item => item.district),
      axisLabel: { color: 'rgba(225,236,255,0.72)' },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: districtStats.value.map(item => item.sales),
        barWidth: 12,
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#34d399' },
              { offset: 1, color: '#56d7ff' },
            ],
          },
        },
      },
    ],
  }
}

function createCategoryOption(): EChartsOption {
  return {
    animationDuration: 700,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(6, 15, 28, 0.94)',
      borderColor: 'rgba(84, 211, 255, 0.22)',
      textStyle: { color: '#f8fcff' },
    },
    color: ['#56d7ff', '#fbc531', '#f97316', '#9b8cff'],
    series: [
      {
        type: 'pie',
        radius: ['54%', '76%'],
        center: ['50%', '58%'],
        avoidLabelOverlap: true,
        label: {
          color: 'rgba(225,236,255,0.8)',
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          lineStyle: { color: 'rgba(255,255,255,0.22)' },
        },
        itemStyle: {
          borderColor: 'rgba(4, 10, 18, 0.88)',
          borderWidth: 4,
        },
        data: categoryMix.value,
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '44%',
        style: {
          text: 'GMV\nMIX',
          fill: '#f8fcff',
          fontWeight: 700,
          fontSize: 20,
          textAlign: 'center',
        },
      },
    ],
  }
}

function updateCharts() {
  if (!trendChart || !districtChart || !categoryChart)
    return

  trendChart.setOption(createTrendOption())
  districtChart.setOption(createDistrictOption())
  categoryChart.setOption(createCategoryOption())
}

onMounted(async () => {
  initStoreData()
  seedTrendSeries()
  updateClock()

  ensureLeafletStyle()
  ensureLeafletScript()

  await nextTick()
  await initCharts()

  refreshTimer = setInterval(triggerRealTimeUpdate, 5000)
  clockTimer = setInterval(updateClock, 1000)

  const handleResize = () => {
    mapInstance?.invalidateSize()
    trendChart?.resize()
    districtChart?.resize()
    categoryChart?.resize()
  }

  window.addEventListener('resize', handleResize, { passive: true })
  cleanupResize = () => window.removeEventListener('resize', handleResize)
})

onUnmounted(() => {
  cleanupResize()
  if (refreshTimer)
    clearInterval(refreshTimer)
  if (clockTimer)
    clearInterval(clockTimer)
  if (presentationTimer)
    clearInterval(presentationTimer)

  trendChart?.dispose()
  districtChart?.dispose()
  categoryChart?.dispose()

  if (mapInstance)
    mapInstance.remove()
})
</script>

<template>
  <div class="ops-board" :class="{ presentation: isPresentationMode }">
    <div class="board-shell">
      <header class="board-header">
        <div class="brand-cluster">
          <div class="brand-badge">9JI OPS COMMAND</div>
          <div>
            <h1>昆明门店运营驾驶舱</h1>
            <p>面试展示版 / 实时模拟数据联动 / 门店地图与经营指标一屏联动</p>
          </div>
        </div>

        <div class="header-actions">
          <div class="system-clock">
            <span>System Time</span>
            <strong>{{ currentTime }}</strong>
          </div>
          <div class="system-clock">
            <span>Last Sync</span>
            <strong>{{ lastSync }}</strong>
          </div>
          <button type="button" class="header-btn" @click="togglePresentationMode">
            {{ isPresentationMode ? '退出轮播' : '展示轮播' }}
          </button>
          <a href="/" class="header-btn ghost">返回主页</a>
        </div>
      </header>

      <section class="kpi-row">
        <article class="kpi-card">
          <span>门店总数</span>
          <strong>{{ totalStores }}</strong>
          <small>覆盖昆明主城区</small>
        </article>
        <article class="kpi-card">
          <span>核心门店</span>
          <strong>{{ totalCoreStores }}</strong>
          <small>核心覆盖 {{ coreCoverage }}%</small>
        </article>
        <article class="kpi-card">
          <span>实时客流</span>
          <strong :class="metricTone(totalTraffic, 900, 1100)">{{ totalTraffic }}</strong>
          <small>全域门店客流汇总</small>
        </article>
        <article class="kpi-card">
          <span>今日销量</span>
          <strong class="tone-cyan">{{ totalSales }}</strong>
          <small>门店即时销量模拟</small>
        </article>
        <article class="kpi-card">
          <span>售后工单</span>
          <strong :class="metricTone(totalRepairs, 180, 230)">{{ totalRepairs }}</strong>
          <small>维修/售后待处理量</small>
        </article>
        <article class="kpi-card">
          <span>服务评分</span>
          <strong class="tone-green">{{ avgServiceScore }}</strong>
          <small>平均门店服务体验</small>
        </article>
      </section>

      <section class="main-grid">
        <aside class="side-column left-column">
          <article class="panel-card">
            <div class="panel-head">
              <div>
                <span class="panel-kicker">TODAY RANKING</span>
                <h2>门店实时排行</h2>
              </div>
              <span class="panel-tag">TOP 6</span>
            </div>

            <div class="ranking-list">
              <button
                v-for="(store, index) in topStores"
                :key="store.id"
                type="button"
                class="ranking-item"
                :class="{ active: selectedStoreId === store.id }"
                @click="selectStore(store.id)"
              >
                <span class="rank-index">{{ index + 1 }}</span>
                <div class="rank-main">
                  <strong>{{ store.name }}</strong>
                  <small>{{ store.district }} · {{ store.type === 'core' ? '核心店' : '标准店' }}</small>
                </div>
                <div class="rank-value">
                  <b>{{ store.todaySales }}</b>
                  <small>台</small>
                </div>
              </button>
            </div>
          </article>

          <article class="panel-card">
            <div class="panel-head">
              <div>
                <span class="panel-kicker">ALERT FEED</span>
                <h2>运营提醒</h2>
              </div>
              <span class="panel-tag">LIVE</span>
            </div>

            <div class="alert-list">
              <article v-for="alert in alertFeed" :key="alert.id" class="alert-item" :class="`level-${alert.level}`">
                <div class="alert-dot" />
                <div>
                  <strong>{{ alert.title }}</strong>
                  <p>{{ alert.detail }}</p>
                </div>
                <span>{{ levelText(alert.level) }}</span>
              </article>
            </div>
          </article>
        </aside>

        <section class="map-stage panel-card">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">CITY MAP</span>
              <h2>昆明门店分布与联动地图</h2>
            </div>
            <div class="legend-line">
              <span><i class="legend-dot core" /> 核心店</span>
              <span><i class="legend-dot standard" /> 标准店</span>
            </div>
          </div>

          <div class="map-stage-inner">
            <div ref="mapContainer" class="map-container" />

            <div v-if="selectedStore" class="map-focus-card">
              <span class="focus-kicker">当前聚焦</span>
              <strong>{{ selectedStore.name }}</strong>
              <p>{{ selectedStore.district }} · {{ selectedStore.address }}</p>
              <div class="focus-metrics">
                <span>客流 {{ selectedStore.traffic }}</span>
                <span>销量 {{ selectedStore.todaySales }}</span>
                <span>健康 {{ selectedStore.health }}%</span>
              </div>
            </div>
          </div>
        </section>

        <aside class="side-column right-column">
          <article v-if="selectedStore" class="panel-card detail-card">
            <div class="panel-head">
              <div>
                <span class="panel-kicker">STORE DETAIL</span>
                <h2>{{ selectedStore.name }}</h2>
              </div>
              <span class="panel-tag" :class="{ core: selectedStore.type === 'core' }">
                {{ selectedStore.type === 'core' ? 'CORE' : 'STANDARD' }}
              </span>
            </div>

            <div class="detail-badges">
              <span>{{ selectedStore.district }}</span>
              <span>{{ selectedStore.serviceTag }}</span>
              <span>{{ selectedStore.techs }}</span>
            </div>

            <div class="detail-grid">
              <div class="detail-metric">
                <span>月销区间</span>
                <strong>{{ selectedStore.avgSales }}</strong>
              </div>
              <div class="detail-metric">
                <span>今日销量</span>
                <strong class="tone-cyan">{{ selectedStore.todaySales }} 台</strong>
              </div>
              <div class="detail-metric">
                <span>实时客流</span>
                <strong>{{ selectedStore.traffic }} 人</strong>
              </div>
              <div class="detail-metric">
                <span>健康指数</span>
                <strong :class="metricTone(selectedStore.health, 93, 96)">{{ selectedStore.health }}%</strong>
              </div>
              <div class="detail-metric">
                <span>维修工单</span>
                <strong>{{ selectedStore.repairOrders }} 单</strong>
              </div>
              <div class="detail-metric">
                <span>服务评分</span>
                <strong class="tone-green">{{ selectedStore.serviceScore }}</strong>
              </div>
            </div>

            <div class="detail-lines">
              <div>
                <span>经营范围</span>
                <p>{{ selectedStore.category }}</p>
              </div>
              <div>
                <span>门店地址</span>
                <p>{{ selectedStore.address }}</p>
              </div>
              <div>
                <span>联系电话</span>
                <p>{{ selectedStore.phone }}</p>
              </div>
            </div>

            <a :href="selectedStore.url" target="_blank" rel="noreferrer" class="detail-link">查看官网详情 ↗</a>
          </article>

          <article class="panel-card summary-card">
            <div class="panel-head">
              <div>
                <span class="panel-kicker">OPS SUMMARY</span>
                <h2>当前总览</h2>
              </div>
            </div>

            <div class="summary-list">
              <div class="summary-row">
                <span>平均健康指数</span>
                <b class="tone-green">{{ avgHealth }}%</b>
              </div>
              <div class="summary-row">
                <span>核心门店覆盖</span>
                <b>{{ coreCoverage }}%</b>
              </div>
              <div class="summary-row">
                <span>全域服务评分</span>
                <b class="tone-cyan">{{ avgServiceScore }}</b>
              </div>
              <div class="summary-row">
                <span>轮播展示状态</span>
                <b>{{ isPresentationMode ? '运行中' : '关闭' }}</b>
              </div>
            </div>
          </article>
        </aside>
      </section>

      <section class="chart-grid">
        <article class="chart-card panel-card">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">TREND</span>
              <h2>7 日销量与客流趋势</h2>
            </div>
          </div>
          <div ref="trendChartEl" class="chart-host" />
        </article>

        <article class="chart-card panel-card">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">DISTRICT</span>
              <h2>区域门店销量分布</h2>
            </div>
          </div>
          <div ref="districtChartEl" class="chart-host" />
        </article>

        <article class="chart-card panel-card">
          <div class="panel-head">
            <div>
              <span class="panel-kicker">CATEGORY</span>
              <h2>业务结构占比</h2>
            </div>
          </div>
          <div ref="categoryChartEl" class="chart-host" />
        </article>
      </section>
    </div>
  </div>
</template>

<style scoped>
.ops-board {
  position: fixed;
  inset: 0;
  z-index: 99999;
  overflow: auto;
  background:
    radial-gradient(circle at top, rgba(60, 145, 255, 0.22), transparent 26%),
    radial-gradient(circle at 80% 12%, rgba(24, 217, 255, 0.15), transparent 24%),
    linear-gradient(180deg, #050b14 0%, #07111f 52%, #091725 100%);
  color: #f8fbff;
}

.ops-board::before {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 44px 44px;
  content: '';
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.84), transparent 90%);
  pointer-events: none;
}

.board-shell {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
  min-height: 100%;
  padding: 18px;
}

.board-header,
.kpi-card,
.panel-card {
  border: 1px solid rgba(86, 215, 255, 0.12);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
    rgba(4, 10, 18, 0.78);
  box-shadow:
    0 14px 32px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px) saturate(150%);
}

.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 24px;
}

.brand-cluster {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 132px;
  min-height: 44px;
  padding: 0 1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(86, 215, 255, 0.22), rgba(86, 215, 255, 0.08));
  color: #78dfff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.brand-cluster h1 {
  margin: 0;
  font-size: clamp(1.7rem, 3vw, 2.45rem);
  font-weight: 900;
  letter-spacing: 0.02em;
}

.brand-cluster p {
  margin: 0.3rem 0 0;
  color: rgba(225, 236, 255, 0.64);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.system-clock {
  min-width: 116px;
  padding: 0.75rem 0.9rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  text-align: right;
}

.system-clock span {
  display: block;
  color: rgba(220, 233, 255, 0.52);
  font-size: 12px;
}

.system-clock strong {
  display: block;
  margin-top: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.05rem;
}

.header-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  font-weight: 800;
  transition: transform 0.2s ease, background 0.2s ease;
}

.header-btn:hover,
.ranking-item:hover {
  transform: translateY(-1px);
}

.header-btn.ghost {
  background: rgba(7, 19, 34, 0.72);
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.kpi-card {
  padding: 0.95rem 1rem;
  border-radius: 22px;
}

.kpi-card span {
  display: block;
  color: rgba(220, 233, 255, 0.56);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.kpi-card strong {
  display: block;
  margin-top: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.85rem, 3vw, 2.7rem);
  line-height: 1;
}

.kpi-card small {
  display: block;
  margin-top: 0.55rem;
  color: rgba(220, 233, 255, 0.54);
}

.tone-hot {
  color: #ff8b6c;
}

.tone-warn {
  color: #fbc531;
}

.tone-safe,
.tone-green {
  color: #4ff0af;
}

.tone-cyan {
  color: #56d7ff;
}

.main-grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 340px;
  gap: 14px;
  min-height: 560px;
}

.side-column,
.chart-grid {
  display: grid;
  gap: 14px;
}

.panel-card {
  border-radius: 24px;
  padding: 1rem;
  overflow: hidden;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.95rem;
}

.panel-kicker {
  display: block;
  color: rgba(120, 223, 255, 0.62);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.panel-head h2 {
  margin: 0.3rem 0 0;
  font-size: 1.12rem;
  font-weight: 900;
}

.panel-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(225, 236, 255, 0.7);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.panel-tag.core {
  background: rgba(251, 197, 49, 0.16);
  color: #fbc531;
}

.ranking-list,
.alert-list {
  display: grid;
  gap: 0.75rem;
}

.ranking-item {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  color: #fff;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.ranking-item.active {
  border-color: rgba(86, 215, 255, 0.36);
  background: linear-gradient(135deg, rgba(86, 215, 255, 0.16), rgba(255, 255, 255, 0.04));
}

.rank-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #56d7ff;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
}

.rank-main {
  min-width: 0;
}

.rank-main strong {
  display: block;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-main small {
  display: block;
  margin-top: 3px;
  color: rgba(220, 233, 255, 0.52);
}

.rank-value {
  text-align: right;
}

.rank-value b {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.15rem;
}

.rank-value small {
  color: rgba(220, 233, 255, 0.48);
}

.alert-item {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: start;
  padding: 0.85rem 0.9rem;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.045);
}

.alert-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 999px;
  box-shadow: 0 0 14px currentColor;
}

.alert-item.level-high .alert-dot,
.alert-item.level-high span:last-child {
  color: #ff8b6c;
}

.alert-item.level-medium .alert-dot,
.alert-item.level-medium span:last-child {
  color: #fbc531;
}

.alert-item.level-info .alert-dot,
.alert-item.level-info span:last-child {
  color: #56d7ff;
}

.alert-item strong {
  display: block;
  font-size: 14px;
}

.alert-item p {
  margin: 0.25rem 0 0;
  color: rgba(220, 233, 255, 0.58);
  line-height: 1.6;
  font-size: 13px;
}

.alert-item span:last-child {
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
}

.map-stage {
  display: flex;
  flex-direction: column;
}

.legend-line {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  color: rgba(225, 236, 255, 0.72);
  font-size: 12px;
}

.legend-line span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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
  background: #56d7ff;
  color: #56d7ff;
}

.map-stage-inner {
  position: relative;
  flex: 1;
  overflow: hidden;
  min-height: 480px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(4, 9, 17, 0.78);
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-focus-card {
  position: absolute;
  left: 18px;
  bottom: 18px;
  min-width: 260px;
  max-width: min(360px, calc(100% - 36px));
  padding: 0.95rem 1rem;
  border-radius: 18px;
  background: rgba(4, 12, 22, 0.82);
  border: 1px solid rgba(86, 215, 255, 0.18);
  backdrop-filter: blur(20px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.24);
}

.focus-kicker {
  display: block;
  color: rgba(120, 223, 255, 0.66);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.map-focus-card strong {
  display: block;
  margin-top: 0.45rem;
  font-size: 1.15rem;
}

.map-focus-card p {
  margin: 0.35rem 0 0;
  color: rgba(220, 233, 255, 0.62);
  line-height: 1.6;
}

.focus-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.8rem;
}

.focus-metrics span,
.detail-badges span {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(244, 248, 255, 0.84);
  font-size: 12px;
}

.detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.95rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.detail-metric {
  padding: 0.8rem 0.85rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.detail-metric span {
  display: block;
  color: rgba(220, 233, 255, 0.5);
  font-size: 12px;
}

.detail-metric strong {
  display: block;
  margin-top: 0.45rem;
  font-size: 1.08rem;
  line-height: 1.35;
}

.detail-lines {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.95rem;
}

.detail-lines span {
  display: block;
  color: rgba(220, 233, 255, 0.5);
  font-size: 12px;
}

.detail-lines p {
  margin: 0.25rem 0 0;
  color: rgba(236, 243, 255, 0.84);
  line-height: 1.65;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin-top: 1rem;
  padding: 0 1rem;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(86, 215, 255, 0.18), rgba(86, 215, 255, 0.08));
  border: 1px solid rgba(86, 215, 255, 0.18);
  color: #fff;
  text-decoration: none;
  font-weight: 800;
}

.summary-list {
  display: grid;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0.95rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-row span {
  color: rgba(220, 233, 255, 0.58);
}

.summary-row b {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
}

.chart-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.chart-card {
  min-height: 320px;
}

.chart-host {
  width: 100%;
  height: 250px;
}

:deep(.leaflet-popup-content-wrapper) {
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
  background: rgba(8, 16, 28, 0.98);
  border: 1px solid rgba(86, 215, 255, 0.15);
}

:deep(.leaflet-popup-tip) {
  background: rgba(8, 16, 28, 0.98);
}

:deep(.leaflet-popup-content) {
  width: 360px !important;
  margin: 0 !important;
}

:deep(.leaflet-container) {
  background: #07131f;
}

:deep(.leaflet-control-zoom a) {
  background: rgba(5, 14, 25, 0.9);
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.ops-marker-wrapper) {
  background: transparent;
  border: 0;
}

:deep(.ops-marker) {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

:deep(.ops-marker span) {
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  border: 1px solid currentColor;
  opacity: 0.6;
  animation: markerPulse 2.4s infinite;
  content: '';
}

:deep(.ops-marker.core) {
  background: #fbc531;
  color: #fbc531;
  box-shadow: 0 0 12px rgba(251, 197, 49, 0.72);
}

:deep(.ops-marker.standard) {
  background: #56d7ff;
  color: #56d7ff;
  box-shadow: 0 0 10px rgba(86, 215, 255, 0.68);
}

:deep(.popup-shell) {
  color: #f8fcff;
}

:deep(.popup-header) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 14px 16px;
}

:deep(.popup-title-group strong) {
  display: block;
  font-size: 16px;
}

:deep(.popup-title-group span) {
  display: block;
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

:deep(.core-header) {
  background: linear-gradient(135deg, rgba(251, 197, 49, 0.28), rgba(251, 197, 49, 0.12));
}

:deep(.standard-header) {
  background: linear-gradient(135deg, rgba(86, 215, 255, 0.25), rgba(86, 215, 255, 0.1));
}

:deep(.badge) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 11px;
  font-weight: 800;
}

:deep(.badge-core) {
  color: #fbc531;
}

:deep(.badge-standard) {
  color: #56d7ff;
}

:deep(.popup-body) {
  padding: 0 16px 12px;
}

:deep(.popup-metric-grid) {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
}

:deep(.popup-metric-card) {
  padding: 0.7rem 0.75rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

:deep(.popup-metric-card span) {
  display: block;
  color: rgba(220, 233, 255, 0.5);
  font-size: 11px;
}

:deep(.popup-metric-card b) {
  display: block;
  margin-top: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  color: #fff;
}

:deep(.popup-metric-card small) {
  margin-left: 4px;
  font-size: 11px;
  color: rgba(220, 233, 255, 0.54);
}

:deep(.popup-info-list) {
  display: grid;
  gap: 0.65rem;
  margin-top: 0.85rem;
}

:deep(.info-item) {
  color: rgba(240, 246, 255, 0.84);
  line-height: 1.55;
  font-size: 13px;
}

:deep(.info-item span) {
  display: block;
  margin-bottom: 2px;
  color: rgba(220, 233, 255, 0.46);
  font-size: 11px;
}

:deep(.popup-footer) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 12px 16px 14px;
  color: rgba(220, 233, 255, 0.5);
  font-size: 11px;
}

:deep(.store-link) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff !important;
  text-decoration: none;
  font-weight: 800;
}

@keyframes markerPulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }

  70% {
    transform: scale(1.85);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@media (max-width: 1440px) {
  .kpi-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .main-grid {
    grid-template-columns: 300px minmax(0, 1fr);
  }

  .right-column {
    grid-column: span 2;
    grid-template-columns: 1.2fr 0.8fr;
  }

  .detail-card,
  .summary-card {
    min-height: 100%;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 980px) {
  .board-shell {
    padding: 12px;
  }

  .board-header {
    flex-direction: column;
    align-items: stretch;
  }

  .brand-cluster {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .kpi-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid,
  .right-column,
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .map-stage-inner {
    min-height: 420px;
  }

  .detail-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .kpi-row,
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .panel-card,
  .board-header,
  .kpi-card {
    border-radius: 18px;
  }

  .map-stage-inner {
    min-height: 360px;
  }

  .map-focus-card {
    left: 12px;
    right: 12px;
    bottom: 12px;
    min-width: auto;
  }

  :deep(.leaflet-popup-content) {
    width: 300px !important;
  }
}
</style>
