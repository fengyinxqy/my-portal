#!/usr/bin/env node
/**
 * Obsidian -> My Portal 一键同步脚本
 *
 * 使用方式：
 *   1. 在 Obsidian 笔记的 YAML frontmatter 中添加：
 *      publish: true
 *      type: blog   # 可选: blog（默认）或 now
 *      slug: my-post # 可选：自定义 URL slug
 *   2. 运行: pnpm sync:obsidian
 *
 * 环境变量：
 *   OBSIDIAN_VAULT_PATH=d:/UserData/Desktop/个人/知识库
 */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT_DIR = process.cwd()
const DEFAULT_VAULT = 'd:/UserData/Desktop/个人/知识库'

// Simple .env loader (no extra dependency needed)
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    val = val.replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const VAULT_DIR = path.resolve(process.env.OBSIDIAN_VAULT_PATH || DEFAULT_VAULT)
const BLOG_DEST = path.join(ROOT_DIR, 'content', 'blog')
const NOW_DEST = path.join(ROOT_DIR, 'content', 'now')
const IMG_DEST = path.join(ROOT_DIR, 'public', 'images', 'obsidian')

const IGNORE_DIRS = new Set(['.obsidian', '.git', '.trash', '.claudian', 'node_modules'])

function walkFiles(dir, result = []) {
  if (!fs.existsSync(dir)) return result
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(fullPath, result)
    } else {
      result.push(fullPath)
    }
  }
  return result
}

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function sync() {
  if (!fs.existsSync(VAULT_DIR)) {
    console.error(`❌ 找不到 Obsidian 知识库目录: ${VAULT_DIR}`)
    console.error('请在 .env 中配置正确的 OBSIDIAN_VAULT_PATH')
    process.exit(1)
  }

  console.log(`🔍 正在扫描 Obsidian 知识库: ${VAULT_DIR}`)
  const allFiles = walkFiles(VAULT_DIR)

  // Build attachment index (basename -> fullPath) for ![[image.png]] resolution
  const assetMap = new Map()
  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase()
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'].includes(ext)) {
      assetMap.set(path.basename(file), file)
    }
  }

  const mdFiles = allFiles.filter((f) => f.endsWith('.md'))
  ensureDir(BLOG_DEST)
  ensureDir(NOW_DEST)
  ensureDir(IMG_DEST)

  const syncedTargets = new Set()
  let blogCount = 0
  let nowCount = 0
  let imgCount = 0

  for (const mdPath of mdFiles) {
    const raw = fs.readFileSync(mdPath, 'utf-8')
    let parsed
    try {
      parsed = matter(raw)
    } catch {
      continue
    }

    const data = parsed.data || {}
    if (data.publish !== true) continue

    const type = data.type === 'now' ? 'now' : 'blog'
    const baseName = path.basename(mdPath, '.md')
    const slug = data.slug ? slugify(String(data.slug)) : slugify(baseName)
    const destDir = type === 'now' ? NOW_DEST : BLOG_DEST
    const destPath = path.join(destDir, `${slug}.md`)

    // Transform Obsidian image embeds ![[image.png]] or ![[image.png|alt]]
    let content = parsed.content.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alt) => {
      const cleanName = path.basename(target.trim())
      const srcAsset = assetMap.get(cleanName)
      if (srcAsset) {
        const targetAsset = path.join(IMG_DEST, cleanName)
        fs.copyFileSync(srcAsset, targetAsset)
        imgCount++
        return `![${(alt || cleanName).trim()}](/images/obsidian/${encodeURIComponent(cleanName)})`
      }
      return `![${(alt || cleanName).trim()}](${target.trim()})`
    })

    // Transform Obsidian wikilinks [[Note|Alias]] -> Alias, [[Note]] -> Note
    content = content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
      return (alias || target).trim()
    })

    const nextFrontmatter = {
      title: data.title || baseName,
      description: data.description || '',
      date: data.date
        ? new Date(data.date).toISOString().split('T')[0]
        : fs.statSync(mdPath).mtime.toISOString().split('T')[0],
      ...(data.tags ? { tags: Array.isArray(data.tags) ? data.tags : [data.tags] } : {}),
      ...(data.tag ? { tag: data.tag } : {}),
      syncedFromObsidian: true
    }

    const output = matter.stringify(content.trimStart(), nextFrontmatter)
    fs.writeFileSync(destPath, output, 'utf-8')
    syncedTargets.add(destPath)

    if (type === 'now') nowCount++
    else blogCount++
  }

  // Clean up previously synced Obsidian files that are no longer publish: true
  for (const dir of [BLOG_DEST, NOW_DEST]) {
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue
      const fullPath = path.join(dir, file)
      if (syncedTargets.has(fullPath)) continue
      try {
        const { data } = matter(fs.readFileSync(fullPath, 'utf-8'))
        if (data?.syncedFromObsidian === true) {
          fs.unlinkSync(fullPath)
          console.log(`🧹 已清理取消发布的文章: ${path.relative(ROOT_DIR, fullPath)}`)
        }
      } catch {
        // ignore
      }
    }
  }

  console.log(`✅ 同步完成：博客 ${blogCount} 篇，动态 ${nowCount} 条，图片资源 ${imgCount} 个。`)
}

sync()
