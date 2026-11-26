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
      class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/80 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
      :aria-label="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
      :title="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
      @click="toggleTheme"
    >
      <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4" />
      <Moon v-else class="h-4 w-4" />
    </button>
    <template #fallback>
      <span class="inline-flex h-9 w-9 rounded-xl border border-zinc-200/80 dark:border-zinc-800" />
    </template>
  </ClientOnly>
</template>
