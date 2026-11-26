<script setup lang="ts">
import { ZoomIn } from 'lucide-vue-next'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined }
})

const { openImage } = useLightbox()

const meaningfulCaption = computed(() => {
  const text = (props.alt || '').trim()
  if (!text) return ''
  // Hide auto-generated filenames like "Pasted image 2026..." or "img-123.png"
  if (/^pasted image/i.test(text)) return ''
  if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(text)) return ''
  if (/^\d+(?:x\d+)?$/i.test(text)) return ''
  return text
})

function handleZoom() {
  if (!props.src) return
  openImage(props.src, meaningfulCaption.value)
}
</script>

<template>
  <figure class="my-6 flex flex-col items-center">
    <div
      class="group relative inline-block max-w-full cursor-zoom-in overflow-hidden rounded-2xl border border-black/[0.08] bg-white/60 shadow-[0_6px_24px_-8px_rgba(15,23,42,0.12)] transition-all duration-200 hover:shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] dark:border-white/[0.1] dark:bg-white/[0.03]"
      role="button"
      tabindex="0"
      :aria-label="meaningfulCaption ? `放大查看：${meaningfulCaption}` : '放大查看图片'"
      @click="handleZoom"
      @keydown.enter.prevent="handleZoom"
    >
      <img
        :src="src"
        :alt="meaningfulCaption || alt"
        :width="width"
        :height="height"
        loading="lazy"
        decoding="async"
        class="!my-0 block max-h-[560px] w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
      />
      <span
        class="pointer-events-none absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100"
      >
        <ZoomIn class="h-3.5 w-3.5" />
      </span>
    </div>
    <figcaption
      v-if="meaningfulCaption"
      class="mt-2.5 text-center text-xs text-[#86868B]"
    >
      {{ meaningfulCaption }}
    </figcaption>
  </figure>
</template>
