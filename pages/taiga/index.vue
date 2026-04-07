<route lang="yaml">
meta:
  frontmatter:
    title: 逢坂大河
    layout: taiga
    comment: false
</route>

<script setup lang="ts">
type SectionId = 'scene-archive' | 'save-archive' | 'gallery-shelf' | 'relation-room'

const menuCards: Array<{
  title: string
  subtitle: string
  accent?: boolean
  section?: SectionId
  to?: string
}> = [
  {
    title: '开始',
    subtitle: 'START PAGE',
    accent: true,
    section: 'scene-archive',
  },
  {
    title: '场景',
    subtitle: 'SCENE LOG',
    section: 'scene-archive',
  },
  {
    title: '存档',
    subtitle: 'SAVE DATA',
    section: 'save-archive',
  },
  {
    title: '图库',
    subtitle: 'GALLERY',
    section: 'gallery-shelf',
  },
  {
    title: '关系',
    subtitle: 'RELATION',
    section: 'relation-room',
  },
  {
    title: '返回',
    subtitle: 'BACK HOME',
    to: '/',
  },
]

const quickButtons = [
  {
    label: '查看场景',
    section: 'scene-archive' as const,
  },
  {
    label: '打开图库',
    section: 'gallery-shelf' as const,
  },
]

const sceneCards = [
  {
    title: '圣诞夜',
    copy: '提到《龙与虎》，很多人最先想起的就是这里。这一段不需要解释太多，情绪自己会落下来。',
  },
  {
    title: '雪地',
    copy: '整部作品的后劲，很多都埋在这几分钟里。安静、发冷，但心口会一下收紧。',
  },
  {
    title: '晚饭时间',
    copy: '饭桌、公寓、做饭和拌嘴，这些家常片段才是大河最贴近生活的一面。',
  },
  {
    title: '放学后的路',
    copy: '我会记住这部作品，很大一部分就是因为那些路灯、住宅区和冬夜空气。',
  },
]

const relationCards = [
  {
    name: '高须龙儿',
    copy: '不是只靠表白撑起来的关系，而是真的一起过日子。',
  },
  {
    name: '栉枝实乃梨',
    copy: '很多藏起来的情绪，恰好都绕不过她。',
  },
  {
    name: '川岛亚美',
    copy: '带刺、清醒、互相看穿，这条线一直很有张力。',
  },
  {
    name: '北村祐作',
    copy: '最早把心意往外放的一次，也让大河这个角色更完整。',
  },
]

const saveSlots = [
  {
    slot: 'SLOT 01',
    title: '第一次补完',
    note: '留给最初那次看完整部作品的感觉。',
  },
  {
    slot: 'SLOT 02',
    title: '最近一次回看',
    note: '以后每次重看，都可以把新的感觉补进来。',
  },
  {
    slot: 'SLOT 03',
    title: '截图和小收藏',
    note: '壁纸、截图、喜欢的表情，以后往这里堆。',
  },
]

const tags = [
  '掌中萌虎',
  'Toradora!',
  '冬夜',
  '路灯',
  '校园',
  '公寓',
  '雪地',
  '圣诞夜',
  '嘴硬',
  '后劲',
]

function jumpTo(sectionId?: SectionId) {
  if (!sectionId)
    return

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <main class="taiga-route-page">
    <section class="taiga-stage">
      <div class="stage-shell">
        <div class="utility-row">
          <AppLink class="utility-btn" to="/" aria-label="返回首页">
            <span class="i-ri-home-5-line" />
          </AppLink>
          <AppLink class="utility-btn" to="/hobbies/" aria-label="兴趣区">
            <span class="i-ri-heart-3-line" />
          </AppLink>
          <AppLink class="utility-btn" to="/collection/" aria-label="收藏页">
            <span class="i-ri-bookmark-3-line" />
          </AppLink>
        </div>

        <article class="profile-card">
          <div class="profile-topline">
            <strong>Aisaka Taiga</strong>
            <span class="profile-badge">Aisaka Route</span>
          </div>
          <span class="profile-name">逢坂大河</span>

          <div class="profile-metrics">
            <div>
              <small>Route</small>
              <b>01</b>
            </div>
            <div>
              <small>Archive</small>
              <b>10</b>
            </div>
            <div>
              <small>Level</small>
              <b>A++</b>
            </div>
          </div>
        </article>

        <div class="hero-copy">
          <p class="kana-line">オトメモード / AISAKA TAIGA</p>

          <h1 class="hero-title">
            <span class="word-pink">Aisaka</span>
            <span class="word-blue">Route</span>
          </h1>

          <p class="hero-note">
            这页不写长长的感想，直接做成一个可以慢慢补内容的角色菜单。场景、图库、关系线，还有以后回坑时想留下来的东西，都放在这里。
          </p>

          <div class="hero-actions">
            <button
              v-for="button in quickButtons"
              :key="button.label"
              type="button"
              class="hero-action-btn"
              @click="jumpTo(button.section)"
            >
              {{ button.label }}
            </button>
          </div>
        </div>

        <div class="hero-art">
          <div class="hero-art-glow hero-art-glow-a" />
          <div class="hero-art-glow hero-art-glow-b" />
          <img class="hero-main" src="/taiga-route-main.jpg" alt="逢坂大河" />
          <img class="hero-side" src="/taiga-route-side.jpg" alt="逢坂大河副图" />
        </div>

        <div class="menu-row">
          <template v-for="card in menuCards" :key="card.title">
            <button
              v-if="card.section"
              type="button"
              class="menu-card"
              :class="{ 'menu-card-accent': card.accent }"
              @click="jumpTo(card.section)"
            >
              <strong>{{ card.title }}</strong>
              <span>{{ card.subtitle }}</span>
            </button>

            <AppLink
              v-else
              class="menu-card"
              :class="{ 'menu-card-accent': card.accent }"
              :to="card.to || '/'"
            >
              <strong>{{ card.title }}</strong>
              <span>{{ card.subtitle }}</span>
            </AppLink>
          </template>
        </div>
      </div>
    </section>

    <section id="scene-archive" class="route-section">
      <article class="route-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">SCENE ARCHIVE</p>
            <h2>会先想到的几个场景</h2>
          </div>
          <p>先放最常想起的几个，后面再慢慢补得更满。</p>
        </div>

        <div class="scene-grid">
          <article v-for="scene in sceneCards" :key="scene.title" class="scene-card">
            <span class="card-mini">Scene</span>
            <h3>{{ scene.title }}</h3>
            <p>{{ scene.copy }}</p>
          </article>
        </div>
      </article>
    </section>

    <section id="save-archive" class="route-section">
      <article class="route-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">SAVE DATA</p>
            <h2>给以后回来的内容先留存档位</h2>
          </div>
          <p>现在不硬填，先把位置留出来。</p>
        </div>

        <div class="save-grid">
          <article v-for="slot in saveSlots" :key="slot.slot" class="save-card">
            <span class="save-index">{{ slot.slot }}</span>
            <h3>{{ slot.title }}</h3>
            <p>{{ slot.note }}</p>
          </article>
        </div>
      </article>
    </section>

    <section id="gallery-shelf" class="route-section">
      <article class="route-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">GALLERY</p>
            <h2>先放两张图，后面继续补</h2>
          </div>
          <p>这块以后可以继续塞截图、壁纸和别的版本。</p>
        </div>

        <div class="gallery-grid">
          <article class="gallery-card gallery-card-large">
            <img src="/taiga-route-main.jpg" alt="逢坂大河主图" />
          </article>
          <article class="gallery-card">
            <img src="/taiga-route-side.jpg" alt="逢坂大河副图" />
          </article>
          <article class="gallery-card gallery-card-placeholder">
            <span>PLACEHOLDER</span>
            <strong>以后补截图</strong>
          </article>
          <article class="gallery-card gallery-card-placeholder">
            <span>PLACEHOLDER</span>
            <strong>以后补周边</strong>
          </article>
        </div>
      </article>
    </section>

    <section id="relation-room" class="route-section route-section-wide">
      <article class="route-panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">RELATION ROOM</p>
            <h2>关系线和一些固定标签</h2>
          </div>
          <p>不写长分析，先把最核心的东西摆出来。</p>
        </div>

        <div class="relation-layout">
          <div class="relation-grid">
            <article v-for="relation in relationCards" :key="relation.name" class="relation-card">
              <h3>{{ relation.name }}</h3>
              <p>{{ relation.copy }}</p>
            </article>
          </div>

          <aside class="tag-panel">
            <p class="card-mini">KEY WORDS</p>
            <div class="tag-cloud">
              <span v-for="tag in tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </aside>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.taiga-route-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.94), transparent 28%),
    linear-gradient(180deg, #fff6f9 0%, #fff1f6 38%, #ffeef5 100%);
  color: #4d6078;
}

.taiga-stage {
  min-height: 100svh;
  padding: 1rem;
}

.stage-shell {
  position: relative;
  min-height: calc(100svh - 2rem);
  padding: 1.35rem 1.4rem 8.2rem;
  overflow: hidden;
  border-radius: 34px;
  background:
    radial-gradient(circle at 22% 28%, rgba(255, 255, 255, 0.66), transparent 14%),
    radial-gradient(circle at 70% 24%, rgba(255, 255, 255, 0.44), transparent 16%),
    url('/taiga-ui/stage-board.webp') center/cover no-repeat;
  border: 2px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 26px 80px rgba(234, 183, 203, 0.28);
}

.stage-shell::before {
  content: '';
  position: absolute;
  inset: 0.95rem;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.72);
  pointer-events: none;
}

.utility-row,
.menu-row,
.tag-cloud,
.hero-actions {
  display: flex;
  flex-wrap: wrap;
}

.utility-row {
  position: absolute;
  top: 1.3rem;
  left: 1.3rem;
  gap: 0.8rem;
  z-index: 3;
}

.utility-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 20px;
  background: url('/taiga-ui/utility-button.png') center/100% 100% no-repeat;
  color: #91a3bb;
  font-size: 1.35rem;
  text-decoration: none;
}

.profile-card,
.route-panel,
.scene-card,
.save-card,
.gallery-card,
.relation-card,
.tag-panel {
  background: url('/taiga-ui/panel-soft.png') center/100% 100% no-repeat;
}

.profile-card {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  z-index: 3;
  width: min(270px, calc(100vw - 2.8rem));
  padding: 1rem 1.15rem 1.1rem;
}

.profile-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.profile-topline strong {
  color: #53637c;
  font-size: 1.15rem;
}

.profile-badge {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 92, 150, 0.12);
  color: #ff5c96;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-name {
  display: block;
  margin-top: 0.25rem;
  color: #8a9cb2;
}

.profile-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  margin-top: 1rem;
}

.profile-metrics div {
  display: grid;
  gap: 0.12rem;
  text-align: center;
}

.profile-metrics small {
  color: #9eabc0;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.profile-metrics b {
  color: #5b6a81;
  font-size: 1.2rem;
}

.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 720px;
  padding-top: 4.5rem;
}

.kana-line,
.section-kicker,
.card-mini {
  color: rgba(255, 116, 165, 0.74);
  letter-spacing: 0.24em;
  font-size: 0.78rem;
  text-transform: uppercase;
}

.hero-title {
  display: grid;
  gap: 0;
  margin: 1.5rem 0 0.9rem;
  line-height: 0.9;
}

.hero-title span {
  font-family: 'Baloo 2', 'ZCOOL KuaiLe', 'LXGW WenKai Screen', sans-serif;
  font-size: clamp(4.6rem, 11vw, 8rem);
  font-weight: 800;
  letter-spacing: -0.06em;
}

.word-pink {
  color: #ff538c;
  -webkit-text-stroke: 6px rgba(255, 255, 255, 0.98);
  text-shadow:
    0 0 0 #ff9cbf,
    0 8px 0 rgba(255, 168, 197, 0.14),
    0 0 20px rgba(255, 144, 184, 0.18);
}

.word-blue {
  margin-left: 1.3rem;
  color: #4b84ff;
  -webkit-text-stroke: 6px rgba(255, 255, 255, 0.98);
  text-shadow:
    0 0 0 #9cc0ff,
    0 8px 0 rgba(138, 179, 255, 0.12),
    0 0 18px rgba(125, 176, 255, 0.16);
}

.hero-note {
  max-width: 35rem;
  margin: 0;
  color: #708198;
  font-size: 1.08rem;
  line-height: 1.85;
}

.hero-actions {
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.hero-action-btn {
  min-height: 3.1rem;
  padding: 0.55rem 1.1rem;
  border: 2px solid rgba(255, 182, 207, 0.7);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #65768f;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(239, 187, 207, 0.22);
}

.hero-art {
  position: absolute;
  right: 3%;
  bottom: 0;
  width: min(46vw, 860px);
  height: min(88vh, 900px);
  z-index: 1;
  pointer-events: none;
}

.hero-main,
.hero-side {
  position: absolute;
  display: block;
  object-fit: cover;
}

.hero-main {
  right: 0;
  bottom: 0;
  width: 82%;
  height: 88%;
  border-radius: 34px 34px 0 0;
  border: 10px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 24px 60px rgba(229, 170, 191, 0.2);
}

.hero-side {
  right: 49%;
  bottom: 9%;
  width: 28%;
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  border: 6px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 34px rgba(231, 177, 198, 0.22);
  transform: rotate(-7deg);
}

.hero-art-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(42px);
}

.hero-art-glow-a {
  right: 10%;
  bottom: 14%;
  width: 14rem;
  height: 14rem;
  background: rgba(255, 168, 168, 0.26);
}

.hero-art-glow-b {
  right: 42%;
  top: 18%;
  width: 8rem;
  height: 8rem;
  background: rgba(124, 175, 255, 0.22);
}

.menu-row {
  position: absolute;
  right: 1.15rem;
  bottom: 1.15rem;
  left: 1.15rem;
  gap: 1rem;
  z-index: 3;
}

.menu-card {
  flex: 1 1 11rem;
  display: grid;
  gap: 0.05rem;
  min-height: 6.6rem;
  padding: 1rem 1.1rem;
  border: 0;
  background:
    url('/taiga-ui/menu-default.png') center/100% 100% no-repeat,
    transparent;
  color: #5d6e86;
  text-decoration: none;
  cursor: pointer;
}

.menu-card strong {
  font-size: 2rem;
  font-weight: 800;
}

.menu-card span {
  color: #97a7ba;
  font-size: 0.93rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.menu-card-accent {
  background:
    url('/taiga-ui/menu-active.png') center/100% 100% no-repeat,
    transparent;
  color: #fff;
}

.menu-card-accent span {
  color: rgba(255, 244, 248, 0.9);
}

.route-section {
  width: min(1420px, calc(100vw - 2rem));
  margin: 0 auto;
  padding: 0.3rem 0 1.35rem;
}

.route-section-wide {
  padding-bottom: 2rem;
}

.route-panel {
  padding: 1.2rem;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-inline: 0.2rem;
}

.section-head h2 {
  margin: 0.2rem 0 0;
  color: #51637c;
  font-family: 'ZCOOL XiaoWei', 'STSong', 'Songti SC', serif;
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-head > p,
.section-head p:last-child {
  margin: 0;
  color: #8b98ab;
  line-height: 1.75;
}

.scene-grid,
.save-grid,
.gallery-grid,
.relation-layout,
.relation-grid {
  display: grid;
  gap: 1rem;
}

.scene-grid,
.save-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gallery-grid {
  grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr;
}

.relation-layout {
  grid-template-columns: 1.15fr 0.85fr;
}

.scene-card,
.save-card,
.gallery-card,
.relation-card,
.tag-panel {
  overflow: hidden;
  padding: 1.15rem;
}

.scene-card h3,
.save-card h3,
.relation-card h3 {
  margin: 0.5rem 0 0.45rem;
  color: #566781;
}

.scene-card p,
.save-card p,
.relation-card p {
  margin: 0;
  color: #7d8ba0;
  line-height: 1.78;
}

.save-index {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  background: rgba(94, 139, 255, 0.1);
  color: #5388ff;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.gallery-card {
  position: relative;
  min-height: 20rem;
  padding: 0.7rem;
}

.gallery-card img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 22px;
  object-fit: cover;
}

.gallery-card-large {
  min-height: 26rem;
}

.gallery-card-placeholder {
  display: grid;
  place-content: center;
  gap: 0.35rem;
  text-align: center;
}

.gallery-card-placeholder span {
  color: rgba(255, 97, 150, 0.7);
  font-size: 0.78rem;
  letter-spacing: 0.12em;
}

.gallery-card-placeholder strong {
  color: #7d8ba1;
  font-size: 1.2rem;
}

.relation-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.tag-panel {
  display: grid;
  align-content: start;
}

.tag-cloud {
  gap: 0.6rem;
  margin-top: 1rem;
}

.tag-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.1rem;
  padding: 0.35rem 0.78rem;
  border-radius: 999px;
  background: rgba(255, 103, 154, 0.12);
  color: #ff5d98;
  font-size: 0.84rem;
  font-weight: 700;
}

@media (max-width: 1240px) {
  .hero-art {
    width: min(50vw, 720px);
  }

  .scene-grid,
  .save-grid,
  .gallery-grid,
  .relation-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .stage-shell {
    min-height: auto;
    padding: 1rem 1rem 1rem;
  }

  .utility-row,
  .profile-card,
  .hero-art,
  .menu-row {
    position: static;
  }

  .profile-card {
    width: 100%;
    margin-top: 0.9rem;
  }

  .hero-copy {
    padding-top: 2rem;
  }

  .hero-art {
    width: 100%;
    height: auto;
    margin-top: 1rem;
    display: grid;
    justify-items: center;
  }

  .hero-main {
    position: relative;
    width: min(100%, 520px);
    height: auto;
    aspect-ratio: 4 / 5;
    border-radius: 30px;
  }

  .hero-side {
    right: auto;
    left: 0.3rem;
    bottom: 1rem;
    width: 7.2rem;
  }

  .hero-art-glow-a,
  .hero-art-glow-b {
    display: none;
  }

  .menu-row,
  .scene-grid,
  .save-grid,
  .gallery-grid,
  .relation-layout,
  .relation-grid {
    grid-template-columns: 1fr;
  }

  .menu-row {
    display: grid;
    margin-top: 1rem;
  }

  .section-head {
    flex-direction: column;
    align-items: start;
  }
}
</style>
