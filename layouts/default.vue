<script setup lang="ts">
const isSearchOpen = ref(false)

function openSearch() {
  isSearchOpen.value = true
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchOpen.value = !isSearchOpen.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col overflow-x-clip">
    <!-- Calm macOS Coastal Daylight / Midnight Ocean Wallpaper Backdrop for Frosted Glass Refraction -->
    <div aria-hidden="true" class="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <!-- Base tonal canvas -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#E6EFFA] via-[#F2F5F9] to-[#EBF3F0] dark:from-[#060912] dark:via-[#0B101D] dark:to-[#081216]" />
      <!-- Soft architectural daylight light-wells (natural sky-blue, glacier-teal, warm pearl — zero neon purple/pink) -->
      <div class="absolute -top-28 -left-20 h-[440px] w-[440px] rounded-full bg-[#9EC9F7]/45 blur-[95px] dark:bg-[#14467A]/35" />
      <div class="absolute top-[18%] -right-24 h-[420px] w-[420px] rounded-full bg-[#A8DDD4]/40 blur-[100px] dark:bg-[#0F4C5C]/30" />
      <div class="absolute top-[52%] left-[12%] h-[360px] w-[360px] rounded-full bg-[#F2DEC6]/45 blur-[100px] dark:bg-[#1E3252]/30" />
      <div class="absolute -bottom-24 right-[18%] h-[400px] w-[400px] rounded-full bg-[#B4D2F5]/40 blur-[100px] dark:bg-[#163A5F]/25" />
    </div>

    <AppHeader @open-search="openSearch" />

    <main class="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <slot />
    </main>

    <AppFooter />

    <SearchModal v-model="isSearchOpen" />
    <ImageLightbox />
  </div>
</template>
