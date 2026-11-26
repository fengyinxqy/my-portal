export type AmbientPreset = 'rhodes' | 'rain' | 'coastal' | 'piano' | 'synth' | 'forest'

export interface MusicTrack {
  id: string
  title: string
  artist: string
  /** 可选：本地 public/audio/xxx.mp3 或外部直链；留空时使用内置纯音乐引擎 */
  url?: string
  /** 封面图 URL；留空时使用渐变唱片封面 */
  cover?: string
  /** 内置纯音乐声景预设 */
  ambientPreset?: AmbientPreset
  /** 单轮展示时长（秒） */
  duration?: number
  /** 封面渐变色（无封面图时使用） */
  gradient?: [string, string]
}

export const musicConfig = {
  /**
   * 内置 6 首零依赖 Web Audio 专注纯音乐，开箱即播、完整循环且永不 404。
   * 如需加入自己的 MP3，把文件放进 public/audio/ 并添加 { id, title, artist, url: '/audio/xxx.mp3' } 即可。
   */
  tracks: [
    {
      id: 'ambient-rhodes',
      title: 'Midnight Rhodes',
      artist: '深夜电钢 · 爵士和弦',
      ambientPreset: 'rhodes',
      duration: 180,
      gradient: ['#1E3A5F', '#0F172A']
    },
    {
      id: 'ambient-piano',
      title: 'Velvet Piano',
      artist: '柔焦钢琴 · 极简独奏',
      ambientPreset: 'piano',
      duration: 200,
      gradient: ['#3B4252', '#1B202B']
    },
    {
      id: 'ambient-rain',
      title: 'Rainy Coding',
      artist: '雨夜微澜 · 沉浸白噪',
      ambientPreset: 'rain',
      duration: 180,
      gradient: ['#1D4E5F', '#0B1D26']
    },
    {
      id: 'ambient-coastal',
      title: 'Coastal Morning',
      artist: '海岸晨光 · 柔和氛围',
      ambientPreset: 'coastal',
      duration: 210,
      gradient: ['#0071E3', '#38BDF8']
    },
    {
      id: 'ambient-forest',
      title: 'Forest Stream',
      artist: '林间溪流 · 木琴清音',
      ambientPreset: 'forest',
      duration: 195,
      gradient: ['#0F766E', '#134E4A']
    },
    {
      id: 'ambient-synth',
      title: 'Starlight Drift',
      artist: '星夜漫游 · 空灵合成',
      ambientPreset: 'synth',
      duration: 220,
      gradient: ['#312E81', '#0F172A']
    }
  ] as MusicTrack[]
}
