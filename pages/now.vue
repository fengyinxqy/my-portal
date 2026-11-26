<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { nowFocus } from '~/data/now'
import { formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '动态',
  description: '记录最近在做的事情和阶段性进展。'
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
    <!-- Top Focus Section -->
    <section class="space-y-5">
      <header class="space-y-2">
        <div class="flex flex-wrap items-center gap-3 text-xs text-[#86868B]">
          <span class="font-mono tabular-nums">更新于 {{ nowFocus.updatedAt }}</span>
          <span class="inline-flex items-center gap-1">
            <MapPin class="h-3.5 w-3.5" />
            {{ nowFocus.location }}
          </span>
        </div>
        <h1 class="text-2xl font-bold tracking-[-0.03em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
          最近在做什么
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
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
              <span class="text-xs font-medium text-[#86868B]">{{ item.label }}</span>
              <span class="pill-tag text-[10px]">{{ item.status }}</span>
            </div>
            <h2 class="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {{ item.title }}
            </h2>
            <p class="text-xs leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Chronological Timeline -->
    <section class="space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
          时间线
        </h2>
        <span class="text-xs text-[#86868B]">
          共 {{ timeline?.length || 0 }} 条
        </span>
      </div>

      <div class="relative space-y-5 border-l border-black/[0.1] pl-6 dark:border-white/[0.12]">
        <article
          v-for="entry in timeline"
          :key="entry._path"
          class="relative"
        >
          <span class="absolute -left-[29px] top-6 h-2.5 w-2.5 rounded-full border-2 border-[#F5F5F7] bg-[#0071E3] dark:border-black dark:bg-[#2997FF]" />

          <div class="bento-card space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-mono text-xs tabular-nums text-[#86868B]">
                {{ formatDate(entry.date) }}
              </span>
              <span v-if="entry.tag" class="pill-tag">
                {{ entry.tag }}
              </span>
            </div>

            <h3 class="text-base font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
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
