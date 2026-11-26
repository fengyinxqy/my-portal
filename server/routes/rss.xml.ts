import { serverQueryContent } from '#content/server'

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://your-domain.com').replace(/\/$/, '')
  const siteName = config.public.siteName || '个人门户'
  const siteDescription = config.public.siteDescription || '前端工程师个人门户与技术博客'

  const docs = await serverQueryContent(event, 'blog')
    .where({ draft: { $ne: true } })
    .sort({ date: -1 })
    .find()

  const items = docs
    .map((doc) => {
      const link = `${siteUrl}${doc._path}`
      const pubDate = doc.date ? new Date(doc.date).toUTCString() : new Date().toUTCString()
      return `    <item>
      <title>${escapeXml(doc.title || '无标题')}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(doc.description || '')}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>zh-CN</language>
    <atom:link href="${escapeXml(siteUrl)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
