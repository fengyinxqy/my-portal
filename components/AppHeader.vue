<script setup lang="ts">
import { Menu, Search, X } from 'lucide-vue-next'
import { profile } from '~/data/profile'

const emit = defineEmits<{
  (e: 'open-search'): void
}>()

const route = useRoute()
const mobileOpen = ref(false)

const navItems = [
  { label: '首页', to: '/' },
  { label: '简历', to: '/resume' },
  { label: '项目', to: '/projects' },
  { label: '博客', to: '/blog' },
  { label: '动态', to: '/now' }
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<template>
  <header class="no-print sticky top-0 z-40 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
    <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="group flex items-center gap-2.5">
        <img
          :src="profile.avatar"
          :alt="profile.name"
          class="h-8 w-8 rounded-xl border border-zinc-200/80 object-cover transition group-hover:scale-105 dark:border-zinc-700"
        />
        <span class="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {{ profile.name }}
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-1 rounded-2xl border border-zinc-200/70 bg-white/70 p-1 dark:border-zinc-800/70 dark:bg-zinc-900/60">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-3.5 py-1.5 text-sm font-medium transition"
          :class="
            isActive(item.to)
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center gap-2 rounded-xl border border-zinc-200/80 bg-white/80 px-2.5 text-xs text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
          @click="emit('open-search')"
        >
          <Search class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">搜索</span>
          <kbd class="hidden sm:inline rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        <button
          type="button"
          class="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/80 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300"
          aria-label="打开导航菜单"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <div
      v-if="mobileOpen"
      class="md:hidden border-t border-zinc-200/70 bg-white/95 px-4 py-3 dark:border-zinc-800/70 dark:bg-zinc-950/95"
    >
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-3 py-2 text-sm font-medium transition"
          :class="
            isActive(item.to)
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
