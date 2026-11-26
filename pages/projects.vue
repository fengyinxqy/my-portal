<script setup lang="ts">
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bot,
  Gauge,
  Github,
  Network,
  Package,
  Smartphone,
  Sparkles,
  Timer
} from 'lucide-vue-next'
import { portfolioProjects, projectTintStyles, type ProjectIconKey } from '~/data/projects'

useSeoMeta({
  title: '项目作品集',
  description: '精选开源作品、浏览器性能治理、AI 工程化与跨端平台项目展示。'
})

const iconMap: Record<ProjectIconKey, Component> = {
  smartphone: Smartphone,
  package: Package,
  timer: Timer,
  network: Network,
  sparkles: Sparkles,
  gauge: Gauge,
  activity: Activity,
  bot: Bot,
  'bar-chart': BarChart3
}

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
      <h1 class="text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
        项目作品集
      </h1>
      <p class="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
        收录个人独立开源作品与企业级核心工程项目，涵盖性能治理、AI 工程化与跨端桌面/小程序实践。
      </p>

      <!-- Apple Segmented Filter Bar -->
      <div class="inline-flex flex-wrap gap-1.5 rounded-full border border-white/80 bg-white/60 p-1.5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ease-apple"
          :class="
            activeCategory === cat
              ? 'bg-gradient-to-b from-[#1A88FF] to-[#007AFF] text-white shadow-[0_2px_10px_rgba(0,122,255,0.3)]'
              : 'text-slate-600 hover:bg-white/70 hover:text-[#1D1D1F] dark:text-zinc-300 dark:hover:bg-white/10'
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
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-4">
            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] ring-1 ring-inset ring-white/40"
              :class="projectTintStyles[project.tint].badge"
            >
              <component :is="iconMap[project.iconKey]" class="h-6 w-6" />
            </span>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span class="font-semibold" :class="projectTintStyles[project.tint].text">{{ project.category }}</span>
                <span>·</span>
                <span class="font-mono tabular-nums">{{ project.year }}</span>
                <span>· {{ project.role }}</span>
              </div>
              <h2 class="text-xl font-bold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
                {{ project.title }}
              </h2>
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="apple-btn-primary px-4 py-1.5 text-xs"
            >
              在线体验
              <ArrowUpRight class="h-3.5 w-3.5" />
            </a>
            <a
              v-if="project.repoUrl"
              :href="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="apple-btn-secondary px-4 py-1.5 text-xs"
            >
              <Github class="h-3.5 w-3.5" />
              源码
            </a>
          </div>
        </div>

        <p class="text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
          {{ project.summary }}
        </p>

        <ul class="list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-zinc-300">
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
