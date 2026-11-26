<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <button
      type="button"
      class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/70 text-slate-600 transition-all duration-200 hover:bg-white hover:text-[#1D1D1F] active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/15 dark:hover:text-white"
      :aria-label="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
      :title="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
      @click="toggleTheme"
    >
      <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4" />
      <Moon v-else class="h-4 w-4" />
    </button>
    <template #fallback>
      <span class="inline-flex h-8 w-8 rounded-full border border-white/60 dark:border-white/10" />
    </template>
  </ClientOnly>
</template>
