<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '博客',
  description: '个人笔记、技术思考与日常随笔。'
})

const { data: posts } = await useAsyncData('blog-list', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()
)

const activeTag = ref('全部')

const allTags = computed(() => {
  const set = new Set<string>()
  for (const post of posts.value || []) {
    if (Array.isArray(post.tags)) {
      for (const t of post.tags) set.add(String(t))
    }
  }
  return ['全部', ...Array.from(set)]
})

const filteredPosts = computed(() => {
  const list = posts.value || []
  if (activeTag.value === '全部') return list
  return list.filter((p) => Array.isArray(p.tags) && p.tags.includes(activeTag.value))
})
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-4">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold tracking-[-0.03em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
          博客
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
          平时记在 Obsidian 里，挑出整理好的笔记同步到这里。<span class="hidden sm:inline">按 <kbd class="rounded border border-black/[0.1] bg-white px-1.5 py-0.5 font-mono text-[11px] dark:border-white/15 dark:bg-[#1C1C1E]">⌘K</kbd> 可快速搜索。</span>
        </p>
      </div>

      <!-- Clean Individual Tag Pills (Fixes wrapped multi-line oval distortion on mobile) -->
      <div v-if="allTags.length > 1" class="flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
          :class="
            activeTag === tag
              ? 'bg-[#1D1D1F] text-white shadow-sm dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
              : 'glass-pill-btn'
          "
          @click="activeTag = tag"
        >
          {{ tag === '全部' ? '全部' : `#${tag}` }}
        </button>
      </div>
    </header>

    <!-- Apple Editorial Grouped List -->
    <div v-if="filteredPosts.length > 0" class="bento-card p-0 overflow-hidden divide-y divide-black/[0.06] dark:divide-white/[0.08]">
      <NuxtLink
        v-for="post in filteredPosts"
        :key="post._path"
        :to="post._path"
        class="group block px-5 py-5 sm:px-6 sm:py-6 transition-colors hover:bg-black/[0.015] dark:hover:bg-white/[0.03]"
      >
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-[#86868B]">
          <span class="font-mono tabular-nums">{{ formatDate(post.date) }}</span>
          <span class="inline-flex items-center gap-1">
            <Clock class="h-3.5 w-3.5" />
            约 {{ estimateReadingTime(post.body) }} 分钟
          </span>
        </div>

        <h2 class="mt-2 text-lg font-semibold tracking-[-0.015em] text-[#1D1D1F] transition-colors group-hover:text-[#0071E3] dark:text-[#F5F5F7] dark:group-hover:text-[#2997FF]">
          {{ post.title }}
        </h2>

        <p v-if="post.description" class="mt-1.5 text-sm leading-relaxed text-[#6E6E73] line-clamp-2 dark:text-[#A1A1A6]">
          {{ post.description }}
        </p>

        <div v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="tag in post.tags" :key="tag" class="pill-tag">
            #{{ tag }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div v-else class="bento-card py-12 text-center text-sm text-[#6E6E73]">
      这个标签下暂时没有文章
    </div>
  </div>
</template>
