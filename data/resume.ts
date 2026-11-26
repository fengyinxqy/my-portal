export interface ResumeExperience {
  company: string
  role: string
  secondaryRole?: string
  period: string
  location: string
  highlights: string[]
  tech: string[]
}

export interface ResumeProject {
  name: string
  role: string
  period: string
  description: string
  metrics: string[]
  tech: string[]
}

export interface OtherProjectItem {
  name: string
  description: string
}

export const resumeData = {
  updatedAt: '2026-11-26',
  targetRole: 'Web 前端工程师 · 广州 / 深圳',
  summary:
    '3 年以上 Web 前端研发经验，负责日志平台、智能客服、网站分析与数据门户等公司级系统，擅长复杂数据渲染与浏览器性能治理，兼具工程质量规范与 AI 研发效能实践。',
  summaries: [
    '3 年以上 Web 前端研发经验，负责日志平台、智能客服、网站分析与数据门户等公司级系统，具备平台型产品独立开发和持续治理经验。',
    '擅长复杂数据渲染与浏览器性能治理，落地动态高度虚拟列表、横向虚拟滚动、懒加载和渲染链路优化；代表成果包括表格渲染 47s → 约 600ms、ECharts 筛选 14s → 约 300ms。',
    '兼具工程质量、团队协作与 AI 研发效能实践，曾兼任组长助理，协助统筹 4 人团队、3 条业务线；推动增量覆盖率门禁、AI Review 与 AI 辅助研发流程落地。'
  ],
  skillGroups: [
    {
      label: '前端基础',
      items: ['JavaScript（ES6+）', 'TypeScript', 'HTML5 / CSS3', 'Vue 2 / 3']
    },
    {
      label: '工程化',
      items: ['Vite / Webpack', 'Istanbul / Puppeteer', '代码 Review 规范', '覆盖率采集与增量发版门禁']
    },
    {
      label: '性能与可视化',
      items: ['动态高度虚拟列表', '横向虚拟滚动 / 懒加载 / 防抖', 'Web Vitals', 'ECharts / heatmap.js']
    },
    {
      label: '平台开发',
      items: ['埋点 SDK 与前端监控', '国际化多语言', 'Cookie 与隐私控制', 'PC / 移动端适配']
    },
    {
      label: '跨端与服务协作',
      items: ['Tauri', 'Node.js / Egg.js', 'WebSocket', 'Redis / MongoDB']
    },
    {
      label: 'AI 研发实践',
      items: ['AI Coding（Codex / Cursor / Claude Code）', 'SDD 研发流程', '三级 AI Review / AI + Figma 出码', '多智能体协作 & CodeGraph MCP']
    }
  ],
  experiences: [
    {
      company: '广州多益网络有限公司',
      role: 'Web 前端开发工程师（2023.04 - 2026.08）',
      secondaryRole: '兼任组长助理 · 核心骨干（2025.12 - 2026.08）',
      period: '2023.04 - 2026.08',
      location: '广州',
      highlights: [
        '负责日志平台、智能客服、网站分析与埋点平台、数据门户等核心系统的前端开发、架构升级和性能治理，服务公司多条产品线。',
        '协助组长统筹 4 人研发团队和 3 条业务线，参与资源分配、月度 / 季度计划、技术方案评审及架构选型，并负责技术难题支持与新人带教。',
        '推动代码 Review 与覆盖率规范落地，建立基于代码 diff 的增量覆盖率发版门禁，要求本次新增及修改代码的行覆盖率达到 95% 以上。',
        '负责埋点 SDK、国际化多语言及隐私控制能力建设，推动 AI 在需求分析、编码、测试和审查环节的工程化应用。'
      ],
      tech: ['Vue 2/3', 'TypeScript', 'Vite', 'Istanbul', 'Puppeteer', 'Tauri', 'AI 工程化']
    }
  ] as ResumeExperience[],
  projects: [
    {
      name: 'AI 工程化与前端研发效能',
      role: '主导者',
      period: '2025.09 - 2026.08',
      description: '围绕需求理解、代码交付和审查效率，推动 AI 从个人编码工具转化为团队研发流程的一部分。',
      metrics: [
        '建立基于 SDD 的 AI 辅助研发流程，覆盖需求澄清、方案评审、任务拆解、编码测试与归档；组织三人小组试点，沉淀可执行示例项目，通过实践指导推动团队落地并推广至公司业务线。',
        '设计“AI 初审 → 开发者逐条回复 → 人工终审”三级 Review 流程，负责审查规则配置与流程推广；据团队反馈估算，两个月实践期间代码审查耗时减少约 30%。',
        '落地 AI + Figma 出码流程，整理设计元数据层级、按区块生成代码，并通过截图对比与反馈迭代校正布局，形成从设计稿解析到页面走查的交付流程。',
        '牵头多智能体协作工具接入 IM，支持策划、研发等角色开展代码问答、问题排查与任务工单创建；通过共享检出目录和定时更新减少重复检出，并接入 CodeGraph MCP 辅助代码检索。'
      ],
      tech: ['SDD', 'AI Review', 'Figma 出码', '多智能体协作', 'CodeGraph MCP']
    },
    {
      name: '日志查询与分析平台',
      role: '前端负责人',
      period: '2023.10 - 2026.08',
      description: '公司级日志查询平台，前端由本人独立负责，核心挑战为大体量日志和超宽表格导致的页面卡顿与浏览器崩溃。',
      metrics: [
        '设计动态高度虚拟列表，通过预估高度、实测回填、分段加载及内容折叠与截断，优化大体量日志浏览的流畅性与稳定性。',
        '优化异常日志的文本渲染与转义处理，避免异常 HTML 生成深层 DOM；在 100 条异常日志场景下，将渲染耗时由 7s 降至 2.5s。',
        '定位超宽表格中表头组件重复实例化的性能瓶颈，通过单实例复用与横向虚拟滚动，将 1000 行 × 1000+ 列场景下的渲染耗时由 47s 降至约 600ms。',
        '设计全键盘查询模式；持续治理线上异常，同一监控口径下，系统日均报错量由 100 余次降至 10 余次（优化前后各半年对比）。'
      ],
      tech: ['Vue', 'TypeScript', '动态高度虚拟列表', '横向虚拟滚动', '性能治理']
    },
    {
      name: '网站分析与埋点平台',
      role: '前端负责人',
      period: '2023.10 - 2026.08',
      description: '面向公司产品线的 PV / UV、点击热力图、事件采集与性能监控平台，覆盖约 200 个服务，累计接入 1000+ 埋点需求。',
      metrics: [
        '设计并维护埋点 SDK，支持按配置停止数据发送并清理对应 Cookie，为业务系统落实隐私控制要求提供基础能力。',
        '建设 Web Vitals 与请求耗时观测能力，覆盖 LCP、CLS 等页面体验指标；协同后端定位并优化慢接口，相关接口响应耗时由 1500ms 降至约 220ms。',
        '基于 heatmap.js 实现点击热力图，展示用户点击分布。',
        '建设元素埋点耗时 P90 排名，使用 Puppeteer 自动渲染排名页面、截图并推送；推动 16 个系统完成 23 个异常埋点治理。'
      ],
      tech: ['埋点 SDK', 'Web Vitals', 'heatmap.js', 'Puppeteer', '隐私控制']
    },
    {
      name: '智能客服系统',
      role: '前端负责人',
      period: '2024.09 - 2026.08',
      description: '覆盖 PC、移动端和国际化场景的客服系统，本人为主要前端，负责架构升级和核心模块交付。',
      metrics: [
        '将 jQuery 多页项目重构为 Vue 单页应用，统一 PC / 移动端工程及多语言能力，降低后续功能维护成本。',
        '集成 AI 举报审核能力，支持日均约 1000 条“不处罚”判定，业务方复核口径下该类判定准确率约 95%；据客服主管反馈，减少约 3 名客服的年度工作量。',
        '实现用户侧 AI Agent 对话页面，支持多轮自动回复及会话状态展示。'
      ],
      tech: ['Vue', '国际化 i18n', 'PC/移动端适配', 'AI Agent']
    }
  ] as ResumeProject[],
  otherProjects: [
    {
      name: '数据门户性能治理',
      description:
        '修复循环调用 setOption 和输入筛选未防抖造成的重复渲染，ECharts 图项搜索耗时由 14s 降至约 300ms；将最多约 7000 项的级联选择器改为懒加载，解决 34s 渲染及崩溃问题。'
    },
    {
      name: '模型状态查询桌面工具',
      description:
        '使用 Tauri 独立开发内部桌面应用，支持多 Key 配置、30 秒轮询、托盘运行、窗口置顶及开机启动，累计约 600 名内部用户使用。'
    }
  ] as OtherProjectItem[],
  education: [
    {
      school: '贵州师范大学求是学院',
      degree: '计算机科学与技术 · 本科',
      period: '2019.09 - 2023.06',
      note: '专业前 1% ｜ 贵州省优秀毕业生（2023）｜ 贵州省三好学生（2022）｜ 英语四级'
    }
  ],
  honors: [
    '参与 MDN 文档维护，提交的内容修订 PR 被官方合并。',
    '连续三年获得 A 绩效，获公司季度 / 年度技术分享一等奖。'
  ]
}
