<script setup lang="ts">
import { Github, Mail, Rss } from 'lucide-vue-next'
import { profile } from '~/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="no-print mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
    <div class="flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-zinc-400">
      <p>
        © {{ year }} {{ profile.name }} · Crafted with Nuxt 3 & Tailwind CSS
      </p>
      <div class="flex items-center gap-4">
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 transition hover:text-[#007AFF]"
        >
          <Github class="h-3.5 w-3.5" />
          GitHub
        </a>
        <a
          :href="`mailto:${profile.email}`"
          class="inline-flex items-center gap-1.5 transition hover:text-[#007AFF]"
        >
          <Mail class="h-3.5 w-3.5" />
          Email
        </a>
        <a
          href="/rss.xml"
          target="_blank"
          class="inline-flex items-center gap-1.5 transition hover:text-[#007AFF]"
        >
          <Rss class="h-3.5 w-3.5" />
          RSS
        </a>
      </div>
    </div>
  </footer>
</template>
