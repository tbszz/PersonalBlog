import type { ContentTranslations } from '../utils/contentLocalization.js'

export interface SeedPortfolioItem {
  id: number
  title: string
  description: string
  coverImage?: string
  projectUrl?: string
  sourceUrl?: string
  tags: string[]
  translations: ContentTranslations<Pick<SeedPortfolioItem, 'title' | 'description' | 'tags'>>
  featured: boolean
  sortOrder: number
  status: 'published' | 'draft'
  createdAt: string
}

export const defaultPortfolioItems: SeedPortfolioItem[] = [
  {
    id: 1002,
    title: 'PPTSight 企业文档结构化检索与问答系统',
    description: '面向 XFusion AI Hackathon 赛题 5 的文档问答系统，解析 PPTX、PDF 与表格结构，构建页面级、Chunk、Fact 三层索引，并结合 SQLite FTS5、规则评分和 LLM 路由提升检索解释性。',
    coverImage: '/portfolio/pptsight.webp',
    projectUrl: undefined,
    sourceUrl: undefined,
    tags: ['Python', 'FastAPI', 'React', 'SQLite FTS5', 'PPTX XML', 'RAG'],
    translations: {
      en: {
        title: 'PPTSight Enterprise Document Retrieval and QA',
        description: 'A document QA system built for XFusion AI Hackathon Task 5. It parses PPTX, PDF, and tabular structures, builds page-level, chunk-level, and fact-level indexes, and combines SQLite FTS5, rule scoring, and LLM routing for explainable retrieval.',
        tags: ['Python', 'FastAPI', 'React', 'SQLite FTS5', 'PPTX XML', 'RAG'],
      },
    },
    featured: true,
    sortOrder: 1,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1007,
    title: 'Resume Protocol AI 求职资料与岗位雷达',
    description: '面向求职场景的本地 AI 产品，覆盖材料导入、职业画像抽取、缺口追问、岗位筛选、模板选择、正式简历生成、投递队列和 RPA dry-run 风险边界。',
    coverImage: '/portfolio/resume-protocol.webp',
    projectUrl: 'https://github.com/tbszz/Resume-Protocol',
    sourceUrl: 'https://github.com/tbszz/Resume-Protocol',
    tags: ['React', 'Vite', 'Express', 'Playwright', 'pdf-parse', 'MiniMax API'],
    translations: {
      en: {
        title: 'Resume Protocol AI Career Material and Job Radar',
        description: 'A local AI product for job hunting workflows, covering material import, career-profile extraction, gap follow-up, job filtering, template selection, formal resume generation, delivery queues, and RPA dry-run safety boundaries.',
        tags: ['React', 'Vite', 'Express', 'Playwright', 'pdf-parse', 'MiniMax API'],
      },
    },
    featured: true,
    sortOrder: 2,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1001,
    title: 'AceMode 全球华人 AI 生产力社区',
    description: '基于 Discourse 的生产级社区二次开发项目，覆盖 Rails 后端扩展、Ember 前端交互、Sidekiq 异步任务、PostgreSQL/Redis 性能优化，以及 Ubuntu + Nginx + Puma 生产部署。',
    coverImage: '/portfolio/acemode.webp',
    projectUrl: 'https://acemode.ai',
    sourceUrl: undefined,
    tags: ['Ruby on Rails', 'Ember.js', 'PostgreSQL', 'Redis', 'Sidekiq', 'Nginx'],
    translations: {
      en: {
        title: 'AceMode Global Chinese AI Productivity Community',
        description: 'A production-grade Discourse-based community customization project covering Rails backend extensions, Ember frontend interactions, Sidekiq background jobs, PostgreSQL/Redis performance work, and Ubuntu + Nginx + Puma deployment.',
        tags: ['Ruby on Rails', 'Ember.js', 'PostgreSQL', 'Redis', 'Sidekiq', 'Nginx'],
      },
    },
    featured: true,
    sortOrder: 3,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1006,
    title: 'OpenClaw 多 Agent 控制台',
    description: '面向 Windows / WSL2 的多 Gateway 桌面管理器，用统一控制台管理多 bot、多账号、多 Telegram/Discord 通道、生命周期、日志和健康状态。',
    coverImage: '/portfolio/openclaw-manager.webp',
    projectUrl: 'https://github.com/tbszz/awesome-openclaw-manager',
    sourceUrl: 'https://github.com/tbszz/awesome-openclaw-manager',
    tags: ['Tauri 2', 'React', 'TypeScript', 'Rust', 'WSL2', 'Gateway Orchestration'],
    translations: {
      en: {
        title: 'OpenClaw Multi-Agent Control Console',
        description: 'A Windows / WSL2 multi-gateway desktop manager that unifies bot accounts, Telegram/Discord channels, lifecycle controls, logs, and health status into one operations console.',
        tags: ['Tauri 2', 'React', 'TypeScript', 'Rust', 'WSL2', 'Gateway Orchestration'],
      },
    },
    featured: true,
    sortOrder: 4,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1008,
    title: 'HyperFarming 智慧农业管理平台',
    description: '面向农业园区 / 智慧大棚的 B/G 端管理系统，覆盖环境监测、设备控制、数据分析、生产计划、仓储溯源、GIS 地块可视化和 AI 智脑。',
    coverImage: '/portfolio/hyperfarming.webp',
    projectUrl: undefined,
    sourceUrl: undefined,
    tags: ['Vue 3', 'TypeScript', 'Go', 'Gin', 'PostgreSQL', 'WebSocket', 'Docker'],
    translations: {
      en: {
        title: 'HyperFarming Smart Agriculture Management Platform',
        description: 'A B/G-side management system for agricultural parks and smart greenhouses, covering environment monitoring, device control, analytics, production planning, warehouse traceability, GIS land visualization, and AI assistant workflows.',
        tags: ['Vue 3', 'TypeScript', 'Go', 'Gin', 'PostgreSQL', 'WebSocket', 'Docker'],
      },
    },
    featured: true,
    sortOrder: 5,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1009,
    title: '自动化视频剪辑工具',
    description: 'React + Remotion + IndexTTS 的内容生产流水线，将脚本切片、语音合成、字幕、转场、录屏缩放、商品展示和最终导出串成可复用视频生产系统。',
    coverImage: '/portfolio/auto-video-editor.webp',
    projectUrl: undefined,
    sourceUrl: undefined,
    tags: ['React', 'Remotion', 'IndexTTS', 'Python', 'Script Slicing', 'Auto Render'],
    translations: {
      en: {
        title: 'Automated Video Editing Pipeline',
        description: 'A React + Remotion + IndexTTS content-production pipeline that connects script slicing, voice generation, subtitles, transitions, screen-recording zooms, product showcases, and final exports into reusable video templates.',
        tags: ['React', 'Remotion', 'IndexTTS', 'Python', 'Script Slicing', 'Auto Render'],
      },
    },
    featured: true,
    sortOrder: 6,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
]

export function getDefaultPortfolioItems(): SeedPortfolioItem[] {
  return defaultPortfolioItems.map(item => ({
    ...item,
    tags: [...item.tags],
    translations: {
      ...item.translations,
      en: {
        ...item.translations.en,
        tags: [...(item.translations.en?.tags ?? [])],
      },
    },
  }))
}
