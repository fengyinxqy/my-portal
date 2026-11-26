<script setup lang="ts">
import {
  AlertOctagon,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Flame,
  HelpCircle,
  Info,
  Lightbulb,
  Quote
} from 'lucide-vue-next'

const props = defineProps({
  type: { type: String, default: 'note' },
  title: { type: String, default: '' }
})

interface CalloutPreset {
  label: string
  icon: any
  container: string
  header: string
}

const presets: Record<string, CalloutPreset> = {
  note: {
    label: '说明',
    icon: Info,
    container: 'border-[#0071E3]/20 bg-[#0071E3]/[0.05] dark:border-[#2997FF]/25 dark:bg-[#2997FF]/[0.08]',
    header: 'text-[#0071E3] dark:text-[#47A6FF]'
  },
  info: {
    label: '信息',
    icon: Info,
    container: 'border-[#0071E3]/20 bg-[#0071E3]/[0.05] dark:border-[#2997FF]/25 dark:bg-[#2997FF]/[0.08]',
    header: 'text-[#0071E3] dark:text-[#47A6FF]'
  },
  tip: {
    label: '提示',
    icon: Lightbulb,
    container: 'border-emerald-500/25 bg-emerald-500/[0.06] dark:border-emerald-400/25 dark:bg-emerald-400/[0.08]',
    header: 'text-emerald-700 dark:text-emerald-300'
  },
  success: {
    label: '完成',
    icon: CheckCircle2,
    container: 'border-emerald-500/25 bg-emerald-500/[0.06] dark:border-emerald-400/25 dark:bg-emerald-400/[0.08]',
    header: 'text-emerald-700 dark:text-emerald-300'
  },
  important: {
    label: '重要',
    icon: Flame,
    container: 'border-indigo-500/25 bg-indigo-500/[0.06] dark:border-indigo-400/25 dark:bg-indigo-400/[0.08]',
    header: 'text-indigo-700 dark:text-indigo-300'
  },
  warning: {
    label: '注意',
    icon: AlertTriangle,
    container: 'border-amber-500/30 bg-amber-500/[0.07] dark:border-amber-400/25 dark:bg-amber-400/[0.08]',
    header: 'text-amber-700 dark:text-amber-300'
  },
  caution: {
    label: '警示',
    icon: AlertOctagon,
    container: 'border-rose-500/25 bg-rose-500/[0.06] dark:border-rose-400/25 dark:bg-rose-400/[0.08]',
    header: 'text-rose-700 dark:text-rose-300'
  },
  danger: {
    label: '警告',
    icon: AlertOctagon,
    container: 'border-rose-500/25 bg-rose-500/[0.06] dark:border-rose-400/25 dark:bg-rose-400/[0.08]',
    header: 'text-rose-700 dark:text-rose-300'
  },
  question: {
    label: '思考',
    icon: HelpCircle,
    container: 'border-amber-500/25 bg-amber-500/[0.06] dark:border-amber-400/25 dark:bg-amber-400/[0.08]',
    header: 'text-amber-700 dark:text-amber-300'
  },
  example: {
    label: '示例',
    icon: Bookmark,
    container: 'border-slate-500/20 bg-slate-500/[0.05] dark:border-slate-400/20 dark:bg-white/[0.05]',
    header: 'text-[#1D1D1F] dark:text-[#F5F5F7]'
  },
  quote: {
    label: '摘录',
    icon: Quote,
    container: 'border-black/[0.08] bg-black/[0.025] dark:border-white/[0.1] dark:bg-white/[0.04]',
    header: 'text-[#515154] dark:text-[#C7C7CC]'
  }
}

const aliasMap: Record<string, string> = {
  hint: 'tip',
  check: 'success',
  done: 'success',
  abstract: 'note',
  summary: 'note',
  tldr: 'note',
  attention: 'warning',
  fail: 'danger',
  failure: 'danger',
  error: 'danger',
  bug: 'danger',
  faq: 'question',
  help: 'question',
  cite: 'quote'
}

const preset = computed(() => {
  const key = props.type.toLowerCase()
  const resolved = aliasMap[key] || key
  return presets[resolved] || presets.note
})

const displayTitle = computed(() => props.title.trim() || preset.value.label)
</script>

<template>
  <aside
    :class="[
      'callout-box my-5 rounded-2xl border px-4 py-3.5 backdrop-blur-md',
      preset.container
    ]"
  >
    <div :class="['mb-1.5 flex items-center gap-2 text-[13px] font-semibold tracking-tight', preset.header]">
      <component :is="preset.icon" class="h-4 w-4 shrink-0" />
      <span>{{ displayTitle }}</span>
    </div>
    <div class="callout-body text-[14px] leading-relaxed text-[#3A3A3C] dark:text-[#D1D1D6]">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.callout-body :deep(> :first-child) {
  margin-top: 0;
}
.callout-body :deep(> :last-child) {
  margin-bottom: 0;
}
</style>
