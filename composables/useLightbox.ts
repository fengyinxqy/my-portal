export interface LightboxState {
  open: boolean
  mode: 'image' | 'svg'
  src: string
  alt: string
  svgHtml: string
}

export function useLightbox() {
  const state = useState<LightboxState>('portal-lightbox', () => ({
    open: false,
    mode: 'image',
    src: '',
    alt: '',
    svgHtml: ''
  }))

  function openImage(src: string, alt = '') {
    state.value = {
      open: true,
      mode: 'image',
      src,
      alt,
      svgHtml: ''
    }
  }

  function openSvg(svgHtml: string, alt = '') {
    state.value = {
      open: true,
      mode: 'svg',
      src: '',
      alt,
      svgHtml
    }
  }

  function close() {
    state.value.open = false
  }

  return {
    state,
    openImage,
    openSvg,
    close
  }
}
