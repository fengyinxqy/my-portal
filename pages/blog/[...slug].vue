<script setup lang="ts">
import { ArrowLeft, ArrowUp, Calendar, Check, Clock, Link2 } from 'lucide-vue-next'
import { estimateReadingTime, formatDate } from '~/utils/readingTime'

const route = useRoute()

const { data: doc } = await useAsyncData(`blog-${route.path}`, () =>
  queryContent(route.path).findOne()
)

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

const { data: surround } = await useAsyncData(`blog-surround-${route.path}`, () =>
  queryContent('blog')
    .where({ _dir: 'blog', draft: { $ne: true } })
    .only(['_path', 'title'])
    .sort({ date: -1 })
    .findSurround(route.path)
)

const prev = computed(() => {
  const item = surround.value?.[0]
  return item?._path?.startsWith('/blog/') ? item : null
})
const next = computed(() => {
  const item = surround.value?.[1]
  return item?._path?.startsWith('/blog/') ? item : null
})
const readingMinutes = computed(() => estimateReadingTime(doc.value?.body))

// Reading progress & floating back-to-top
const articleRef = ref<HTMLElement | null>(null)
const readProgress = ref(0)
const showBackTop = ref(false)
const copiedLink = ref(false)

let rafId: number | null = null

function updateScrollState() {
  rafId = null
  const scrollY = window.scrollY || window.pageYOffset
  showBackTop.value = scrollY > 480

  const el = articleRef.value
  if (!el) {
    readProgress.value = 0
    return
  }

  const rect = el.getBoundingClientRect()
  const articleTop = scrollY + rect.top
  const scrollable = Math.max(1, el.offsetHeight - window.innerHeight * 0.72)
  const raw = ((scrollY - articleTop + 80) / scrollable) * 100
  readProgress.value = Math.min(100, Math.max(0, raw))
}

function onScroll() {
  if (rafId !== null) return
  rafId = window.requestAnimationFrame(updateScrollState)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function copyArticleLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copiedLink.value = true
    setTimeout(() => {
      copiedLink.value = false
    }, 2000)
  } catch {
    // ignore clipboard errors
  }
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
  }
})

useSeoMeta({
  title: doc.value.title,
  description: doc.value.description,
  ogTitle: doc.value.title,
  ogDescription: doc.value.description,
  ogType: 'article'
})
</script>

<template>
  <div v-if="doc" class="space-y-8">
    <!-- Top Reading Progress Bar (2px Apple Blue right below sticky header) -->
    <div
      aria-hidden="true"
      class="no-print pointer-events-none fixed left-0 right-0 top-14 z-40 h-[2px] bg-transparent"
    >
      <div
        class="h-full bg-[#0071E3] transition-[width] duration-75 ease-out dark:bg-[#2997FF]"
        :style="{ width: `${readProgress}%` }"
      />
    </div>

    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] transition-colors hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:text-white"
    >
      <ArrowLeft class="h-3.5 w-3.5" />
      返回博客列表
    </NuxtLink>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <!-- Main Article -->
      <article ref="articleRef" class="bento-card min-w-0 space-y-8 p-6 sm:p-10">
        <header class="space-y-4 border-b border-black/[0.06] pb-6 dark:border-white/[0.08]">
          <h1 class="text-2xl font-bold tracking-[-0.025em] text-[#1D1D1F] sm:text-3xl dark:text-[#F5F5F7]">
            {{ doc.title }}
          </h1>

          <p v-if="doc.description" class="text-sm leading-relaxed text-[#6E6E73] dark:text-[#A1A1A6]">
            {{ doc.description }}
          </p>

          <div class="flex flex-wrap items-center gap-4 text-xs text-[#86868B]">
            <span v-if="doc.date" class="inline-flex items-center gap-1 font-mono tabular-nums">
              <Calendar class="h-3.5 w-3.5" />
              {{ formatDate(doc.date) }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Clock class="h-3.5 w-3.5" />
              约 {{ readingMinutes }} 分钟阅读
            </span>
          </div>

          <div v-if="doc.tags?.length" class="flex flex-wrap gap-1.5">
            <span v-for="tag in doc.tags" :key="tag" class="pill-tag">
              #{{ tag }}
            </span>
          </div>
        </header>

        <div class="prose prose-zinc max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-[#0071E3] prose-a:underline-offset-4 dark:prose-a:text-[#2997FF]">
          <ContentRenderer :value="doc" />
        </div>

        <!-- Article Actions Bar -->
        <div class="no-print flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-6 dark:border-white/[0.08]">
          <span class="text-xs text-[#86868B]">
            {{ doc.syncedFromObsidian ? '撰写于 Obsidian · 同步发布' : '原创文章' }}
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="glass-pill-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium"
              @click="copyArticleLink"
            >
              <Check v-if="copiedLink" class="h-3.5 w-3.5 text-emerald-500" />
              <Link2 v-else class="h-3.5 w-3.5" />
              <span>{{ copiedLink ? '已复制链接' : '复制文章链接' }}</span>
            </button>
            <button
              type="button"
              class="glass-pill-btn inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium"
              @click="scrollToTop"
            >
              <ArrowUp class="h-3.5 w-3.5" />
              <span>顶部</span>
            </button>
          </div>
        </div>

        <!-- Prev / Next Navigation -->
        <nav
          v-if="prev || next"
          class="grid grid-cols-1 gap-3 border-t border-black/[0.06] pt-6 sm:grid-cols-2 dark:border-white/[0.08]"
        >
          <NuxtLink
            v-if="prev"
            :to="prev._path"
            class="glass-inner block p-4 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <p class="text-[11px] text-[#86868B]">← 上一篇</p>
            <p class="mt-1 truncate text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              {{ prev.title }}
            </p>
          </NuxtLink>
          <div v-else />

          <NuxtLink
            v-if="next"
            :to="next._path"
            class="glass-inner block p-4 text-right transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <p class="text-[11px] text-[#86868B]">下一篇 →</p>
            <p class="mt-1 truncate text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              {{ next.title }}
            </p>
          </NuxtLink>
        </nav>
      </article>

      <!-- Sticky TOC Sidebar -->
      <BlogToc :links="doc.body?.toc?.links || []" />
    </div>

    <!-- Subtle Floating Back-to-Top Pill -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <button
        v-if="showBackTop"
        type="button"
        aria-label="返回顶部"
        class="no-print glass-pill-btn fixed bottom-6 right-5 z-30 inline-flex h-10 w-10 items-center justify-center shadow-lg sm:right-8"
        @click="scrollToTop"
      >
        <ArrowUp class="h-4 w-4" />
      </button>
    </Transition>
  </div>
</template>
