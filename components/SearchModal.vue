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
        class="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 px-4 pt-[12vh] backdrop-blur-sm"
        @click.self="close"
      >
        <div
          class="w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
          @keydown="handleKeydown"
        >
          <div class="flex items-center gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <Search class="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="搜索博客文章、项目或技术栈标签..."
              class="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-100"
            />
            <button
              type="button"
              class="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="关闭搜索"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto p-2">
            <div v-if="filteredItems.length === 0" class="py-10 text-center text-sm text-zinc-500">
              未找到与「{{ query }}」相关的内容
            </div>

            <button
              v-for="(item, idx) in filteredItems"
              :key="item.to + item.title"
              type="button"
              class="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition"
              :class="
                idx === activeIndex
                  ? 'bg-zinc-100 dark:bg-zinc-800'
                  : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              "
              @mouseenter="activeIndex = idx"
              @click="selectItem(item)"
            >
              <component
                :is="item.type === 'blog' ? FileText : FolderKanban"
                class="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {{ item.title }}
                  </span>
                  <span class="shrink-0 rounded bg-zinc-200/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                    {{ item.type === 'blog' ? '博客' : '项目' }}
                  </span>
                </div>
                <p v-if="item.subtitle" class="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {{ item.subtitle }}
                </p>
              </div>
            </button>
          </div>

          <div class="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-400 dark:border-zinc-800">
            <span>↑↓ 选择 · Enter 打开</span>
            <span>ESC 关闭</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
