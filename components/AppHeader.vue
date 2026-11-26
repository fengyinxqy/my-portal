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
  <header class="no-print sticky top-3 z-40 mx-auto w-full max-w-5xl px-4 sm:px-6">
    <div class="glass-pill flex h-14 items-center justify-between px-3 sm:px-4">
      <NuxtLink to="/" class="group flex items-center gap-2.5 pl-1">
        <span class="rounded-full p-[1.5px] bg-gradient-to-tr from-[#007AFF] via-[#5856D6] to-[#32ADE6] transition-transform duration-300 ease-apple group-hover:scale-105">
          <img
            :src="profile.avatar"
            :alt="profile.name"
            class="h-7 w-7 rounded-full object-cover bg-white dark:bg-zinc-900"
          />
        </span>
        <span class="text-sm font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          {{ profile.name }}
        </span>
      </NuxtLink>

      <!-- Apple Segmented Glass Nav -->
      <nav class="hidden md:flex items-center gap-1 rounded-full bg-slate-900/[0.04] p-1 dark:bg-white/[0.06]">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-3.5 py-1 text-[13px] font-medium transition-all duration-200 ease-apple"
          :class="
            isActive(item.to)
              ? 'bg-gradient-to-b from-[#1A88FF] to-[#007AFF] text-white shadow-[0_2px_10px_rgba(0,122,255,0.35)]'
              : 'text-slate-600 hover:text-[#1D1D1F] hover:bg-white/60 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-white/10'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2 pr-0.5">
        <button
          type="button"
          class="inline-flex h-8 items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 text-xs text-slate-500 transition-all duration-200 hover:bg-white hover:text-[#1D1D1F] active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15 dark:hover:text-white"
          @click="emit('open-search')"
        >
          <Search class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">搜索</span>
          <kbd class="hidden sm:inline rounded-full bg-slate-100/90 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-white/10 dark:text-zinc-300">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        <button
          type="button"
          class="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/75 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300"
          aria-label="打开导航菜单"
          @click="mobileOpen = !mobileOpen"
        >
          <X v-if="mobileOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Mobile Glass Drawer -->
    <div
      v-if="mobileOpen"
      class="md:hidden mt-2 rounded-3xl border border-white/85 bg-white/85 p-2 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/85"
    >
      <nav class="flex flex-col gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-2xl px-4 py-2.5 text-sm font-medium transition"
          :class="
            isActive(item.to)
              ? 'bg-[#007AFF] text-white'
              : 'text-slate-600 hover:bg-slate-100/80 dark:text-zinc-300 dark:hover:bg-white/10'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
