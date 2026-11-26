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
    .where({ _dir: 'blog', draft: { $ne: true } })
    .only(['_path', 'title'])
    .sort({ date: -1 })
    .findSurround(route.path)
)

const prev = computed(() => {
  const item = surround.value?.[0]
  return item?._path?.startsWith('/blog/') ? item : null
})
const next = computed(() => {
  const item = surround.value?.[1]
  return item?._path?.startsWith('/blog/') ? item : null
})
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
      class="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] transition-colors hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:text-white"
    >
      <ArrowLeft class="h-3.5 w-3.5" />
      返回博客列表
    </NuxtLink>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <!-- Main Article -->
      <article class="bento-card min-w-0 space-y-8 p-6 sm:p-10">
        <header class="space-y-4 border-b border-black/[0.06] pb-6 dark:border-white/[0.08]">
          <h1 class="text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
            {{ doc.title }}
          </h1>

          <p v-if="doc.description" class="text-sm leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
            {{ doc.description }}
          </p>

          <div class="flex flex-wrap items-center gap-4 text-xs text-[#86868B]">
            <span v-if="doc.date" class="inline-flex items-center gap-1 font-mono tabular-nums">
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

        <div class="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-[#0071E3] prose-a:underline-offset-4 dark:prose-a:text-[#2997FF]">
          <ContentRenderer :value="doc" />
        </div>

        <!-- Prev / Next Navigation -->
        <nav
          v-if="prev || next"
          class="grid grid-cols-1 gap-3 border-t border-black/[0.06] pt-6 sm:grid-cols-2 dark:border-white/[0.08]"
        >
          <NuxtLink
            v-if="prev"
            :to="prev._path"
            class="glass-inner block p-4 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <p class="text-[11px] text-[#86868B]">← 上一篇</p>
            <p class="mt-1 truncate text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              {{ prev.title }}
            </p>
          </NuxtLink>
          <div v-else />

          <NuxtLink
            v-if="next"
            :to="next._path"
            class="glass-inner block p-4 text-right transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <p class="text-[11px] text-[#86868B]">下一篇 →</p>
            <p class="mt-1 truncate text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
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
