<script setup lang="ts">
import { Github, Mail, Rss } from 'lucide-vue-next'
import { profile } from '~/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="no-print mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
    <div class="flex flex-col gap-3 border-t border-black/[0.06] pt-6 text-xs text-[#6E6E73] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08] dark:text-[#86868B]">
      <p>© {{ year }} {{ profile.name }}</p>
      <div class="flex items-center gap-5">
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 transition-colors hover:text-[#1D1D1F] dark:hover:text-white"
        >
          <Github class="h-3.5 w-3.5" />
          GitHub
        </a>
        <a
          :href="`mailto:${profile.email}`"
          class="inline-flex items-center gap-1.5 transition-colors hover:text-[#1D1D1F] dark:hover:text-white"
        >
          <Mail class="h-3.5 w-3.5" />
          Email
        </a>
        <a
          href="/rss.xml"
          target="_blank"
          class="inline-flex items-center gap-1.5 transition-colors hover:text-[#1D1D1F] dark:hover:text-white"
        >
          <Rss class="h-3.5 w-3.5" />
          RSS
        </a>
      </div>
    </div>
  </footer>
</template>
