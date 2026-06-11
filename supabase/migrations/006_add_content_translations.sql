-- =====================================================
-- 2026-06-11: Bilingual cached backups for user-authored content
-- =====================================================

ALTER TABLE articles
ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE gallery
ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE portfolio_items
ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE articles
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{en}',
  jsonb_strip_nulls(jsonb_build_object(
    'title', CASE title
      WHEN '欢迎来到我的博客' THEN 'Welcome to My Blog'
      ELSE title
    END,
    'summary', CASE summary
      WHEN '欢迎来到我的个人博客，这里记录我的技术学习和生活感悟。' THEN 'Welcome to my personal blog, where I record my technical learning and reflections on life.'
      ELSE summary
    END,
    'content', CASE content
      WHEN '这是我的第一篇博客文章。感谢你的访问！' THEN 'This is my first blog post. Thanks for visiting!'
      ELSE content
    END,
    'category', CASE category
      WHEN '随笔' THEN 'Essay'
      WHEN '生活' THEN 'Life'
      WHEN '技术' THEN 'Technology'
      ELSE category
    END
  )),
  true
)
WHERE NOT (COALESCE(translations, '{}'::jsonb) ? 'en');

UPDATE gallery
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{en}',
  jsonb_strip_nulls(jsonb_build_object('description', description)),
  true
)
WHERE NOT (COALESCE(translations, '{}'::jsonb) ? 'en');

UPDATE portfolio_items
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{en}',
  jsonb_strip_nulls(jsonb_build_object(
    'title', title,
    'description', description,
    'tags', (
      SELECT jsonb_agg(
        CASE value #>> '{}'
          WHEN '建筑设计' THEN 'Architecture Design'
          WHEN '东方美学' THEN 'Eastern Aesthetics'
          WHEN '前端开发' THEN 'Frontend Development'
          WHEN '作品集' THEN 'Portfolio'
          ELSE value #>> '{}'
        END
      )
      FROM jsonb_array_elements(tags)
    )
  )),
  true
)
WHERE NOT (COALESCE(translations, '{}'::jsonb) ? 'en');
