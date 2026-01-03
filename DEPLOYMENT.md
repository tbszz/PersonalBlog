# Vercel + Supabase 部署指南

## 一、Supabase 配置

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 **New Project**
3. 填写项目名称，选择区域（建议选择离用户最近的）
4. 设置数据库密码（妥善保存）

### 2. 获取 API 凭据

1. 进入项目后，点击左侧 **Settings** → **API**
2. 复制以下信息：
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJh...`

### 3. 执行数据库迁移

1. 点击左侧 **SQL Editor**
2. 新建一个 Query
3. 将 `supabase/migrations/001_initial_schema.sql` 的内容粘贴进去
4. 点击 **Run** 执行

### 4. 创建 Storage Bucket

1. 点击左侧 **Storage**
2. 点击 **New bucket**
3. 名称填写: `uploads`
4. 勾选 **Public bucket**
5. 点击 **Create bucket**

---

## 二、Vercel 部署

### 1. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | 你的 Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | 你的 Supabase anon key |

### 2. 部署方式

#### 方式 A：GitHub 自动部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 **Add New** → **Project**
4. 选择你的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 添加环境变量（见上表）
7. 点击 **Deploy**

#### 方式 B：Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 进入前端目录
cd frontend

# 登录并部署
vercel login
vercel --prod
```

---

## 三、本地开发

### 1. 配置环境变量

复制环境变量模板：

```bash
cd frontend
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 凭据：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 启动开发服务器

```bash
npm install
npm run dev
```

访问 http://localhost:5173

---

## 四、注意事项

### 安全性

- `anon key` 是公开的，只能执行受 RLS 策略限制的操作
- 敏感操作需要用户认证后使用 `service_role key`（永远不要暴露在前端）

### CORS

Supabase 自动处理 CORS，无需额外配置。

### 文件上传

- 图片/视频将上传到 Supabase Storage
- 免费版限制：1GB 存储空间

---

## 五、清理旧文件（可选）

迁移完成后，可以删除以下不再需要的文件：

```
# 后端相关
src/
pom.xml
Dockerfile

# Redis
redis/
dump.rdb
```

> ⚠️ **建议**：在确认新架构运行正常前，先保留这些文件作为备份。
