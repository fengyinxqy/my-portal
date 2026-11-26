<script setup lang="ts">
import { MapPin, Sparkles } from 'lucide-vue-next'
import { nowFocus } from '~/data/now'
import { formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '动态 · Now',
  description: '记录此时此刻正在专注的事情，以及近期的阶段性进展时间线。'
})

const { data: timeline } = await useAsyncData('now-timeline', () =>
  queryContent('now')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()
)
</script>

<template>
  <div class="space-y-10">
    <!-- Top Now Focus Section -->
    <section class="space-y-5">
      <header class="space-y-2">
        <div class="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span class="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
            <Sparkles class="h-3.5 w-3.5" />
            Now Page
          </span>
          <span>· 更新于 {{ nowFocus.updatedAt }}</span>
          <span class="inline-flex items-center gap-1">
            <MapPin class="h-3.5 w-3.5" />
            {{ nowFocus.location }}
          </span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          此时此刻 · 最近在做的事
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {{ nowFocus.headline }}
        </p>
      </header>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          v-for="item in nowFocus.items"
          :key="item.title"
          class="bento-card flex flex-col justify-between gap-3"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-zinc-400">{{ item.label }}</span>
              <span class="pill-tag text-[10px]">{{ item.status }}</span>
            </div>
            <h2 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {{ item.title }}
            </h2>
            <p class="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Chronological Timeline -->
    <section class="space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          近期动态时间线
        </h2>
        <span class="text-xs text-zinc-400">
          共 {{ timeline?.length || 0 }} 条记录
        </span>
      </div>

      <div class="relative space-y-6 border-l-2 border-indigo-200/70 pl-6 dark:border-indigo-500/30">
        <article
          v-for="entry in timeline"
          :key="entry._path"
          class="relative"
        >
          <!-- Apple Blue Timeline Dot -->
          <span class="absolute -left-[31px] top-6 h-3 w-3 rounded-full border-2 border-white bg-[#007AFF] shadow-[0_0_0_4px_rgba(0,122,255,0.15)] dark:border-zinc-950" />

          <div class="bento-card space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-mono text-xs text-zinc-400">
                {{ formatDate(entry.date) }}
              </span>
              <span v-if="entry.tag" class="pill-tag">
                {{ entry.tag }}
              </span>
            </div>

            <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {{ entry.title }}
            </h3>

            <div class="prose prose-sm prose-zinc max-w-none dark:prose-invert">
              <ContentRenderer :value="entry" />
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
