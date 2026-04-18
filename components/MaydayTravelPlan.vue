<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

type CityId = 'zhengzhou' | 'kaifeng' | 'luoyang'
type DayId = '0429' | '0430' | '0501' | '0502' | '0503'
type ItemType = 'play' | 'food' | 'show' | 'photo' | 'move'

interface PlanItem {
  time: string
  title: string
  type: ItemType
  copy: string
  picks: string[]
}

interface DayPlan {
  id: DayId
  date: string
  city: CityId
  cityName: string
  theme: string
  image: string
  accent: string
  summary: string
  items: PlanItem[]
}

const activeDay = ref<DayId>('0429')
const activeType = ref<ItemType | 'all'>('all')
const checkedMap = ref<Record<string, boolean>>({})
const copyState = ref('')

const typeMeta: Record<ItemType | 'all', { label: string, icon: string }> = {
  all: { label: '全部', icon: 'i-ri-apps-2-line' },
  play: { label: '玩', icon: 'i-ri-map-pin-2-line' },
  food: { label: '吃', icon: 'i-ri-restaurant-2-line' },
  show: { label: '演出', icon: 'i-ri-movie-2-line' },
  photo: { label: '拍照', icon: 'i-ri-camera-3-line' },
  move: { label: '换城', icon: 'i-ri-train-line' },
}

const dayPlans: DayPlan[] = [
  {
    id: '0429',
    date: '4.29',
    city: 'zhengzhou',
    cityName: '郑州',
    theme: '抵达当晚，先把烟火气吃到胃里',
    image: '/mayday-trip/zhengzhou.svg',
    accent: '#fb923c',
    summary: '18:00 抵达郑州，不安排重景点，直接二七、德化街和夜市开胃。',
    items: [
      {
        time: '18:00',
        title: '到达郑州',
        type: 'move',
        copy: '今晚不赶路，不塞满行程。先把行李和状态放好，之后直接去市中心。',
        picks: ['手机电量补满', '轻装出门', '把第二天博物院预约再确认一次'],
      },
      {
        time: '19:10',
        title: '健康路夜市 / 老蔡记二选一',
        type: 'food',
        copy: '想更本地就去健康路，想稳一点就老蔡记蒸饺。第一顿不要太撑，后面还有夜逛。',
        picks: ['松针蒸饺 + 鸡丝馄饨', '小马炸鸡', '烤筋配冰赤豆', '杏仁茶解腻'],
      },
      {
        time: '20:30',
        title: '二七广场 + 德化街',
        type: 'photo',
        copy: '二七塔亮灯后再去，德化街适合慢慢走，作为郑州第一晚的城市开场。',
        picks: ['二七塔夜景', '德化街小店', '商业街人流氛围'],
      },
    ],
  },
  {
    id: '0430',
    date: '4.30',
    city: 'zhengzhou',
    cityName: '郑州',
    theme: '从国宝到老城，再到夜里的现代郑州',
    image: '/mayday-trip/zhengzhou.svg',
    accent: '#f97316',
    summary: '河南博物院是核心，下午补商都遗址、文庙或油化厂，晚上看 CBD 或继续吃。',
    items: [
      {
        time: '08:20',
        title: '胡辣汤开场',
        type: 'food',
        copy: '方中山可以尝两掺，胡辣汤加豆腐脑，配油馍头。口味冲，别空腹猛喝。',
        picks: ['两掺', '油馍头', '少点一份先试口味'],
      },
      {
        time: '09:00',
        title: '河南博物院',
        type: 'play',
        copy: '这天的重头戏。建议早进馆，先看贾湖骨笛、莲鹤方壶、妇好鸮尊，再留时间给华夏古乐。',
        picks: ['贾湖骨笛', '莲鹤方壶', '妇好鸮尊', '武则天金简'],
      },
      {
        time: '11:00',
        title: '华夏古乐',
        type: 'show',
        copy: '能买到票就看，编钟、古乐器和展厅里的文物刚好接上。',
        picks: ['提前进场', '坐中区', '演出后再补二楼展厅'],
      },
      {
        time: '12:40',
        title: '烩面 / 焖饼午餐',
        type: 'food',
        copy: '合记烩面更郑州，葛记焖饼更重口。看排队和胃口决定，不必硬凑两家。',
        picks: ['羊肉烩面', '坛子肉焖饼', '黄桥烧饼'],
      },
      {
        time: '14:30',
        title: '郑州商城遗址 + 文庙',
        type: 'play',
        copy: '从博物院里的商文明走到真实城墙遗址，节奏会很顺。文庙红墙古柏，拍照也稳。',
        picks: ['商代夯土城墙', '郑州文庙', '红墙古柏'],
      },
      {
        time: '16:40',
        title: '油化厂创意园',
        type: 'photo',
        copy: '老厂房、红砖、烟囱和涂鸦墙，傍晚光线更好，适合把城市感拍出来。',
        picks: ['红砖墙', '老厂房窗格', '傍晚逆光'],
      },
      {
        time: '19:00',
        title: '关虎屯 / 正弘城食光里',
        type: 'food',
        copy: '如果还想继续吃本地味，关虎屯杂面条和葛记焖饼都能排进备选；想舒服一点就商场里解决。',
        picks: ['关虎屯杂面条', '葛记焖饼', '正弘城食光里'],
      },
    ],
  },
  {
    id: '0501',
    date: '5.1',
    city: 'kaifeng',
    cityName: '开封',
    theme: '从郑州去开封，直接进入北宋剧场',
    image: '/mayday-trip/kaifeng.svg',
    accent: '#f43f5e',
    summary: '上午换城，中午开封府或锅贴，下午到晚上留给清明上河园和东京梦华。',
    items: [
      {
        time: '08:30',
        title: '郑州 → 开封',
        type: 'move',
        copy: '城际或高铁都可以，五一当天别卡太死，给进站和景区排队多留半小时。',
        picks: ['郑州东 / 郑州站看车次', '到开封后先吃再进景区', '门票二维码提前截屏'],
      },
      {
        time: '10:20',
        title: '开封府',
        type: 'show',
        copy: '如果早到，先看开衙迎宾和大堂审案；如果人太多，就把精力留给下午清明上河园。',
        picks: ['开衙迎宾', '铡美案', '府衙建筑群'],
      },
      {
        time: '12:10',
        title: '锅贴 / 灌汤包',
        type: 'food',
        copy: '邢家锅贴、黄家老店都可进备选。灌汤包先咬小口喝汤，别一口闷。',
        picks: ['韭黄鲜肉锅贴', '灌汤包', '鲤鱼焙面', '炸八块'],
      },
      {
        time: '14:30',
        title: '清明上河园',
        type: 'play',
        copy: '下午进园节奏更舒服：虹桥、汴河、民俗表演一路看，到傍晚等灯慢慢亮。',
        picks: ['虹桥夕阳', '水上傀儡', '王员外招婿', '宋服拍照'],
      },
      {
        time: '20:00',
        title: '大宋·东京梦华',
        type: 'show',
        copy: '这天的压轴。水面、灯光、词牌和船影一起出来时，开封的夜就完整了。',
        picks: ['提前入座', '带薄外套', '演出后别急着散场'],
      },
    ],
  },
  {
    id: '0502',
    date: '5.2',
    city: 'kaifeng',
    cityName: '开封',
    theme: '白天江湖，晚上夜市',
    image: '/mayday-trip/kaifeng.svg',
    accent: '#e11d48',
    summary: '万岁山武侠城是主菜，下午留一点古寺城墙，晚上西司夜市开吃。',
    items: [
      {
        time: '09:00',
        title: '万岁山·大宋武侠城',
        type: 'show',
        copy: '直接按节目单走。马战、爆破、NPC 任务和江湖街都很适合沉浸玩。',
        picks: ['三打祝家庄', '武松醉打蒋门神', '水浒街 NPC', '银票任务'],
      },
      {
        time: '12:50',
        title: '江湖街 / 黄家老店',
        type: 'food',
        copy: '景区内先垫一口，下午出园后再吃正餐。想稳就灌汤包、炸八块、红薯泥。',
        picks: ['灌汤包', '炸八块', '红薯泥', '江湖街小吃'],
      },
      {
        time: '15:00',
        title: '大相国寺 / 铁塔 / 城墙',
        type: 'play',
        copy: '这三处按体力选。想安静就大相国寺，想看古建筑就铁塔，想拉开视野就城墙。',
        picks: ['千手千眼观音', '铁塔琉璃砖', '大梁门城墙', '城摞城剖面'],
      },
      {
        time: '18:30',
        title: '西司夜市',
        type: 'food',
        copy: '本地人气更足。二嫂羊肉炕馍、小虎炒凉粉、杏仁茶都排进第一梯队。',
        picks: ['羊肉炕馍', '炒凉粉焦皮多', '杏仁茶加料', '黄焖鱼'],
      },
      {
        time: '21:00',
        title: '打铁花 / 御河夜游',
        type: 'show',
        copy: '如果当天还能撑住，优先看打铁花；想舒服收尾就去御河边散步或坐船。',
        picks: ['打铁花金雨', '大宋御河', '鼓楼夜景'],
      },
    ],
  },
  {
    id: '0503',
    date: '5.3',
    city: 'luoyang',
    cityName: '洛阳',
    theme: '神都、石窟、牡丹和夜色一起收尾',
    image: '/mayday-trip/luoyang.svg',
    accent: '#6366f1',
    summary: '开封去洛阳后，白天龙门和牡丹，晚上应天门、洛邑古城、十字街。',
    items: [
      {
        time: '08:30',
        title: '开封 → 洛阳',
        type: 'move',
        copy: '高铁到洛阳龙门站最顺，后面直接接龙门石窟，减少来回折返。',
        picks: ['开封北 → 洛阳龙门', '轻装去石窟', '防晒和水先备好'],
      },
      {
        time: '10:00',
        title: '龙门石窟',
        type: 'play',
        copy: '先走西山石窟，卢舍那大佛一定留时间仰看；之后去礼佛台拍全景。',
        picks: ['卢舍那大佛', '奉先寺', '礼佛台倒影', '香山寺视野'],
      },
      {
        time: '13:20',
        title: '洛阳水席',
        type: 'food',
        copy: '牡丹燕菜、连汤肉片、焦炸丸子是核心。真不同更游客，管记更日常，看距离选。',
        picks: ['牡丹燕菜', '连汤肉片', '焦炸丸子', '浆面条解腻'],
      },
      {
        time: '15:30',
        title: '国花园 / 国际牡丹园',
        type: 'photo',
        copy: '五一是牡丹尾声，优先找晚花区、控温区和芍药。别执着全园盛花，找机位更重要。',
        picks: ['晚花牡丹', '芍药', '长廊构图', '低角度花丛'],
      },
      {
        time: '17:50',
        title: '隋唐洛阳城',
        type: 'play',
        copy: '应天门、明堂天堂适合傍晚进，天色变暗之后灯光才是重点。',
        picks: ['应天门北广场', '明堂天堂', '蓝调时刻', '城墙投影'],
      },
      {
        time: '20:30',
        title: '洛邑古城 + 十字街',
        type: 'food',
        copy: '最后一晚就放松逛。想拍照去洛邑古城，想吃就十字街，不翻汤和牛肉汤都能收尾。',
        picks: ['洛邑古城夜景', '十字街夜市', '不翻汤', '牛肉汤配饼丝'],
      },
    ],
  },
]

const cities = [
  {
    id: 'zhengzhou' as const,
    name: '郑州',
    image: '/mayday-trip/zhengzhou.svg',
    tags: ['河南博物院', '商都遗址', '二七夜色'],
    copy: '第一站负责把历史和城市烟火铺开。',
  },
  {
    id: 'kaifeng' as const,
    name: '开封',
    image: '/mayday-trip/kaifeng.svg',
    tags: ['清明上河园', '万岁山', '西司夜市'],
    copy: '第二站直接进入北宋剧场和夜市修罗场。',
  },
  {
    id: 'luoyang' as const,
    name: '洛阳',
    image: '/mayday-trip/luoyang.svg',
    tags: ['龙门石窟', '应天门', '洛邑古城'],
    copy: '最后一站用神都夜色和牡丹尾声收住。',
  },
]

const foodDeck = [
  {
    city: '郑州',
    title: '老味道',
    items: ['松针蒸饺', '羊肉烩面', '胡辣汤两掺', '坛子肉焖饼'],
  },
  {
    city: '开封',
    title: '夜市主场',
    items: ['羊肉炕馍', '炒凉粉', '杏仁茶', '灌汤包'],
  },
  {
    city: '洛阳',
    title: '汤水收尾',
    items: ['牡丹燕菜', '连汤肉片', '不翻汤', '牛肉汤'],
  },
]

const photoSpots = [
  '二七塔亮灯后站到广场边缘，别站太近，塔身更完整。',
  '油化厂傍晚拍红砖和烟囱，光线比中午柔和。',
  '清明上河园虹桥等夕阳，水面和人流会一起进画面。',
  '万岁山演出尽量提前占侧前方，能拍到马战冲出来的方向。',
  '龙门礼佛台拍卢舍那全景，河对岸比佛像脚下更稳。',
  '应天门蓝调时刻最好看，天还没全黑时就到北广场。',
]

const checklist = [
  { id: 'museum', text: '河南博物院预约和华夏古乐票' },
  { id: 'qms', text: '清明上河园门票 / 东京梦华演出票' },
  { id: 'wansui', text: '万岁山节目单，先标出必看演出' },
  { id: 'longmen', text: '龙门石窟实名预约，身份证随身带' },
  { id: 'weather', text: '郑州、开封、洛阳三城天气和防晒' },
  { id: 'power', text: '充电宝、数据线、纸巾、湿巾' },
  { id: 'shoes', text: '一双能走两万步的鞋' },
  { id: 'tickets', text: '所有二维码截图到相册收藏夹' },
]

const hiddenTips = [
  {
    title: '烩面暗号',
    copy: '大碗、四两面、多放芫荽。能不能像老郑州不重要，好吃就行。',
  },
  {
    title: '夜市取舍',
    copy: '开封西司更本地，鼓楼更热闹。胃只有一个，不用把两个夜市都硬吃满。',
  },
  {
    title: '汉服策略',
    copy: '洛邑古城和清明上河园都适合，但五一排队会久，先看妆造店评价再下单。',
  },
  {
    title: '牡丹心态',
    copy: '5月看晚花和芍药，不要用“全园盛花”的期待去逛，找局部机位更容易出片。',
  },
]

const activePlan = computed(() => dayPlans.find(day => day.id === activeDay.value) || dayPlans[0])
const activeCity = computed(() => cities.find(city => city.id === activePlan.value.city) || cities[0])
const filteredItems = computed(() => {
  if (activeType.value === 'all')
    return activePlan.value.items

  return activePlan.value.items.filter(item => item.type === activeType.value)
})

const dayText = computed(() => {
  const lines = activePlan.value.items.map(item => `${item.time} ${item.title}：${item.picks.join(' / ')}`)
  return `${activePlan.value.date} ${activePlan.value.cityName}｜${activePlan.value.theme}\n${lines.join('\n')}`
})

function selectDay(dayId: DayId) {
  activeDay.value = dayId
  activeType.value = 'all'
  copyState.value = ''
}

function toggleCheck(id: string) {
  checkedMap.value = {
    ...checkedMap.value,
    [id]: !checkedMap.value[id],
  }
}

async function copyActiveDay() {
  try {
    await navigator.clipboard.writeText(dayText.value)
    copyState.value = '已复制'
    window.setTimeout(() => {
      copyState.value = ''
    }, 1800)
  }
  catch {
    copyState.value = '复制失败'
  }
}

onMounted(() => {
  const saved = window.localStorage.getItem('mayday-trip-checklist')
  if (saved)
    checkedMap.value = JSON.parse(saved)
})

watch(checkedMap, (value) => {
  window.localStorage.setItem('mayday-trip-checklist', JSON.stringify(value))
}, { deep: true })
</script>

<template>
  <main class="mayday-page">
    <section class="trip-hero">
      <div class="hero-copy">
        <p class="eyebrow">
          2026 五一 / 郑州 → 开封 → 洛阳
        </p>
        <h1>豫中三城穿越计划</h1>
        <p class="hero-text">
          4 月 29 日 18:00 抵达郑州，5 月 1 日去开封，5 月 3 日转到洛阳。酒店机票不写，只保留吃、玩、演出、拍照和预约提醒。
        </p>

        <div class="hero-actions">
          <button type="button" class="primary-btn" @click="selectDay('0429')">
            从 4.29 开始
          </button>
          <button type="button" class="ghost-btn" @click="copyActiveDay">
            {{ copyState || '复制当天计划' }}
          </button>
        </div>
      </div>

      <div class="route-card">
        <img src="/mayday-trip/route-map.svg" alt="郑州、开封、洛阳路线图" />
      </div>
    </section>

    <section class="city-strip" aria-label="城市重点">
      <article v-for="city in cities" :key="city.id" class="city-card">
        <img :src="city.image" :alt="`${city.name}插画`" />
        <div>
          <span>{{ city.name }}</span>
          <strong>{{ city.copy }}</strong>
          <p>{{ city.tags.join(' / ') }}</p>
        </div>
      </article>
    </section>

    <section class="plan-shell">
      <aside class="day-tabs" aria-label="每日切换">
        <button
          v-for="day in dayPlans"
          :key="day.id"
          type="button"
          class="day-tab"
          :class="{ active: activeDay === day.id }"
          :style="{ '--day-accent': day.accent }"
          @click="selectDay(day.id)"
        >
          <span>{{ day.date }}</span>
          <strong>{{ day.cityName }}</strong>
        </button>
      </aside>

      <article class="day-board" :style="{ '--active-accent': activePlan.accent }">
        <div class="day-head">
          <div>
            <p class="eyebrow">
              {{ activePlan.date }} / {{ activePlan.cityName }}
            </p>
            <h2>{{ activePlan.theme }}</h2>
            <p>{{ activePlan.summary }}</p>
          </div>
          <img :src="activeCity.image" :alt="`${activeCity.name}插画`" />
        </div>

        <div class="type-filters" aria-label="筛选行程">
          <button
            v-for="(meta, type) in typeMeta"
            :key="type"
            type="button"
            :class="{ active: activeType === type }"
            @click="activeType = type"
          >
            <span :class="meta.icon" />
            {{ meta.label }}
          </button>
        </div>

        <div class="timeline">
          <article v-for="item in filteredItems" :key="`${activePlan.id}-${item.time}-${item.title}`" class="timeline-item">
            <div class="time-pill">
              {{ item.time }}
            </div>
            <div class="timeline-content">
              <div class="item-title-row">
                <span :class="typeMeta[item.type].icon" />
                <h3>{{ item.title }}</h3>
                <b>{{ typeMeta[item.type].label }}</b>
              </div>
              <p>{{ item.copy }}</p>
              <div class="pick-row">
                <span v-for="pick in item.picks" :key="pick">{{ pick }}</span>
              </div>
            </div>
          </article>
        </div>
      </article>
    </section>

    <section class="rich-grid">
      <article class="guide-panel food-panel">
        <div class="section-head">
          <p class="eyebrow">
            FOOD BOARD
          </p>
          <h2>吃喝主线</h2>
        </div>
        <div class="food-deck">
          <div v-for="food in foodDeck" :key="food.city" class="food-card">
            <span>{{ food.city }}</span>
            <strong>{{ food.title }}</strong>
            <p>{{ food.items.join(' · ') }}</p>
          </div>
        </div>
      </article>

      <article class="guide-panel checklist-panel">
        <div class="section-head">
          <p class="eyebrow">
            READY CHECK
          </p>
          <h2>出发前打勾</h2>
        </div>
        <div class="check-list">
          <button
            v-for="item in checklist"
            :key="item.id"
            type="button"
            class="check-item"
            :class="{ done: checkedMap[item.id] }"
            @click="toggleCheck(item.id)"
          >
            <span class="i-ri-check-line" />
            {{ item.text }}
          </button>
        </div>
      </article>

      <article class="guide-panel photo-panel">
        <div class="section-head">
          <p class="eyebrow">
            PHOTO SPOTS
          </p>
          <h2>拍照机位</h2>
        </div>
        <ol class="photo-list">
          <li v-for="spot in photoSpots" :key="spot">
            {{ spot }}
          </li>
        </ol>
      </article>

      <article class="guide-panel tips-panel">
        <div class="section-head">
          <p class="eyebrow">
            HIDDEN TIPS
          </p>
          <h2>隐藏彩蛋</h2>
        </div>
        <div class="tip-grid">
          <div v-for="tip in hiddenTips" :key="tip.title" class="tip-card">
            <strong>{{ tip.title }}</strong>
            <p>{{ tip.copy }}</p>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped lang="scss">
.mayday-page {
  min-height: 100svh;
  padding: clamp(1rem, 2.8vw, 2rem);
  color: #f8fbff;
  background:
    radial-gradient(circle at 18% 12%, rgba(251, 146, 60, 0.3), transparent 26%),
    radial-gradient(circle at 82% 18%, rgba(99, 102, 241, 0.28), transparent 28%),
    radial-gradient(circle at 64% 78%, rgba(244, 63, 94, 0.22), transparent 30%),
    linear-gradient(135deg, rgba(5, 9, 20, 0.96), rgba(13, 20, 38, 0.94));
}

.mayday-page::before {
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  content: '';
  mask-image: linear-gradient(180deg, #000, transparent 82%);
  pointer-events: none;
}

.mayday-page > * {
  position: relative;
  z-index: 1;
}

.trip-hero,
.plan-shell,
.rich-grid,
.city-strip {
  width: min(1280px, 100%);
  margin-inline: auto;
}

.trip-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(320px, 1fr);
  gap: clamp(1rem, 3vw, 2rem);
  align-items: stretch;
  min-height: min(690px, calc(100svh - 2rem));
}

.hero-copy,
.route-card,
.day-board,
.guide-panel,
.city-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.045)),
    rgba(7, 12, 24, 0.58);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(24px) saturate(150%);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: clamp(1.4rem, 4vw, 3.4rem);
  border-radius: 40px;
}

.eyebrow {
  margin: 0 0 0.7rem;
  color: rgba(244, 248, 255, 0.62);
  font-size: 0.76rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  margin: 0;
}

h1 {
  max-width: 8ch;
  font-family: 'ZCOOL XiaoWei', 'STSong', 'Songti SC', serif;
  font-size: clamp(3.6rem, 9vw, 8.8rem);
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.08em;
}

.hero-text {
  max-width: 38rem;
  margin: 1.4rem 0 0;
  color: rgba(238, 244, 255, 0.76);
  font-size: clamp(1rem, 2vw, 1.16rem);
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;
}

.primary-btn,
.ghost-btn,
.type-filters button,
.day-tab,
.check-item {
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}

.primary-btn,
.ghost-btn {
  min-height: 3.2rem;
  padding: 0.85rem 1.35rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  font-weight: 800;
}

.primary-btn {
  background: #fff;
  color: #101827;
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.08);
  color: #f7fbff;
}

.primary-btn:hover,
.ghost-btn:hover,
.day-tab:hover,
.type-filters button:hover,
.check-item:hover,
.city-card:hover {
  transform: translateY(-3px);
}

.route-card {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 40px;
  padding: clamp(0.8rem, 2vw, 1.2rem);
}

.route-card img {
  width: 100%;
  border-radius: 34px;
}

.city-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1rem;
}

.city-card {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  min-width: 0;
  padding: 0.9rem;
  border-radius: 28px;
}

.city-card img {
  width: 100%;
  border-radius: 20px;
}

.city-card span,
.food-card span {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.8rem;
}

.city-card strong {
  display: block;
  margin-top: 0.3rem;
  color: #fff;
  line-height: 1.5;
}

.city-card p {
  margin: 0.4rem 0 0;
  color: rgba(238, 244, 255, 0.65);
  font-size: 0.9rem;
}

.plan-shell {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.day-tabs {
  display: grid;
  gap: 0.75rem;
  align-content: start;
}

.day-tab {
  display: grid;
  gap: 0.35rem;
  min-height: 5.4rem;
  padding: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  text-align: left;
}

.day-tab span {
  color: rgba(244, 248, 255, 0.58);
  font-size: 0.85rem;
}

.day-tab strong {
  font-size: 1.35rem;
}

.day-tab.active {
  border-color: color-mix(in srgb, var(--day-accent) 76%, #fff 24%);
  background: linear-gradient(135deg, color-mix(in srgb, var(--day-accent) 22%, transparent), rgba(255, 255, 255, 0.08));
  box-shadow: 0 16px 40px color-mix(in srgb, var(--day-accent) 18%, transparent);
}

.day-board {
  overflow: hidden;
  border-radius: 34px;
  padding: clamp(1rem, 2.4vw, 1.6rem);
}

.day-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 1rem;
  align-items: center;
}

.day-head h2,
.section-head h2 {
  font-family: 'ZCOOL XiaoWei', 'STSong', 'Songti SC', serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.05;
}

.day-head p:not(.eyebrow) {
  max-width: 42rem;
  color: rgba(238, 244, 255, 0.7);
  line-height: 1.8;
}

.day-head img {
  width: 100%;
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.type-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin: 1.2rem 0;
}

.type-filters button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(244, 248, 255, 0.76);
}

.type-filters button.active {
  border-color: color-mix(in srgb, var(--active-accent) 70%, #fff 30%);
  background: color-mix(in srgb, var(--active-accent) 22%, rgba(255, 255, 255, 0.08));
  color: #fff;
}

.timeline {
  display: grid;
  gap: 0.85rem;
}

.timeline-item {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 0.9rem;
}

.time-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.6rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--active-accent) 26%, rgba(255, 255, 255, 0.08));
  color: #fff;
  font-weight: 800;
}

.timeline-content {
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.055);
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.item-title-row h3 {
  flex: 1;
  color: #fff;
  font-size: 1.2rem;
}

.item-title-row > span {
  color: var(--active-accent);
  font-size: 1.25rem;
}

.item-title-row b {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(244, 248, 255, 0.62);
  font-size: 0.76rem;
}

.timeline-content p {
  margin: 0.65rem 0 0;
  color: rgba(238, 244, 255, 0.68);
  line-height: 1.8;
}

.pick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.pick-row span {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(249, 251, 255, 0.82);
  font-size: 0.85rem;
}

.rich-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.guide-panel {
  border-radius: 30px;
  padding: clamp(1rem, 2vw, 1.35rem);
}

.section-head {
  margin-bottom: 1rem;
}

.food-deck,
.tip-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.food-card,
.tip-card {
  min-width: 0;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.055);
}

.food-card strong,
.tip-card strong {
  display: block;
  margin: 0.3rem 0;
  color: #fff;
  font-size: 1.05rem;
}

.food-card p,
.tip-card p {
  margin: 0;
  color: rgba(238, 244, 255, 0.68);
  line-height: 1.7;
}

.check-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(244, 248, 255, 0.74);
  text-align: left;
}

.check-item span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: transparent;
}

.check-item.done {
  border-color: rgba(125, 211, 252, 0.42);
  background: rgba(14, 165, 233, 0.12);
  color: #fff;
}

.check-item.done span {
  color: #fff;
  background: #0ea5e9;
}

.photo-list {
  display: grid;
  gap: 0.65rem;
  margin: 0;
  padding-left: 1.2rem;
  color: rgba(238, 244, 255, 0.72);
  line-height: 1.75;
}

.tips-panel {
  grid-column: span 2;
}

.tip-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 1080px) {
  .trip-hero,
  .plan-shell,
  .rich-grid {
    grid-template-columns: 1fr;
  }

  .city-strip {
    grid-template-columns: 1fr;
  }

  .day-tabs {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    overflow-x: auto;
  }

  .day-tab {
    min-width: 120px;
  }

  .tips-panel {
    grid-column: auto;
  }

  .tip-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .mayday-page {
    padding: 0.75rem;
  }

  .trip-hero {
    min-height: auto;
  }

  .hero-copy,
  .route-card,
  .day-board,
  .guide-panel {
    border-radius: 26px;
  }

  h1 {
    max-width: 9ch;
    font-size: clamp(3.4rem, 18vw, 5.5rem);
  }

  .hero-actions,
  .type-filters {
    align-items: stretch;
    flex-direction: column;
  }

  .day-head {
    grid-template-columns: 1fr;
  }

  .day-head img {
    order: -1;
  }

  .timeline-item {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }

  .time-pill {
    width: max-content;
  }

  .food-deck,
  .check-list,
  .tip-grid {
    grid-template-columns: 1fr;
  }

  .city-card {
    grid-template-columns: 92px minmax(0, 1fr);
  }
}
</style>
