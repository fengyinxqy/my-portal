export type AmbientPreset = 'rhodes' | 'rain' | 'coastal'

export interface MusicTrack {
  id: string
  title: string
  artist: string
  /** 外部音频或本地 public/audio/xxx.mp3 路径；留空且配置 ambientPreset 时使用内置轻音乐引擎 */
  url?: string
  /** 封面图 URL；留空时使用渐变唱片封面 */
  cover?: string
  /** 仅用于内置氛围声景的预设类型 */
  ambientPreset?: AmbientPreset
  /** 氛围声景默认单轮时长（秒），用于进度条展示 */
  duration?: number
  /** 封面渐变色（无封面图时使用） */
  gradient?: [string, string]
}

export const musicConfig = {
  /**
   * 可选：填入你的网易云公开歌单 ID（如 '3778678'）即可自动拉取歌单曲目。
   * 留空或接口不可用时，会自动回退到下方 tracks 曲库。
   */
  neteasePlaylistId: '',

  /** Meting 公共解析接口列表（自动按顺序容错回退） */
  metingApis: [
    'https://api.i-meto.com/meting/api?server=netease&type=playlist&id={id}',
    'https://api.injahow.cn/meting/?server=netease&type=playlist&id={id}'
  ],

  /**
   * 曲库列表：
   * - 想放自己的 MP3：把文件丢进 public/audio/，添加 { id, title, artist, url: '/audio/xxx.mp3' } 即可
   * - 默认内置 3 首零依赖 Web Audio 轻音乐声景，开箱即播且永不 404
   */
  tracks: [
    {
      id: 'ambient-rhodes',
      title: 'Midnight Rhodes',
      artist: '深夜电钢 · 专注声景',
      ambientPreset: 'rhodes',
      duration: 180,
      gradient: ['#1E3A5F', '#0F172A']
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
      duration: 180,
      gradient: ['#0071E3', '#38BDF8']
    }
  ] as MusicTrack[]
}
