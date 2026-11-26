<script setup lang="ts">
import { Github, Mail, Rss } from 'lucide-vue-next'
import { profile } from '~/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="no-print border-t border-zinc-200/70 dark:border-zinc-800/70">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
      <p>
        © {{ year }} {{ profile.name }} · 使用 Nuxt 3 与 Tailwind CSS 构建
      </p>
      <div class="flex items-center gap-4">
        <a
          :href="profile.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 transition hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Github class="h-3.5 w-3.5" />
          GitHub
        </a>
        <a
          :href="`mailto:${profile.email}`"
          class="inline-flex items-center gap-1.5 transition hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Mail class="h-3.5 w-3.5" />
          Email
        </a>
        <a
          href="/rss.xml"
          target="_blank"
          class="inline-flex items-center gap-1.5 transition hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Rss class="h-3.5 w-3.5" />
          RSS
        </a>
      </div>
    </div>
  </footer>
</template>
