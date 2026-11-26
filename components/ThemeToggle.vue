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
      class="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#6E6E73] transition-colors hover:bg-black/[0.05] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/[0.08] dark:hover:text-white"
      :aria-label="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
      :title="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
      @click="toggleTheme"
    >
      <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4" />
      <Moon v-else class="h-4 w-4" />
    </button>
    <template #fallback>
      <span class="inline-flex h-8 w-8" />
    </template>
  </ClientOnly>
</template>
