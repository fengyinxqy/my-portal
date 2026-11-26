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
    .limit(4)
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
  <div class="space-y-10">
    <!-- Top Section: Hero + Key Numbers -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-12">
      <!-- Hero Card (8 cols) -->
      <div class="bento-card md:col-span-8 flex flex-col justify-between gap-6">
        <div class="space-y-4">
          <div class="flex items-center gap-3.5">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="h-12 w-12 shrink-0 rounded-full border border-black/[0.08] object-cover dark:border-white/15"
            />
            <div>
              <div class="text-base font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                {{ profile.name }}
              </div>
              <div class="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                <span>{{ profile.role }}</span>
                <span class="inline-flex items-center gap-1">
                  <MapPin class="h-3 w-3" />
                  {{ profile.location }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2 pt-1">
            <h1 class="text-2xl font-bold tracking-[-0.03em] text-[#1D1D1F] sm:text-[26px] leading-snug dark:text-[#F5F5F7]">
              {{ profile.slogan }}
            </h1>
            <p class="max-w-xl text-sm leading-relaxed text-[#515154] dark:text-[#C7C7CC]">
              {{ profile.tagline }}
            </p>
          </div>
        </div>

        <div>
          <NuxtLink to="/resume" class="apple-btn-primary">
            <FileText class="h-4 w-4" />
            查看简历
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Spec Card: Engineering Results (4 cols) -->
      <div class="bento-card md:col-span-4 flex flex-col justify-between gap-5">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold text-[#86868B]">
              代表成果
            </h2>
            <span class="text-xs text-[#6E6E73] dark:text-[#86868B]">MDN 贡献者</span>
          </div>

          <div class="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
            <div class="pb-3.5">
              <div class="font-mono text-xl font-semibold tracking-tight tabular-nums text-[#1D1D1F] dark:text-[#F5F5F7]">
                47s <span class="text-[#86868B] font-normal">→</span> 600ms
              </div>
              <p class="mt-0.5 text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                超宽表格单实例复用与横向虚拟滚动
              </p>
            </div>

            <div class="pt-3.5">
              <div class="font-mono text-xl font-semibold tracking-tight tabular-nums text-[#1D1D1F] dark:text-[#F5F5F7]">
                14s <span class="text-[#86868B] font-normal">→</span> 300ms
              </div>
              <p class="mt-0.5 text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                数据门户 ECharts 渲染链路治理
              </p>
            </div>
          </div>
        </div>

        <p class="text-xs text-[#86868B]">
          AI Review 耗时约 -30% · 增量覆盖率 ≥ 95%
        </p>
      </div>

      <!-- Now Card (4 cols) -->
      <NuxtLink to="/now" class="bento-card-interactive md:col-span-4 group flex flex-col justify-between gap-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#86868B]">
              最近在做什么
            </span>
            <ArrowUpRight class="h-4 w-4 text-[#86868B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0071E3] dark:group-hover:text-[#2997FF]" />
          </div>

          <ul class="space-y-2.5">
            <li v-for="item in nowFocus.items.slice(0, 3)" :key="item.title" class="space-y-0.5">
              <p class="text-[11px] text-[#86868B]">{{ item.label }}</p>
              <p class="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] line-clamp-1">
                {{ item.title }}
              </p>
            </li>
          </ul>
        </div>

        <p class="text-xs tabular-nums text-[#86868B]">
          更新于 {{ nowFocus.updatedAt }}
        </p>
      </NuxtLink>

      <!-- Tech Stack Card (4 cols) -->
      <div class="bento-card md:col-span-4 flex flex-col justify-between gap-4">
        <div class="space-y-3.5">
          <div class="flex items-center justify-between">
            <h2 class="text-xs font-semibold text-[#86868B]">
              常用技术栈
            </h2>
            <NuxtLink to="/resume" class="text-xs font-medium text-[#0071E3] hover:underline dark:text-[#2997FF]">
              详情 →
            </NuxtLink>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="skill in profile.coreSkills" :key="skill" class="pill-tag px-2.5 py-1">
              {{ skill }}
            </span>
          </div>
        </div>

        <p class="text-xs text-[#86868B]">
          主力 Vue 生态 · 偏工程与性能治理
        </p>
      </div>

      <!-- Contact Card (4 cols) -->
      <div class="bento-card md:col-span-4 flex flex-col justify-between gap-4">
        <div class="space-y-3.5">
          <h2 class="text-xs font-semibold text-[#86868B]">
            联系方式
          </h2>
          <div class="flex flex-col gap-2">
            <button
              type="button"
              class="glass-inner flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1D1D1F] transition-colors hover:bg-black/[0.04] dark:text-[#F5F5F7] dark:hover:bg-white/[0.08]"
              @click="copyEmail"
            >
              <span class="inline-flex items-center gap-2 truncate">
                <Mail class="h-3.5 w-3.5 shrink-0 text-[#6E6E73]" />
                <span class="truncate">{{ profile.email }}</span>
              </span>
              <Check v-if="copiedEmail" class="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <Copy v-else class="h-3.5 w-3.5 shrink-0 text-[#86868B]" />
            </button>

            <button
              type="button"
              class="glass-inner flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1D1D1F] transition-colors hover:bg-black/[0.04] dark:text-[#F5F5F7] dark:hover:bg-white/[0.08]"
              @click="copyWechat"
            >
              <span class="inline-flex items-center gap-2 truncate">
                <MessageSquare class="h-3.5 w-3.5 shrink-0 text-[#6E6E73]" />
                <span class="truncate">微信：{{ profile.wechatId }}</span>
              </span>
              <Check v-if="copiedWechat" class="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <Copy v-else class="h-3.5 w-3.5 shrink-0 text-[#86868B]" />
            </button>

            <a
              :href="profile.github"
              target="_blank"
              rel="noopener noreferrer"
              class="glass-inner flex items-center justify-between px-3 py-2 text-xs font-medium text-[#1D1D1F] transition-colors hover:bg-black/[0.04] dark:text-[#F5F5F7] dark:hover:bg-white/[0.08]"
            >
              <span class="inline-flex items-center gap-2">
                <Github class="h-3.5 w-3.5 text-[#6E6E73]" />
                github.com/fengyinxqy
              </span>
              <ArrowUpRight class="h-3.5 w-3.5 text-[#86868B]" />
            </a>
          </div>
        </div>

        <p class="text-xs text-[#86868B]">
          点击邮箱或微信号可一键复制
        </p>
      </div>
    </section>

    <!-- Featured Projects (2x2 Clean Grid) -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
          精选开源项目
        </h2>
        <NuxtLink to="/projects" class="inline-flex items-center gap-1 text-xs font-medium text-[#0071E3] hover:underline dark:text-[#2997FF]">
          全部项目
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
              <div class="flex items-center gap-3">
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  :class="projectTintStyles[project.tint].badge"
                >
                  <component :is="iconMap[project.iconKey]" class="h-5 w-5" />
                </span>
                <div>
                  <h3 class="text-[15px] font-semibold tracking-tight text-[#1D1D1F] transition-colors group-hover:text-[#0071E3] dark:text-[#F5F5F7] dark:group-hover:text-[#2997FF]">
                    {{ project.title }}
                  </h3>
                  <p class="text-xs text-[#86868B]">
                    {{ project.year }} · {{ project.role }}
                  </p>
                </div>
              </div>
              <ArrowUpRight class="h-4 w-4 shrink-0 text-[#86868B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0071E3] dark:group-hover:text-[#2997FF]" />
            </div>

            <p class="text-xs leading-relaxed text-[#515154] line-clamp-2 dark:text-[#A1A1A6]">
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
          <h2 class="text-base font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
            最近写的文章
          </h2>
          <NuxtLink to="/blog" class="text-xs font-medium text-[#0071E3] hover:underline dark:text-[#2997FF]">
            全部文章 →
          </NuxtLink>
        </div>

        <div class="divide-y divide-black/[0.06] dark:divide-white/[0.08]">
          <NuxtLink
            v-for="post in latestPosts"
            :key="post._path"
            :to="post._path"
            class="group block py-3.5 first:pt-1 last:pb-0"
          >
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="text-sm font-semibold text-[#1D1D1F] transition-colors group-hover:text-[#0071E3] dark:text-[#F5F5F7] dark:group-hover:text-[#2997FF]">
                {{ post.title }}
              </h3>
              <span class="shrink-0 font-mono text-xs tabular-nums text-[#86868B]">
                {{ formatDate(post.date) }}
              </span>
            </div>
            <p v-if="post.description" class="mt-1 text-xs text-[#6E6E73] line-clamp-1 dark:text-[#A1A1A6]">
              {{ post.description }}
            </p>
            <div class="mt-2 flex items-center gap-3 text-[11px] text-[#86868B]">
              <span class="inline-flex items-center gap-1">
                <Clock class="h-3 w-3" />
                约 {{ estimateReadingTime(post.body) }} 分钟
              </span>
              <span v-for="tag in (post.tags || []).slice(0, 3)" :key="tag">
                #{{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Now Timeline -->
      <div class="bento-card space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F5F7]">
            近期记录
          </h2>
          <NuxtLink to="/now" class="text-xs font-medium text-[#0071E3] hover:underline dark:text-[#2997FF]">
            全部 →
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="item in latestUpdates"
            :key="item._path"
            to="/now"
            class="glass-inner block p-3.5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <div class="flex items-center justify-between text-[11px] text-[#86868B]">
              <span class="font-mono tabular-nums">{{ formatDate(item.date) }}</span>
              <span v-if="item.tag" class="pill-tag text-[10px]">{{ item.tag }}</span>
            </div>
            <p class="mt-1.5 text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              {{ item.title }}
            </p>
            <p v-if="item.description" class="mt-1 text-xs text-[#6E6E73] line-clamp-2 dark:text-[#A1A1A6]">
              {{ item.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
