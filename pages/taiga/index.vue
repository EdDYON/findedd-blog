<route lang="yaml">
meta:
  frontmatter:
    title: 逢坂大河
    comment: false
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'

type FocusKey = 'character' | 'scenes' | 'tone'

const focusKey = ref<FocusKey>('character')
const facetIndex = ref(0)

const focusTabs = [
  {
    key: 'character' as const,
    label: '角色本身',
    title: '我喜欢的不是一个设定，而是她整个人的节奏。',
    copy: '大河最容易被记住的当然是凶、冲、嘴硬，但真正会留下来的不是这些表面动作，而是她每次逞强之后露出来的那点笨拙和认真。她不是稳定输出某一种萌点的角色，而是会在强硬、依赖、狼狈、心软之间来回晃，这种不平整反而特别像活人。',
  },
  {
    key: 'scenes' as const,
    label: '会想起的场景',
    title: '我记住她，很多时候是因为那些场景根本离不开她。',
    copy: '圣诞夜、雪地、公寓门口、一起吃饭的夜晚、放学路上的灯光，这些画面单看都已经成立，但只要少了大河，整个味道就会直接淡掉。她和这些场景是绑在一起的，不是“角色在场”，而是“她就是气氛的一部分”。',
  },
  {
    key: 'tone' as const,
    label: '作品空气',
    title: '提到她，我想到的从来不只是她本人，还有整部《龙与虎》的温度。',
    copy: '那种冬天夜里有点冷、街灯却很暖的空气感，那种吵吵闹闹之后忽然安静下来的节奏，那种校园、住宅区、晚饭和心事全都挤在一起的青春味道，都是我回头再看这部作品时最舍不得的部分。',
  },
]

const sceneCards = [
  {
    title: '圣诞夜',
    note: '这段几乎已经成了整部作品最容易让人心口发紧的地方。它不是靠大起大落取胜，而是情绪终于压不住的时候，前面所有铺垫一起落下来。',
  },
  {
    title: '一起吃饭的夜晚',
    note: '《龙与虎》最稳的一层底色，其实是那些很家常的片段。饭桌、公寓、做饭、收拾、顺手照顾彼此，这些日常把大河写得特别近。',
  },
  {
    title: '雪地那一段',
    note: '到这里的时候，很多感情已经不需要再绕弯子了。雪地会让整部作品的情绪突然变得很安静，也更疼。',
  },
  {
    title: '放学后的路和住宅区',
    note: '我会反复想起这部作品，很大一部分原因就是这些晚上的街道。大河走在这种灯光下面时，角色和场景会一起留在脑子里。',
  },
]

const relationCards = [
  {
    name: '高须龙儿',
    copy: '这条关系线最打动我的不是“官配感”，而是他们真的把彼此放进了生活里。一起做饭、一起收拾、吵着吵着又默认对方会在，这种靠近比很多直白表白都更重。',
  },
  {
    name: '栉枝实乃梨',
    copy: '大河面对实乃梨时，总会把很多真心藏得更深一点。那里面有仰望、有歉意、有不想伤人的笨拙，所以看起来才会一直拧着。',
  },
  {
    name: '川岛亚美',
    copy: '我很喜欢她和亚美放在一起时那种带刺的清醒感。两个人都不简单，也都很能看穿别人，所以碰到一起的时候格外有张力。',
  },
  {
    name: '北村祐作',
    copy: '最开始的喜欢当然重要，因为那是大河最早把心意往外放的一次。就算最后答案不在这里，这条线也让她整个人更完整了。',
  },
]

const detailChips = [
  '掌中萌虎',
  '圣诞夜',
  '雪地',
  '公寓门口',
  '一起吃饭',
  '放学后的街灯',
  '嘴硬和心软',
  '凶巴巴的关心',
  '冬天空气感',
  '住宅区夜色',
]

const revisitReasons = [
  '她不是“可爱模板”，而是情绪起伏和自尊心都很重的人。',
  '她和《龙与虎》的场景绑定得太紧，想到她就会想到整部作品的空气。',
  '再看时不会只剩名场面，反而会更在意那些安静、家常、很生活化的段落。',
  '很多年后回头看，依然能被她的别扭、认真和狼狈击中。',
]

const facets = [
  {
    title: '炸毛的时候',
    copy: '她一凶起来，整个画面立刻有了节奏，这种存在感不是靠台词堆出来的，是角色本人站在那里就够强。',
  },
  {
    title: '安静下来的时候',
    copy: '真正让我一直记着她的，反而是那些突然安静的时刻。只要一沉下来，她身上的脆弱和逞强就会一起露出来。',
  },
  {
    title: '把人放进生活里的时候',
    copy: '她最动人的地方之一，就是嘴上再怎么拧，最后还是会把在意的人慢慢放进自己的日常。',
  },
  {
    title: '被冬天包住的时候',
    copy: '大河和冬天实在太配了。冷空气、路灯、围起来的心事，这些元素和她放在一起，会让记忆直接定格。',
  },
]

const activeTab = computed(() => focusTabs.find(tab => tab.key === focusKey.value) ?? focusTabs[0])
const currentFacet = computed(() => facets[facetIndex.value % facets.length])

function nextFacet() {
  facetIndex.value = (facetIndex.value + 1) % facets.length
}
</script>

<template>
  <section class="taiga-page">
    <article class="taiga-hero">
      <div class="taiga-hero-copy">
        <p class="eyebrow">Tiger & Dragon</p>
        <h2>这页不打算讲道理，只想认真留住我为什么会一直喜欢逢坂大河。</h2>
        <p>
          如果这个站里要给某个角色单独留一页，那就是她。《龙与虎》对我来说不是“看过的一部校园番”，而是隔一段时间就会想回去听一听、看一看、再把那些冬夜和情绪重新过一遍的作品。
        </p>

        <div class="taiga-chip-row">
          <span v-for="chip in detailChips" :key="chip" class="inline-chip">{{ chip }}</span>
        </div>
      </div>

      <div class="taiga-side-panel">
        <p class="mini-label">今天先想到的那一面</p>
        <h3>{{ currentFacet.title }}</h3>
        <p>{{ currentFacet.copy }}</p>
        <button type="button" class="taiga-switch" @click="nextFacet">
          再看一面
        </button>
      </div>
    </article>

    <article class="taiga-panel">
      <div class="taiga-section-head">
        <div>
          <p class="mini-label">我喜欢她，不只是一种喜欢法</p>
          <h3>有时候想到角色本身，有时候想到的是整部作品的空气。</h3>
        </div>

        <div class="taiga-tabs">
          <button
            v-for="tab in focusTabs"
            :key="tab.key"
            type="button"
            class="taiga-tab"
            :class="{ active: focusKey === tab.key }"
            @click="focusKey = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="taiga-focus-card">
        <h4>{{ activeTab.title }}</h4>
        <p>{{ activeTab.copy }}</p>
      </div>
    </article>

    <article class="taiga-panel">
      <div class="taiga-section-head">
        <div>
          <p class="mini-label">会反复回头想起的地方</p>
          <h3>真正撑住这页的，不是“她很好”，而是这些场景一直都在。</h3>
        </div>
      </div>

      <div class="taiga-scene-grid">
        <article v-for="scene in sceneCards" :key="scene.title" class="scene-card">
          <span class="scene-kicker">Scene</span>
          <h4>{{ scene.title }}</h4>
          <p>{{ scene.note }}</p>
        </article>
      </div>
    </article>

    <div class="taiga-dual-grid">
      <article class="taiga-panel">
        <div class="taiga-section-head">
          <div>
            <p class="mini-label">关系线</p>
            <h3>她之所以立得住，也因为她和每个人的距离都不一样。</h3>
          </div>
        </div>

        <div class="relation-grid">
          <article v-for="relation in relationCards" :key="relation.name" class="relation-card">
            <h4>{{ relation.name }}</h4>
            <p>{{ relation.copy }}</p>
          </article>
        </div>
      </article>

      <article class="taiga-panel">
        <div class="taiga-section-head">
          <div>
            <p class="mini-label">为什么会反复重看</p>
            <h3>不是因为怀旧，而是她和这部作品真的会留下来。</h3>
          </div>
        </div>

        <ul class="revisit-list">
          <li v-for="reason in revisitReasons" :key="reason">
            {{ reason }}
          </li>
        </ul>
      </article>
    </div>

    <article class="taiga-panel taiga-ending">
      <p class="mini-label">最后留一句最像我的话</p>
      <h3>如果以后我还会给角色单开页面，标准大概就是：想到她的时候，我会不会连整部作品的风都一起想起来。</h3>
      <p>
        逢坂大河会。所以这页留给她，不是顺手做的收藏夹，也不是为了显得自己很懂角色，而是因为她和《龙与虎》确实在我这里留了很久。
      </p>
    </article>
  </section>
</template>

<style scoped>
.taiga-page {
  display: grid;
  gap: 1rem;
}

.taiga-hero,
.taiga-panel,
.scene-card,
.relation-card,
.taiga-focus-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--site-shadow);
}

.taiga-hero,
.taiga-panel {
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(255, 175, 143, 0.12), transparent 28%),
    radial-gradient(circle at bottom left, rgba(255, 214, 153, 0.09), transparent 34%),
    rgba(11, 16, 28, 0.8);
}

.taiga-hero {
  display: grid;
  grid-template-columns: 1.35fr 0.75fr;
  gap: 1rem;
  padding: 1.3rem;
}

.taiga-hero-copy h2,
.taiga-panel h3,
.taiga-focus-card h4,
.scene-card h4,
.relation-card h4,
.taiga-side-panel h3 {
  color: #fff;
}

.taiga-hero-copy h2 {
  margin: 0.35rem 0 0.8rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.06;
  max-width: 12ch;
}

.taiga-hero-copy p,
.taiga-side-panel p,
.taiga-focus-card p,
.scene-card p,
.relation-card p,
.revisit-list li,
.taiga-ending p {
  color: rgba(240, 244, 255, 0.8);
  line-height: 1.82;
}

.taiga-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 1rem;
}

.taiga-side-panel {
  display: grid;
  align-content: start;
  gap: 0.55rem;
  padding: 1rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.taiga-switch,
.taiga-tab {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.taiga-switch {
  width: fit-content;
  margin-top: 0.3rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
}

.taiga-switch:hover,
.taiga-tab:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.09);
}

.taiga-panel {
  padding: 1.2rem;
}

.taiga-section-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.taiga-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.taiga-tab {
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
}

.taiga-tab.active {
  background: rgba(255, 186, 156, 0.14);
  border-color: rgba(255, 186, 156, 0.26);
}

.taiga-focus-card {
  padding: 1rem 1.05rem;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
    rgba(255, 255, 255, 0.03);
}

.taiga-focus-card h4 {
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
}

.taiga-scene-grid,
.relation-grid {
  display: grid;
  gap: 1rem;
}

.taiga-scene-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.relation-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.scene-card,
.relation-card {
  padding: 1rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.035);
}

.scene-kicker {
  display: inline-block;
  margin-bottom: 0.65rem;
  color: rgba(255, 210, 170, 0.72);
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.scene-card h4,
.relation-card h4 {
  margin: 0 0 0.5rem;
}

.taiga-dual-grid {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: 1rem;
}

.revisit-list {
  display: grid;
  gap: 0.85rem;
  margin: 0;
  padding-left: 1.2rem;
}

.taiga-ending {
  background:
    radial-gradient(circle at top right, rgba(255, 198, 163, 0.13), transparent 28%),
    rgba(12, 17, 29, 0.82);
}

@media (max-width: 1100px) {
  .taiga-hero,
  .taiga-dual-grid,
  .taiga-scene-grid,
  .relation-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .taiga-hero,
  .taiga-panel {
    padding: 1rem;
    border-radius: 24px;
  }

  .taiga-section-head {
    flex-direction: column;
  }

  .taiga-hero-copy h2 {
    max-width: none;
    font-size: clamp(2rem, 9vw, 2.7rem);
  }
}
</style>
