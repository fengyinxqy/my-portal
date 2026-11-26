<script setup lang="ts">
import {
  ChevronDown,
  Disc3,
  GripVertical,
  ListMusic,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-vue-next'

const {
  tracks,
  currentIndex,
  currentTrack,
  isPlaying,
  isExpanded,
  isLoading,
  statusTip,
  currentTime,
  duration,
  progress,
  volume,
  isMuted,
  togglePlay,
  selectTrack,
  nextTrack,
  prevTrack,
  seekToPercent,
  setVolume,
  toggleMute
} = useMusicPlayer()

const showPlaylist = ref(false)
const coverErrorMap = reactive<Record<string, boolean>>({})
const containerRef = ref<HTMLElement | null>(null)
const capsuleRef = ref<HTMLElement | null>(null)

// Draggable state (persisted in localStorage, always clamped inside viewport)
const STORAGE_KEY = 'portal-music-capsule-pos'
const DRAG_THRESHOLD = 5
const MARGIN = 12
const TOP_SAFE = 68

const hasCustomPos = ref(false)
const pos = reactive({ x: 20, y: 0 })
const isDragging = ref(false)
const openBelow = ref(false)
const alignRight = ref(false)

let pointerActive = false
let didMoveBeyondThreshold = false
let startClientX = 0
let startClientY = 0
let startPosX = 0
let startPosY = 0

function getCapsuleSize() {
  const rect = capsuleRef.value?.getBoundingClientRect()
  return {
    width: rect?.width || 180,
    height: rect?.height || 44
  }
}

function clampPosition(x: number, y: number) {
  if (!import.meta.client) return { x, y }
  const { width, height } = getCapsuleSize()
  const maxX = Math.max(MARGIN, window.innerWidth - width - MARGIN)
  const maxY = Math.max(TOP_SAFE, window.innerHeight - height - MARGIN)
  return {
    x: Math.min(maxX, Math.max(MARGIN, x)),
    y: Math.min(maxY, Math.max(TOP_SAFE, y))
  }
}

function updatePanelDirection() {
  if (!import.meta.client) return
  const rect = capsuleRef.value?.getBoundingClientRect()
  const centerX = rect ? rect.left + rect.width / 2 : pos.x
  const centerY = rect ? rect.top + rect.height / 2 : pos.y
  openBelow.value = centerY < window.innerHeight * 0.48
  alignRight.value = centerX > window.innerWidth * 0.55
}

function savePosition() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: Math.round(pos.x), y: Math.round(pos.y) }))
  } catch {
    // ignore storage errors
  }
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 && e.pointerType === 'mouse') return
  const target = e.target as HTMLElement
  // Do not hijack play button clicks
  if (target.closest('[data-no-drag]')) return

  const rect = capsuleRef.value?.getBoundingClientRect()
  if (!rect) return

  pointerActive = true
  didMoveBeyondThreshold = false
  startClientX = e.clientX
  startClientY = e.clientY
  startPosX = rect.left
  startPosY = rect.top

  window.addEventListener('pointermove', onPointerMove, { passive: false })
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!pointerActive) return
  const dx = e.clientX - startClientX
  const dy = e.clientY - startClientY

  if (!didMoveBeyondThreshold) {
    if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    didMoveBeyondThreshold = true
    isDragging.value = true
    hasCustomPos.value = true
  }

  e.preventDefault()
  const clamped = clampPosition(startPosX + dx, startPosY + dy)
  pos.x = clamped.x
  pos.y = clamped.y
  updatePanelDirection()
}

function onPointerUp() {
  if (!pointerActive) return
  pointerActive = false
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)

  if (didMoveBeyondThreshold) {
    savePosition()
    // Keep dragging flag briefly so trailing click after release doesn't toggle panel
    window.setTimeout(() => {
      isDragging.value = false
      didMoveBeyondThreshold = false
    }, 60)
  } else {
    isDragging.value = false
  }
}

function handleCapsuleToggle() {
  if (isDragging.value || didMoveBeyondThreshold) return
  updatePanelDirection()
  isExpanded.value = !isExpanded.value
}

function handleResize() {
  if (!hasCustomPos.value) {
    updatePanelDirection()
    return
  }
  const clamped = clampPosition(pos.x, pos.y)
  pos.x = clamped.x
  pos.y = clamped.y
  updatePanelDirection()
}

const wrapperStyle = computed(() => {
  if (!hasCustomPos.value) return undefined
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    bottom: 'auto',
    right: 'auto'
  }
})

const hasValidCover = computed(() => {
  const t = currentTrack.value
  return Boolean(t?.cover && !coverErrorMap[t.id])
})

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function handleSeekClick(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const pct = ((e.clientX - rect.left) / rect.width) * 100
  seekToPercent(pct)
}

function handleOutsideClick(e: MouseEvent) {
  if (!isExpanded.value) return
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isExpanded.value = false
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isExpanded.value) {
    isExpanded.value = false
  }
}

const coverStyle = computed(() => {
  const g = currentTrack.value?.gradient || ['#0071E3', '#1E3A5F']
  return {
    background: `linear-gradient(135deg, ${g[0]} 0%, ${g[1]} 100%)`
  }
})

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
        nextTick(() => {
          const clamped = clampPosition(parsed.x, parsed.y)
          pos.x = clamped.x
          pos.y = clamped.y
          hasCustomPos.value = true
          updatePanelDirection()
        })
      }
    }
  } catch {
    // ignore invalid saved state
  }

  document.addEventListener('click', handleOutsideClick)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
})
</script>

<template>
  <div
    ref="containerRef"
    class="no-print fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6"
    :style="wrapperStyle"
  >
    <!-- Smart-Positioned Expanded Frosted-Glass Popover Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="isExpanded"
        class="music-panel absolute w-[296px] sm:w-[320px] rounded-[22px] p-4"
        :class="[
          openBelow ? 'top-full mt-2.5' : 'bottom-full mb-2.5',
          alignRight ? 'right-0' : 'left-0',
          openBelow && alignRight ? 'origin-top-right' : '',
          openBelow && !alignRight ? 'origin-top-left' : '',
          !openBelow && alignRight ? 'origin-bottom-right' : '',
          !openBelow && !alignRight ? 'origin-bottom-left' : ''
        ]"
      >
        <!-- Header: Artwork + Track Info + Collapse -->
        <div class="flex items-center gap-3">
          <div
            class="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/40 shadow-sm dark:border-white/15"
            :style="hasValidCover ? undefined : coverStyle"
          >
            <img
              v-if="hasValidCover"
              :src="currentTrack.cover"
              :alt="currentTrack.title"
              class="h-full w-full object-cover"
              @error="coverErrorMap[currentTrack.id] = true"
            />
            <div v-else class="flex h-full w-full items-center justify-center text-white/90">
              <Disc3
                class="h-6 w-6 disc-spin"
                :class="{ 'is-spinning': isPlaying }"
              />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              {{ currentTrack.title }}
            </p>
            <p class="mt-0.5 truncate text-xs text-[#6E6E73] dark:text-[#A1A1A6]">
              {{ statusTip || currentTrack.artist }}
            </p>
          </div>

          <button
            type="button"
            aria-label="收起播放器"
            class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6E6E73] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white"
            @click="isExpanded = false"
          >
            <ChevronDown class="h-4 w-4" :class="{ 'rotate-180': openBelow }" />
          </button>
        </div>

        <!-- Interactive Progress Bar -->
        <div class="mt-4 space-y-1.5">
          <div
            role="slider"
            tabindex="0"
            aria-label="播放进度"
            :aria-valuenow="Math.round(progress)"
            aria-valuemin="0"
            aria-valuemax="100"
            class="group relative flex h-3 cursor-pointer items-center"
            @click="handleSeekClick"
          >
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.08] dark:bg-white/[0.12]">
              <div
                class="h-full rounded-full bg-[#0071E3] transition-[width] duration-150 dark:bg-[#2997FF]"
                :style="{ width: `${progress}%` }"
              />
            </div>
          </div>
          <div class="flex items-center justify-between font-mono text-[10px] tabular-nums text-[#86868B]">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Transport & Volume Controls -->
        <div class="mt-2.5 flex items-center justify-between">
          <!-- Volume -->
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              :aria-label="isMuted ? '取消静音' : '静音'"
              class="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6E6E73] transition-colors hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white"
              @click="toggleMute"
            >
              <VolumeX v-if="isMuted || volume === 0" class="h-3.5 w-3.5" />
              <Volume2 v-else class="h-3.5 w-3.5" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              :value="isMuted ? 0 : volume"
              aria-label="音量"
              class="h-1 w-14 cursor-pointer accent-[#0071E3] dark:accent-[#2997FF]"
              @input="setVolume(Number(($event.target as HTMLInputElement).value))"
            />
          </div>

          <!-- Prev / Play / Next -->
          <div class="flex items-center gap-1">
            <button
              type="button"
              aria-label="上一首"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#1D1D1F] transition-colors hover:bg-black/[0.06] dark:text-[#F5F5F7] dark:hover:bg-white/10"
              @click="prevTrack"
            >
              <SkipBack class="h-4 w-4" />
            </button>
            <button
              type="button"
              :aria-label="isPlaying ? '暂停' : '播放'"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1D1D1F] text-white shadow-sm transition-transform hover:scale-105 active:scale-95 dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
              @click="togglePlay"
            >
              <Pause v-if="isPlaying" class="h-4 w-4 fill-current" />
              <Play v-else class="h-4 w-4 translate-x-[1px] fill-current" />
            </button>
            <button
              type="button"
              aria-label="下一首"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#1D1D1F] transition-colors hover:bg-black/[0.06] dark:text-[#F5F5F7] dark:hover:bg-white/10"
              @click="nextTrack()"
            >
              <SkipForward class="h-4 w-4" />
            </button>
          </div>

          <!-- Playlist Toggle -->
          <button
            type="button"
            aria-label="展开播放列表"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors"
            :class="
              showPlaylist
                ? 'bg-[#0071E3]/12 text-[#0071E3] dark:bg-[#2997FF]/20 dark:text-[#47A6FF]'
                : 'text-[#6E6E73] hover:bg-black/[0.06] hover:text-[#1D1D1F] dark:text-[#A1A1A6] dark:hover:bg-white/10 dark:hover:text-white'
            "
            @click="showPlaylist = !showPlaylist"
          >
            <ListMusic class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Playlist Drawer -->
        <div
          v-if="showPlaylist"
          class="mt-3 max-h-44 space-y-1 overflow-y-auto border-t border-black/[0.06] pt-2.5 dark:border-white/[0.08]"
        >
          <button
            v-for="(track, idx) in tracks"
            :key="track.id"
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left transition-colors"
            :class="
              idx === currentIndex
                ? 'bg-[#0071E3]/[0.1] text-[#0071E3] dark:bg-[#2997FF]/[0.15] dark:text-[#47A6FF]'
                : 'text-[#3A3A3C] hover:bg-black/[0.04] dark:text-[#D1D1D6] dark:hover:bg-white/[0.06]'
            "
            @click="selectTrack(idx, true)"
          >
            <div class="min-w-0">
              <p class="truncate text-xs font-medium">{{ track.title }}</p>
              <p class="truncate text-[11px] opacity-70">{{ track.artist }}</p>
            </div>
            <span
              v-if="idx === currentIndex && isPlaying"
              class="eq-bars shrink-0"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Draggable Compact Floating Capsule -->
    <div
      ref="capsuleRef"
      class="music-capsule inline-flex select-none items-center gap-1.5 rounded-full p-1.5 sm:pr-2.5 touch-none"
      :class="isDragging ? 'cursor-grabbing scale-[1.04] shadow-2xl' : 'cursor-grab transition-transform duration-200 hover:scale-[1.015]'"
      title="按住拖动位置，轻点展开歌单"
      @pointerdown="onPointerDown"
    >
      <!-- Subtle Drag Handle Hint -->
      <GripVertical class="hidden sm:block h-3.5 w-3.5 shrink-0 text-[#86868B]/60" aria-hidden="true" />

      <!-- Spinning Mini Disc / Cover (click to expand) -->
      <button
        type="button"
        aria-label="展开音乐播放器"
        class="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/40 shadow-sm dark:border-white/15"
        :style="hasValidCover ? undefined : coverStyle"
        @click="handleCapsuleToggle"
      >
        <img
          v-if="hasValidCover"
          :src="currentTrack.cover"
          :alt="currentTrack.title"
          class="disc-spin pointer-events-none h-full w-full object-cover"
          :class="{ 'is-spinning': isPlaying }"
          @error="coverErrorMap[currentTrack.id] = true"
        />
        <Disc3
          v-else
          class="disc-spin pointer-events-none h-4 w-4 text-white/95"
          :class="{ 'is-spinning': isPlaying }"
        />
      </button>

      <!-- Track Info (clickable to toggle panel) -->
      <button
        type="button"
        class="hidden sm:flex min-w-0 max-w-[132px] flex-col text-left pl-0.5"
        @click="handleCapsuleToggle"
      >
        <span class="flex items-center gap-1.5 truncate text-xs font-semibold leading-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          <span class="truncate">{{ currentTrack.title }}</span>
          <span v-if="isPlaying" class="eq-bars shrink-0" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </span>
        <span class="truncate text-[10px] leading-tight text-[#6E6E73] dark:text-[#A1A1A6]">
          {{ isLoading ? '缓冲中…' : statusTip || currentTrack.artist }}
        </span>
      </button>

      <!-- Quick Play / Pause Button -->
      <button
        type="button"
        data-no-drag
        :aria-label="isPlaying ? '暂停音乐' : '播放音乐'"
        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/[0.06] text-[#1D1D1F] transition-colors hover:bg-[#0071E3] hover:text-white dark:bg-white/[0.12] dark:text-[#F5F5F7] dark:hover:bg-[#2997FF] dark:hover:text-black"
        @click.stop="togglePlay"
      >
        <Pause v-if="isPlaying" class="h-3.5 w-3.5 fill-current" />
        <Play v-else class="h-3.5 w-3.5 translate-x-[0.5px] fill-current" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.music-capsule,
.music-panel {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(26px) saturate(185%);
  -webkit-backdrop-filter: blur(26px) saturate(185%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow:
    inset 0 1px 0.5px rgba(255, 255, 255, 0.95),
    0 10px 30px -8px rgba(15, 23, 42, 0.16),
    0 2px 6px rgba(15, 23, 42, 0.06);
}

:global(.dark) .music-capsule,
:global(.dark) .music-panel {
  background: rgba(26, 28, 36, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0.5px rgba(255, 255, 255, 0.18),
    0 14px 36px -6px rgba(0, 0, 0, 0.55);
}

.disc-spin {
  animation: disc-rotate 10s linear infinite;
  animation-play-state: paused;
}

.disc-spin.is-spinning {
  animation-play-state: running;
}

@keyframes disc-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.eq-bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 10px;
}

.eq-bars i {
  display: block;
  width: 2px;
  border-radius: 9999px;
  background: currentColor;
  animation: eq-bounce 0.9s ease-in-out infinite alternate;
}

.eq-bars i:nth-child(1) {
  height: 4px;
  animation-delay: 0s;
}
.eq-bars i:nth-child(2) {
  height: 9px;
  animation-delay: 0.22s;
}
.eq-bars i:nth-child(3) {
  height: 6px;
  animation-delay: 0.44s;
}

@keyframes eq-bounce {
  from {
    transform: scaleY(0.35);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
