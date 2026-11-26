import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './content/**/*.md'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace'
        ]
      },
      colors: {
        apple: {
          blue: '#007AFF',
          'blue-dark': '#0A84FF',
          indigo: '#5856D6',
          cyan: '#32ADE6',
          mint: '#00C7BE',
          pink: '#FF2D55'
        }
      },
      boxShadow: {
        glass: '0 2px 10px rgba(15, 23, 42, 0.03), 0 12px 32px rgba(88, 86, 214, 0.06)',
        'glass-hover': '0 6px 18px rgba(15, 23, 42, 0.05), 0 18px 40px rgba(0, 122, 255, 0.11)',
        'glass-dark': '0 4px 20px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.45)'
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: [typography]
}
