<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '博客',
  description: '前端工程、Vue 生态、算法思考与个人复盘笔记。'
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
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        博客文章
      </h1>
      <p class="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        平时在 Obsidian 中写作沉淀，筛选优质内容同步发布到这里。支持按标签筛选或按 <kbd class="rounded border border-zinc-200 px-1.5 py-0.5 font-mono text-[11px] dark:border-zinc-700">⌘K</kbd> 全站搜索。
      </p>

      <div class="flex flex-wrap gap-2 pt-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          type="button"
          class="rounded-xl px-3 py-1 text-xs font-medium transition"
          :class="
            activeTag === tag
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700'
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
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <span class="font-mono">{{ formatDate(post.date) }}</span>
          <span class="inline-flex items-center gap-1">
            <Clock class="h-3.5 w-3.5" />
            约 {{ estimateReadingTime(post.body) }} 分钟阅读
          </span>
        </div>

        <h2 class="text-lg font-semibold text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
          {{ post.title }}
        </h2>

        <p v-if="post.description" class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {{ post.description }}
        </p>

        <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 pt-1">
          <span v-for="tag in post.tags" :key="tag" class="pill-tag">
            #{{ tag }}
          </span>
        </div>
      </NuxtLink>

      <div v-if="filteredPosts.length === 0" class="bento-card py-12 text-center text-sm text-zinc-500">
        当前分类下暂无文章
      </div>
    </div>
  </div>
</template>
