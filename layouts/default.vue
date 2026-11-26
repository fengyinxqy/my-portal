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
  <div class="relative min-h-screen flex flex-col">
    <!-- Subtle daylight top wash (Apple-style restraint, no loud neon blobs) -->
    <div
      aria-hidden="true"
      class="no-print pointer-events-none fixed inset-x-0 top-0 -z-10 h-[360px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,113,227,0.07),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(41,151,255,0.12),transparent_70%)]"
    />

    <AppHeader @open-search="openSearch" />

    <main class="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <slot />
    </main>

    <AppFooter />

    <SearchModal v-model="isSearchOpen" />
  </div>
</template>
