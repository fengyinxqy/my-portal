export interface FocusItem {
  label: string
  title: string
  description: string
  status: '进行中' | '持续中' | '筹备中'
}

export const nowFocus = {
  updatedAt: '2026-11-26',
  location: '广州',
  headline: '最近在打磨个人网站和几个开源小工具，顺便把平时记在 Obsidian 里的笔记慢慢整理出来。',
  items: [
    {
      label: '在做',
      title: '个人门户 & Obsidian 同步流',
      description: '用 Nuxt 3 搭个人主页，放简历、开源项目和日常笔记。',
      status: '进行中'
    },
    {
      label: '在学',
      title: '算法题单与前端底层复盘',
      description: '按题型系统刷题，同时复盘之前做过的复杂表格与渲染性能优化案例。',
      status: '持续中'
    },
    {
      label: '在折腾',
      title: 'AI 研发流与桌面/背屏小工具',
      description: '继续迭代背屏亮点、封箱之前等个人项目，尝试更多实用的 AI 辅助工作流。',
      status: '持续中'
    }
  ] as FocusItem[]
}
