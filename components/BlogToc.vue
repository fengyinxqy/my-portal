<script setup lang="ts">
interface TocLink {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

const props = defineProps<{
  links: TocLink[]
}>()

const activeId = ref('')

const flatLinks = computed(() => {
  const result: { id: string; text: string; depth: number }[] = []
  for (const link of props.links || []) {
    result.push({ id: link.id, text: link.text, depth: link.depth })
    if (link.children?.length) {
      for (const child of link.children) {
        result.push({ id: child.id, text: child.text, depth: child.depth })
      }
    }
  }
  return result
})

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px' }
  )

  for (const item of flatLinks.value) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }

  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <aside v-if="flatLinks.length > 0" class="hidden lg:block">
    <div class="sticky top-24 rounded-[20px] border border-white/80 bg-white/70 p-4 shadow-glass backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/60">
      <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        目录大纲
      </p>
      <ul class="space-y-1.5 text-xs">
        <li
          v-for="item in flatLinks"
          :key="item.id"
          :class="item.depth >= 3 ? 'pl-3' : ''"
        >
          <a
            :href="`#${item.id}`"
            class="block truncate rounded-lg px-2 py-1 transition"
            :class="
              activeId === item.id
                ? 'bg-[#007AFF]/10 font-semibold text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#64B5FF]'
                : 'text-slate-500 hover:text-[#1D1D1F] dark:text-zinc-400 dark:hover:text-zinc-200'
            "
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
