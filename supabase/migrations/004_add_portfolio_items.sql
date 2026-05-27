-- =====================================================
-- 2026-05-27: 作品集表与基础 Supabase Auth 绑定字段
-- =====================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  cover_image VARCHAR(500),
  project_url VARCHAR(500),
  source_url VARCHAR(500),
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_status_sort
ON portfolio_items(status, featured DESC, sort_order ASC, created_at DESC);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE users.auth_user_id = auth.uid()
      AND users.role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

DROP POLICY IF EXISTS "Allow public read on portfolio_items" ON portfolio_items;
DROP POLICY IF EXISTS "Allow admin insert on portfolio_items" ON portfolio_items;
DROP POLICY IF EXISTS "Allow admin update on portfolio_items" ON portfolio_items;
DROP POLICY IF EXISTS "Allow admin delete on portfolio_items" ON portfolio_items;

CREATE POLICY "Allow public read on portfolio_items" ON portfolio_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow admin insert on portfolio_items" ON portfolio_items
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on portfolio_items" ON portfolio_items
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on portfolio_items" ON portfolio_items
  FOR DELETE TO authenticated USING (is_admin());
