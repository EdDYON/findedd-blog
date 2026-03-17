<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'

const mapRef = ref(null)
let chartInstance = null
let timer = null

const rawStores = [
    {"name": "昆明佰腾店", "loc": [102.7135, 25.0458], "address": "五华区圆通北路120号", "phone": "0871-65141852", "type": "core"},
    {"name": "昆明关上汇溪大厦店", "loc": [102.7452, 25.0196], "address": "官渡区关上中路63号", "phone": "0871-67012140", "type": "core"},
    {"name": "昆明兴苑路碧鸡广场店", "loc": [102.6589, 25.0312], "address": "西山区兴苑路150号", "phone": "0871-68255039", "type": "standard"},
    {"name": "昆明小西门店", "loc": [102.7102, 25.0405], "address": "五华区人民中路175号", "phone": "0871-65383839", "type": "core"},
    {"name": "昆明南亚店", "loc": [102.6973, 24.9864], "address": "西山区南亚风情第壹城", "phone": "0871-64163939", "type": "core"},
    {"name": "昆明红锦路店", "loc": [102.7215, 25.0789], "address": "五华区红锦路15号", "phone": "0871-64106139", "type": "standard"},
    {"name": "昆明世纪城店", "loc": [102.7986, 24.9756], "address": "官渡区世纪城金源大道", "phone": "0871-68421039", "type": "core"},
    {"name": "昆明海乐城店", "loc": [102.8012, 24.9587], "address": "官渡区海乐城东门", "phone": "0871-68307798", "type": "core"},
    {"name": "昆明北云66店", "loc": [102.7236, 25.0589], "address": "盘龙区白云路北云66", "phone": "0871-63163328", "type": "standard"},
    {"name": "昆明欣都龙城店", "loc": [102.7358, 25.0712], "address": "盘龙区北京路延长线", "phone": "0871-65615961", "type": "core"},
    {"name": "昆明黄土坡西口店", "loc": [102.6789, 25.0563], "address": "五华区滇缅大道2449号", "phone": "0871-68333063", "type": "standard"},
    {"name": "昆明西昌路店", "loc": [102.6987, 25.0325], "address": "五华区西昌路848号", "phone": "0871-64613039", "type": "standard"},
    {"name": "昆明玫瑰湾店", "loc": [102.7658, 24.9963], "address": "官渡区官城路39号", "phone": "0871-63623939", "type": "standard"},
    {"name": "昆明东华店", "loc": [102.7321, 25.0489], "address": "盘龙区环城东路176号", "phone": "0871-68102039", "type": "standard"},
    {"name": "昆明吴井路塘子巷店", "loc": [102.7265, 25.0289], "address": "官渡区吴井路131号", "phone": "0871-63160076", "type": "standard"},
    {"name": "昆明云纺店", "loc": [102.6987, 25.0156], "address": "西山区海埂路32号", "phone": "0871-63518839", "type": "core"},
    {"name": "昆明新螺蛳湾写字楼店", "loc": [102.8563, 24.9215], "address": "官渡区新螺蛳湾一期", "phone": "0871-63350039", "type": "standard"},
    {"name": "昆明羊甫店", "loc": [102.8236, 24.9187], "address": "官渡区云大西路", "phone": "0871-63361939", "type": "standard"},
    {"name": "昆明广福路金科爱琴海店", "loc": [102.6859, 24.9632], "address": "西山区广福路金科爱琴海", "phone": "0871-67286339", "type": "core"},
    {"name": "昆明红云店", "loc": [102.7058, 25.0896], "address": "五华区红云路99号", "phone": "0871-65039039", "type": "standard"},
    {"name": "昆明关上融城金阶店", "loc": [102.7589, 25.0236], "address": "官渡区民航路679号", "phone": "0871-68393039", "type": "standard"},
    {"name": "昆明春城慧谷店", "loc": [102.6452, 25.0689], "address": "五华区海屯路", "phone": "0871-68309057", "type": "standard"},
    {"name": "昆明大板桥店", "loc": [102.8532, 25.1876], "address": "官渡区大板桥镇", "phone": "0871-64663039", "type": "standard"},
    {"name": "昆明前兴路店", "loc": [102.6758, 24.9789], "address": "西山区前兴路", "phone": "0871-63393039", "type": "standard"},
    {"name": "昆明茨坝店", "loc": [102.7089, 25.1236], "address": "盘龙区茨坝北路", "phone": "0871-65628339", "type": "standard"},
    {"name": "昆明朗悦湾店", "loc": [102.6897, 25.0856], "address": "五华区小康大道", "phone": "0871-63373939", "type": "standard"},
    {"name": "昆明云路中心店", "loc": [102.7215, 25.0312], "address": "官渡区环城南路262号", "phone": "0871-63139039", "type": "core"},
    {"name": "云南映象店", "loc": [102.7456, 25.0789], "address": "盘龙区穿金路", "phone": "0871-63133939", "type": "standard"},
    {"name": "昆明威远街店", "loc": [102.7189, 25.0421], "address": "五华区威远街166号", "phone": "0871-65879074", "type": "core"},
    {"name": "昆明万科魅力之城店", "loc": [102.8321, 24.9365], "address": "官渡区魅力之城", "phone": "0871-63338439", "type": "standard"},
    {"name": "昆明新闻路店", "loc": [102.6963, 25.0358], "address": "五华区新闻路335号", "phone": "0871-68193139", "type": "standard"},
    {"name": "昆明东寺街店", "loc": [102.6987, 25.0321], "address": "西山区东寺街", "phone": "0871-64189039", "type": "core"},
    {"name": "昆明新迎新城店", "loc": [102.7389, 25.0563], "address": "盘龙区新迎新城", "phone": "0871-63196039", "type": "standard"},
    {"name": "昆明大都摩天店", "loc": [102.7856, 24.9689], "address": "官渡区大都摩天", "phone": "0871-67298039", "type": "core"},
    {"name": "昆明瑞鼎城购物公园店", "loc": [102.7315, 25.0632], "address": "盘龙区白云路168号", "phone": "0871-63187039", "type": "core"}
]

let storeData = ref([])

const initData = () => {
    storeData.value = rawStores.map((s) => {
        const isCore = s.type === 'core'
        return {
            ...s,
            traffic: isCore ? Math.floor(Math.random()*11 + 30) : Math.floor(Math.random()*11 + 10),
            todaySales: isCore ? Math.floor(Math.random()*11 + 40) : Math.floor(Math.random()*11 + 15),
            health: isCore ? Math.floor(Math.random()*3 + 96) : Math.floor(Math.random()*4 + 92)
        }
    })
}

const renderChart = async () => {
    chartInstance = echarts.init(mapRef.value)
    chartInstance.showLoading({ text: '加载本地地图数据中...', color: '#00f2fe', textColor: '#fff', maskColor: 'rgba(1, 8, 22, 0.8)' })

    try {
        const response = await fetch('/kunming.json')
        const geoJson = await response.json()
        echarts.registerMap('kunming', geoJson)
        chartInstance.hideLoading()

        const option = {
            backgroundColor: '#010816',
            title: {
                text: '九机昆明门店实时大屏',
                left: 'center',
                top: 20,
                textStyle: { color: '#00f2fe', fontSize: 24, letterSpacing: 2 }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(16, 24, 48, 0.9)',
                borderColor: '#00f2fe',
                textStyle: { color: '#fff' },
                formatter: (params) => {
                    const d = params.data
                    if (!d) return ''
                    const healthColor = d.health >= 95 ? '#2ed573' : '#ffa502'
                    return `
                        <div style="font-weight:bold;font-size:16px;border-bottom:1px solid #333;padding-bottom:5px;margin-bottom:5px;">
                            ${d.name} <span style="font-size:12px;color:#aaa;margin-left:5px">${d.type === 'core' ? '★ 核心店' : '标准店'}</span>
                        </div>
                        地址: ${d.address}<br/>
                        热线: ${d.phone}<br/>
                        <div style="margin-top:8px;">实时客流: <b style="color:#00f2fe;font-size:18px">${d.traffic}</b> 人</div>
                        <div>今日销量: <b style="color:#ff4757;font-size:18px">${d.todaySales}</b> 台</div>
                        <div>库存健康度: <b style="color:${healthColor};font-size:18px">${d.health}%</b></div>
                    `
                }
            },
            geo: {
                map: 'kunming',
                roam: true,
                zoom: 1.2,
                itemStyle: {
                    areaColor: '#0a1a3a',
                    borderColor: '#1e90ff',
                    borderWidth: 1
                },
                emphasis: {
                    itemStyle: { areaColor: '#102a5a' },
                    label: { show: false }
                }
            },
            series: [
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: storeData.value.map(s => ({
                        name: s.name,
                        value: [s.loc[0], s.loc[1], s.traffic],
                        ...s
                    })),
                    symbolSize: val => Math.max(8, val[2] / 3),
                    showEffectOn: 'render',
                    rippleEffect: { brushType: 'stroke', scale: 3 },
                    itemStyle: { color: '#00f2fe', shadowBlur: 10, shadowColor: '#00f2fe' },
                    zlevel: 1
                }
            ]
        }
        chartInstance.setOption(option)
    } catch (error) {
        console.error('地图数据加载失败', error)
        chartInstance.hideLoading()
    }
}

const updateData = () => {
    if (!chartInstance) return
    storeData.value = storeData.value.map(s => ({
        ...s,
        traffic: Math.max(0, s.traffic + (Math.floor(Math.random() * 21) - 10)),
        todaySales: Math.max(0, s.todaySales + (Math.floor(Math.random() * 5) - 2)),
        health: Math.max(90, Math.min(100, s.health + (Math.floor(Math.random() * 3) - 1)))
    }))

    chartInstance.setOption({
        series: [{
            data: storeData.value.map(s => ({
                name: s.name,
                value: [s.loc[0], s.loc[1], s.traffic],
                ...s
            }))
        }]
    })
}

const handleResize = () => {
    chartInstance?.resize()
}

onMounted(() => {
    initData()
    renderChart()
    timer = setInterval(updateData, 3000)
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    clearInterval(timer)
    window.removeEventListener('resize', handleResize)
    chartInstance?.dispose()
})
</script>

<template>
  <div class="dash-wrapper">
    <a href="/" class="back-btn">← 返回主页</a>
    <div ref="mapRef" class="echarts-container"></div>
  </div>
</template>

<style scoped>
.dash-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: #010816;
}
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100000;
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid #00f2fe;
  color: #00f2fe !important;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}
.back-btn:hover {
  background: #00f2fe;
  color: #010816 !important;
}
.echarts-container {
  width: 100%;
  height: 100%;
}
</style>