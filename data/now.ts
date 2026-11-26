export interface FocusItem {
  label: string
  title: string
  description: string
  status: '进行中' | '持续中' | '筹备中'
}

export const nowFocus = {
  updatedAt: '2026-11-26',
  location: '广州',
  headline: '最近正在打磨个人门户与开源小工具，同时系统复盘前端性能治理与 AI 工程化实践。',
  items: [
    {
      label: '在做 · Building',
      title: '搭建个人门户 & Obsidian 发布流',
      description: '用 Nuxt 3 + Tailwind CSS 打造个人主页，统一承载在线简历、性能治理案例与日常复盘。',
      status: '进行中'
    },
    {
      label: '在学 · Learning',
      title: '算法 30 天冲刺 & 浏览器底层复盘',
      description: '系统梳理高频算法题型，并结合过往 47s → 600ms 性能治理案例沉淀可复用的方法论。',
      status: '持续中'
    },
    {
      label: '在探索 · Exploring',
      title: 'AI 工程化与多智能体研发流',
      description: '持续实践 SDD 研发流程、CodeGraph MCP 与自动化代码审查，探索更高效的前端交付方式。',
      status: '持续中'
    }
  ] as FocusItem[]
}
