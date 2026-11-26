import { musicConfig, type AmbientPreset, type MusicTrack } from '~/data/music'

/**
 * Lightweight, click-free Web Audio API focus soundscape synthesizer.
 * Generates 6 distinct pure instrumental / ambient moods with zero external dependencies.
 */
class AmbientEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private activeNodes: AudioNode[] = []
  private timers: number[] = []
  private currentPreset: AmbientPreset | null = null
  private volume = 0.68

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.0001
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val))
    if (this.ctx && this.masterGain && this.currentPreset) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setTargetAtTime(Math.max(0.0001, this.volume * 0.44), now, 0.06)
    }
  }

  start(preset: AmbientPreset, volume: number) {
    this.stop()
    this.ensureContext()
    if (!this.ctx || !this.masterGain) return

    this.currentPreset = preset
    this.volume = Math.max(0, Math.min(1, volume))

    const now = this.ctx.currentTime
    this.masterGain.gain.cancelScheduledValues(now)
    this.masterGain.gain.setValueAtTime(0.0001, now)
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, this.volume * 0.44), now + 0.45)

    switch (preset) {
      case 'rhodes':
        this.startRhodes()
        break
      case 'piano':
        this.startPiano()
        break
      case 'rain':
        this.startRain()
        break
      case 'coastal':
        this.startCoastal()
        break
      case 'forest':
        this.startForest()
        break
      case 'synth':
        this.startSynth()
        break
    }
  }

  stop() {
    for (const t of this.timers) {
      window.clearInterval(t)
      window.clearTimeout(t)
    }
    this.timers = []

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setTargetAtTime(0.0001, now, 0.05)
    }

    const nodesToClean = this.activeNodes
    this.activeNodes = []
    this.currentPreset = null
    window.setTimeout(() => {
      for (const node of nodesToClean) {
        try {
          if ('stop' in node && typeof (node as any).stop === 'function') {
            ;(node as any).stop()
          }
          node.disconnect()
        } catch {
          // ignore already stopped nodes
        }
      }
    }, 180)
  }

  private createFilteredNoise(cutoffHz: number, gainLevel: number, q = 0.7) {
    if (!this.ctx || !this.masterGain) return
    const sampleRate = this.ctx.sampleRate
    const bufferSize = sampleRate * 3
    const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate)

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch)
      let b0 = 0
      let b1 = 0
      let b2 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99765 * b0 + white * 0.099046
        b1 = 0.963 * b1 + white * 0.2965164
        b2 = 0.57 * b2 + white * 1.0526913
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.04
      }
    }

    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = cutoffHz
    filter.Q.value = q

    const gain = this.ctx.createGain()
    gain.gain.value = gainLevel

    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    src.start()

    this.activeNodes.push(src, filter, gain)
  }

  private playWarmChord(
    freqs: number[],
    durationSec: number,
    gainPeak = 0.14,
    staggerSec = 0.035,
    cutoffStart = 1350
  ) {
    if (!this.ctx || !this.masterGain) return
    const now = this.ctx.currentTime
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(cutoffStart, now)
    filter.frequency.exponentialRampToValueAtTime(480, now + durationSec)

    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.0001, now)
    env.gain.linearRampToValueAtTime(gainPeak, now + 0.16)
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec)

    filter.connect(env)
    env.connect(this.masterGain)

    freqs.forEach((f, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      osc.type = idx === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(f, now)
      osc.detune.setValueAtTime((idx - 1.5) * 3.2, now)

      const noteGain = this.ctx.createGain()
      noteGain.gain.value = idx === 0 ? 0.45 : 0.24

      osc.connect(noteGain)
      noteGain.connect(filter)
      osc.start(now + idx * staggerSec)
      osc.stop(now + durationSec + 0.1)
    })
  }

  private playPluckNote(freq: number, startOffsetSec: number, durationSec: number, peak = 0.11, wave: OscillatorType = 'triangle') {
    if (!this.ctx || !this.masterGain) return
    const start = this.ctx.currentTime + startOffsetSec

    const osc = this.ctx.createOscillator()
    osc.type = wave
    osc.frequency.setValueAtTime(freq, start)

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(freq * 3.2, start)
    filter.frequency.exponentialRampToValueAtTime(Math.max(240, freq * 1.1), start + durationSec)

    const env = this.ctx.createGain()
    env.gain.setValueAtTime(0.0001, start)
    env.gain.linearRampToValueAtTime(peak, start + 0.025)
    env.gain.exponentialRampToValueAtTime(0.0001, start + durationSec)

    osc.connect(filter)
    filter.connect(env)
    env.connect(this.masterGain)

    osc.start(start)
    osc.stop(start + durationSec + 0.06)
  }

  private startRhodes() {
    // Lo-Fi jazz chords with subtle vinyl warmth
    this.createFilteredNoise(900, 0.12)
    const chords = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.0, 261.63], // Dm7
      [130.81, 196.0, 246.94, 329.63]  // Cmaj7
    ]
    let step = 0
    const tick = () => {
      this.playWarmChord(chords[step % chords.length], 3.5, 0.16)
      step++
    }
    tick()
    this.timers.push(window.setInterval(tick, 3400))
  }

  private startPiano() {
    // Intimate felt-piano arpeggios: Cmaj9 -> G6 -> Am9 -> Fmaj7
    const arpeggios = [
      [130.81, 196.0, 246.94, 293.66, 329.63],
      [98.0, 196.0, 246.94, 293.66, 329.63],
      [110.0, 164.81, 246.94, 261.63, 329.63],
      [87.31, 174.61, 220.0, 261.63, 329.63]
    ]
    let bar = 0
    const tick = () => {
      const notes = arpeggios[bar % arpeggios.length]
      notes.forEach((freq, idx) => {
        this.playPluckNote(freq, idx * 0.42, 2.3, idx === 0 ? 0.14 : 0.09, 'triangle')
      })
      bar++
    }
    tick()
    this.timers.push(window.setInterval(tick, 3200))
  }

  private startRain() {
    // Soft rainfall + delicate pentatonic droplets
    this.createFilteredNoise(720, 0.65)
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]
    const tick = () => {
      const n1 = notes[Math.floor(Math.random() * notes.length)]
      const n2 = notes[Math.floor(Math.random() * notes.length)]
      this.playWarmChord([n1, n2], 2.8, 0.085)
    }
    tick()
    this.timers.push(window.setInterval(tick, 2900))
  }

  private startCoastal() {
    // Calm airy coastal swell + open fifth/ninth pads
    this.createFilteredNoise(460, 0.35)
    const pads = [
      [130.81, 196.0, 293.66, 329.63], // Cadd9
      [110.0, 164.81, 246.94, 329.63], // Am9
      [174.61, 261.63, 329.63, 392.0], // Fmaj9
      [196.0, 246.94, 293.66, 392.0]   // G6
    ]
    let step = 0
    const tick = () => {
      this.playWarmChord(pads[step % pads.length], 4.6, 0.13)
      step++
    }
    tick()
    this.timers.push(window.setInterval(tick, 4400))
  }

  private startForest() {
    // Gentle stream ambience + wooden marimba/kalimba pentatonic chimes
    this.createFilteredNoise(1150, 0.24, 1.4)
    const scale = [293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
    const tick = () => {
      const count = 2 + Math.floor(Math.random() * 2)
      for (let i = 0; i < count; i++) {
        const freq = scale[Math.floor(Math.random() * scale.length)]
        this.playPluckNote(freq, i * 0.36, 1.35, 0.09, 'sine')
      }
    }
    tick()
    this.timers.push(window.setInterval(tick, 2200))
  }

  private startSynth() {
    // Slow breathing space pad + shimmering high harmonic notes
    const pads = [
      [110.0, 164.81, 220.0, 329.63],  // Am(add5)
      [87.31, 130.81, 220.0, 261.63],  // Fmaj7
      [98.0, 146.83, 196.0, 293.66],   // Gsus2
      [130.81, 196.0, 246.94, 392.0]   // Cmaj7
    ]
    const chimes = [523.25, 659.25, 783.99, 987.77]
    let step = 0
    const tick = () => {
      this.playWarmChord(pads[step % pads.length], 5.2, 0.13, 0.08, 920)
      const shimmer = chimes[step % chimes.length]
      this.playPluckNote(shimmer, 1.4, 2.8, 0.045, 'sine')
      step++
    }
    tick()
    this.timers.push(window.setInterval(tick, 4800))
  }
}

let singletonAudio: HTMLAudioElement | null = null
let singletonAmbient: AmbientEngine | null = null
let ambientTickTimer: number | null = null

export function useMusicPlayer() {
  const tracks = useState<MusicTrack[]>('music-tracks', () => [...musicConfig.tracks])
  const currentIndex = useState<number>('music-index', () => 0)
  const isPlaying = useState<boolean>('music-playing', () => false)
  const isExpanded = useState<boolean>('music-expanded', () => false)
  const isLoading = useState<boolean>('music-loading', () => false)
  const statusTip = useState<string>('music-status-tip', () => '')
  const currentTime = useState<number>('music-current-time', () => 0)
  const duration = useState<number>('music-duration', () => musicConfig.tracks[0]?.duration || 180)
  const volume = useState<number>('music-volume', () => 0.68)
  const isMuted = useState<boolean>('music-muted', () => false)

  const currentTrack = computed<MusicTrack>(() => tracks.value[currentIndex.value] || tracks.value[0])
  const effectiveVolume = computed(() => (isMuted.value ? 0 : volume.value))
  const progress = computed(() => {
    if (!duration.value || duration.value <= 0) return 0
    return Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
  })

  function ensureEngines() {
    if (!import.meta.client) return
    if (!singletonAmbient) {
      singletonAmbient = new AmbientEngine()
    }
    if (!singletonAudio) {
      singletonAudio = new Audio()
      singletonAudio.preload = 'metadata'
      singletonAudio.volume = effectiveVolume.value

      singletonAudio.addEventListener('timeupdate', () => {
        if (!singletonAudio) return
        currentTime.value = singletonAudio.currentTime || 0
      })
      singletonAudio.addEventListener('loadedmetadata', () => {
        if (!singletonAudio) return
        if (Number.isFinite(singletonAudio.duration)) {
          duration.value = singletonAudio.duration
        }
      })
      singletonAudio.addEventListener('ended', () => {
        nextTrack(true)
      })
      singletonAudio.addEventListener('error', () => {
        isLoading.value = false
        isPlaying.value = false
        statusTip.value = '音频加载失败'
        window.setTimeout(() => {
          if (statusTip.value === '音频加载失败') statusTip.value = ''
        }, 2000)
      })
    }
  }

  function clearAmbientClock() {
    if (ambientTickTimer !== null) {
      window.clearInterval(ambientTickTimer)
      ambientTickTimer = null
    }
  }

  function startAmbientClock() {
    clearAmbientClock()
    ambientTickTimer = window.setInterval(() => {
      if (!isPlaying.value) return
      const nextSec = currentTime.value + 0.5
      if (nextSec >= duration.value) {
        currentTime.value = 0
      } else {
        currentTime.value = nextSec
      }
    }, 500)
  }

  async function playCurrent() {
    if (!import.meta.client) return
    ensureEngines()
    const track = currentTrack.value
    if (!track) return

    if (track.url) {
      singletonAmbient?.stop()
      clearAmbientClock()
      if (!singletonAudio) return

      isLoading.value = true
      const resolvedHref = new URL(track.url, window.location.origin).href
      if (singletonAudio.error || singletonAudio.src !== resolvedHref) {
        singletonAudio.src = track.url
        singletonAudio.load()
      }
      singletonAudio.volume = effectiveVolume.value
      try {
        await singletonAudio.play()
        isPlaying.value = true
      } catch {
        isPlaying.value = false
      } finally {
        isLoading.value = false
      }
    } else if (track.ambientPreset) {
      if (singletonAudio) {
        singletonAudio.pause()
      }
      duration.value = track.duration || 180
      singletonAmbient?.start(track.ambientPreset, effectiveVolume.value)
      isPlaying.value = true
      startAmbientClock()
    }
  }

  function pause() {
    if (!import.meta.client) return
    isPlaying.value = false
    singletonAudio?.pause()
    singletonAmbient?.stop()
    clearAmbientClock()
  }

  function togglePlay() {
    if (isPlaying.value) {
      pause()
    } else {
      playCurrent()
    }
  }

  function selectTrack(index: number, autoPlay = true) {
    if (index < 0 || index >= tracks.value.length) return
    const wasPlaying = isPlaying.value
    pause()
    currentIndex.value = index
    currentTime.value = 0
    duration.value = tracks.value[index]?.duration || 180
    if (autoPlay || wasPlaying) {
      playCurrent()
    }
  }

  function nextTrack(autoPlay = false) {
    const nextIdx = (currentIndex.value + 1) % tracks.value.length
    selectTrack(nextIdx, autoPlay || isPlaying.value)
  }

  function prevTrack() {
    const prevIdx = (currentIndex.value - 1 + tracks.value.length) % tracks.value.length
    selectTrack(prevIdx, isPlaying.value)
  }

  function seekToPercent(percent: number) {
    const clamped = Math.max(0, Math.min(100, percent))
    const targetSec = (clamped / 100) * duration.value
    currentTime.value = targetSec
    if (currentTrack.value?.url && singletonAudio && Number.isFinite(singletonAudio.duration)) {
      singletonAudio.currentTime = targetSec
    }
  }

  function setVolume(val: number) {
    const next = Math.max(0, Math.min(1, val))
    volume.value = next
    if (next > 0 && isMuted.value) {
      isMuted.value = false
    }
    if (singletonAudio) singletonAudio.volume = effectiveVolume.value
    singletonAmbient?.setVolume(effectiveVolume.value)
  }

  function toggleMute() {
    isMuted.value = !isMuted.value
    if (singletonAudio) singletonAudio.volume = effectiveVolume.value
    singletonAmbient?.setVolume(effectiveVolume.value)
  }

  return {
    tracks,
    currentIndex,
    currentTrack,
    isPlaying,
    isExpanded,
    isLoading,
    statusTip,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
    togglePlay,
    selectTrack,
    nextTrack,
    prevTrack,
    seekToPercent,
    setVolume,
    toggleMute
  }
}
