export default defineNuxtConfig({
  compatibilityDate: '2025-03-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      preload: ['ts', 'js', 'vue', 'html', 'css', 'bash', 'json', 'yaml', 'markdown']
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      }
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-domain.com',
      siteName: '肖祺彦 · Web 前端工程师',
      siteDescription: '肖祺彦的个人门户：Web 前端工程师简历、性能治理与 AI 工程化项目、技术博客与近期动态。'
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      titleTemplate: '%s · 肖祺彦',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '肖祺彦的个人门户：Web 前端工程师简历、性能治理与 AI 工程化项目、技术博客与近期动态。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'zh_CN' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS 订阅', href: '/rss.xml' }
      ]
    }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/resume', '/projects', '/blog', '/now', '/rss.xml', '/sitemap.xml']
    }
  }
})
