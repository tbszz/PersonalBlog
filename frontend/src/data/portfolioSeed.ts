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
    id: 1001,
    title: 'AceMode 全球华人 AI 生产力社区',
    description: '基于 Discourse 的生产级社区二次开发项目，覆盖 Rails 后端扩展、Ember 前端交互、Sidekiq 异步任务、PostgreSQL/Redis 性能优化，以及 Ubuntu + Nginx + Puma 生产部署。',
    coverImage: undefined,
    projectUrl: 'https://acemode.ai',
    sourceUrl: undefined,
    tags: ['Ruby on Rails', 'Ember.js', 'PostgreSQL', 'Redis', 'Docker', 'Nginx'],
    translations: {
      en: {
        title: 'AceMode Global Chinese AI Productivity Community',
        description: 'A production-grade Discourse-based community customization project covering Rails backend extensions, Ember frontend interactions, Sidekiq background jobs, PostgreSQL/Redis performance work, and Ubuntu + Nginx + Puma deployment.',
        tags: ['Ruby on Rails', 'Ember.js', 'PostgreSQL', 'Redis', 'Docker', 'Nginx'],
      },
    },
    featured: true,
    sortOrder: 1,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1002,
    title: 'PPTSight 企业文档结构化检索与问答系统',
    description: '面向 XFusion AI Hackathon 赛题 5 的文档问答系统，解析 PPTX、PDF 与表格结构，构建页面级、Chunk、Fact 三层索引，并结合 SQLite FTS5、规则评分和 LLM 路由提升检索解释性。',
    coverImage: undefined,
    projectUrl: 'https://github.com/tbszz/XFusion_AI_Hackathon',
    sourceUrl: 'https://github.com/tbszz/XFusion_AI_Hackathon',
    tags: ['Python', 'FastAPI', 'React', 'SQLite FTS5', 'RAG', 'LLM'],
    translations: {
      en: {
        title: 'PPTSight Enterprise Document Retrieval and QA',
        description: 'A document QA system built for XFusion AI Hackathon Task 5. It parses PPTX, PDF, and tabular structures, builds page-level, chunk-level, and fact-level indexes, and combines SQLite FTS5, rule scoring, and LLM routing for explainable retrieval.',
        tags: ['Python', 'FastAPI', 'React', 'SQLite FTS5', 'RAG', 'LLM'],
      },
    },
    featured: true,
    sortOrder: 2,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1003,
    title: '《园冶：借景》古代园林解谜游戏',
    description: '以《园冶》的“借景”理念为核心的 Unity 解谜游戏，包含强制透视、影子投射、框景视差等视觉错位谜题，并接入 AI 问答面板与章节上下文提示。',
    coverImage: undefined,
    projectUrl: 'https://github.com/tbszz/Yuanye-Jiejing',
    sourceUrl: 'https://github.com/tbszz/Yuanye-Jiejing',
    tags: ['Unity', 'C#', 'HDRP', 'Game AI', 'OpenAI API', 'Testing'],
    translations: {
      en: {
        title: 'Yuanye: Jiejing Ancient Garden Puzzle Game',
        description: 'A Unity puzzle game built around the classical garden concept of borrowed scenery. It features forced perspective, shadow projection, framed-view parallax puzzles, plus an AI Q&A panel with chapter-aware hints.',
        tags: ['Unity', 'C#', 'HDRP', 'Game AI', 'OpenAI API', 'Testing'],
      },
    },
    featured: true,
    sortOrder: 3,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1004,
    title: 'XianyuAutoAgent 闲鱼 AI 值守机器人',
    description: '面向闲鱼平台的 AI 自动化值守系统，支持多专家协同决策、上下文感知对话、智能议价和 7×24 小时自动化客服工作流。',
    coverImage: undefined,
    projectUrl: 'https://github.com/tbszz/XianyuAutoAgent',
    sourceUrl: 'https://github.com/tbszz/XianyuAutoAgent',
    tags: ['Python', 'AI Agent', 'Automation', 'RPA', 'Negotiation', 'Workflow'],
    translations: {
      en: {
        title: 'XianyuAutoAgent AI Sales Assistant',
        description: 'An AI automation system for Xianyu operations, supporting multi-expert decision making, context-aware conversation, intelligent negotiation, and 24/7 customer-service workflows.',
        tags: ['Python', 'AI Agent', 'Automation', 'RPA', 'Negotiation', 'Workflow'],
      },
    },
    featured: true,
    sortOrder: 4,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1005,
    title: 'VoiceBridge 语音 AI 工作流',
    description: '澳门黑客松源代码项目，围绕语音与 AI 工作流搭建数据处理、交互和自动化能力，体现从原型到可交付工程结构的完整落地。',
    coverImage: undefined,
    projectUrl: 'https://github.com/tbszz/aomen-heikesong-source',
    sourceUrl: 'https://github.com/tbszz/aomen-heikesong-source',
    tags: ['Python', 'Voice AI', 'Hackathon', 'Automation', 'Workflow'],
    translations: {
      en: {
        title: 'VoiceBridge Voice AI Workflow',
        description: 'A Macau hackathon source project focused on voice and AI workflows, covering data processing, interaction, and automation capabilities from prototype to deliverable engineering structure.',
        tags: ['Python', 'Voice AI', 'Hackathon', 'Automation', 'Workflow'],
      },
    },
    featured: true,
    sortOrder: 5,
    status: 'published',
    createdAt: '2026-06-22T00:00:00.000Z',
  },
  {
    id: 1006,
    title: 'Awesome OpenClaw Manager 多网关运维面板',
    description: '面向 Windows 与 WSL2 的 OpenClaw 管理面板，集成多网关 dashboard、Telegram Bot 管理、Discord Bot Gateway、控制中心与运维 UI。',
    coverImage: undefined,
    projectUrl: 'https://github.com/tbszz/awesome-openclaw-manager',
    sourceUrl: 'https://github.com/tbszz/awesome-openclaw-manager',
    tags: ['TypeScript', 'Dashboard', 'Telegram Bot', 'Discord Gateway', 'Operations UI'],
    translations: {
      en: {
        title: 'Awesome OpenClaw Manager Operations Dashboard',
        description: 'An OpenClaw management dashboard for Windows and WSL2, integrating a multi-gateway dashboard, Telegram bot management, Discord bot gateway, control center, and operations UI.',
        tags: ['TypeScript', 'Dashboard', 'Telegram Bot', 'Discord Gateway', 'Operations UI'],
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
