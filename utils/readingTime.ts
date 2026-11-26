/**
 * Estimate reading time in minutes for mixed Chinese + English Markdown content.
 */
export function estimateReadingTime(textOrBody: unknown): number {
  const plainText = extractPlainText(textOrBody)
  if (!plainText) return 1

  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (plainText.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[a-zA-Z0-9_]+/g) || []).length

  const minutes = chineseChars / 350 + englishWords / 200
  return Math.max(1, Math.ceil(minutes))
}

function extractPlainText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractPlainText).join(' ')
  if (typeof node === 'object') {
    const record = node as Record<string, unknown>
    if (typeof record.value === 'string') return record.value
    if (Array.isArray(record.children)) return extractPlainText(record.children)
  }
  return ''
}

export function formatDate(dateInput?: string | Date): string {
  if (!dateInput) return ''
  const d = new Date(dateInput)
  if (Number.isNaN(d.getTime())) return String(dateInput)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
