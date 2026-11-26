# My Portal · 个人门户网站

基于 **Nuxt 3 + Tailwind CSS + `@nuxt/content`** 构建的个人门户与数字花园（纯静态生成 SSG）。

## 核心功能
- **首页 (`/`)**：现代极简 Bento 卡片网格（名片、近期专注、核心技术栈、精选项目、最新文章与动态）
- **简历 (`/resume`)**：结构化在线简历 + 专用 `@media print` 一键导出 A4 PDF + 脱敏联系方式
- **项目 (`/projects`)**：分类筛选作品集（Demo 链接、源码链接、核心亮点）
- **博客 (`/blog`)**：标签筛选、侧边大纲目录（TOC）、代码高亮与一键复制、中英阅读时长估算
- **动态 (`/now`)**：顶部「当前专注」状态卡片 + 底部按时间倒序的近期动态时间线
- **全局能力**：深浅色模式切换、`Cmd+K` / `Ctrl+K` 全站搜索、RSS 订阅 (`/rss.xml`)、Sitemap (`/sitemap.xml`)

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发预览 (http://localhost:3000)
pnpm dev

# 生成纯静态站点 (.output/public)
pnpm generate
```

## 个人资料定制
只需修改 `data/` 目录下的 4 个文件即可替换为你的真实信息：
- `data/profile.ts`：姓名、职位、简介、邮箱、GitHub、微信号、核心技术栈
- `data/resume.ts`：工作经历、代表项目、技能矩阵、教育背景
- `data/projects.ts`：作品集项目列表
- `data/now.ts`：`/now` 页面顶部的 3 张当前专注状态卡片

---

## Obsidian 一键同步工作流

1. 复制 `.env.example` 为 `.env`，确认 `OBSIDIAN_VAULT_PATH` 指向你的知识库路径（默认已是 `d:/UserData/Desktop/个人/知识库`）。
2. 在任意 Obsidian 笔记顶部 YAML frontmatter 添加 `publish: true`：

```yaml
---
title: 文章标题
description: 一句话摘要
date: 2026-11-26
publish: true
type: blog   # blog（默认）或 now（同步到动态时间线）
tags: [Vue3, 前端]
---
```

3. 在本项目根目录执行：

```bash
pnpm sync:obsidian
```

脚本会自动：
- 扫描所有 `publish: true` 的笔记并按 `type` 分别写入 `content/blog/` 与 `content/now/`
- 将 `![[图片.png]]` 自动复制到 `public/images/obsidian/` 并替换为标准 Markdown 图片路径
- 将 `[[双链|别名]]` 清理为可读文本
- 自动清理此前同步但已取消 `publish: true` 的旧文章

---

## 免费部署（Cloudflare Pages / Vercel）
将本仓库推送到 GitHub 后，在 Cloudflare Pages 或 Vercel 导入仓库：
- **Build command**: `pnpm generate`
- **Output directory**: `.output/public`
- 配置环境变量 `NUXT_PUBLIC_SITE_URL=https://你的域名`
