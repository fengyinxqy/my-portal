<script setup lang="ts">
import { FileText, FolderKanban, Search, X } from 'lucide-vue-next'
import { portfolioProjects } from '~/data/projects'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const router = useRouter()
const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const { data: blogPosts } = await useAsyncData('search-blog-index', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .only(['_path', 'title', 'description', 'tags', 'date'])
    .sort({ date: -1 })
    .find()
)

interface SearchItem {
  type: 'blog' | 'project'
  title: string
  subtitle: string
  to: string
  tags: string[]
}

const allItems = computed<SearchItem[]>(() => {
  const posts: SearchItem[] = (blogPosts.value || []).map((post) => ({
    type: 'blog',
    title: post.title || '无标题文章',
    subtitle: post.description || '',
    to: post._path || '/blog',
    tags: Array.isArray(post.tags) ? post.tags : []
  }))

  const projects: SearchItem[] = portfolioProjects.map((project) => ({
    type: 'project',
    title: project.title,
    subtitle: project.summary,
    to: `/projects#${project.slug}`,
    tags: project.tech
  }))

  return [...posts, ...projects]
})

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allItems.value.slice(0, 8)
  return allItems.value.filter((item) => {
    const haystack = [item.title, item.subtitle, ...item.tags].join(' ').toLowerCase()
    return haystack.includes(q)
  })
})

function close() {
  emit('update:modelValue', false)
}

function selectItem(item: SearchItem) {
  close()
  router.push(item.to)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, Math.max(filteredItems.value.length - 1, 0))
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter' && filteredItems.value[activeIndex.value]) {
    e.preventDefault()
    selectItem(filteredItems.value[activeIndex.value])
  }
}

watch(() => props.modelValue, (open) => {
  if (open) {
    query.value = ''
    activeIndex.value = 0
    nextTick(() => inputRef.value?.focus())
  }
})

watch(query, () => {
  activeIndex.value = 0
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[12vh] backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="w-full max-w-xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/[0.12] dark:bg-[#1C1C1E]/95"
          @keydown="handleKeydown"
        >
          <div class="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 dark:border-white/[0.08]">
            <Search class="h-4 w-4 shrink-0 text-[#6E6E73]" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="搜索文章、项目或标签..."
              class="w-full bg-transparent text-sm text-[#1D1D1F] placeholder-[#86868B] outline-none dark:text-[#F5F5F7]"
            />
            <button
              type="button"
              class="rounded-full p-1 text-[#86868B] hover:bg-black/[0.05] hover:text-[#1D1D1F] dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="关闭搜索"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto p-2">
            <div v-if="filteredItems.length === 0" class="py-10 text-center text-sm text-[#6E6E73]">
              没有找到与「{{ query }}」相关的内容
            </div>

            <button
              v-for="(item, idx) in filteredItems"
              :key="item.to + item.title"
              type="button"
              class="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
              :class="
                idx === activeIndex
                  ? 'bg-[#0071E3]/[0.08] dark:bg-[#2997FF]/15'
                  : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
              "
              @mouseenter="activeIndex = idx"
              @click="selectItem(item)"
            >
              <component
                :is="item.type === 'blog' ? FileText : FolderKanban"
                class="mt-0.5 h-4 w-4 shrink-0"
                :class="idx === activeIndex ? 'text-[#0071E3] dark:text-[#2997FF]' : 'text-[#86868B]'"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {{ item.title }}
                  </span>
                  <span class="shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-medium text-[#6E6E73] dark:bg-white/10 dark:text-[#A1A1A6]">
                    {{ item.type === 'blog' ? '文章' : '项目' }}
                  </span>
                </div>
                <p v-if="item.subtitle" class="mt-0.5 truncate text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
                  {{ item.subtitle }}
                </p>
              </div>
            </button>
          </div>

          <div class="hidden sm:flex items-center justify-between border-t border-black/[0.06] px-4 py-2 text-[11px] text-[#86868B] dark:border-white/[0.08]">
            <span>↑↓ 选择 · Enter 打开</span>
            <span>ESC 关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
