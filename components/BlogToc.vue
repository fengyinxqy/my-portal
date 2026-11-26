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
    <div class="bento-card sticky top-24 p-4">
      <p class="mb-3 text-xs font-semibold text-[#86868B]">
        目录
      </p>
      <ul class="space-y-1 text-xs">
        <li
          v-for="item in flatLinks"
          :key="item.id"
          :class="item.depth >= 3 ? 'pl-3' : ''"
        >
          <a
            :href="`#${item.id}`"
            class="block truncate rounded-lg px-2 py-1 transition-colors"
            :class="
              activeId === item.id
                ? 'bg-[#0071E3]/[0.08] font-medium text-[#0071E3] dark:bg-[#2997FF]/15 dark:text-[#2997FF]'
                : 'text-[#6E6E73] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:text-white'
            "
          >
            {{ item.text }}
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
