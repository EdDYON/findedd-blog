<script lang="ts" setup>
import { defineArticle, useSchemaOrg } from '@unhead/schema-org/vue'
import dayjs from 'dayjs'
import { useFrontmatter, useSiteConfig, useValaxyI18n } from 'valaxy'

const siteConfig = useSiteConfig()
const frontmatter = useFrontmatter()

const { $t, $tO } = useValaxyI18n()
const article: Parameters<typeof defineArticle>[0] = {
  '@type': 'BlogPosting',
  'headline': $tO(frontmatter.value.title),
  'description': $tO(frontmatter.value.description),
  'author': [
    {
      name: $t(siteConfig.value.author.name),
      url: siteConfig.value.author.link,
    },
  ],
  'datePublished': dayjs(frontmatter.value.date || '').toDate(),
  'dateModified': dayjs(frontmatter.value.updated || '').toDate(),
}

const image = frontmatter.value.image || frontmatter.value.cover
if (image)
  article.image = image

useSchemaOrg(
  defineArticle(article),
)
</script>

<template>
  <YunLayoutWrapper>
    <div class="reading-shell">
      <RouterView v-slot="{ Component }">
        <component :is="Component">
          <template #main-header-after>
            <YunMainHeaderAfter />
          </template>

          <template #main-content-after>
            <YunMainContentAfter />
          </template>

          <template #aside-custom>
            <slot name="aside-custom" />
          </template>

          <template #main-footer-before>
            <ArticleInteraction />
          </template>
        </component>
      </RouterView>
    </div>

    <YunLayoutRight />
  </YunLayoutWrapper>
</template>

<style scoped>
.reading-shell {
  flex: 1;
  width: min(860px, calc(100vw - 2rem));
  min-width: 0;
}

.reading-shell :deep(.content > .yun-card),
.reading-shell :deep(.yun-post),
.reading-shell :deep(.yun-post-nav),
.reading-shell :deep(.yun-comment) {
  max-width: 100%;
}

.reading-shell :deep(.content > .yun-card) {
  padding: 1.55rem 1.8rem;
}

.reading-shell :deep(.post-header) {
  margin-bottom: 0.5rem;
}

.reading-shell :deep(.post-title) {
  padding: 0.25rem 0 !important;
  font-size: clamp(2rem, 3.8vw, 3rem) !important;
  line-height: 1.14;
}

.reading-shell :deep(.post-meta) {
  gap: 0.85rem !important;
}

.reading-shell :deep(.inline-flex.text-sm.py-1) {
  padding: 0.25rem 0 0.4rem;
}

.reading-shell :deep(.post-copyright),
.reading-shell :deep(.yun-post-nav),
.reading-shell :deep(.article-question-card),
.reading-shell :deep(.yun-comment) {
  border-radius: 24px;
}

.reading-shell :deep(.post-copyright) {
  margin-top: 1.1rem;
  padding: 1rem 1.15rem;
  border-left-width: 3px;
  background: rgba(255, 255, 255, 0.035);
}

.reading-shell :deep(.yun-post-nav) {
  margin-top: 1rem;
  padding: 0.4rem;
}

.reading-shell :deep(.post-nav-item) {
  height: auto;
  border-radius: 18px;
}

.reading-shell :deep(.post-nav-prev),
.reading-shell :deep(.post-nav-next) {
  min-height: 3.2rem;
}

.reading-shell :deep(.yun-comment) {
  margin-top: 1rem;
}

@media (max-width: 960px) {
  .reading-shell {
    width: calc(100vw - 0.8rem);
  }

  .reading-shell :deep(.content > .yun-card) {
    padding: 1.1rem 1rem;
  }

  .reading-shell :deep(.post-title) {
    font-size: clamp(1.8rem, 8vw, 2.35rem) !important;
    line-height: 1.16;
  }

  .reading-shell :deep(.post-meta) {
    gap: 0.45rem !important;
    font-size: 0.92rem;
  }

  .reading-shell :deep(.inline-flex.text-sm.py-1) {
    padding-top: 0.15rem;
    font-size: 0.9rem;
  }

  .reading-shell :deep(.post-copyright) {
    padding: 0.9rem 0.95rem;
  }
}
</style>
