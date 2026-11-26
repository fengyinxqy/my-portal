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
      enter-active-class="transition duration-200 ease-apple"
      enter-from-class="opacity-0 scale-[0.98]"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-[0.98]"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/30 px-4 pt-[12vh] backdrop-blur-md"
        @click.self="close"
      >
        <div
          class="w-full max-w-xl overflow-hidden rounded-[24px] border border-white/85 bg-white/85 shadow-2xl backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-white/80 dark:border-white/15 dark:bg-zinc-900/85 dark:ring-white/10"
          @keydown="handleKeydown"
        >
          <div class="flex items-center gap-3 border-b border-slate-200/70 px-5 py-3.5 dark:border-white/10">
            <Search class="h-4 w-4 shrink-0 text-[#007AFF]" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Spotlight 搜索博客文章、项目或技术栈..."
              class="w-full bg-transparent text-sm text-[#1D1D1F] placeholder-slate-400 outline-none dark:text-[#F5F5F7]"
            />
            <button
              type="button"
              class="rounded-full p-1 text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="关闭搜索"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto p-2.5">
            <div v-if="filteredItems.length === 0" class="py-10 text-center text-sm text-slate-500">
              未找到与「{{ query }}」相关的内容
            </div>

            <button
              v-for="(item, idx) in filteredItems"
              :key="item.to + item.title"
              type="button"
              class="flex w-full items-start gap-3 rounded-2xl px-3.5 py-2.5 text-left transition"
              :class="
                idx === activeIndex
                  ? 'bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/20'
                  : 'hover:bg-white/70 dark:hover:bg-white/5'
              "
              @mouseenter="activeIndex = idx"
              @click="selectItem(item)"
            >
              <component
                :is="item.type === 'blog' ? FileText : FolderKanban"
                class="mt-0.5 h-4 w-4 shrink-0"
                :class="idx === activeIndex ? 'text-[#007AFF]' : 'text-slate-400'"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {{ item.title }}
                  </span>
                  <span class="shrink-0 rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-zinc-300">
                    {{ item.type === 'blog' ? '博客' : '项目' }}
                  </span>
                </div>
                <p v-if="item.subtitle" class="mt-0.5 truncate text-xs text-slate-500 dark:text-zinc-400">
                  {{ item.subtitle }}
                </p>
              </div>
            </button>
          </div>

          <div class="flex items-center justify-between border-t border-slate-200/70 px-5 py-2.5 text-[11px] text-slate-400 dark:border-white/10">
            <span>↑↓ 选择 · Enter 打开</span>
            <span>ESC 关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
