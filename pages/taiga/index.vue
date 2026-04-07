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

const sceneCards = [
  {
    title: '圣诞夜',
    copy: '这一段不用多解释，提到《龙与虎》，很多人最先想起的就是这里。',
  },
  {
    title: '雪地',
    copy: '安静、发冷、情绪却压不住，整部作品的后劲很多都在这几分钟里。',
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
      <div class="stage-inner">
        <div class="utility-row">
          <AppLink class="utility-btn" to="/">
            <span class="i-ri-home-5-line" />
          </AppLink>
          <AppLink class="utility-btn" to="/hobbies/">
            <span class="i-ri-heart-3-line" />
          </AppLink>
          <AppLink class="utility-btn" to="/collection/">
            <span class="i-ri-bookmark-3-line" />
          </AppLink>
        </div>

        <article class="profile-card">
          <strong>Aisaka Taiga</strong>
          <span>逢坂大河</span>
          <div class="profile-tags">
            <span>Toradora!</span>
            <span>长驻页面</span>
            <span>偏爱角色</span>
          </div>
        </article>

        <div class="hero-copy">
          <p class="kana-line">オトメモード / AISAKA TAIGA</p>
          <h1>
            <span class="word-pink">Taiga</span>
            <span class="word-blue">Route</span>
          </h1>
          <p class="hero-note">
            这页不写大段感想，直接做成一张可以慢慢补内容的角色菜单。喜欢的场景、截图、关系线和回看记录，都从下面这些入口往下走。
          </p>
        </div>

        <div class="hero-art">
          <div class="hero-art-glow hero-art-glow-a" />
          <div class="hero-art-glow hero-art-glow-b" />
          <img class="hero-main" src="/taiga-route-main.jpg" alt="逢坂大河" />
          <img class="hero-side" src="/taiga-route-side.jpg" alt="逢坂大河侧图" />
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
      <div class="section-head">
        <div>
          <p class="section-kicker">SCENE ARCHIVE</p>
          <h2>会先想到的几个场景</h2>
        </div>
        <p>这块只先放最常想起的几个，后面慢慢补。</p>
      </div>

      <div class="scene-grid">
        <article v-for="scene in sceneCards" :key="scene.title" class="scene-card">
          <span class="card-mini">Scene</span>
          <h3>{{ scene.title }}</h3>
          <p>{{ scene.copy }}</p>
        </article>
      </div>
    </section>

    <section id="save-archive" class="route-section">
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
    </section>

    <section id="gallery-shelf" class="route-section">
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
    </section>

    <section id="relation-room" class="route-section route-section-wide">
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
    </section>
  </main>
</template>

<style scoped>
.taiga-route-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.88), transparent 28%),
    linear-gradient(135deg, rgba(255, 214, 230, 0.58) 0%, rgba(255, 244, 248, 0.96) 36%, rgba(255, 239, 247, 0.96) 100%);
  color: #4c5970;
}

.taiga-stage {
  min-height: 100svh;
  padding: 1.1rem;
}

.stage-inner {
  position: relative;
  min-height: calc(100svh - 2.2rem);
  padding: 1.35rem 1.4rem 8.3rem;
  border-radius: 34px;
  overflow: hidden;
  background:
    radial-gradient(circle at 26% 38%, rgba(255, 255, 255, 0.82), transparent 18%),
    radial-gradient(circle at 72% 24%, rgba(255, 255, 255, 0.4), transparent 18%),
    repeating-linear-gradient(135deg, rgba(255, 213, 229, 0.46) 0 16px, rgba(255, 242, 247, 0.86) 16px 32px);
  border: 2px solid rgba(255, 255, 255, 0.82);
  box-shadow: 0 28px 80px rgba(235, 171, 195, 0.24);
}

.stage-inner::before {
  content: '';
  position: absolute;
  inset: 1rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.52);
  pointer-events: none;
}

.utility-row,
.menu-row,
.profile-tags,
.tag-cloud {
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
  background: rgba(255, 255, 255, 0.9);
  color: #8ba0b8;
  font-size: 1.35rem;
  text-decoration: none;
  box-shadow: 0 14px 34px rgba(223, 171, 194, 0.22);
}

.profile-card {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  z-index: 3;
  width: min(250px, calc(100vw - 3rem));
  padding: 1rem 1.1rem;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 40px rgba(232, 182, 204, 0.22);
}

.profile-card strong {
  display: block;
  color: #526178;
  font-size: 1.2rem;
}

.profile-card > span {
  display: block;
  margin-top: 0.15rem;
  color: #8ea0b5;
}

.profile-tags {
  gap: 0.45rem;
  margin-top: 0.9rem;
}

.profile-tags span,
.tag-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 111, 156, 0.1);
  color: #ff5c96;
  font-size: 0.82rem;
  font-weight: 700;
}

.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 720px;
  padding-top: 4.4rem;
}

.kana-line,
.section-kicker,
.card-mini {
  color: rgba(255, 127, 168, 0.75);
  letter-spacing: 0.24em;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.hero-copy h1 {
  display: grid;
  gap: 0;
  margin: 1.7rem 0 1rem;
  line-height: 0.9;
}

.hero-copy h1 span {
  font-family: 'Baloo 2', 'ZCOOL KuaiLe', 'LXGW WenKai Screen', sans-serif;
  font-size: clamp(4.5rem, 11vw, 7.8rem);
  font-weight: 800;
  letter-spacing: -0.05em;
}

.word-pink {
  color: #ff4e88;
  -webkit-text-stroke: 6px rgba(255, 255, 255, 0.98);
  text-shadow:
    0 0 0 #ff84b0,
    7px 7px 0 rgba(255, 143, 179, 0.16),
    0 0 18px rgba(255, 123, 170, 0.18);
}

.word-blue {
  margin-left: 1.2rem;
  color: #3d7cff;
  -webkit-text-stroke: 6px rgba(255, 255, 255, 0.98);
  text-shadow:
    0 0 0 #87b8ff,
    7px 7px 0 rgba(106, 163, 255, 0.16),
    0 0 18px rgba(106, 163, 255, 0.2);
}

.hero-note {
  max-width: 34rem;
  margin: 1rem 0 0;
  color: #6d7a90;
  font-size: 1.08rem;
  line-height: 1.8;
}

.hero-art {
  position: absolute;
  right: 4%;
  bottom: 0;
  width: min(44vw, 820px);
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
  filter: saturate(1.03) contrast(1.02);
  box-shadow: 0 24px 60px rgba(228, 162, 188, 0.18);
}

.hero-side {
  right: 48%;
  bottom: 10%;
  width: 28%;
  aspect-ratio: 1 / 1;
  border-radius: 24px;
  border: 6px solid rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 34px rgba(231, 177, 198, 0.22);
  transform: rotate(-7deg);
}

.hero-art-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(44px);
}

.hero-art-glow-a {
  right: 8%;
  bottom: 14%;
  width: 14rem;
  height: 14rem;
  background: rgba(255, 170, 170, 0.3);
}

.hero-art-glow-b {
  right: 42%;
  top: 18%;
  width: 8rem;
  height: 8rem;
  background: rgba(111, 170, 255, 0.22);
}

.menu-row {
  position: absolute;
  right: 1.1rem;
  bottom: 1.15rem;
  left: 1.1rem;
  gap: 1rem;
  z-index: 3;
}

.menu-card {
  flex: 1 1 11rem;
  display: grid;
  gap: 0.1rem;
  min-height: 6.6rem;
  padding: 1rem 1.1rem;
  border-radius: 24px;
  border: 2px solid rgba(255, 190, 212, 0.68);
  background: rgba(255, 255, 255, 0.84);
  color: #5a6a80;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(234, 184, 206, 0.22);
}

.menu-card strong {
  font-size: 2rem;
  font-weight: 800;
}

.menu-card span {
  color: #94a4b8;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.menu-card-accent {
  background: linear-gradient(180deg, #ff6e9e, #ff5a88);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.74);
}

.menu-card-accent span {
  color: rgba(255, 241, 246, 0.84);
}

.route-section {
  width: min(1400px, calc(100vw - 2.2rem));
  margin: 0 auto;
  padding: 0.35rem 0 1.3rem;
}

.route-section-wide {
  padding-bottom: 2rem;
}

.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-inline: 0.3rem;
}

.section-head h2 {
  margin: 0.2rem 0 0;
  color: #4d5d75;
  font-family: 'ZCOOL XiaoWei', 'STSong', 'Songti SC', serif;
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-head p:last-child {
  margin: 0;
  color: #8b98ab;
  line-height: 1.75;
}

.scene-grid,
.save-grid,
.gallery-grid,
.relation-grid,
.relation-layout {
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
  border-radius: 28px;
  border: 2px solid rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 40px rgba(233, 184, 204, 0.18);
}

.scene-card,
.save-card,
.relation-card,
.tag-panel {
  padding: 1.15rem;
}

.scene-card h3,
.save-card h3,
.relation-card h3 {
  margin: 0.5rem 0 0.45rem;
  color: #53627a;
}

.scene-card p,
.save-card p,
.relation-card p {
  margin: 0;
  color: #7b889c;
  line-height: 1.75;
}

.save-index {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  background: rgba(79, 133, 255, 0.08);
  color: #4b85ff;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.gallery-card {
  position: relative;
  min-height: 20rem;
}

.gallery-card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-card-large {
  min-height: 25rem;
}

.gallery-card-placeholder {
  display: grid;
  place-content: center;
  gap: 0.4rem;
  color: #8a9aac;
  text-align: center;
  background:
    linear-gradient(135deg, rgba(255, 224, 234, 0.62), rgba(255, 255, 255, 0.9));
}

.gallery-card-placeholder span {
  color: rgba(255, 110, 158, 0.66);
  letter-spacing: 0.12em;
  font-size: 0.78rem;
}

.relation-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.tag-panel {
  display: grid;
  align-content: start;
}

.tag-cloud {
  gap: 0.55rem;
  margin-top: 1rem;
}

.tag-pill {
  min-height: 2.15rem;
}

@media (max-width: 1200px) {
  .hero-art {
    width: min(48vw, 680px);
  }

  .scene-grid,
  .save-grid,
  .gallery-grid,
  .relation-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .stage-inner {
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
    margin-top: 1rem;
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
    border-radius: 28px;
  }

  .hero-side {
    right: auto;
    left: 0.4rem;
    bottom: 1.3rem;
    width: 7.5rem;
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
