<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { monthlyFavorites, musicConfig, type MusicTrack } from '../data/music'

const props = withDefaults(defineProps<{
  expanded?: boolean
}>(), {
  expanded: false,
})

const loading = ref(false)
const errorMessage = ref('')
const recentTracks = ref<MusicTrack[]>([])

const recentLimit = computed(() => props.expanded ? Math.max(musicConfig.recentLimit, 8) : musicConfig.recentLimit)
const visibleRecentTracks = computed(() => recentTracks.value.slice(0, recentLimit.value))
const visibleMonthlyFavorites = computed(() => props.expanded ? monthlyFavorites : monthlyFavorites.slice(0, 3))
const showMonthlyFavorites = computed(() => visibleMonthlyFavorites.value.length > 0)
const apiReady = computed(() => Boolean(musicConfig.endpoint.trim()))

function pickString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim())
      return value.trim()
  }

  return ''
}

function pickArtists(raw: any) {
  const artistSource = raw?.ar
    || raw?.artists
    || raw?.song?.ar
    || raw?.song?.artists
    || raw?.resourceExtInfo?.artists
    || raw?.data?.artists

  if (Array.isArray(artistSource)) {
    const names = artistSource
      .map(artist => pickString(artist?.name, artist))
      .filter(Boolean)

    if (names.length)
      return names.join(' / ')
  }

  return pickString(raw?.artist, raw?.author, raw?.creator)
}

function normalizeTrack(raw: any): MusicTrack | null {
  const song = raw?.song || raw?.resourceExtInfo?.songData || raw
  const id = song?.id || raw?.id
  const title = pickString(song?.name, raw?.name, raw?.title)
  const artist = pickArtists(song) || pickArtists(raw)

  if (!title || !artist)
    return null

  const album = pickString(song?.al?.name, raw?.al?.name, song?.album?.name, raw?.album?.name)
  const cover = pickString(song?.al?.picUrl, raw?.al?.picUrl, song?.album?.picUrl, raw?.album?.picUrl)
  const link = id ? `https://music.163.com/#/song?id=${id}` : pickString(raw?.link, song?.link)

  return {
    title,
    artist,
    album,
    cover,
    link,
  }
}

function extractTrackList(payload: any) {
  const candidates = [
    payload?.data?.list,
    payload?.data?.weekData,
    payload?.data?.allData,
    payload?.data?.songs,
    payload?.weekData,
    payload?.allData,
    payload?.list,
    payload?.songs,
    payload?.playlist?.tracks,
    payload?.data,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate))
      return candidate
  }

  return []
}

async function loadRecentTracks() {
  if (!apiReady.value)
    return

  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(musicConfig.endpoint, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok)
      throw new Error(`HTTP ${response.status}`)

    const payload = await response.json()
    const normalizedTracks = extractTrackList(payload)
      .map(normalizeTrack)
      .filter((track): track is MusicTrack => Boolean(track))

    recentTracks.value = normalizedTracks

    if (!normalizedTracks.length) {
      errorMessage.value = '接口有返回，但这次没解析出歌曲列表。'
    }
  }
  catch {
    errorMessage.value = '最近在听暂时没拉到，可能是接口没开 CORS 或返回结构不一样。'
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecentTracks()
})
</script>

<template>
  <section class="music-board" :class="{ 'music-board-expanded': expanded }">
    <div class="music-board-grid" :class="{ 'music-board-grid-single': !showMonthlyFavorites }">
      <article class="music-panel">
        <div class="music-panel-head">
          <div>
            <p class="mini-label">最近在听</p>
            <h3>网易云最近循环</h3>
          </div>
          <a
            v-if="musicConfig.profileUrl"
            class="music-link"
            :href="musicConfig.profileUrl"
            target="_blank"
            rel="noreferrer"
          >
            去主页看看
          </a>
        </div>

        <p class="music-copy">这里会用你自己填的接口拉最近在听，适合挂在首页当一个活着的小角落。</p>

        <div v-if="loading" class="music-empty">
          正在拉最近在听...
        </div>

        <div v-else-if="visibleRecentTracks.length" class="track-list">
          <a
            v-for="track in visibleRecentTracks"
            :key="`${track.title}-${track.artist}`"
            class="track-card"
            :href="track.link || musicConfig.profileUrl || '#'"
            target="_blank"
            rel="noreferrer"
          >
            <img v-if="track.cover" class="track-cover" :src="track.cover" :alt="track.title" loading="lazy">
            <div v-else class="track-cover track-cover-fallback">♪</div>

            <div class="track-copy">
              <strong>{{ track.title }}</strong>
              <span>{{ track.artist }}</span>
              <small v-if="track.album">{{ track.album }}</small>
            </div>
          </a>
        </div>

        <div v-else class="music-empty">
          <template v-if="apiReady">
            这里已经准备好拉接口了，等接口返回歌曲后就会显示。
          </template>
          <template v-else>
            把 `data/music.ts` 里的 `endpoint` 填上，这里就会自动显示最近在听。
          </template>
        </div>

        <p v-if="errorMessage" class="music-tip">{{ errorMessage }}</p>
      </article>

      <article v-if="showMonthlyFavorites" class="music-panel">
        <div class="music-panel-head">
          <div>
            <p class="mini-label">每月最爱</p>
            <h3>这个月最想留住的几首</h3>
          </div>
        </div>

        <p class="music-copy">这一块完全手写。你每个月挑几首歌，再写一句为什么喜欢，就会比纯歌单更像你。</p>

        <div v-if="visibleMonthlyFavorites.length" class="monthly-list">
          <article v-for="item in visibleMonthlyFavorites" :key="`${item.month}-${item.title}`" class="monthly-card">
            <div class="monthly-meta">
              <span>{{ item.month }}</span>
              <a v-if="item.link" :href="item.link" target="_blank" rel="noreferrer">去听</a>
            </div>
            <h4>{{ item.title }}</h4>
            <p class="monthly-artist">{{ item.artist }}</p>
            <p class="monthly-reason">{{ item.reason }}</p>
          </article>
        </div>

        <div v-else class="music-empty">
          这里先留给你。以后只要往 `data/music.ts` 里继续加每个月最爱的歌就行。
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.music-board {
  display: grid;
  gap: 1rem;
}

.music-board-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.music-board-grid-single {
  grid-template-columns: 1fr;
}

.music-panel {
  border-radius: 28px;
  padding: 1.25rem;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
    rgba(8, 14, 25, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 60px rgba(5, 10, 20, 0.26);
  backdrop-filter: blur(18px);
}

.music-panel-head {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.music-panel h3,
.monthly-card h4 {
  margin: 0;
  color: #fff;
}

.music-copy,
.monthly-reason {
  color: rgba(240, 244, 255, 0.74);
  line-height: 1.8;
}

.music-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.35rem;
  border-radius: 999px;
  padding: 0 0.9rem;
  border: 1px solid rgba(255, 196, 230, 0.18);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  text-decoration: none;
}

.track-list,
.monthly-list {
  display: grid;
  gap: 0.85rem;
  margin-top: 1rem;
}

.track-card {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 0.9rem;
  align-items: center;
  padding: 0.8rem;
  border-radius: 22px;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.track-card:hover,
.music-link:hover {
  transform: translateY(-2px);
  border-color: rgba(145, 215, 255, 0.24);
  background: rgba(255, 255, 255, 0.07);
}

.track-cover {
  width: 4rem;
  height: 4rem;
  border-radius: 18px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.06);
}

.track-cover-fallback {
  display: grid;
  place-items: center;
  color: #fff4fb;
  font-size: 1.35rem;
}

.track-copy {
  display: grid;
  gap: 0.18rem;
}

.track-copy strong,
.monthly-artist {
  color: #fff;
}

.track-copy span,
.track-copy small,
.music-tip,
.monthly-meta span,
.monthly-meta a {
  color: rgba(240, 244, 255, 0.68);
}

.monthly-card {
  border-radius: 22px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.monthly-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.45rem;
}

.monthly-meta a {
  text-decoration: none;
}

.monthly-artist {
  margin: 0.35rem 0 0.45rem;
}

.music-empty {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.14);
  color: rgba(240, 244, 255, 0.72);
  line-height: 1.8;
}

.music-tip {
  margin: 0.85rem 0 0;
}

@media (max-width: 900px) {
  .music-board-grid {
    grid-template-columns: 1fr;
  }

  .music-panel-head {
    flex-direction: column;
  }
}
</style>





