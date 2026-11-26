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
    <!-- Apple Aurora Ambient Mesh Background (Hidden on Print) -->
    <div aria-hidden="true" class="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full bg-indigo-400/25 blur-[110px] dark:bg-indigo-600/20" />
      <div class="absolute top-12 -right-24 h-[440px] w-[440px] rounded-full bg-sky-300/35 blur-[110px] dark:bg-sky-500/15" />
      <div class="absolute top-[42%] left-1/3 h-[380px] w-[380px] rounded-full bg-fuchsia-300/20 blur-[120px] dark:bg-violet-600/15" />
      <div class="absolute -bottom-32 right-1/4 h-[420px] w-[420px] rounded-full bg-teal-300/20 blur-[120px] dark:bg-cyan-600/10" />
    </div>

    <AppHeader @open-search="openSearch" />

    <main class="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 pt-6 pb-12 sm:pt-8 sm:pb-16">
      <slot />
    </main>

    <AppFooter />

    <SearchModal v-model="isSearchOpen" />
  </div>
</template>
