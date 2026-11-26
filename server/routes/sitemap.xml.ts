import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl || 'https://your-domain.com').replace(/\/$/, '')

  const staticRoutes = ['/', '/resume', '/projects', '/blog', '/now']
  const docs = await serverQueryContent(event, 'blog')
    .where({ draft: { $ne: true } })
    .find()

  const nowIso = new Date().toISOString().split('T')[0]

  const urls = [
    ...staticRoutes.map(
      (route) => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${nowIso}</lastmod>
    <changefreq>${route === '/' || route === '/now' ? 'weekly' : 'monthly'}</changefreq>
  </url>`
    ),
    ...docs.map((doc) => {
      const lastmod = doc.date ? new Date(doc.date).toISOString().split('T')[0] : nowIso
      return `  <url>
    <loc>${siteUrl}${doc._path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`
    })
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
