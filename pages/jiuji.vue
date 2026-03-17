<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

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

let storeData = []

const generateHTML = (store) => {
    const isCore = store.type === 'core'
    const healthClass = store.health >= 95 ? 'text-green' : 'text-orange'
    const timeNow = new Date().toLocaleTimeString('zh-CN', {hour12: false})
    
    return `
        <div class="popup-header">
            <div>${store.name} <br/><a href="${store.url}" target="_blank" class="store-link" style="margin-top:5px;">官网详情 ↗</a></div>
            <span class="badge ${isCore ? '' : 'standard'}">${isCore ? '★ 核心店' : '标准店'}</span>
        </div>
        <div class="popup-body">
            <div class="col">
                <div class="col-title">基础信息</div>
                <div class="info-item"><span>详细地址</span>${store.address}</div>
                <div class="info-item"><span>营业时间</span>09:00 - 22:00</div>
                <div class="info-item"><span>销售热线</span>${store.phone}</div>
            </div>
            <div class="col">
                <div class="col-title">静态月度画像</div>
                <div class="info-item"><span>月均销量估算</span><b>${store.avgSales} 台</b></div>
                <div class="info-item"><span>主营业务线</span>${store.category}</div>
                <div class="info-item"><span>驻店技师配置</span>${store.techs} 人</div>
            </div>
            <div class="col">
                <div class="col-title">实时状态追踪</div>
                <div class="info-item"><span>当前客流量</span><div class="data-value text-blue">${store.traffic} <small style="font-size:12px;font-weight:normal;color:#a4b0be">人</small></div></div>
                <div class="info-item"><span>今日累计成单</span><div class="data-value">${store.todaySales} <small style="font-size:12px;font-weight:normal;color:#a4b0be">台</small></div></div>
                <div class="info-item"><span>库存健康度</span><div class="data-value ${healthClass}">${store.health}%</div></div>
            </div>
        </div>
        <div class="update-time">实时引流引擎活跃中 | 数据最后拉取：${timeNow}</div>
    `
}

const triggerRealTimeUpdate = () => {
    storeData.forEach(store => {
        store.traffic = Math.max(0, store.traffic + (Math.floor(Math.random() * 21) - 10))
        store.todaySales = Math.max(0, store.todaySales + (Math.floor(Math.random() * 11) - 5))
        store.health = Math.max(90, Math.min(100, store.health + (Math.floor(Math.random() * 3) - 1)))

        const marker = markerCache[store.id]
        if (marker && marker.isPopupOpen()) {
            marker.setPopupContent(generateHTML(store))
        }
    })
}

onMounted(() => {
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
        attribution: '© 高德地图 | 九机运营数据分析系统 (模拟)'
    }).addTo(mapInstance)

    storeData = rawStores.map((s, idx) => {
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

    const dotIcon = window.L.divIcon({
        className: 'custom-icon',
        html: `<div style="background:#ff4757; width:12px; height:12px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 10px rgba(255,71,87,1);"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -10]
    })

    storeData.forEach(store => {
        const marker = window.L.marker(store.loc, { icon: dotIcon, title: store.name }).addTo(mapInstance)
        marker.bindPopup(generateHTML(store))
        markerCache[store.id] = marker
    })

    timer = setInterval(triggerRealTimeUpdate, 30000)
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
    <a href="/" class="back-btn">← 返回主页</a>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<style>
.map-page-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: #f8f9fa;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100000;
  background: #2f3640;
  color: #fff !important;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}

.back-btn:hover {
  background: #353b48;
}

.map-container {
  width: 100%;
  height: 100%;
}

.leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 8px 25px rgba(0,0,0,0.3); padding: 0; overflow: hidden; background: #fff;}
.leaflet-popup-tip-container { display: none; } 
.leaflet-popup-content { margin: 0; width: 450px !important; }
.popup-header { background: #00f2fe; color: #fff; padding: 12px 16px; font-size: 16px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
.badge { background: #ff4757; color: white; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: normal; letter-spacing: 1px;}
.badge.standard { background: #2ed573; }
.popup-body { display: flex; padding: 16px; background: #fff; }
.col { flex: 1; padding: 0 12px; border-right: 1px solid #f1f2f6; }
.col:last-child { border-right: none; }
.col-title { font-size: 13px; color: #747d8c; margin-bottom: 10px; border-bottom: 2px solid #f1f2f6; padding-bottom: 4px; font-weight: bold;}
.info-item { font-size: 12px; color: #2f3542; margin-bottom: 8px; line-height: 1.5; }
.info-item span { color: #a4b0be; display: block; font-size: 11px; margin-bottom: 2px;}
.data-value { font-size: 20px; font-weight: 900; color: #2f3542; margin: 4px 0; font-family: monospace;}
.text-green { color: #2ed573 !important; }
.text-orange { color: #ffa502 !important; }
.text-blue { color: #1e90ff !important; }
.update-time { text-align: right; padding: 8px 16px; background: #f8f9fa; font-size: 11px; color: #a4b0be; border-top: 1px solid #f1f2f6;}
a.store-link { display: inline-block; color: #fff !important; text-decoration: none; font-size: 12px; background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 4px; transition: 0.3s;}
a.store-link:hover { background: rgba(0,0,0,0.4); }
</style>
