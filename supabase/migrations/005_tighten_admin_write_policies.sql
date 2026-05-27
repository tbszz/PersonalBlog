-- =====================================================
-- 2026-05-27: 收紧旧匿名写入策略，写操作改为 Supabase Auth 管理员
-- =====================================================

DROP POLICY IF EXISTS "Enable all access for articles" ON articles;
DROP POLICY IF EXISTS "Enable all access for gallery" ON gallery;
DROP POLICY IF EXISTS "Enable all access for users" ON users;

DROP POLICY IF EXISTS "Allow public read on articles" ON articles;
DROP POLICY IF EXISTS "Allow public read on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow public read on users" ON users;
DROP POLICY IF EXISTS "Allow admin insert on articles" ON articles;
DROP POLICY IF EXISTS "Allow admin update on articles" ON articles;
DROP POLICY IF EXISTS "Allow admin delete on articles" ON articles;
DROP POLICY IF EXISTS "Allow admin insert on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin delete on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow admin update on users" ON users;

CREATE POLICY "Allow public read on articles" ON articles
  FOR SELECT USING (status = 'published' OR is_admin());

CREATE POLICY "Allow public read on gallery" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on users" ON users
  FOR SELECT USING (username = 'admin');

CREATE POLICY "Allow admin insert on articles" ON articles
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on articles" ON articles
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on articles" ON articles
  FOR DELETE TO authenticated USING (is_admin());

CREATE POLICY "Allow admin insert on gallery" ON gallery
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "Allow admin update on gallery" ON gallery
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Allow admin delete on gallery" ON gallery
  FOR DELETE TO authenticated USING (is_admin());

CREATE POLICY "Allow admin update on users" ON users
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Give me liberty or give me death" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read on uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin insert on uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update on uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete on uploads" ON storage.objects;

CREATE POLICY "Allow public read on uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow admin insert on uploads" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads' AND is_admin());

CREATE POLICY "Allow admin update on uploads" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'uploads' AND is_admin()) WITH CHECK (bucket_id = 'uploads' AND is_admin());

CREATE POLICY "Allow admin delete on uploads" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'uploads' AND is_admin());
