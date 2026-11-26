<script setup lang="ts">
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  Clock,
  Copy,
  FileText,
  Gauge,
  Github,
  Mail,
  MapPin,
  MessageSquare,
  Network,
  Package,
  Smartphone,
  Sparkles,
  Timer
} from 'lucide-vue-next'
import { profile } from '~/data/profile'
import { portfolioProjects, projectTintStyles, type ProjectIconKey } from '~/data/projects'
import { nowFocus } from '~/data/now'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '首页',
  description: profile.tagline,
  ogTitle: `${profile.name} · ${profile.role}`,
  ogDescription: profile.tagline
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

const copiedEmail = ref(false)
const copiedWechat = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copiedEmail.value = true
    setTimeout(() => {
      copiedEmail.value = false
    }, 1800)
  } catch {
    // ignore
  }
}

async function copyWechat() {
  try {
    await navigator.clipboard.writeText(profile.wechatId)
    copiedWechat.value = true
    setTimeout(() => {
      copiedWechat.value = false
    }, 1800)
  } catch {
    // ignore
  }
}

const featuredProjects = computed(() => portfolioProjects.filter((p) => p.featured).slice(0, 4))

const { data: latestPosts } = await useAsyncData('home-latest-posts', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .limit(3)
    .find()
)

const { data: latestUpdates } = await useAsyncData('home-latest-now', () =>
  queryContent('now')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .limit(2)
    .find()
)
</script>

<template>
  <div class="space-y-8">
    <!-- Top Aurora Bento Grid -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-12">
      <!-- Hero Bio Glass Card (8 cols) -->
      <div class="bento-card md:col-span-8 flex flex-col justify-between gap-6">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300">
              <span class="h-1.5 w-1.5 rounded-full bg-[#007AFF] animate-pulse" />
              {{ profile.availability }}
            </span>
            <span class="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
              <MapPin class="h-3.5 w-3.5 text-[#007AFF]" />
              {{ profile.location }}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <span class="shrink-0 rounded-[22px] p-[2px] bg-gradient-to-tr from-[#007AFF] via-[#5856D6] to-[#32ADE6] shadow-[0_8px_20px_rgba(0,122,255,0.22)]">
              <img
                :src="profile.avatar"
                :alt="profile.name"
                class="h-16 w-16 rounded-[20px] object-cover bg-white dark:bg-zinc-900"
              />
            </span>
            <div>
              <h1 class="text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
                你好，我是
                <span class="bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#32ADE6] bg-clip-text text-transparent">
                  {{ profile.name }}
                </span>
              </h1>
              <p class="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-400">
                {{ profile.role }}
              </p>
            </div>
          </div>

          <p class="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-zinc-300">
            {{ profile.tagline }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink to="/resume" class="apple-btn-primary">
            <FileText class="h-4 w-4" />
            查看在线简历
          </NuxtLink>
          <NuxtLink to="/projects" class="apple-btn-secondary">
            浏览作品集
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Performance Highlights Glass Widget (4 cols) -->
      <div class="bento-card md:col-span-4 flex flex-col justify-between gap-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
            工程亮点 · Metrics
          </span>
          <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            MDN PR
          </span>
        </div>

        <div class="space-y-3">
          <div class="glass-inner p-3.5">
            <div class="font-mono text-xl font-bold tabular-nums bg-gradient-to-r from-[#007AFF] to-[#5856D6] bg-clip-text text-transparent">
              47s → 600ms
            </div>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
              1000×1000+ 超宽表格横向虚拟滚动治理
            </p>
          </div>

          <div class="glass-inner p-3.5">
            <div class="font-mono text-xl font-bold tabular-nums bg-gradient-to-r from-[#5856D6] to-[#FF2D55] bg-clip-text text-transparent">
              14s → 300ms
            </div>
            <p class="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
              数据门户 ECharts 渲染链路与防抖优化
            </p>
          </div>
        </div>

        <p class="text-[11px] text-slate-400 dark:text-zinc-500">
          AI 三级 Review 耗时 -30% · 增量覆盖率 ≥ 95%
        </p>
      </div>

      <!-- Now Focus Card (4 cols) -->
      <NuxtLink to="/now" class="bento-card-interactive md:col-span-4 group flex flex-col justify-between gap-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles class="h-3.5 w-3.5 text-amber-500" />
              近期专注 · Now
            </span>
            <ArrowUpRight class="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#007AFF]" />
          </div>

          <ul class="space-y-2.5">
            <li v-for="item in nowFocus.items.slice(0, 3)" :key="item.title" class="space-y-0.5">
              <p class="text-[11px] font-medium text-indigo-500/80 dark:text-indigo-400">{{ item.label }}</p>
              <p class="text-sm font-medium text-[#1D1D1F] dark:text-zinc-200 line-clamp-1">
                {{ item.title }}
              </p>
            </li>
          </ul>
        </div>

        <p class="text-xs text-slate-400">
          更新于 {{ nowFocus.updatedAt }}
        </p>
      </NuxtLink>

      <!-- Tech Stack Card (4 cols) -->
      <div class="bento-card md:col-span-4 flex flex-col justify-between gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            核心技术栈
          </h2>
          <NuxtLink to="/resume" class="text-xs font-medium text-[#007AFF] hover:underline">
            完整矩阵 →
          </NuxtLink>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span v-for="skill in profile.coreSkills" :key="skill" class="pill-tag px-2.5 py-1 text-xs">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Contact Card (4 cols) -->
      <div class="bento-card md:col-span-4 flex flex-col justify-between gap-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
          联系与社交
        </h2>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="glass-inner flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-white dark:text-zinc-200 dark:hover:bg-white/10"
            @click="copyEmail"
          >
            <span class="inline-flex items-center gap-2 truncate">
              <Mail class="h-3.5 w-3.5 shrink-0 text-[#007AFF]" />
              <span class="truncate">{{ profile.email }}</span>
            </span>
            <Check v-if="copiedEmail" class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <Copy v-else class="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </button>

          <button
            type="button"
            class="glass-inner flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-white dark:text-zinc-200 dark:hover:bg-white/10"
            @click="copyWechat"
          >
            <span class="inline-flex items-center gap-2 truncate">
              <MessageSquare class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span class="truncate">微信：{{ profile.wechatId }}</span>
            </span>
            <Check v-if="copiedWechat" class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <Copy v-else class="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </button>

          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="glass-inner flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-white dark:text-zinc-200 dark:hover:bg-white/10"
          >
            <span class="inline-flex items-center gap-2">
              <Github class="h-3.5 w-3.5 text-slate-600 dark:text-zinc-300" />
              GitHub 主页
            </span>
            <ArrowUpRight class="h-3.5 w-3.5 text-slate-400" />
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Projects (2x2 Apple App-Icon Cards) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-lg font-bold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
          精选项目
        </h2>
        <NuxtLink to="/projects" class="inline-flex items-center gap-1 text-xs font-medium text-[#007AFF] hover:underline">
          查看全部项目
          <ArrowRight class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="project in featuredProjects"
          :key="project.slug"
          :to="`/projects#${project.slug}`"
          class="bento-card-interactive group flex flex-col justify-between gap-4"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3.5">
                <!-- macOS Squircle App Icon Badge -->
                <span
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ring-1 ring-inset ring-white/40 transition-transform duration-300 ease-apple group-hover:scale-105"
                  :class="projectTintStyles[project.tint].badge"
                >
                  <component :is="iconMap[project.iconKey]" class="h-5 w-5" />
                </span>
                <div>
                  <h3 class="text-base font-semibold tracking-tight text-[#1D1D1F] transition group-hover:text-[#007AFF] dark:text-[#F5F5F7]">
                    {{ project.title }}
                  </h3>
                  <p class="mt-0.5 text-xs font-medium" :class="projectTintStyles[project.tint].text">
                    {{ project.category }} · {{ project.year }}
                  </p>
                </div>
              </div>
              <ArrowUpRight class="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#007AFF]" />
            </div>

            <p class="text-xs leading-relaxed text-slate-600 line-clamp-2 dark:text-zinc-400">
              {{ project.summary }}
            </p>
          </div>

          <div class="flex flex-wrap gap-1.5">
            <span v-for="t in project.tech.slice(0, 4)" :key="t" class="pill-tag">
              {{ t }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Latest Blog + Recent Now Timeline -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- Latest Blog Posts -->
      <div class="bento-card md:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
            最新文章
          </h2>
          <NuxtLink to="/blog" class="text-xs font-medium text-[#007AFF] hover:underline">
            全部文章 →
          </NuxtLink>
        </div>

        <div class="divide-y divide-slate-200/60 dark:divide-white/10">
          <NuxtLink
            v-for="post in latestPosts"
            :key="post._path"
            :to="post._path"
            class="group block py-3.5 first:pt-1 last:pb-0"
          >
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="text-sm font-semibold text-[#1D1D1F] transition group-hover:text-[#007AFF] dark:text-[#F5F5F7]">
                {{ post.title }}
              </h3>
              <span class="shrink-0 font-mono text-xs tabular-nums text-slate-400">
                {{ formatDate(post.date) }}
              </span>
            </div>
            <p v-if="post.description" class="mt-1 text-xs text-slate-500 line-clamp-1 dark:text-zinc-400">
              {{ post.description }}
            </p>
            <div class="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <Clock class="h-3 w-3" />
                约 {{ estimateReadingTime(post.body) }} 分钟
              </span>
              <span v-for="tag in (post.tags || []).slice(0, 2)" :key="tag" class="text-indigo-500/80 dark:text-indigo-400">
                #{{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Now Timeline -->
      <div class="bento-card space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
            近期动态
          </h2>
          <NuxtLink to="/now" class="text-xs font-medium text-[#007AFF] hover:underline">
            时间线 →
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="item in latestUpdates"
            :key="item._path"
            to="/now"
            class="glass-inner block p-3.5 transition hover:bg-white/90 dark:hover:bg-white/10"
          >
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="font-mono tabular-nums">{{ formatDate(item.date) }}</span>
              <span v-if="item.tag" class="pill-tag text-[10px]">{{ item.tag }}</span>
            </div>
            <p class="mt-1.5 text-sm font-medium text-[#1D1D1F] dark:text-zinc-200">
              {{ item.title }}
            </p>
            <p v-if="item.description" class="mt-1 text-xs text-slate-500 line-clamp-2 dark:text-zinc-400">
              {{ item.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
