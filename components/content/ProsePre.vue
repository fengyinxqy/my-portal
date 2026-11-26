<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'

const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: '' },
  filename: { type: String, default: '' },
  highlights: { type: Array as () => number[], default: () => [] },
  meta: { type: String, default: '' },
  class: { type: String, default: '' }
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    // ignore clipboard errors
  }
}
</script>

<template>
  <div class="group relative my-5 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/90">
    <div class="flex items-center justify-between border-b border-zinc-200/70 px-3.5 py-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <span class="font-mono">{{ filename || language || 'code' }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium text-zinc-500 transition hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        @click="copyCode"
      >
        <Check v-if="copied" class="h-3 w-3 text-emerald-500" />
        <Copy v-else class="h-3 w-3" />
        <span>{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <pre :class="['!my-0 !rounded-none !border-0 overflow-x-auto p-4 text-sm leading-relaxed', $props.class]"><slot /></pre>
  </div>
</template>
