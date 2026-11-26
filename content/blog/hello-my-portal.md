---
title: 为什么我用 Nuxt 3 + Obsidian 搭建个人门户
description: 分享这个个人门户网站的设计思路：如何兼顾求职简历展示、作品集与日常 Obsidian 写作流。
date: 2026-11-26
tags:
  - Nuxt3
  - Obsidian
  - 个人品牌
---

## 为什么要做一个个人门户？

对于前端工程师来说，个人网站不仅仅是一个写博客的地方，它更像是一张**随时在线的立体名片**：

- **给面试官与 HR**：除了静态 PDF 简历，还能直观看到线上代码质感、组件交互细节和近期学习状态。
- **给自己**：把散落在本地笔记里的项目复盘、技术文章和阶段性进展沉淀下来，形成长期复利。

## 为什么选择 Nuxt 3 + SSG？

相比纯动态服务端渲染，个人门户和博客天然适合**纯静态生成（SSG）**：

1. **极速首屏**：构建产物是纯静态 HTML + 轻量水合 JS，配合 Cloudflare Pages / Vercel 全球分发几乎秒开。
2. **零运维成本**：不需要维护数据库与后端服务器，Git 推送即自动构建部署。
3. **Vue 生态原生体验**：可以直接在 Markdown 中使用 Vue 组件，简历和作品集也能随时加入丰富的交互。

```ts
// nuxt.config.ts 中开启静态预渲染
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/resume', '/projects', '/blog', '/now', '/rss.xml', '/sitemap.xml']
    }
  }
})
```

## 与 Obsidian 知识库的联动

我日常使用 Obsidian 管理知识库，但并不希望把整个私人笔记库全部公开。因此采用了**显式标记发布**的工作流：

- 只有 frontmatter 中带有 `publish: true` 的笔记才会被同步脚本提取。
- 通过 `type: blog` 或 `type: now` 自动分流到「博客」或「动态时间线」。
- 笔记里的 `![[图片.png]]` 会被自动查找并复制到 `public/images/obsidian/`。

```yaml
---
title: 我的第一篇同步文章
date: 2026-11-26
publish: true
type: blog
tags: [Vue3, 前端工程]
---
```

## 接下来

后续我会陆续在这里更新前端工程实践、算法复盘以及最近正在折腾的小项目。欢迎通过简历页的邮箱或微信交流！
