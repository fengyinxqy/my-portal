<script setup lang="ts">
import { Check, Code2, Copy, Maximize2 } from 'lucide-vue-next'

const props = defineProps({
  code: { type: String, required: true }
})

const colorMode = useColorMode()
const { openSvg } = useLightbox()

const svgHtml = ref('')
const renderError = ref('')
const showSource = ref(false)
const copied = ref(false)
const isLoading = ref(true)

let renderCounter = 0

async function renderDiagram() {
  if (!import.meta.client) return
  isLoading.value = true
  renderError.value = ''

  try {
    const mermaidModule = await import('mermaid')
    const mermaid = mermaidModule.default
    const isDark = colorMode.value === 'dark'

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: isDark ? 'dark' : 'base',
      themeVariables: isDark
        ? {
            background: 'transparent',
            primaryColor: '#1E293B',
            primaryTextColor: '#F5F5F7',
            primaryBorderColor: '#38BDF8',
            lineColor: '#94A3B8',
            secondaryColor: '#182235',
            tertiaryColor: '#14161D',
            fontFamily: 'inherit'
          }
        : {
            background: 'transparent',
            primaryColor: '#EEF5FF',
            primaryTextColor: '#1D1D1F',
            primaryBorderColor: '#0071E3',
            lineColor: '#64748B',
            secondaryColor: '#F6F8FA',
            tertiaryColor: '#FFFFFF',
            fontFamily: 'inherit'
          }
    })

    const id = `mermaid-${Date.now()}-${++renderCounter}`
    const { svg } = await mermaid.render(id, props.code.trim())
    svgHtml.value = svg
  } catch (err: any) {
    renderError.value = err?.message || 'Mermaid 语法渲染失败'
    svgHtml.value = ''
  } finally {
    isLoading.value = false
  }
}

async function copySource() {
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

function handleZoom() {
  if (!svgHtml.value) return
  openSvg(svgHtml.value, 'Mermaid 图表预览')
}

onMounted(() => {
  renderDiagram()
})

watch(
  () => [colorMode.value, props.code],
  () => {
    renderDiagram()
  }
)
</script>

<template>
  <div class="my-5 overflow-hidden rounded-2xl border border-black/[0.08] bg-[#F8FAFC]/85 backdrop-blur-md dark:border-white/[0.1] dark:bg-[#14161D]/90">
    <div class="flex items-center justify-between border-b border-black/[0.06] bg-white/60 px-4 py-2 text-xs text-[#6E6E73] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#A1A1A6]">
      <span class="font-mono">mermaid</span>
      <div class="flex items-center gap-1">
        <button
          v-if="svgHtml && !showSource"
          type="button"
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-[#6E6E73] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white"
          @click="handleZoom"
        >
          <Maximize2 class="h-3 w-3" />
          <span>放大</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-[#6E6E73] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white"
          @click="showSource = !showSource"
        >
          <Code2 class="h-3 w-3" />
          <span>{{ showSource ? '图表' : '源码' }}</span>
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-[#6E6E73] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white"
          @click="copySource"
        >
          <Check v-if="copied" class="h-3 w-3 text-emerald-500" />
          <Copy v-else class="h-3 w-3" />
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
      </div>
    </div>

    <ClientOnly>
      <div v-if="showSource || renderError" class="p-4">
        <p v-if="renderError" class="mb-2 text-xs text-rose-500">
          {{ renderError }}
        </p>
        <pre class="!my-0 !border-0 !bg-transparent !p-0 overflow-x-auto text-[13px] leading-relaxed !text-[#1D1D1F] dark:!text-[#E5E5EA]"><code>{{ code }}</code></pre>
      </div>

      <div
        v-else-if="isLoading"
        class="flex min-h-[120px] items-center justify-center p-6 text-xs text-[#86868B]"
      >
        正在渲染图表…
      </div>

      <div
        v-else
        class="mermaid-diagram flex justify-center overflow-x-auto p-5 cursor-zoom-in"
        title="点击放大查看图表"
        @click="handleZoom"
        v-html="svgHtml"
      />

      <template #fallback>
        <pre class="!my-0 !border-0 !bg-transparent p-4 overflow-x-auto text-[13px] leading-relaxed !text-[#1D1D1F] dark:!text-[#E5E5EA]"><code>{{ code }}</code></pre>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
