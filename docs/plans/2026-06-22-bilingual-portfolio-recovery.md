# Bilingual Portfolio Recovery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the portfolio page with six high-signal projects and make the whole blog switch fully between Chinese and English for static UI, profile, portfolio, gallery, and article content.

**Architecture:** Keep the existing Vue + Supabase architecture. Add a small curated portfolio seed as a read fallback only when the production `portfolio_items` table is missing or empty, while preserving the Supabase table path for future persistence. Dynamic bilingual content uses `translations.en` caches; new authoring flows must require English backups so language switching never depends on live translation.

**Tech Stack:** Vue 3, TypeScript, Supabase JS, existing i18n utilities, existing unit-test runner, Vite build, Supabase SQL migrations.

---

## PRD

### Problem

The English toggle currently localizes some shell UI but not all user-authored content. The production Supabase database also has no `portfolio_items` table, so the portfolio page appears empty. The user wants a finished portfolio and a global bilingual experience where switching to English changes every visible content surface, including profile, portfolio descriptions, article list/detail content, and future authored posts.

### Current Evidence

- Production articles still exist: 8 rows were verified through Supabase REST.
- Production gallery still exists: 8 rows were verified through Supabase REST.
- Production portfolio table is missing: Supabase returns `PGRST205 Could not find the table public.portfolio_items`.
- Local PDF source exists: `E:\赛题5\resume-v2-source.pdf`.
- GitHub project list was fetched for `tbszz`.
- Current code already has bilingual utilities and migrations committed in `b4baa1f`, but production DB migrations are not applied.

### Selected Portfolio Projects

Use these six projects unless a stronger recovered source appears:

1. AceMode Global Chinese AI Productivity Community
   - Evidence: resume PDF, production site `acemode.ai`
   - Stack: Ruby on Rails, Ember.js, PostgreSQL, Redis, Sidekiq, Docker, Nginx
2. PPTSight Enterprise Document Structured Retrieval and QA
   - Evidence: resume PDF, GitHub `XFusion_AI_Hackathon`, local `E:\赛题5`
   - Stack: Python, FastAPI, React, SQLite FTS5, PDF/PPTX parsing, LLM routing
3. Yuanye Jiejing Ancient Garden Puzzle Game
   - Evidence: resume PDF, GitHub `Yuanye-Jiejing`
   - Stack: Unity 6000, C#, HDRP, Timeline, UGUI, OpenAI-compatible API
4. XianyuAutoAgent AI Sales Assistant
   - Evidence: GitHub `XianyuAutoAgent`
   - Stack: Python, multi-agent decisioning, negotiation, context-aware automation
5. VoiceBridge / Macau Hackathon Source
   - Evidence: GitHub `aomen-heikesong-source`
   - Stack: Python, voice/AI workflow
6. Awesome OpenClaw Manager
   - Evidence: GitHub `awesome-openclaw-manager`
   - Stack: TypeScript, dashboard, Telegram/Discord bot gateway, operations UI

### Requirements

- Portfolio page must show six polished project cards even while production `portfolio_items` table is missing.
- Each portfolio item must include Chinese fields and `translations.en` for title, description, and tags.
- If the Supabase table exists and has rows, DB content should win over seed content.
- English mode must localize navigation, static shell text, profile, portfolio cards, gallery descriptions, article titles, article summaries, categories, tags, and expanded article content.
- New article publishing must store English title, summary, and content before accepting publication.
- New portfolio and gallery content must store English backups before accepting publication.
- Code should stay small: no runtime translation dependency, no new frontend package, no broad refactor.
- Verification must include unit tests, production build, static Chinese-string scan, and live read checks where possible.

### Non-Goals

- Do not invent a backend translation service in this pass.
- Do not require production Supabase admin credentials for the immediate portfolio restore.
- Do not migrate unrelated database schema.
- Do not include unrelated favicon work in commits.

---

## Todo

### Task 1: Lock Portfolio Fallback Behavior With Tests

**Files:**
- Create: `frontend/tests/portfolioFallback.test.ts`
- Modify: `frontend/scripts/run-unit-tests.mjs`

**Steps:**
1. Add tests that assert seeded portfolio items localize through `localizePortfolioItem(..., 'en')`.
2. Add tests that assert the seed contains exactly six published items.
3. Add tests that assert every seeded item has complete English backup.
4. Run `npm.cmd run test:unit` and confirm the new test fails before implementation.

### Task 2: Add Curated Portfolio Seed

**Files:**
- Create: `frontend/src/data/portfolioSeed.ts`
- Modify: `frontend/src/api.ts`

**Steps:**
1. Create `defaultPortfolioItems` with six selected projects.
2. Include `translations.en` for every item.
3. Add a small `getDefaultPortfolioItems()` helper that returns cloned data.
4. In `portfolioApi.getAll()`, return seed items when Supabase returns `42P01` or `PGRST205`, or when the table exists but returns zero rows.
5. Do not use seed after successful non-empty DB reads.
6. Run portfolio fallback tests.

### Task 3: Verify Existing Bilingual Content Pipeline

**Files:**
- Modify: `frontend/tests/contentLocalization.test.ts`
- Modify only if tests expose gaps: `frontend/src/utils/contentLocalization.ts`, `frontend/src/utils/i18n.ts`

**Steps:**
1. Add a regression test for article detail content switching to English.
2. Add a regression test that incomplete English backups are rejected.
3. Add a regression test for profile English localization using `profile.locales.en`.
4. Run `npm.cmd run test:unit`.

### Task 4: Improve Authoring UX Without Extra Dependencies

**Files:**
- Modify: `frontend/src/components/WriteArticleModal.vue`
- Modify: `frontend/src/components/PortfolioModal.vue`
- Modify: `frontend/src/components/UploadModal.vue`
- Modify: `frontend/src/components/HeroSection.vue`

**Steps:**
1. Ensure submit buttons cannot publish when required English cache is missing.
2. Ensure validation messages are localized.
3. Keep form changes small and avoid new abstractions unless duplicated code becomes unsafe.
4. Run `npm.cmd run build`.

### Task 5: Validate Static and Dynamic English Coverage

**Files:**
- Modify if needed: `frontend/tests/i18n.test.ts`
- Optional create: `frontend/tests/noChineseInEnglishCache.test.ts`

**Steps:**
1. Scan English locale strings for accidental Chinese text.
2. Scan portfolio seed English fields for CJK characters.
3. Confirm all source Chinese UI strings are either inside `translations.zh`, known profile defaults, or intended Chinese source content.
4. Run `npm.cmd run test:unit`.

### Task 6: Production Verification

**Files:**
- No code changes expected.

**Steps:**
1. Run `npm.cmd run test:unit`.
2. Run `npm.cmd run build`.
3. Commit with Lore protocol.
4. Push to `main`.
5. Confirm `https://zouzi.tech/` references a new asset bundle.
6. Confirm production articles endpoint still returns 8 rows.
7. Confirm production portfolio UI bundle contains seeded project text.
8. Smoke-check English mode and verify profile, portfolio, article list/detail, and gallery descriptions switch.

### Task 7: Database Follow-Up When Credentials Exist

**Files:**
- Already present: `supabase/migrations/004_add_portfolio_items.sql`
- Already present: `supabase/migrations/006_add_content_translations.sql`
- Already present: `supabase/migrations/007_backfill_existing_english_content.sql`
- Added: `supabase/migrations/008_seed_portfolio_items.sql`

**Steps:**
1. Apply migrations 004, 006, 007, and 008 to production Supabase.
2. Verify the six portfolio seed items exist in `portfolio_items` with `translations.en`.
3. Verify DB content overrides the frontend seed.
4. Remove or keep seed as empty-state fallback depending on production confidence.
