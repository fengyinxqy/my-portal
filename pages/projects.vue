<script setup lang="ts">
import { ArrowUpRight, Github } from 'lucide-vue-next'
import { portfolioProjects } from '~/data/projects'

useSeoMeta({
  title: '项目作品集',
  description: '精选前端 Web 应用、开源项目与工程化工具展示。'
})

const categories = ['全部', '开源作品', '性能治理', 'AI 工程化', '平台与跨端'] as const
const activeCategory = ref<(typeof categories)[number]>('全部')

const filteredProjects = computed(() => {
  if (activeCategory.value === '全部') return portfolioProjects
  return portfolioProjects.filter((p) => p.category === activeCategory.value)
})
</script>

<template>
  <div class="space-y-8">
    <header class="space-y-3">
      <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        项目作品集
      </h1>
      <p class="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        这里收录了我独立开发或主导的代表性项目，涵盖 Web 应用、开源组件和效率工程工具。
      </p>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2 pt-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-xl px-3.5 py-1.5 text-xs font-medium transition"
          :class="
            activeCategory === cat
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700'
          "
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-5">
      <article
        v-for="project in filteredProjects"
        :id="project.slug"
        :key="project.slug"
        class="bento-card scroll-mt-24 space-y-4"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-xs text-zinc-400">
              <span class="pill-tag">{{ project.category }}</span>
              <span class="font-mono">{{ project.year }}</span>
              <span>· {{ project.role }}</span>
            </div>
            <h2 class="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {{ project.title }}
            </h2>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              在线体验
              <ArrowUpRight class="h-3.5 w-3.5" />
            </a>
            <a
              v-if="project.repoUrl"
              :href="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Github class="h-3.5 w-3.5" />
              源码
            </a>
          </div>
        </div>

        <p class="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {{ project.summary }}
        </p>

        <ul class="list-disc space-y-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li v-for="point in project.highlights" :key="point">
            {{ point }}
          </li>
        </ul>

        <div class="flex flex-wrap gap-1.5 pt-1">
          <span v-for="tech in project.tech" :key="tech" class="pill-tag">
            {{ tech }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>
