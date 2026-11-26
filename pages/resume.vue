<script setup lang="ts">
import { Award, Check, Copy, Github, Mail, MapPin, MessageSquare, Printer, ShieldCheck } from 'lucide-vue-next'
import { profile } from '~/data/profile'
import { resumeData } from '~/data/resume'

useSeoMeta({
  title: '简历',
  description: `${profile.name} 的在线简历：${profile.role}`,
  ogTitle: `${profile.name} · 在线简历`,
  ogDescription: resumeData.summary
})

const copiedEmail = ref(false)
const copiedWechat = ref(false)
const showWechat = ref(false)

function printPdf() {
  window.print()
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
    copiedEmail.value = true
    setTimeout(() => {
      copiedEmail.value = false
    }, 1800)
  } catch {
    // ignore
  }
}

async function copyWechat() {
  try {
    await navigator.clipboard.writeText(profile.wechatId)
    copiedWechat.value = true
    setTimeout(() => {
      copiedWechat.value = false
    }, 1800)
  } catch {
    // ignore
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Action Toolbar (Hidden when printing) -->
    <div class="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          在线简历
        </h1>
        <p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          最后更新于 {{ resumeData.updatedAt }} · 支持一键导出 A4 排版 PDF
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="apple-btn-secondary px-4 py-2 text-xs"
          @click="copyEmail"
        >
          <Check v-if="copiedEmail" class="h-3.5 w-3.5 text-emerald-500" />
          <Copy v-else class="h-3.5 w-3.5" />
          {{ copiedEmail ? '已复制邮箱' : '复制邮箱' }}
        </button>

        <button
          type="button"
          class="apple-btn-secondary px-4 py-2 text-xs"
          @click="showWechat = !showWechat"
        >
          <MessageSquare class="h-3.5 w-3.5" />
          微信联系
        </button>

        <button
          type="button"
          class="apple-btn-primary px-4 py-2 text-xs"
          @click="printPdf"
        >
          <Printer class="h-3.5 w-3.5" />
          导出 / 打印 PDF
        </button>
      </div>
    </div>

    <!-- Privacy Drawer -->
    <div
      v-if="showWechat"
      class="no-print bento-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20"
    >
      <div class="space-y-1">
        <p class="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <ShieldCheck class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          微信号：{{ profile.wechatId }}
        </p>
        <p class="text-xs text-zinc-600 dark:text-zinc-400">
          {{ profile.wechatNote }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900"
        @click="copyWechat"
      >
        <Check v-if="copiedWechat" class="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
        <Copy v-else class="h-3.5 w-3.5" />
        {{ copiedWechat ? '已复制微信号' : '复制微信号' }}
      </button>
    </div>

    <!-- Printable A4 Resume Sheet -->
    <article class="bento-card print-container mx-auto max-w-4xl space-y-8 p-6 sm:p-10">
      <!-- Header -->
      <header class="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-zinc-800">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {{ profile.name }}
          </h2>
          <p class="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {{ resumeData.targetRole }}
          </p>
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          <span class="inline-flex items-center gap-1">
            <MapPin class="h-3.5 w-3.5" />
            {{ profile.location }}
          </span>
          <span class="inline-flex items-center gap-1">
            <MessageSquare class="h-3.5 w-3.5" />
            微信：{{ profile.wechatId }}
          </span>
          <a :href="`mailto:${profile.email}`" class="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100">
            <Mail class="h-3.5 w-3.5" />
            {{ profile.email }}
          </a>
          <a :href="profile.github" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100">
            <Github class="h-3.5 w-3.5" />
            {{ profile.github.replace('https://', '') }}
          </a>
        </div>
      </header>

      <!-- Career Summary -->
      <section class="space-y-2.5 print-avoid-break">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          职业概述
        </h3>
        <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li v-for="line in resumeData.summaries" :key="line">
            {{ line }}
          </li>
        </ul>
      </section>

      <!-- Skills -->
      <section class="space-y-3 print-avoid-break">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          专业技能
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="group in resumeData.skillGroups"
            :key="group.label"
            class="glass-inner p-3.5"
          >
            <p class="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {{ group.label }}
            </p>
            <ul class="mt-2 space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li v-for="item in group.items" :key="item">• {{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Work Experience -->
      <section class="space-y-4">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          工作经历
        </h3>
        <div class="space-y-6">
          <div
            v-for="exp in resumeData.experiences"
            :key="exp.company + exp.period"
            class="print-avoid-break space-y-2.5"
          >
            <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h4 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {{ exp.company }}
                </h4>
                <p class="mt-0.5 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  {{ exp.role }}
                  <span v-if="exp.secondaryRole" class="block text-xs text-zinc-500 sm:inline sm:ml-2 dark:text-zinc-400">
                    ｜ {{ exp.secondaryRole }}
                  </span>
                </p>
              </div>
              <span class="font-mono text-xs text-zinc-400">
                {{ exp.period }} · {{ exp.location }}
              </span>
            </div>

            <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <li v-for="item in exp.highlights" :key="item">{{ item }}</li>
            </ul>

            <div class="flex flex-wrap gap-1.5 pt-1">
              <span v-for="t in exp.tech" :key="t" class="pill-tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Highlight Projects -->
      <section class="space-y-5">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          代表项目
        </h3>
        <div class="space-y-6">
          <div
            v-for="proj in resumeData.projects"
            :key="proj.name"
            class="print-avoid-break space-y-2"
          >
            <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h4 class="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {{ proj.name }}
                <span class="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-400">{{ proj.role }}</span>
              </h4>
              <span class="font-mono text-xs text-zinc-400">{{ proj.period }}</span>
            </div>
            <p class="text-sm text-zinc-600 dark:text-zinc-300">{{ proj.description }}</p>
            <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              <li v-for="m in proj.metrics" :key="m">{{ m }}</li>
            </ul>
            <div class="flex flex-wrap gap-1.5 pt-0.5">
              <span v-for="t in proj.tech" :key="t" class="pill-tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Other Frontend Projects -->
      <section class="space-y-3 print-avoid-break">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          其他前端项目
        </h3>
        <ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li v-for="item in resumeData.otherProjects" :key="item.name">
            <span class="font-semibold text-zinc-900 dark:text-zinc-100">{{ item.name }}：</span>
            {{ item.description }}
          </li>
        </ul>
      </section>

      <!-- Education -->
      <section class="space-y-3 print-avoid-break">
        <h3 class="text-xs font-bold uppercase tracking-wider text-zinc-400">
          教育经历
        </h3>
        <div v-for="edu in resumeData.education" :key="edu.school" class="space-y-1">
          <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
            <h4 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {{ edu.school }} · <span class="font-normal text-zinc-600 dark:text-zinc-300">{{ edu.degree }}</span>
            </h4>
            <span class="font-mono text-xs text-zinc-400">{{ edu.period }}</span>
          </div>
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{{ edu.note }}</p>
        </div>
      </section>

      <!-- Open Source & Honors -->
      <section class="space-y-2.5 print-avoid-break">
        <h3 class="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Award class="h-3.5 w-3.5" />
          开源与荣誉
        </h3>
        <ul class="list-disc space-y-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li v-for="honor in resumeData.honors" :key="honor">{{ honor }}</li>
        </ul>
      </section>

      <!-- Privacy footnote -->
      <footer class="border-t border-zinc-100 pt-4 text-[11px] text-zinc-400 dark:border-zinc-800">
        {{ profile.wechatNote }}
      </footer>
    </article>
  </div>
</template>
