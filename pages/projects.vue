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
  title: '项目',
  description: '个人开源作品与前端工程实践项目。'
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
    <header class="space-y-4">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold tracking-[-0.03em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
          项目
        </h1>
        <p class="max-w-2xl text-sm leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
          业余做的开源小工具，以及工作期间负责过的核心前端项目。
        </p>
      </div>

      <!-- Clean Wrapping Filter Pills (No outer stadium capsule!) -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
          :class="
            activeCategory === cat
              ? 'bg-[#1D1D1F] text-white shadow-sm dark:bg-[#F5F5F7] dark:text-[#1D1D1F]'
              : 'glass-pill-btn'
          "
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4">
      <article
        v-for="project in filteredProjects"
        :id="project.slug"
        :key="project.slug"
        class="bento-card scroll-mt-20 space-y-4"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-3.5">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              :class="projectTintStyles[project.tint].badge"
            >
              <component :is="iconMap[project.iconKey]" class="h-5 w-5" />
            </span>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2 text-xs text-[#86868B]">
                <span>{{ project.category }}</span>
                <span>·</span>
                <span class="font-mono tabular-nums">{{ project.year }}</span>
                <span>· {{ project.role }}</span>
              </div>
              <h2 class="text-lg font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
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
              class="apple-btn-primary px-3.5 py-1.5 text-xs"
            >
              在线体验
              <ArrowUpRight class="h-3.5 w-3.5" />
            </a>
            <a
              v-if="project.repoUrl"
              :href="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="apple-btn-secondary px-3.5 py-1.5 text-xs"
            >
              <Github class="h-3.5 w-3.5" />
              源码
            </a>
          </div>
        </div>

        <p class="text-sm leading-relaxed text-[#515154] dark:text-[#D1D1D6]">
          {{ project.summary }}
        </p>

        <ul class="list-disc space-y-1.5 pl-5 text-sm text-[#515154] dark:text-[#A1A1A6]">
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
