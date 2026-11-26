<script setup lang="ts">
import { X } from 'lucide-vue-next'

const { state, close } = useLightbox()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && state.value.open) {
    close()
  }
}

watch(
  () => state.value.open,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="state.open"
        role="dialog"
        aria-modal="true"
        :aria-label="state.alt || '图片预览'"
        class="no-print fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/75 p-4 sm:p-8 backdrop-blur-md"
        @click.self="close"
      >
        <button
          type="button"
          class="fixed right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white"
          aria-label="关闭预览"
          @click="close"
        >
          <X class="h-5 w-5" />
        </button>

        <div class="relative flex max-h-[85vh] max-w-[92vw] flex-col items-center justify-center">
          <img
            v-if="state.mode === 'image'"
            :src="state.src"
            :alt="state.alt"
            class="max-h-[82vh] max-w-full rounded-2xl border border-white/15 bg-white/5 object-contain shadow-2xl"
          />
          <div
            v-else
            class="mermaid-lightbox max-h-[82vh] max-w-[90vw] overflow-auto rounded-2xl border border-black/10 bg-white/95 p-6 shadow-2xl dark:border-white/15 dark:bg-[#14161D]/95"
            v-html="state.svgHtml"
          />

          <p
            v-if="state.alt"
            class="mt-3 max-w-2xl text-center text-xs text-white/80"
          >
            {{ state.alt }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mermaid-lightbox :deep(svg) {
  max-width: none;
  min-width: min(720px, 80vw);
  height: auto;
}
</style>
