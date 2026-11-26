<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '博客',
  description: '前端工程、性能治理、AI 研发效能与个人思考笔记。'
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
    <header class="space-y-3">
      <h1 class="text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
        博客文章
      </h1>
      <p class="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        平时在 Obsidian 中写作沉淀，筛选优质内容同步发布到这里。支持按标签筛选或按 <kbd class="rounded-full border border-slate-200 bg-white/80 px-2 py-0.5 font-mono text-[11px] dark:border-white/15 dark:bg-white/10">⌘K</kbd> 全站搜索。
      </p>

      <div class="inline-flex flex-wrap gap-1.5 rounded-full border border-white/80 bg-white/60 p-1.5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="rounded-full px-3.5 py-1 text-xs font-medium transition-all duration-200 ease-apple"
          :class="
            activeTag === tag
              ? 'bg-gradient-to-b from-[#1A88FF] to-[#007AFF] text-white shadow-[0_2px_10px_rgba(0,122,255,0.3)]'
              : 'text-slate-600 hover:bg-white/70 hover:text-[#1D1D1F] dark:text-zinc-300 dark:hover:bg-white/10'
          "
          @click="activeTag = tag"
        >
          {{ tag === '全部' ? '全部' : `#${tag}` }}
        </button>
      </div>
    </header>

    <div class="space-y-4">
      <NuxtLink
        v-for="post in filteredPosts"
        :key="post._path"
        :to="post._path"
        class="bento-card-interactive group block space-y-2.5"
      >
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <span class="font-mono tabular-nums">{{ formatDate(post.date) }}</span>
          <span class="inline-flex items-center gap-1">
            <Clock class="h-3.5 w-3.5" />
            约 {{ estimateReadingTime(post.body) }} 分钟阅读
          </span>
        </div>

        <h2 class="text-lg font-bold tracking-[-0.015em] text-[#1D1D1F] transition group-hover:text-[#007AFF] dark:text-[#F5F5F7]">
          {{ post.title }}
        </h2>

        <p v-if="post.description" class="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          {{ post.description }}
        </p>

        <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 pt-1">
          <span v-for="tag in post.tags" :key="tag" class="pill-tag">
            #{{ tag }}
          </span>
        </div>
      </NuxtLink>

      <div v-if="filteredPosts.length === 0" class="bento-card py-12 text-center text-sm text-slate-500">
        当前分类下暂无文章
      </div>
    </div>
  </div>
</template>
