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
  <div class="min-h-screen flex flex-col">
    <AppHeader @open-search="openSearch" />

    <main class="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
      <slot />
    </main>

    <AppFooter />

    <SearchModal v-model="isSearchOpen" />
  </div>
</template>
