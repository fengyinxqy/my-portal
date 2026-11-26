export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  // Skip on touch devices or when user prefers reduced motion
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!supportsHover || prefersReduced) return

  let rafId: number | null = null
  let lastX = -9999
  let lastY = -9999
  let activeCards = new Set<HTMLElement>()

  const PROXIMITY = 110

  function updateCards() {
    rafId = null
    const cards = document.querySelectorAll<HTMLElement>('.bento-card')
    const nextActive = new Set<HTMLElement>()

    for (const card of cards) {
      const rect = card.getBoundingClientRect()
      const nearX = lastX >= rect.left - PROXIMITY && lastX <= rect.right + PROXIMITY
      const nearY = lastY >= rect.top - PROXIMITY && lastY <= rect.bottom + PROXIMITY

      if (nearX && nearY) {
        const x = lastX - rect.left
        const y = lastY - rect.top
        const inside = lastX >= rect.left && lastX <= rect.right && lastY >= rect.top && lastY <= rect.bottom

        card.style.setProperty('--mx', `${x.toFixed(1)}px`)
        card.style.setProperty('--my', `${y.toFixed(1)}px`)
        card.style.setProperty('--glass-sheen', inside ? '1' : '0')
        card.style.setProperty('--glass-rim', '1')
        nextActive.add(card)
      }
    }

    for (const prev of activeCards) {
      if (!nextActive.has(prev)) {
        prev.style.setProperty('--glass-sheen', '0')
        prev.style.setProperty('--glass-rim', '0')
      }
    }

    activeCards = nextActive
  }

  function handlePointerMove(e: PointerEvent) {
    lastX = e.clientX
    lastY = e.clientY
    if (rafId === null) {
      rafId = window.requestAnimationFrame(updateCards)
    }
  }

  function clearAll() {
    for (const card of activeCards) {
      card.style.setProperty('--glass-sheen', '0')
      card.style.setProperty('--glass-rim', '0')
    }
    activeCards.clear()
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  document.addEventListener('mouseleave', clearAll, { passive: true })
  window.addEventListener('blur', clearAll, { passive: true })
})
