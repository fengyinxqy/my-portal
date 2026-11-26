<script setup lang="ts">
import { RefreshCw, X } from 'lucide-vue-next'

const config = useRuntimeConfig()
const router = useRouter()

const currentVersion = String(config.public.appVersion || '')
const hasUpdate = ref(false)
const latestVersion = ref('')
const isRefreshing = ref(false)

let dismissedVersion = ''
let lastCheckedAt = 0
let pollTimer: number | null = null
let removeAfterEach: (() => void) | null = null

const MIN_CHECK_GAP_MS = 30_000
const POLL_INTERVAL_MS = 3 * 60 * 1000

async function checkVersion(force = false) {
  if (!import.meta.client || import.meta.dev || !currentVersion) return
  if (document.visibilityState === 'hidden') return

  const now = Date.now()
  if (!force && now - lastCheckedAt < MIN_CHECK_GAP_MS) return
  lastCheckedAt = now

  try {
    const res = await fetch(`/version.json?t=${now}`, {
      cache: 'no-store',
      headers: { 'cache-control': 'no-cache' }
    })
    if (!res.ok) return
    const data = await res.json()
    const remoteVersion = String(data?.version || '')

    if (remoteVersion && remoteVersion !== currentVersion) {
      latestVersion.value = remoteVersion
      if (dismissedVersion !== remoteVersion) {
        hasUpdate.value = true
      }
    }
  } catch {
    // ignore transient offline / network errors
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    checkVersion()
  }
}

function handleFocus() {
  checkVersion()
}

function handlePreloadError() {
  // Lazy chunk 404 after a new deploy -> prompt immediate refresh
  hasUpdate.value = true
}

function refreshNow() {
  isRefreshing.value = true
  window.location.reload()
}

function dismiss() {
  hasUpdate.value = false
  if (latestVersion.value) {
    dismissedVersion = latestVersion.value
  }
}

onMounted(() => {
  if (import.meta.dev) return

  // Initial delayed check (skip immediately on fresh load to avoid redundant fetch)
  pollTimer = window.setInterval(() => {
    checkVersion()
  }, POLL_INTERVAL_MS)

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleFocus)
  window.addEventListener('vite:preloadError', handlePreloadError)

  removeAfterEach = router.afterEach(() => {
    checkVersion()
  })
})

onUnmounted(() => {
  if (pollTimer !== null) {
    window.clearInterval(pollTimer)
  }
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleFocus)
  window.removeEventListener('vite:preloadError', handlePreloadError)
  removeAfterEach?.()
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="-translate-y-3 scale-95 opacity-0"
      enter-to-class="translate-y-0 scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 scale-100 opacity-100"
      leave-to-class="-translate-y-2 scale-95 opacity-0"
    >
      <div
        v-if="hasUpdate"
        role="status"
        aria-live="polite"
        class="no-print fixed left-1/2 top-[68px] z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2"
      >
        <div class="update-toast flex items-center justify-between gap-3 rounded-full py-2 pl-4 pr-2">
          <div class="flex min-w-0 items-center gap-2.5">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0071E3]/12 text-[#0071E3] dark:bg-[#2997FF]/20 dark:text-[#47A6FF]">
              <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isRefreshing }" />
            </span>
            <span class="truncate text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              网站已更新，刷新获取最新内容
            </span>
          </div>

          <div class="flex shrink-0 items-center gap-1">
            <button
              type="button"
              class="rounded-full bg-[#0071E3] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[#0077ED] active:scale-95 dark:bg-[#2997FF] dark:text-black dark:hover:bg-[#47A6FF]"
              @click="refreshNow"
            >
              立即刷新
            </button>
            <button
              type="button"
              aria-label="稍后提醒"
              class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#86868B] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:hover:bg-white/10 dark:hover:text-white"
              @click="dismiss"
            >
              <X class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.update-toast {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(26px) saturate(185%);
  -webkit-backdrop-filter: blur(26px) saturate(185%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    inset 0 1px 0.5px rgba(255, 255, 255, 0.96),
    0 12px 32px -8px rgba(15, 23, 42, 0.16),
    0 2px 6px rgba(15, 23, 42, 0.06);
}

:global(.dark) .update-toast {
  background: rgba(26, 28, 36, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow:
    inset 0 1px 0.5px rgba(255, 255, 255, 0.2),
    0 16px 40px -8px rgba(0, 0, 0, 0.55);
}
</style>
