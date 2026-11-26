export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const version = String(config.public.appVersion || 'unknown')

  setHeader(event, 'content-type', 'application/json; charset=utf-8')
  setHeader(event, 'cache-control', 'no-store, no-cache, must-revalidate, max-age=0')

  return {
    version,
    builtAt: new Date().toISOString()
  }
})
