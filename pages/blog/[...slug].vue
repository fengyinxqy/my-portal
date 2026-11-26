<script setup lang="ts">
import { ArrowLeft, Calendar, Clock } from 'lucide-vue-next'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

const route = useRoute()

const { data: doc } = await useAsyncData(`blog-${route.path}`, () =>
  queryContent(route.path).findOne()
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const { data: surround } = await useAsyncData(`blog-surround-${route.path}`, () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .only(['_path', 'title'])
    .sort({ date: -1 })
    .findSurround(route.path)
)

const prev = computed(() => surround.value?.[0])
const next = computed(() => surround.value?.[1])
const readingMinutes = computed(() => estimateReadingTime(doc.value?.body))

useSeoMeta({
  title: doc.value.title,
  description: doc.value.description,
  ogTitle: doc.value.title,
  ogDescription: doc.value.description,
  ogType: 'article'
})
</script>

<template>
  <div v-if="doc" class="space-y-8">
    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      <ArrowLeft class="h-3.5 w-3.5" />
      返回博客列表
    </NuxtLink>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <!-- Main Article -->
      <article class="min-w-0 space-y-8">
        <header class="space-y-4 border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
          <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
            {{ doc.title }}
          </h1>

          <p v-if="doc.description" class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {{ doc.description }}
          </p>

          <div class="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span v-if="doc.date" class="inline-flex items-center gap-1 font-mono">
              <Calendar class="h-3.5 w-3.5" />
              {{ formatDate(doc.date) }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Clock class="h-3.5 w-3.5" />
              约 {{ readingMinutes }} 分钟阅读
            </span>
          </div>

          <div v-if="doc.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="tag in doc.tags" :key="tag" class="pill-tag">
              #{{ tag }}
            </span>
          </div>
        </header>

        <div class="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-zinc-900 prose-a:underline-offset-4 dark:prose-a:text-zinc-100">
          <ContentRenderer :value="doc" />
        </div>

        <!-- Prev / Next Navigation -->
        <nav
          v-if="prev || next"
          class="grid grid-cols-1 gap-3 border-t border-zinc-200/80 pt-6 sm:grid-cols-2 dark:border-zinc-800"
        >
          <NuxtLink
            v-if="prev"
            :to="prev._path"
            class="bento-card-interactive p-4"
          >
            <p class="text-[11px] text-zinc-400">← 上一篇</p>
            <p class="mt-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {{ prev.title }}
            </p>
          </NuxtLink>
          <div v-else />

          <NuxtLink
            v-if="next"
            :to="next._path"
            class="bento-card-interactive p-4 text-right"
          >
            <p class="text-[11px] text-zinc-400">下一篇 →</p>
            <p class="mt-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {{ next.title }}
            </p>
          </NuxtLink>
        </nav>
      </article>

      <!-- Sticky TOC Sidebar -->
      <BlogToc :links="doc.body?.toc?.links || []" />
    </div>
  </div>
</template>
