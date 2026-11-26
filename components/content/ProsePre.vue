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
  <div class="group relative my-5 overflow-hidden rounded-2xl border border-black/[0.08] bg-[#F6F8FA] dark:border-white/[0.1] dark:bg-[#14161D]">
    <div class="flex items-center justify-between border-b border-black/[0.06] bg-white/60 px-4 py-2 text-xs text-[#6E6E73] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#A1A1A6]">
      <span class="font-mono">{{ filename || language || 'text' }}</span>
      <button
        type="button"
        class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#6E6E73] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white"
        @click="copyCode"
      >
        <Check v-if="copied" class="h-3 w-3 text-emerald-500" />
        <Copy v-else class="h-3 w-3" />
        <span>{{ copied ? '已复制' : '复制' }}</span>
      </button>
    </div>
    <pre :class="['!my-0 !rounded-none !border-0 overflow-x-auto p-4 text-[13.5px] leading-relaxed !text-[#1D1D1F] dark:!text-[#E5E5EA]', $props.class]"><slot /></pre>
  </div>
</template>
