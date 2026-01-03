-- =====================================================
-- 2026-01-03 紧急修复脚本：放宽权限与重置管理员
-- 请在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 1. 更新管理员账号 (固定 admin/zou162534)
-- 先删除旧的 admin（防止冲突）
DELETE FROM users WHERE username = 'admin';

-- 插入新管理员
INSERT INTO users (username, password, nickname, role, avatar)
VALUES (
  'admin', 
  'zou162534', 
  'Admin', 
  'admin',
  'https://ui-avatars.com/api/?name=Admin&background=random'
);

-- 2. 紧急放宽 RLS 策略 (允许所有操作)
-- 警告：这允许任何知道 Project URL 和 Anon Key 的人修改数据
-- 对于个人博客且通过前端隐藏入口的情况，暂时可接受，后续建议接入 Supabase Auth

-- 删除旧策略
DROP POLICY IF EXISTS "Allow public read on articles" ON articles;
DROP POLICY IF EXISTS "Allow public read on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow public read on users" ON users;
DROP POLICY IF EXISTS "Allow authenticated insert" ON gallery;

-- 允许 articles 全权访问
CREATE POLICY "Enable all access for articles" ON articles
  FOR ALL USING (true) WITH CHECK (true);

-- 允许 gallery 全权访问
CREATE POLICY "Enable all access for gallery" ON gallery
  FOR ALL USING (true) WITH CHECK (true);

-- 允许 users 全权访问 (包括读取密码，所以要在前端小心处理)
CREATE POLICY "Enable all access for users" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- 3. 确保存储桶策略也开放 (如果还没设置)
-- 注意：Storage 的策略需要在 Storage 界面或通过 SQL 设置
-- 以下 SQL 尝试开放 'uploads' 桶的公共读写权限
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Give me liberty or give me death" ON storage.objects
  FOR ALL USING (bucket_id = 'uploads') WITH CHECK (bucket_id = 'uploads');
