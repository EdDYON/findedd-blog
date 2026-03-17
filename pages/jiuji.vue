<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'

const mapContainer = ref(null)
let mapInstance = null
let timer = null
let markerCache = {}

const rawStores = [
    {"name": "昆明佰腾店", "loc": [25.0458, 102.7135], "address": "五华区圆通北路120号", "phone": "0871-65141852", "url": "https://www.9ji.com/stores/26", "type": "core"},
    {"name": "昆明关上汇溪大厦店", "loc": [25.0196, 102.7452], "address": "官渡区关上中路63号", "phone": "0871-67012140", "url": "https://www.9ji.com/stores/28", "type": "core"},
    {"name": "昆明兴苑路碧鸡广场店", "loc": [25.0312, 102.6589], "address": "西山区兴苑路150号", "phone": "0871-68255039", "url": "https://www.9ji.com/stores/30", "type": "standard"},
    {"name": "昆明小西门店", "loc": [25.0405, 102.7102], "address": "五华区人民中路175号", "phone": "0871-65383839", "url": "https://www.9ji.com/stores/32", "type": "core"},
    {"name": "昆明南亚店", "loc": [24.9864, 102.6973], "address": "西山区南亚风情第壹城", "phone": "0871-64163939", "url": "https://www.9ji.com/stores/36", "type": "core"},
    {"name": "昆明红锦路店", "loc": [25.0789, 102.7215], "address": "五华区红锦路15号", "phone": "0871-64106139", "url": "https://www.9ji.com/stores/38", "type": "standard"},
    {"name": "昆明世纪城店", "loc": [24.9756, 102.7986], "address": "官渡区世纪城金源大道", "phone": "0871-68421039", "url": "https://www.9ji.com/stores/40", "type": "core"},
    {"name": "昆明海乐城店", "loc": [24.9587, 102.8012], "address": "官渡区海乐城东门", "phone": "0871-68307798", "url": "https://www.9ji.com/stores/52", "type": "core"},
    {"name": "昆明北云66店", "loc": [25.0589, 102.7236], "address": "盘龙区白云路北云66", "phone": "0871-63163328", "url": "https://www.9ji.com/stores/68", "type": "standard"},
    {"name": "昆明欣都龙城店", "loc": [25.0712, 102.7358], "address": "盘龙区北京路延长线", "phone": "0871-65615961", "url": "https://www.9ji.com/stores/70", "type": "core"},
    {"name": "昆明黄土坡西口店", "loc": [25.0563, 102.6789], "address": "五华区滇缅大道2449号", "phone": "0871-68333063", "url": "https://www.9ji.com/stores/72", "type": "standard"},
    {"name": "昆明西昌路店", "loc": [25.0325, 102.6987], "address": "五华区西昌路848号", "phone": "0871-64613039", "url": "https://www.9ji.com/stores/76", "type": "standard"},
    {"name": "昆明玫瑰湾店", "loc": [24.9963, 102.7658], "address": "官渡区官城路39号", "phone": "0871-63623939", "url": "https://www.9ji.com/stores/80", "type": "standard"},
    {"name": "昆明东华店", "loc": [25.0489, 102.7321], "address": "盘龙区环城东路176号", "phone": "0871-68102039", "url": "https://www.9ji.com/stores/82", "type": "standard"},
    {"name": "昆明吴井路塘子巷店", "loc": [25.0289, 102.7265], "address": "官渡区吴井路131号", "phone": "0871-63160076", "url": "https://www.9ji.com/stores/86", "type": "standard"},
    {"name": "昆明云纺店", "loc": [25.0156, 102.6987], "address": "西山区海埂路32号", "phone": "0871-63518839", "url": "https://www.9ji.com/stores/90", "type": "core"},
    {"name": "昆明新螺蛳湾写字楼店", "loc": [24.9215, 102.8563], "address": "官渡区新螺蛳湾一期", "phone": "0871-63350039", "url": "https://www.9ji.com/stores/92", "type": "standard"},
    {"name": "昆明羊甫店", "loc": [24.9187, 102.8236], "address": "官渡区云大西路", "phone": "0871-63361939", "url": "https://www.9ji.com/stores/96", "type": "standard"},
    {"name": "昆明广福路金科爱琴海店", "loc": [24.9632, 102.6859], "address": "西山区广福路金科爱琴海", "phone": "0871-67286339", "url": "https://www.9ji.com/stores/100", "type": "core"},
    {"name": "昆明红云店", "loc": [25.0896, 102.7058], "address": "五华区红云路99号", "phone": "0871-65039039", "url": "https://www.9ji.com/stores/102", "type": "standard"},
    {"name": "昆明关上融城金阶店", "loc": [25.0236, 102.7589], "address": "官渡区民航路679号", "phone": "0871-68393039", "url": "https://www.9ji.com/stores/106", "type": "standard"},
    {"name": "昆明春城慧谷店", "loc": [25.0689, 102.6452], "address": "五华区海屯路", "phone": "0871-68309057", "url": "https://www.9ji.com/stores/110", "type": "standard"},
    {"name": "昆明大板桥店", "loc": [25.1876, 102.8532], "address": "官渡区大板桥镇", "phone": "0871-64663039", "url": "https://www.9ji.com/stores/116", "type": "standard"},
    {"name": "昆明前兴路店", "loc": [24.9789, 102.6758], "address": "西山区前兴路", "phone": "0871-63393039", "url": "https://www.9ji.com/stores/120", "type": "standard"},
    {"name": "昆明茨坝店", "loc": [25.1236, 102.7089], "address": "盘龙区茨坝北路", "phone": "0871-65628339", "url": "https://www.9ji.com/stores/122", "type": "standard"},
    {"name": "昆明朗悦湾店", "loc": [25.0856, 102.6897], "address": "五华区小康大道", "phone": "0871-63373939", "url": "https://www.9ji.com/stores/126", "type": "standard"},
    {"name": "昆明云路中心店", "loc": [25.0312, 102.7215], "address": "官渡区环城南路262号", "phone": "0871-63139039", "url": "https://www.9ji.com/stores/130", "type": "core"},
    {"name": "云南映象店", "loc": [25.0789, 102.7456], "address": "盘龙区穿金路", "phone": "0871-63133939", "url": "https://www.9ji.com/stores/136", "type": "standard"},
    {"name": "昆明威远街店", "loc": [25.0421, 102.7189], "address": "五华区威远街166号", "phone": "0871-65879074", "url": "https://www.9ji.com/stores/138", "type": "core"},
    {"name": "昆明万科魅力之城店", "loc": [24.9365, 102.8321], "address": "官渡区魅力之城", "phone": "0871-63338439", "url": "https://www.9ji.com/stores/142", "type": "standard"},
    {"name": "昆明新闻路店", "loc": [25.0358, 102.6963], "address": "五华区新闻路335号", "phone": "0871-68193139", "url": "https://www.9ji.com/stores/146", "type": "standard"},
    {"name": "昆明东寺街店", "loc": [25.0321, 102.6987], "address": "西山区东寺街", "phone": "0871-64189039", "url": "https://www.9ji.com/stores/625", "type": "core"},
    {"name": "昆明新迎新城店", "loc": [25.0563, 102.7389], "address": "盘龙区新迎新城", "phone": "0871-63196039", "url": "https://www.9ji.com/stores/671", "type": "standard"},
    {"name": "昆明大都摩天店", "loc": [24.9689, 102.7856], "address": "官渡区大都摩天", "phone": "0871-67298039", "url": "https://www.9ji.com/stores/1037", "type": "core"},
    {"name": "昆明瑞鼎城购物公园店", "loc": [25.0632, 102.7315], "address": "盘龙区白云路168号", "phone": "0871-63187039", "url": "https://www.9ji.com/stores/1410", "type": "core"}
]

const storeData = ref([])

const initStoreData = () => {
    storeData.value = rawStores.map((s, idx) => {
        const isCore = s.type === 'core'
        return {
            id: idx, ...s,
            avgSales: isCore ? '800-1200' : '400-700',
            category: isCore ? '手机/平板/配件/维修' : '手机/配件/维修',
            techs: isCore ? '6-8' : '3-5',
            traffic: isCore ? Math.floor(Math.random()*11 + 30) : Math.floor(Math.random()*11 + 10),
            todaySales: isCore ? Math.floor(Math.random()*11 + 40) : Math.floor(Math.random()*11 + 15),
            health: isCore ? Math.floor(Math.random()*3 + 96) : Math.floor(Math.random()*4 + 92)
        }
    })
}

const totalTraffic = computed(() => storeData.value.reduce((sum, s) => sum + s.traffic, 0))
const totalSales = computed(() => storeData.value.reduce((sum, s) => sum + s.todaySales, 0))
const avgHealth = computed(() => (storeData.value.reduce((sum, s) => sum + s.health, 0) / storeData.value.length).toFixed(1))

const generateHTML = (store) => {
    const isCore = store.type === 'core'
    const healthClass = store.health >= 95 ? 'text-green' : 'text-orange'
    const timeNow = new Date().toLocaleTimeString('zh-CN', {hour12: false})
    
    return `
        <div class="popup-header ${isCore ? 'core-header' : 'standard-header'}">
            <div>${store.name} <br/><a href="${store.url}" target="_blank" class="store-link" style="margin-top:5px;">官网详情 ↗</a></div>
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
                <div class="info-item"><span>Current Traffic</span><div class="data-value text-blue">${store.traffic} <small style="font-size:12px;font-weight:normal;color:#a4b0be">人</small></div></div>
                <div class="info-item"><span>Today's Sales</span><div class="data-value">${store.todaySales} <small style="font-size:12px;font-weight:normal;color:#a4b0be">台</small></div></div>
                <div class="info-item"><span>Health Index</span><div class="data-value ${healthClass}">${store.health}%</div></div>
            </div>
        </div>
        <div class="update-time">System Active | Last Sync: ${timeNow}</div>
    `
}

const triggerRealTimeUpdate = () => {
    storeData.value = storeData.value.map(store => ({
        ...store,
        traffic: Math.max(0, store.traffic + (Math.floor(Math.random() * 21) - 10)),
        todaySales: Math.max(0, store.todaySales + (Math.floor(Math.random() * 11) - 5)),
        health: Math.max(90, Math.min(100, store.health + (Math.floor(Math.random() * 3) - 1)))
    }))

    storeData.value.forEach(store => {
        const marker = markerCache[store.id]
        if (marker && marker.isPopupOpen()) {
            marker.setPopupContent(generateHTML(store))
        }
    })
}

onMounted(() => {
  initStoreData()
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fastly.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
  document.head.appendChild(link)

  const script = document.createElement('script')
  script.src = 'https://fastly.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'
  script.onload = () => {
    mapInstance = window.L.map(mapContainer.value, { zoomControl: false }).setView([25.042, 102.714], 12)
    window.L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

    window.L.tileLayer('https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
        maxZoom: 18,
        attribution: '© AutoNavi | Data Ops Dashboard'
    }).addTo(mapInstance)

    const coreIcon = window.L.divIcon({
        className: 'custom-icon-wrapper',
        html: `<div class="pulse-marker core-pulse"></div>`,
        iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -10]
    })
    
    const standardIcon = window.L.divIcon({
        className: 'custom-icon-wrapper',
        html: `<div class="pulse-marker standard-pulse"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -8]
    })

    storeData.value.forEach(store => {
        const iconToUse = store.type === 'core' ? coreIcon : standardIcon
        const marker = window.L.marker(store.loc, { icon: iconToUse, title: store.name }).addTo(mapInstance)
        marker.bindPopup(generateHTML(store))
        
        marker.on('click', () => {
            mapInstance.flyTo([store.loc[0] + 0.015, store.loc[1]], 14, { duration: 1.5 })
        })
        
        markerCache[store.id] = marker
    })

    timer = setInterval(triggerRealTimeUpdate, 5000)
  }
  document.body.appendChild(script)
})

onUnmounted(() => {
  clearInterval(timer)
  if (mapInstance) {
    mapInstance.remove()
  }
})
</script>

<template>
  <div class="map-page-wrapper">
    <a href="/" class="back-btn">← Home / 主页</a>
    <div ref="mapContainer" class="map-container"></div>

    <div class="glass-dashboard">
        <h2 class="dash-title">Kunming Operations <span>昆明市大盘监控</span></h2>
        <div class="dash-metric">
            <div class="metric-label">Total Traffic / 实时客流总量</div>
            <div class="metric-value text-blue">{{ totalTraffic }} <span class="unit">Users</span></div>
        </div>
        <div class="dash-metric">
            <div class="metric-label">Total Est. Sales / 今日营收预估</div>
            <div class="metric-value text-orange">{{ totalSales }} <span class="unit">Devices</span></div>
        </div>
        <div class="dash-metric">
            <div class="metric-label">Avg Health / 整体健康度指数</div>
            <div class="metric-value text-green">{{ avgHealth }} <span class="unit">%</span></div>
        </div>
        <div class="dash-footer">
            Data refreshes every 5s / 数据每5秒自动同步
        </div>
    </div>
  </div>
</template>

<style>
.map-page-wrapper {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99999; background: #f8f9fa;
}

.back-btn {
  position: absolute; top: 20px; left: 20px; z-index: 100000;
  background: rgba(255, 255, 255, 0.9); color: #2f3542 !important;
  padding: 8px 18px; border-radius: 8px; text-decoration: none;
  font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px); transition: 0.3s; border: 1px solid rgba(0,0,0,0.05);
}
.back-btn:hover { background: #fff; transform: translateY(-2px); }

.map-container { width: 100%; height: 100%; }

.pulse-marker {
  width: 100%; height: 100%; border-radius: 50%; border: 2px solid #fff;
}
.core-pulse {
  background: #fbc531;
  animation: pulse-core 2s infinite cubic-bezier(0.66, 0, 0, 1);
  box-shadow: 0 0 10px rgba(251, 197, 49, 0.8);
}
.standard-pulse {
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

.glass-dashboard {
  position: absolute; top: 20px; right: 20px; z-index: 100000;
  width: 320px; padding: 24px; border-radius: 16px;
  background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.5);
}
.dash-title {
  margin: 0 0 20px 0; font-size: 18px; color: #2f3542; font-weight: 800; border-bottom: 2px solid #f1f2f6; padding-bottom: 10px;
}
.dash-title span { display: block; font-size: 12px; color: #747d8c; font-weight: normal; margin-top: 4px; }
.dash-metric { margin-bottom: 16px; }
.metric-label { font-size: 12px; color: #747d8c; margin-bottom: 4px; font-weight: 600; }
.metric-value { font-size: 32px; font-weight: 900; font-family: monospace; line-height: 1; }
.metric-value .unit { font-size: 14px; color: #a4b0be; font-weight: normal; margin-left: 4px; }
.dash-footer { margin-top: 20px; font-size: 11px; color: #a4b0be; text-align: center; }

.leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 0; overflow: hidden; background: #fff;}
.leaflet-popup-tip-container { display: none; } 
.leaflet-popup-content { margin: 0; width: 480px !important; }
.popup-header { padding: 14px 18px; font-size: 16px; font-weight: 800; display: flex; justify-content: space-between; align-items: center; color: #fff;}
.core-header { background: linear-gradient(135deg, #fbc531, #e1b12c); }
.standard-header { background: linear-gradient(135deg, #00a8ff, #0097e6); }
.badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);}
.badge-core { background: #fff; color: #e1b12c; }
.badge-standard { background: #fff; color: #0097e6; }
.popup-body { display: flex; padding: 16px; background: #fff; }
.col { flex: 1; padding: 0 12px; border-right: 1px solid #f1f2f6; }
.col:last-child { border-right: none; }
.col-title { font-size: 12px; color: #747d8c; margin-bottom: 12px; border-bottom: 2px solid #f1f2f6; padding-bottom: 4px; font-weight: 800; text-transform: uppercase;}
.info-item { font-size: 13px; color: #2f3542; margin-bottom: 10px; line-height: 1.4; font-weight: 500;}
.info-item span { color: #a4b0be; display: block; font-size: 11px; margin-bottom: 2px; font-weight: normal;}
.data-value { font-size: 22px; font-weight: 900; color: #2f3542; margin: 4px 0; font-family: monospace;}
.text-green { color: #2ed573 !important; }
.text-orange { color: #ffa502 !important; }
.text-blue { color: #1e90ff !important; }
.update-time { text-align: right; padding: 10px 18px; background: #f8f9fa; font-size: 11px; color: #a4b0be; border-top: 1px solid #f1f2f6;}
a.store-link { display: inline-block; color: #fff !important; text-decoration: none; font-size: 11px; background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 4px; transition: 0.3s; backdrop-filter: blur(4px);}
a.store-link:hover { background: rgba(0,0,0,0.4); transform: translateY(-1px);}
</style>
