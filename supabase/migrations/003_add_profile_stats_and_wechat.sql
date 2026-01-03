-- =====================================================
-- 2026-01-03 升级脚本：个人信息扩展
-- 请在 Supabase SQL Editor 中执行此脚本
-- =====================================================

-- 1. 为 users 表添加扩展字段
-- profile_stats 用于存储文章数、相册数、年限的自定义值
-- wechat_qr_code 用于存储微信二维码图片 URL
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profile_stats JSONB DEFAULT '{"articles": "42", "albums": "108", "years": "5"}',
ADD COLUMN IF NOT EXISTS wechat_qr_code VARCHAR(500);

-- 2. 更新现有的 admin 用户（如果存在），设置默认值
UPDATE users 
SET 
  profile_stats = '{"articles": "42", "albums": "108", "years": "5"}'::jsonb
WHERE username = 'admin' AND profile_stats IS NULL;
