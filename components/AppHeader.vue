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
  <header class="no-print sticky top-0 z-40 border-b border-white/70 bg-white/55 shadow-[0_1px_12px_rgba(15,23,42,0.04)] backdrop-blur-2xl backdrop-saturate-[185%] dark:border-white/[0.1] dark:bg-[#12141C]/65">
    <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <img
          :src="profile.avatar"
          :alt="profile.name"
          class="h-7 w-7 rounded-full border border-black/[0.08] object-cover dark:border-white/15"
        />
        <span class="text-[15px] font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          {{ profile.name }}
        </span>
      </NuxtLink>

      <!-- Desktop nav: Apple clean text links -->
      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-3.5 py-1.5 text-[13px] transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-black/[0.06] font-semibold text-[#1D1D1F] dark:bg-white/[0.12] dark:text-white'
              : 'font-medium text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:text-white'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs text-[#6E6E73] transition-colors hover:bg-black/[0.05] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/[0.08] dark:hover:text-white"
          aria-label="站内搜索"
          @click="emit('open-search')"
        >
          <Search class="h-4 w-4" />
          <kbd class="hidden sm:inline rounded border border-black/[0.08] bg-white/80 px-1.5 py-0.5 font-mono text-[10px] text-[#6E6E73] dark:border-white/10 dark:bg-white/10 dark:text-[#A1A1A6]">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        <button
          type="button"
          class="inline-flex md:hidden h-8 w-8 items-center justify-center rounded-full text-[#1D1D1F] transition-colors hover:bg-black/[0.05] dark:text-[#F5F5F7] dark:hover:bg-white/[0.08]"
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
      class="md:hidden border-t border-black/[0.06] bg-white/95 px-4 py-2.5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#1C1C1E]/95"
    >
      <nav class="flex flex-col gap-0.5">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-3.5 py-2.5 text-sm transition-colors"
          :class="
            isActive(item.to)
              ? 'bg-black/[0.05] font-semibold text-[#1D1D1F] dark:bg-white/[0.1] dark:text-white'
              : 'font-medium text-[#6E6E73] dark:text-[#A1A1A6]'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
