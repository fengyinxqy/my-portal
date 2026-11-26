#!/usr/bin/env node
/**
 * Obsidian -> My Portal 一键同步脚本
 *
 * 支持特性：
 *   1. 自动扫描 publish: true（布尔或字符串 "true"）的笔记，按 type 分流到 blog / now
 *   2. 自动拷贝本地图片（支持 ![[img.png]]、![[img.png|说明]]、![[img.png|500]] 及标准相对路径 ![alt](./img.png)）
 *   3. 智能转换双链 [[笔记名|别名]]：目标笔记已发布则转为站内链接，未发布则降级为纯文本
 *   4. 自动将 Obsidian Callout（> [!tip] 标题）转为站内 ::callout MDC 组件
 *   5. 严格跳过代码块（``` / ~~~）内部内容，避免误伤示例代码
 *
 * 使用方式：
 *   pnpm sync:obsidian
 *
 * 环境变量：
 *   OBSIDIAN_VAULT_PATH=d:/UserData/Desktop/个人/知识库
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT_DIR = process.cwd()
const DEFAULT_VAULT = 'd:/UserData/Desktop/个人/知识库'

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
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])

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

function toSafeAsciiSlug(name, datePrefix = '') {
  const ascii = String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (ascii.length >= 3) return ascii

  const hash = crypto.createHash('sha1').update(String(name || '')).digest('hex').slice(0, 8)
  return datePrefix ? `${datePrefix}-${hash}` : `post-${hash}`
}

function toSafeImageName(srcPath) {
  const ext = path.extname(srcPath).toLowerCase()
  const base = path.basename(srcPath, ext)
  const relFromVault = path.relative(VAULT_DIR, srcPath)
  const hash = crypto.createHash('sha1').update(relFromVault).digest('hex').slice(0, 8)
  const asciiBase = base
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
  return asciiBase ? `${asciiBase}-${hash}${ext}` : `img-${hash}${ext}`
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function isPublished(val) {
  if (val === true) return true
  if (typeof val === 'string') {
    const norm = val.trim().toLowerCase()
    return norm === 'true' || norm === 'yes' || norm === '1'
  }
  return false
}

function resolveDate(data, mdPath) {
  const raw = data.date || data.created || data.updated
  if (raw) {
    const d = new Date(raw)
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().split('T')[0]
    }
  }
  return fs.statSync(mdPath).mtime.toISOString().split('T')[0]
}

function extractDescription(markdown) {
  const lines = markdown.split(/\r?\n/)
  let inFence = false
  for (const line of lines) {
    const t = line.trim()
    if (/^(`{3,}|~{3,})/.test(t)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (
      !t ||
      t.startsWith('#') ||
      t.startsWith('>') ||
      t.startsWith('---') ||
      t.startsWith('![') ||
      t.startsWith('::')
    ) {
      continue
    }
    const clean = t
      .replace(/^[-*+]\s+/, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim()
    if (clean.length >= 8) {
      return clean.length > 100 ? `${clean.slice(0, 100)}…` : clean
    }
  }
  return ''
}

function resolveLocalImage(target, mdPath, assetMap) {
  let cleaned = String(target || '').trim()
  try {
    cleaned = decodeURIComponent(cleaned)
  } catch {
    // keep raw if malformed percent-encoding
  }
  const mdDir = path.dirname(mdPath)
  const relCandidate = path.resolve(mdDir, cleaned)
  if (fs.existsSync(relCandidate) && fs.statSync(relCandidate).isFile()) {
    return relCandidate
  }
  const vaultCandidate = path.resolve(VAULT_DIR, cleaned)
  if (fs.existsSync(vaultCandidate) && fs.statSync(vaultCandidate).isFile()) {
    return vaultCandidate
  }
  const byName = assetMap.get(path.basename(cleaned))
  if (byName && fs.existsSync(byName)) {
    return byName
  }
  return null
}

function isObsidianSizeHint(str) {
  return /^\d+(?:x\d+)?$/i.test(str.trim())
}

function escapeAttr(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/**
 * Convert Obsidian Callout blockquotes (> [!tip] Title) into @nuxt/content MDC ::callout blocks.
 * Only operates on non-code prose segments.
 */
function transformCallouts(segment) {
  const lines = segment.split(/\r?\n/)
  const out = []
  let i = 0

  while (i < lines.length) {
    const match = lines[i].match(/^>\s*\[!([a-zA-Z0-9_-]+)\]([+-])?(?:\s+(.*))?$/)
    if (!match) {
      out.push(lines[i])
      i++
      continue
    }

    const rawType = match[1].toLowerCase()
    const customTitle = (match[3] || '').trim()
    const bodyLines = []
    i++

    while (i < lines.length && /^>/.test(lines[i])) {
      bodyLines.push(lines[i].replace(/^>\s?/, ''))
      i++
    }

    const props = [`type="${escapeAttr(rawType)}"`]
    if (customTitle) {
      props.push(`title="${escapeAttr(customTitle)}"`)
    }

    // Ensure spacing around MDC block for clean parsing
    if (out.length > 0 && out[out.length - 1].trim() !== '') {
      out.push('')
    }
    out.push(`::callout{${props.join(' ')}}`)
    out.push(...bodyLines)
    out.push('::')
    if (i < lines.length && lines[i].trim() !== '') {
      out.push('')
    }
  }

  return out.join('\n')
}

/**
 * Split markdown into code-fence segments and prose segments so transformations
 * never corrupt inline examples inside ``` or ~~~ fenced code blocks.
 */
function transformOutsideCodeFences(markdown, transformer) {
  const lines = markdown.split(/\r?\n/)
  const chunks = []
  let buffer = []
  let inFence = false
  let fenceChar = ''
  let fenceLen = 0

  for (const line of lines) {
    const trimmed = line.trimStart()
    if (!inFence) {
      const openMatch = trimmed.match(/^(`{3,}|~{3,})/)
      if (openMatch) {
        if (buffer.length) {
          chunks.push({ type: 'prose', text: buffer.join('\n') })
          buffer = []
        }
        inFence = true
        fenceChar = openMatch[1][0]
        fenceLen = openMatch[1].length
        buffer.push(line)
      } else {
        buffer.push(line)
      }
    } else {
      buffer.push(line)
      const closeRe = new RegExp(`^${fenceChar}{${fenceLen},}\\s*$`)
      if (closeRe.test(trimmed)) {
        chunks.push({ type: 'code', text: buffer.join('\n') })
        buffer = []
        inFence = false
      }
    }
  }

  if (buffer.length) {
    chunks.push({ type: inFence ? 'code' : 'prose', text: buffer.join('\n') })
  }

  return chunks
    .map((chunk) => (chunk.type === 'prose' ? transformer(chunk.text) : chunk.text))
    .join('\n')
}

function sync() {
  if (!fs.existsSync(VAULT_DIR)) {
    console.error(`❌ 找不到 Obsidian 知识库目录: ${VAULT_DIR}`)
    console.error('请在 .env 中配置正确的 OBSIDIAN_VAULT_PATH')
    process.exit(1)
  }

  console.log(`🔍 正在扫描 Obsidian 知识库: ${VAULT_DIR}`)
  const allFiles = walkFiles(VAULT_DIR)

  // Build attachment index (basename -> fullPath)
  const assetMap = new Map()
  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase()
    if (IMAGE_EXTS.has(ext)) {
      assetMap.set(path.basename(file), file)
    }
  }

  const mdFiles = allFiles.filter((f) => f.endsWith('.md'))
  ensureDir(BLOG_DEST)
  ensureDir(NOW_DEST)
  ensureDir(IMG_DEST)

  // Pass 1: collect all publish: true notes and build published wikilink index
  const publishCandidates = []
  const publishedMap = new Map()

  for (const mdPath of mdFiles) {
    const raw = fs.readFileSync(mdPath, 'utf-8')
    let parsed
    try {
      parsed = matter(raw)
    } catch {
      continue
    }

    const data = parsed.data || {}
    if (!isPublished(data.publish)) continue

    const typeStr = Array.isArray(data.type) ? data.type.join(',') : String(data.type || '')
    const type = typeStr.toLowerCase().includes('now') ? 'now' : 'blog'
    const baseName = path.basename(mdPath, '.md')
    const title = String(data.title || baseName).trim()
    const dateStr = resolveDate(data, mdPath)
    const slug = data.slug
      ? toSafeAsciiSlug(String(data.slug), dateStr)
      : toSafeAsciiSlug(baseName, dateStr)
    const route = type === 'now' ? '/now' : `/blog/${slug}`

    const entry = { mdPath, parsed, data, type, baseName, title, dateStr, slug, route }
    publishCandidates.push(entry)

    const relNoExt = path.relative(VAULT_DIR, mdPath).replace(/\\/g, '/').replace(/\.md$/i, '')
    for (const key of [baseName, title, relNoExt]) {
      publishedMap.set(key.trim().toLowerCase(), { route, title })
    }
  }

  // Pass 2: transform content & write files
  const syncedTargets = new Set()
  const copiedImages = new Set()
  let blogCount = 0
  let nowCount = 0
  let wikilinkResolved = 0
  let calloutCount = 0

  function copyImageAsset(srcAsset) {
    const safeName = toSafeImageName(srcAsset)
    const targetAsset = path.join(IMG_DEST, safeName)
    fs.copyFileSync(srcAsset, targetAsset)
    copiedImages.add(safeName)
    return `/images/obsidian/${safeName}`
  }

  for (const item of publishCandidates) {
    const { mdPath, parsed, data, type, title, dateStr, slug } = item
    const destDir = type === 'now' ? NOW_DEST : BLOG_DEST
    const destPath = path.join(destDir, `${slug}.md`)

    let content = transformOutsideCodeFences(parsed.content, (prose) => {
      // 1. Obsidian image embeds: ![[image.png]] or ![[image.png|alt or width]]
      let next = prose.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, rawTarget, rawAlt) => {
        const cleanTarget = rawTarget.trim()
        const srcAsset = resolveLocalImage(cleanTarget, mdPath, assetMap)
        const alt = rawAlt && !isObsidianSizeHint(rawAlt) ? rawAlt.trim() : ''
        if (srcAsset) {
          const publicUrl = copyImageAsset(srcAsset)
          return `![${alt}](${publicUrl})`
        }
        return `![${alt}](${cleanTarget})`
      })

      // 2. Standard local Markdown images: ![alt](./path/to/img.png)
      next = next.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (full, alt, target, imgTitle) => {
        if (/^(https?:\/\/|data:|\/)/i.test(target)) return full
        const srcAsset = resolveLocalImage(target, mdPath, assetMap)
        if (!srcAsset) return full
        const publicUrl = copyImageAsset(srcAsset)
        return imgTitle ? `![${alt}](${publicUrl} "${imgTitle}")` : `![${alt}](${publicUrl})`
      })

      // 3. Smart Obsidian wikilinks: [[Target#Heading|Alias]] / [[Target|Alias]] / [[Target]]
      next = next.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, rawTarget, rawAlias) => {
        const [notePart, headingPart] = rawTarget.split('#')
        const noteName = (notePart || '').trim()
        const heading = (headingPart || '').trim()
        const displayText = (rawAlias || (noteName ? (heading ? `${noteName} · ${heading}` : noteName) : heading)).trim()

        if (noteName) {
          const lookupKey = noteName.toLowerCase()
          const baseLookupKey = path.basename(noteName).toLowerCase()
          const targetNote = publishedMap.get(lookupKey) || publishedMap.get(baseLookupKey)
          if (targetNote) {
            wikilinkResolved++
            return `[${displayText}](${targetNote.route})`
          }
        }
        return displayText
      })

      // 4. Obsidian Callouts: > [!tip] Title
      const beforeCallout = next
      next = transformCallouts(next)
      if (next !== beforeCallout) {
        const matches = next.match(/^::callout\{/gm)
        if (matches) calloutCount += matches.length
      }

      return next
    })

    // Remove duplicate leading H1 if it matches the article title
    content = content.trimStart()
    const firstLineMatch = content.match(/^#\s+(.+?)\r?\n+/)
    if (firstLineMatch && firstLineMatch[1].trim() === String(title).trim()) {
      content = content.slice(firstLineMatch[0].length)
    }

    const nextFrontmatter = {
      title,
      description: data.description || extractDescription(content),
      date: dateStr,
      ...(data.tags ? { tags: Array.isArray(data.tags) ? data.tags : [data.tags] } : {}),
      ...(data.tag ? { tag: data.tag } : {}),
      syncedFromObsidian: true
    }

    const output = matter.stringify(content, nextFrontmatter)
    fs.writeFileSync(destPath, output, 'utf-8')
    syncedTargets.add(destPath)
    console.log(`📝 已同步 [${type}]: ${title} -> ${path.relative(ROOT_DIR, destPath)}`)

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

  console.log(
    `✅ 同步完成：博客 ${blogCount} 篇，动态 ${nowCount} 条，图片 ${copiedImages.size} 张，站内双链 ${wikilinkResolved} 处，Callout ${calloutCount} 处。`
  )
}

sync()
