<script setup lang="ts">
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  FileText,
  Github,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles
} from 'lucide-vue-next'
import { profile } from '~/data/profile'
import { portfolioProjects } from '~/data/projects'
import { nowFocus } from '~/data/now'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

useSeoMeta({
  title: '首页',
  description: profile.tagline,
  ogTitle: `${profile.name} · ${profile.role}`,
  ogDescription: profile.tagline
})

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
    <!-- Bento Top Grid -->
    <section class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- Hero Bio Card (2 cols) -->
      <div class="bento-card md:col-span-2 flex flex-col justify-between gap-6">
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {{ profile.availability }}
            </span>
            <span class="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <MapPin class="h-3.5 w-3.5" />
              {{ profile.location }}
            </span>
          </div>

          <div class="flex items-center gap-4">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="h-14 w-14 shrink-0 rounded-2xl border border-zinc-200/80 object-cover shadow-sm dark:border-zinc-700"
            />
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                你好，我是 {{ profile.name }}
              </h1>
              <p class="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {{ profile.role }}
              </p>
            </div>
          </div>

          <p class="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {{ profile.tagline }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            to="/resume"
            class="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <FileText class="h-4 w-4" />
            查看在线简历
          </NuxtLink>
          <NuxtLink
            to="/projects"
            class="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-700"
          >
            浏览作品集
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Current Focus / Now Card (1 col) -->
      <NuxtLink to="/now" class="bento-card-interactive group flex flex-col justify-between gap-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Sparkles class="h-3.5 w-3.5 text-amber-500" />
              近期专注 · Now
            </span>
            <ArrowUpRight class="h-4 w-4 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
          </div>

          <ul class="space-y-2.5">
            <li v-for="item in nowFocus.items.slice(0, 3)" :key="item.title" class="space-y-0.5">
              <p class="text-[11px] font-medium text-zinc-400">{{ item.label }}</p>
              <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">
                {{ item.title }}
              </p>
            </li>
          </ul>
        </div>

        <p class="text-xs text-zinc-400">
          更新于 {{ nowFocus.updatedAt }}
        </p>
      </NuxtLink>

      <!-- Tech Stack Card (2 cols) -->
      <div class="bento-card md:col-span-2 flex flex-col justify-between gap-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            核心技术栈
          </h2>
          <NuxtLink to="/resume" class="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            完整能力矩阵 →
          </NuxtLink>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="skill in profile.coreSkills" :key="skill" class="pill-tag px-3 py-1 text-xs">
            {{ skill }}
          </span>
        </div>
      </div>

      <!-- Contact Card (1 col) -->
      <div class="bento-card flex flex-col justify-between gap-4">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          联系与社交
        </h2>
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="flex items-center justify-between rounded-xl border border-zinc-200/80 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            @click="copyEmail"
          >
            <span class="inline-flex items-center gap-2 truncate">
              <Mail class="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span class="truncate">{{ profile.email }}</span>
            </span>
            <Check v-if="copiedEmail" class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <Copy v-else class="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          </button>

          <button
            type="button"
            class="flex items-center justify-between rounded-xl border border-zinc-200/80 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
            @click="copyWechat"
          >
            <span class="inline-flex items-center gap-2 truncate">
              <MessageSquare class="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              <span class="truncate">微信：{{ profile.wechatId }}</span>
            </span>
            <Check v-if="copiedWechat" class="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <Copy v-else class="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          </button>

          <a
            :href="profile.github"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between rounded-xl border border-zinc-200/80 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
          >
            <span class="inline-flex items-center gap-2">
              <Github class="h-3.5 w-3.5 text-zinc-400" />
              GitHub 主页
            </span>
            <ArrowUpRight class="h-3.5 w-3.5 text-zinc-400" />
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          精选项目
        </h2>
        <NuxtLink to="/projects" class="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
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
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-xs text-zinc-400">
              <span>{{ project.category }}</span>
              <span class="inline-flex items-center gap-1">
                {{ project.year }}
                <ArrowUpRight class="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
              </span>
            </div>
            <h3 class="font-semibold text-zinc-900 transition group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-white">
              {{ project.title }}
            </h3>
            <p class="text-xs leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-400">
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
          <h2 class="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            最新文章
          </h2>
          <NuxtLink to="/blog" class="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            全部文章 →
          </NuxtLink>
        </div>

        <div class="divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <NuxtLink
            v-for="post in latestPosts"
            :key="post._path"
            :to="post._path"
            class="group block py-3.5 first:pt-1 last:pb-0"
          >
            <div class="flex items-baseline justify-between gap-4">
              <h3 class="text-sm font-semibold text-zinc-900 transition group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                {{ post.title }}
              </h3>
              <span class="shrink-0 font-mono text-xs text-zinc-400">
                {{ formatDate(post.date) }}
              </span>
            </div>
            <p v-if="post.description" class="mt-1 text-xs text-zinc-500 line-clamp-1 dark:text-zinc-400">
              {{ post.description }}
            </p>
            <div class="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
              <span class="inline-flex items-center gap-1">
                <Clock class="h-3 w-3" />
                约 {{ estimateReadingTime(post.body) }} 分钟
              </span>
              <span v-for="tag in (post.tags || []).slice(0, 2)" :key="tag">#{{ tag }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Now Timeline -->
      <div class="bento-card space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            近期动态
          </h2>
          <NuxtLink to="/now" class="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
            时间线 →
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <NuxtLink
            v-for="item in latestUpdates"
            :key="item._path"
            to="/now"
            class="block rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 transition hover:border-zinc-200 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:hover:border-zinc-700"
          >
            <div class="flex items-center justify-between text-[11px] text-zinc-400">
              <span class="font-mono">{{ formatDate(item.date) }}</span>
              <span v-if="item.tag" class="pill-tag text-[10px]">{{ item.tag }}</span>
            </div>
            <p class="mt-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {{ item.title }}
            </p>
            <p v-if="item.description" class="mt-1 text-xs text-zinc-500 line-clamp-2 dark:text-zinc-400">
              {{ item.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
