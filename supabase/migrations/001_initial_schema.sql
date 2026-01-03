-- =====================================================
-- Supabase 数据库迁移脚本
-- 在 Supabase Dashboard -> SQL Editor 中执行
-- =====================================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255),
  nickname VARCHAR(100),
  avatar VARCHAR(500),
  role VARCHAR(20) DEFAULT 'user',
  profile_json TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  summary VARCHAR(500),
  cover_image VARCHAR(500),
  status VARCHAR(20) DEFAULT 'published',
  publish_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 图库表
CREATE TABLE IF NOT EXISTS gallery (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  description TEXT,
  width INT,
  height INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 创建 RPC 函数（用于原子操作）
-- =====================================================

-- 增加文章浏览量
CREATE OR REPLACE FUNCTION increment_view_count(article_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE articles SET view_count = view_count + 1 WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- 增加文章点赞数
CREATE OR REPLACE FUNCTION increment_like_count(article_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE articles SET like_count = like_count + 1 WHERE id = article_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 启用 Row Level Security (RLS) - 可选但推荐
-- =====================================================

-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读取公开数据
CREATE POLICY "Allow public read on articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on users" ON users
  FOR SELECT USING (true);

-- 如果需要写入权限（登录用户），可以添加更多策略
-- CREATE POLICY "Allow authenticated insert" ON gallery
--   FOR INSERT TO authenticated WITH CHECK (true);

-- =====================================================
-- 创建 Storage Bucket（需要在 Dashboard 中操作）
-- =====================================================
-- 1. 进入 Supabase Dashboard -> Storage
-- 2. 点击 "New bucket"
-- 3. 名称填写: uploads
-- 4. 勾选 "Public bucket"（允许公开访问）

-- =====================================================
-- 插入测试数据（可选）
-- =====================================================

-- 插入默认用户
INSERT INTO users (username, nickname, role) 
VALUES ('admin', '管理员', 'admin')
ON CONFLICT (username) DO NOTHING;

-- 插入示例文章
INSERT INTO articles (title, content, summary, status) 
VALUES (
  '欢迎来到我的博客',
  '这是我的第一篇博客文章。感谢你的访问！',
  '欢迎来到我的个人博客，这里记录我的技术学习和生活感悟。',
  'published'
);
