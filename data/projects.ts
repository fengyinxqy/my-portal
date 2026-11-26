export interface PortfolioProject {
  slug: string
  title: string
  summary: string
  category: '开源作品' | '性能治理' | 'AI 工程化' | '平台与跨端'
  year: string
  role: string
  featured: boolean
  tech: string[]
  highlights: string[]
  demoUrl?: string
  repoUrl?: string
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'rear-screen-status',
    title: '背屏亮点 · Rear Screen Status',
    summary:
      '把电脑上正在运行的 AI Agent（Claude Code、Codex 等）实时状态同步到小米手机 HyperOS 背屏，免 Root，写代码时扫一眼即可掌握 Agent 是在开发中、空闲还是断开。',
    category: '开源作品',
    year: '2026',
    role: '作者 · 独立开发',
    featured: true,
    tech: ['HyperOS 背屏', 'Android', 'Shizuku', 'AI Agents', 'Java / Python'],
    highlights: [
      '免 Root 方案，把复杂的终端状态压缩成「开发中 / 空闲 / 未连接」与一行核心读数，减少切窗打断注意力',
      '支持 Claude Code、Codex 等多状态源接入，并提供「交给 Agent 一键安装与验证」的自动化指引',
      '轻量常驻桌面伴侣体验，兼顾背屏低干扰展示与设置页精细配置'
    ],
    repoUrl: 'https://github.com/fengyinxqy/rear-screen-status'
  },
  {
    slug: 'boxfinder',
    title: '封箱之前 · BoxFinder',
    summary:
      '搬家装箱助手微信小程序：给纸箱编号并按房间管理箱内物品，输入物品名即可秒查在几号箱；纯本地存储、不登录不上云，保护个人隐私。',
    category: '开源作品',
    year: '2026',
    role: '作者 · 独立开发',
    featured: true,
    tech: ['uni-app', 'Vue 3', 'Vite', '微信小程序'],
    highlights: [
      '覆盖搬家创建、箱子编号管理、物品连续录入、模糊搜索、箱号反查与物品移箱完整闭环',
      '支持箱内照片持久化、本地数据备份导出与一键恢复，单 key 本地存储零服务器依赖',
      '完整落地 M1–M6 及 v1.1 双 Tab 迭代，配套隐私协议与提审材料'
    ],
    repoUrl: 'https://github.com/fengyinxqy/boxfinder'
  },
  {
    slug: 'time-record',
    title: '时间记录 · Time Record',
    summary:
      '面向 Windows 的轻量级个人桌面时间记录工具，支持一键项目计时、任务自动切换、每日时间轴回顾、系统托盘常驻与本地 SQLite 存储。',
    category: '开源作品',
    year: '2026',
    role: '作者 · 独立开发',
    featured: true,
    tech: ['Tauri 2', 'TypeScript', 'Rust', 'SQLite'],
    highlights: [
      '一键启动/切换项目计时，自动结束上一段记录，并通过每日时间轴清晰回顾时间分配',
      '紧凑桌面窗口 + 系统托盘常驻交互，支持项目归档恢复、历史记录编辑补录与 JSON 导出',
      '数据完全保存在本地 SQLite，无需注册账号与云端服务器'
    ],
    repoUrl: 'https://github.com/fengyinxqy/time-record'
  },
  {
    slug: 'family-tree',
    title: '家谱云 · Family Genealogy Copilot',
    summary:
      '中文优先的 AI 家谱工作台：将树状图/世系表/分支图/时间轴可视化浏览、人物档案维护、AI 识别录入与确定性亲属关系推理整合在同一产品中。',
    category: '开源作品',
    year: '2026',
    role: '作者 · 独立开发',
    featured: true,
    tech: ['TypeScript', 'AI 应用', '可视化树图', '亲属关系引擎'],
    highlights: [
      '提供树状图、世系表、分支图与时间轴多视图，支持代际筛选、节点聚焦与右侧助手联动',
      'AI 负责将自然语言、图片与文档抽取为结构化人物草稿，核心亲属称谓推理采用确定性规则引擎保证可解释性',
      '完整的前后端一体化产品原型，提供在线体验环境与中英双语文档'
    ],
    demoUrl: 'https://family-tree-psi-snowy.vercel.app',
    repoUrl: 'https://github.com/fengyinxqy/family-tree'
  },
  {
    slug: 'ai-engineering-workflow',
    title: 'AI 工程化与前端研发效能体系',
    summary:
      '围绕需求理解、代码交付与审查效率，将 AI 从个人编码工具升级为团队级研发基础设施，覆盖 SDD 流程、三级 AI Review、Figma 出码与 IM 多智能体协作。',
    category: 'AI 工程化',
    year: '2025 - 2026',
    role: '主导者',
    featured: false,
    tech: ['SDD 流程', 'AI Review', 'Figma 出码', '多智能体协作', 'CodeGraph MCP'],
    highlights: [
      '建立基于 SDD 的 AI 辅助研发流程，从 3 人试点沉淀可执行范例并推广至业务线',
      '设计“AI 初审 → 开发者逐条回复 → 人工终审”三级 Review，2 个月内代码审查耗时减少约 30%',
      '落地 AI + Figma 分区块出码与截图对比校正交付流，并牵头多智能体接入 IM 与 CodeGraph MCP'
    ]
  },
  {
    slug: 'log-analysis-platform',
    title: '公司级日志查询与分析平台',
    summary:
      '独立负责前端架构与深度性能治理，攻克大体量异常日志与 1000 行 × 1000+ 列超宽表格带来的卡顿与浏览器崩溃难题。',
    category: '性能治理',
    year: '2023 - 2026',
    role: '前端负责人',
    featured: false,
    tech: ['Vue', 'TypeScript', '动态高度虚拟列表', '横向虚拟滚动', '全键盘交互'],
    highlights: [
      '超宽表格表头单实例复用 + 横向虚拟滚动：1000 行 × 1000+ 列渲染耗时从 47s 降至约 600ms',
      '设计预估高度 + 实测回填的动态高度虚拟列表，100 条异常日志渲染耗时由 7s 降至 2.5s',
      '全键盘查询模式与持续异常治理，系统日均报错量由 100 余次降至 10 余次'
    ]
  },
  {
    slug: 'analytics-tracking-platform',
    title: '网站分析与埋点监控平台',
    summary:
      '覆盖约 200 个服务、累计接入 1000+ 埋点需求的公司级分析与监控平台，提供埋点 SDK、隐私控制、点击热力图与 Web Vitals 性能观测。',
    category: '平台与跨端',
    year: '2023 - 2026',
    role: '前端负责人',
    featured: false,
    tech: ['埋点 SDK', 'Web Vitals', 'heatmap.js', 'Puppeteer', '隐私合规'],
    highlights: [
      '自研埋点 SDK 支持按配置停发与 Cookie 清理，满足业务线隐私合规要求',
      '建设 LCP/CLS 与请求耗时观测，协同后端将慢接口响应由 1500ms 降至约 220ms',
      '基于 Puppeteer 自动渲染并推送埋点 P90 耗时排名，推动 16 个系统完成 23 个异常埋点治理'
    ]
  },
  {
    slug: 'smart-customer-service',
    title: '智能客服系统（架构升级 & AI Agent）',
    summary:
      '覆盖 PC、移动端与国际化的客服系统，完成 jQuery 多页到 Vue SPA 的架构重构，并集成 AI 举报审核与用户侧 AI Agent 对话。',
    category: 'AI 工程化',
    year: '2024 - 2026',
    role: '前端负责人',
    featured: false,
    tech: ['Vue', '国际化 i18n', 'PC/移动端适配', 'AI Agent'],
    highlights: [
      '将 jQuery 多页项目重构为 Vue 单页应用，统一多端工程与多语言能力',
      '集成 AI 举报审核，日均支持约 1000 条“不处罚”判定（复核准确率约 95%），减少约 3 名客服年度工作量',
      '实现用户侧 AI Agent 多轮自动回复与会话状态展示'
    ]
  },
  {
    slug: 'data-portal-performance',
    title: '数据门户渲染链路性能治理',
    summary:
      '针对数据门户核心可视化与筛选交互卡顿进行专项治理，彻底解决大数据量图表重绘与级联选择器崩溃问题。',
    category: '性能治理',
    year: '2024 - 2025',
    role: '核心优化者',
    featured: false,
    tech: ['ECharts', '防抖与懒加载', '浏览器渲染优化'],
    highlights: [
      '修复循环调用 setOption 与未防抖重复渲染，ECharts 图项搜索耗时由 14s 降至约 300ms',
      '将 7000 项级联选择器重构为懒加载模式，彻底解决 34s 渲染卡顿与页面崩溃'
    ]
  }
]
