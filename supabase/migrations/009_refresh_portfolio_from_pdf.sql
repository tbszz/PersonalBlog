-- =====================================================
-- 2026-06-29: Refresh portfolio from the PDF portfolio source
-- =====================================================

BEGIN;

DELETE FROM portfolio_items
WHERE title IN (
  '《园冶：借景》古代园林解谜游戏',
  'XianyuAutoAgent 闲鱼 AI 值守机器人',
  'VoiceBridge 语音 AI 工作流',
  'Awesome OpenClaw Manager 多网关运维面板'
);

WITH seed(title, description, cover_image, project_url, source_url, tags, translations, sort_order) AS (
  VALUES
    (
      'PPTSight 企业文档结构化检索与问答系统',
      '面向 XFusion AI Hackathon 赛题 5 的文档问答系统，解析 PPTX、PDF 与表格结构，构建页面级、Chunk、Fact 三层索引，并结合 SQLite FTS5、规则评分和 LLM 路由提升检索解释性。',
      '/portfolio/pptsight.webp',
      NULL,
      NULL,
      '["Python", "FastAPI", "React", "SQLite FTS5", "PPTX XML", "RAG"]'::jsonb,
      '{"en":{"title":"PPTSight Enterprise Document Retrieval and QA","description":"A document QA system built for XFusion AI Hackathon Task 5. It parses PPTX, PDF, and tabular structures, builds page-level, chunk-level, and fact-level indexes, and combines SQLite FTS5, rule scoring, and LLM routing for explainable retrieval.","tags":["Python","FastAPI","React","SQLite FTS5","PPTX XML","RAG"]}}'::jsonb,
      1
    ),
    (
      'Resume Protocol AI 求职资料与岗位雷达',
      '面向求职场景的本地 AI 产品，覆盖材料导入、职业画像抽取、缺口追问、岗位筛选、模板选择、正式简历生成、投递队列和 RPA dry-run 风险边界。',
      '/portfolio/resume-protocol.webp',
      'https://github.com/tbszz/Resume-Protocol',
      'https://github.com/tbszz/Resume-Protocol',
      '["React", "Vite", "Express", "Playwright", "pdf-parse", "MiniMax API"]'::jsonb,
      '{"en":{"title":"Resume Protocol AI Career Material and Job Radar","description":"A local AI product for job hunting workflows, covering material import, career-profile extraction, gap follow-up, job filtering, template selection, formal resume generation, delivery queues, and RPA dry-run safety boundaries.","tags":["React","Vite","Express","Playwright","pdf-parse","MiniMax API"]}}'::jsonb,
      2
    ),
    (
      'AceMode 全球华人 AI 生产力社区',
      '基于 Discourse 的生产级社区二次开发项目，覆盖 Rails 后端扩展、Ember 前端交互、Sidekiq 异步任务、PostgreSQL/Redis 性能优化，以及 Ubuntu + Nginx + Puma 生产部署。',
      '/portfolio/acemode.webp',
      'https://acemode.ai',
      NULL,
      '["Ruby on Rails", "Ember.js", "PostgreSQL", "Redis", "Sidekiq", "Nginx"]'::jsonb,
      '{"en":{"title":"AceMode Global Chinese AI Productivity Community","description":"A production-grade Discourse-based community customization project covering Rails backend extensions, Ember frontend interactions, Sidekiq background jobs, PostgreSQL/Redis performance work, and Ubuntu + Nginx + Puma deployment.","tags":["Ruby on Rails","Ember.js","PostgreSQL","Redis","Sidekiq","Nginx"]}}'::jsonb,
      3
    ),
    (
      'OpenClaw 多 Agent 控制台',
      '面向 Windows / WSL2 的多 Gateway 桌面管理器，用统一控制台管理多 bot、多账号、多 Telegram/Discord 通道、生命周期、日志和健康状态。',
      '/portfolio/openclaw-manager.webp',
      'https://github.com/tbszz/awesome-openclaw-manager',
      'https://github.com/tbszz/awesome-openclaw-manager',
      '["Tauri 2", "React", "TypeScript", "Rust", "WSL2", "Gateway Orchestration"]'::jsonb,
      '{"en":{"title":"OpenClaw Multi-Agent Control Console","description":"A Windows / WSL2 multi-gateway desktop manager that unifies bot accounts, Telegram/Discord channels, lifecycle controls, logs, and health status into one operations console.","tags":["Tauri 2","React","TypeScript","Rust","WSL2","Gateway Orchestration"]}}'::jsonb,
      4
    ),
    (
      'HyperFarming 智慧农业管理平台',
      '面向农业园区 / 智慧大棚的 B/G 端管理系统，覆盖环境监测、设备控制、数据分析、生产计划、仓储溯源、GIS 地块可视化和 AI 智脑。',
      '/portfolio/hyperfarming.webp',
      NULL,
      NULL,
      '["Vue 3", "TypeScript", "Go", "Gin", "PostgreSQL", "WebSocket", "Docker"]'::jsonb,
      '{"en":{"title":"HyperFarming Smart Agriculture Management Platform","description":"A B/G-side management system for agricultural parks and smart greenhouses, covering environment monitoring, device control, analytics, production planning, warehouse traceability, GIS land visualization, and AI assistant workflows.","tags":["Vue 3","TypeScript","Go","Gin","PostgreSQL","WebSocket","Docker"]}}'::jsonb,
      5
    ),
    (
      '自动化视频剪辑工具',
      'React + Remotion + IndexTTS 的内容生产流水线，将脚本切片、语音合成、字幕、转场、录屏缩放、商品展示和最终导出串成可复用视频生产系统。',
      '/portfolio/auto-video-editor.webp',
      NULL,
      NULL,
      '["React", "Remotion", "IndexTTS", "Python", "Script Slicing", "Auto Render"]'::jsonb,
      '{"en":{"title":"Automated Video Editing Pipeline","description":"A React + Remotion + IndexTTS content-production pipeline that connects script slicing, voice generation, subtitles, transitions, screen-recording zooms, product showcases, and final exports into reusable video templates.","tags":["React","Remotion","IndexTTS","Python","Script Slicing","Auto Render"]}}'::jsonb,
      6
    )
)
UPDATE portfolio_items
SET
  description = seed.description,
  cover_image = seed.cover_image,
  project_url = seed.project_url,
  source_url = seed.source_url,
  tags = seed.tags,
  translations = seed.translations,
  featured = TRUE,
  sort_order = seed.sort_order,
  status = 'published',
  updated_at = NOW()
FROM seed
WHERE portfolio_items.title = seed.title;

WITH seed(title, description, cover_image, project_url, source_url, tags, translations, sort_order) AS (
  VALUES
    ('PPTSight 企业文档结构化检索与问答系统', '面向 XFusion AI Hackathon 赛题 5 的文档问答系统，解析 PPTX、PDF 与表格结构，构建页面级、Chunk、Fact 三层索引，并结合 SQLite FTS5、规则评分和 LLM 路由提升检索解释性。', '/portfolio/pptsight.webp', NULL, NULL, '["Python", "FastAPI", "React", "SQLite FTS5", "PPTX XML", "RAG"]'::jsonb, '{"en":{"title":"PPTSight Enterprise Document Retrieval and QA","description":"A document QA system built for XFusion AI Hackathon Task 5. It parses PPTX, PDF, and tabular structures, builds page-level, chunk-level, and fact-level indexes, and combines SQLite FTS5, rule scoring, and LLM routing for explainable retrieval.","tags":["Python","FastAPI","React","SQLite FTS5","PPTX XML","RAG"]}}'::jsonb, 1),
    ('Resume Protocol AI 求职资料与岗位雷达', '面向求职场景的本地 AI 产品，覆盖材料导入、职业画像抽取、缺口追问、岗位筛选、模板选择、正式简历生成、投递队列和 RPA dry-run 风险边界。', '/portfolio/resume-protocol.webp', 'https://github.com/tbszz/Resume-Protocol', 'https://github.com/tbszz/Resume-Protocol', '["React", "Vite", "Express", "Playwright", "pdf-parse", "MiniMax API"]'::jsonb, '{"en":{"title":"Resume Protocol AI Career Material and Job Radar","description":"A local AI product for job hunting workflows, covering material import, career-profile extraction, gap follow-up, job filtering, template selection, formal resume generation, delivery queues, and RPA dry-run safety boundaries.","tags":["React","Vite","Express","Playwright","pdf-parse","MiniMax API"]}}'::jsonb, 2),
    ('AceMode 全球华人 AI 生产力社区', '基于 Discourse 的生产级社区二次开发项目，覆盖 Rails 后端扩展、Ember 前端交互、Sidekiq 异步任务、PostgreSQL/Redis 性能优化，以及 Ubuntu + Nginx + Puma 生产部署。', '/portfolio/acemode.webp', 'https://acemode.ai', NULL, '["Ruby on Rails", "Ember.js", "PostgreSQL", "Redis", "Sidekiq", "Nginx"]'::jsonb, '{"en":{"title":"AceMode Global Chinese AI Productivity Community","description":"A production-grade Discourse-based community customization project covering Rails backend extensions, Ember frontend interactions, Sidekiq background jobs, PostgreSQL/Redis performance work, and Ubuntu + Nginx + Puma deployment.","tags":["Ruby on Rails","Ember.js","PostgreSQL","Redis","Sidekiq","Nginx"]}}'::jsonb, 3),
    ('OpenClaw 多 Agent 控制台', '面向 Windows / WSL2 的多 Gateway 桌面管理器，用统一控制台管理多 bot、多账号、多 Telegram/Discord 通道、生命周期、日志和健康状态。', '/portfolio/openclaw-manager.webp', 'https://github.com/tbszz/awesome-openclaw-manager', 'https://github.com/tbszz/awesome-openclaw-manager', '["Tauri 2", "React", "TypeScript", "Rust", "WSL2", "Gateway Orchestration"]'::jsonb, '{"en":{"title":"OpenClaw Multi-Agent Control Console","description":"A Windows / WSL2 multi-gateway desktop manager that unifies bot accounts, Telegram/Discord channels, lifecycle controls, logs, and health status into one operations console.","tags":["Tauri 2","React","TypeScript","Rust","WSL2","Gateway Orchestration"]}}'::jsonb, 4),
    ('HyperFarming 智慧农业管理平台', '面向农业园区 / 智慧大棚的 B/G 端管理系统，覆盖环境监测、设备控制、数据分析、生产计划、仓储溯源、GIS 地块可视化和 AI 智脑。', '/portfolio/hyperfarming.webp', NULL, NULL, '["Vue 3", "TypeScript", "Go", "Gin", "PostgreSQL", "WebSocket", "Docker"]'::jsonb, '{"en":{"title":"HyperFarming Smart Agriculture Management Platform","description":"A B/G-side management system for agricultural parks and smart greenhouses, covering environment monitoring, device control, analytics, production planning, warehouse traceability, GIS land visualization, and AI assistant workflows.","tags":["Vue 3","TypeScript","Go","Gin","PostgreSQL","WebSocket","Docker"]}}'::jsonb, 5),
    ('自动化视频剪辑工具', 'React + Remotion + IndexTTS 的内容生产流水线，将脚本切片、语音合成、字幕、转场、录屏缩放、商品展示和最终导出串成可复用视频生产系统。', '/portfolio/auto-video-editor.webp', NULL, NULL, '["React", "Remotion", "IndexTTS", "Python", "Script Slicing", "Auto Render"]'::jsonb, '{"en":{"title":"Automated Video Editing Pipeline","description":"A React + Remotion + IndexTTS content-production pipeline that connects script slicing, voice generation, subtitles, transitions, screen-recording zooms, product showcases, and final exports into reusable video templates.","tags":["React","Remotion","IndexTTS","Python","Script Slicing","Auto Render"]}}'::jsonb, 6)
)
INSERT INTO portfolio_items (
  title,
  description,
  cover_image,
  project_url,
  source_url,
  tags,
  translations,
  featured,
  sort_order,
  status
)
SELECT
  seed.title,
  seed.description,
  seed.cover_image,
  seed.project_url,
  seed.source_url,
  seed.tags,
  seed.translations,
  TRUE,
  seed.sort_order,
  'published'
FROM seed
WHERE NOT EXISTS (
  SELECT 1
  FROM portfolio_items
  WHERE portfolio_items.title = seed.title
);

COMMIT;
