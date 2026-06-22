import { isSupabaseConfigured, supabase } from './lib/supabase'
import { cacheGetJson, cacheRemove, cacheSetJson, getBrowserStorage } from './utils/cache'
import { requireEnglishBackup, type ContentTranslations } from './utils/contentLocalization'
import { parsePortfolioTags } from './utils/portfolio'
import { prepareFileForUpload } from './utils/uploadOptimizer'
import { getDefaultPortfolioItems } from './data/portfolioSeed'

// ==================== 类型定义 ====================

export interface User {
  id: number
  authUserId?: string
  username: string
  password?: string
  nickname?: string
  avatar?: string
  role: string
  profileJson?: string
  profileStats?: { articles: string; albums: string; years: string }
  wechatQrCode?: string
  token?: string
}

export interface GalleryItem {
  id: number
  type: 'image' | 'video'
  url: string
  thumbnailUrl?: string
  description: string
  width?: number
  height?: number
  createdAt: string
  translations?: ContentTranslations<Pick<GalleryItem, 'description'>>
}

export interface Article {
  id: number
  title: string
  content?: string
  summary: string
  coverImage?: string
  status: string
  publishTime: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags?: string[]
  category?: string
  translations?: ContentTranslations<Pick<Article, 'title' | 'summary' | 'content' | 'category' | 'tags'>>
}

export interface PortfolioItem {
  id: number
  title: string
  description: string
  coverImage?: string
  projectUrl?: string
  sourceUrl?: string
  tags?: string[]
  featured: boolean
  sortOrder: number
  status: 'published' | 'draft'
  createdAt: string
  updatedAt?: string
  translations?: ContentTranslations<Pick<PortfolioItem, 'title' | 'description' | 'tags'>>
}

export type PortfolioInput = Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'>

const CACHE_TTL_MS = 60_000
const CACHE_KEYS = {
  profile: (username: string) => `blog:profile:${username}`,
  gallery: 'blog:gallery',
  articles: (page: number, size: number) => `blog:articles:${page}:${size}`,
  article: (id: number) => `blog:article:${id}`,
  portfolio: 'blog:portfolio',
}

function getCache<T>(key: string): T | null {
  return cacheGetJson<T>(getBrowserStorage(), key)
}

function setCache<T>(key: string, value: T): void {
  cacheSetJson(getBrowserStorage(), key, value, CACHE_TTL_MS)
}

function removeCache(key: string): void {
  cacheRemove(getBrowserStorage(), key)
}

function isMissingTranslationsColumn(error: unknown): boolean {
  const candidate = error as { code?: string; message?: string } | null
  return candidate?.code === '42703' && Boolean(candidate.message?.includes('translations'))
}

function isMissingArticleLocalizationColumn(error: unknown): boolean {
  const candidate = error as { code?: string; message?: string } | null
  return candidate?.code === '42703' && Boolean(
    candidate.message?.includes('translations') || candidate.message?.includes('tags'),
  )
}

// ==================== 工具函数 ====================

// 将数据库字段名（snake_case）转换为前端字段名（camelCase）
function toCamelCase<T>(obj: Record<string, unknown> | null): T {
  if (!obj) return {} as T
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = obj[key]
  }
  return result as T
}

// 将前端字段名（camelCase）转换为数据库字段名（snake_case）
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  if (!obj) return {}
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    // 处理驼峰转蛇形：在小写字母和大写字母之间插入下划线
    // 例如 profileJson -> profile_json，而不是 profile_j_son
    const snakeKey = key
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .toLowerCase()
    result[snakeKey] = obj[key]
  }
  return result
}

function mapPortfolioItem(item: Record<string, unknown>): PortfolioItem {
  const mapped = toCamelCase<PortfolioItem>(item)
  const rawTags = mapped.tags

  return {
    ...mapped,
    tags: parsePortfolioTags(Array.isArray(rawTags) ? rawTags : []),
    featured: Boolean(mapped.featured),
    sortOrder: Number(mapped.sortOrder || 0),
    status: mapped.status || 'published',
  }
}

// ==================== 用户 API ====================

export const userApi = {
  async getProfile(username: string): Promise<{ data: User }> {
    if (!isSupabaseConfigured) {
      return {
        data: {
          id: 0,
          username,
          nickname: '邹子',
          role: 'admin',
          profileStats: { articles: '-', albums: '-', years: '-' },
        },
      }
    }

    const cacheKey = CACHE_KEYS.profile(username)
    const cached = getCache<User>(cacheKey)
    if (cached) return { data: cached }

    const { data, error } = await supabase
      .from('users')
      .select('id, auth_user_id, username, nickname, avatar, role, profile_json, profile_stats, wechat_qr_code, created_at')
      .eq('username', username)
      .single()

    if (error) throw error
    const profile = toCamelCase<User>(data)
    setCache(cacheKey, profile)
    return { data: profile }
  },

  async updateProfile(id: number, userData: Partial<User>): Promise<{ data: User }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const { data, error } = await supabase
      .from('users')
      .update(toSnakeCase(userData as Record<string, unknown>))
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      throw new Error('User not found or nothing updated')
    }
    const profile = toCamelCase<User>(data[0])
    removeCache(CACHE_KEYS.profile(profile.username))
    return { data: profile }
  }
}

// ==================== 图库 API ====================

export const galleryApi = {
  async getAll(): Promise<{ data: GalleryItem[] }> {
    if (!isSupabaseConfigured) return { data: [] }

    const cached = getCache<GalleryItem[]>(CACHE_KEYS.gallery)
    if (cached) return { data: cached }

    let { data, error } = await supabase
      .from('gallery')
      .select('id, type, url, thumbnail_url, description, width, height, translations, created_at')
      .order('created_at', { ascending: false })

    if (isMissingTranslationsColumn(error)) {
      const legacy = await supabase
        .from('gallery')
        .select('id, type, url, thumbnail_url, description, width, height, created_at')
        .order('created_at', { ascending: false })
      data = legacy.data as typeof data
      error = legacy.error
    }

    if (error) throw error
    const items = (data || []).map(item => toCamelCase<GalleryItem>(item))
    setCache(CACHE_KEYS.gallery, items)
    return { data: items }
  },

  async create(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<{ data: GalleryItem }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const payload = toSnakeCase({
      ...item,
      translations: requireEnglishBackup({
        description: item.description,
      }, item.translations),
    } as Record<string, unknown>)

    let { data, error } = await supabase
      .from('gallery')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    removeCache(CACHE_KEYS.gallery)
    return { data: toCamelCase<GalleryItem>(data) }
  },

  async delete(id: number): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)

    if (error) throw error
    removeCache(CACHE_KEYS.gallery)
  },

  async upload(file: File): Promise<{ data: { url: string; optimized: boolean; originalSize: number; uploadedSize: number } }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const prepared = await prepareFileForUpload(file)
    const uploadFile = prepared.file
    const fileExt = uploadFile.name.split('.').pop() || 'bin'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `gallery/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, uploadFile, {
        cacheControl: '31536000',
        contentType: uploadFile.type || file.type,
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    return {
      data: {
        url: publicUrl,
        optimized: prepared.optimized,
        originalSize: prepared.originalSize,
        uploadedSize: prepared.uploadedSize,
      },
    }
  }
}

// ==================== 文章 API ====================

export const articleApi = {
  async getAll(page = 1, size = 10): Promise<{ data: { articles: Article[], total: number } }> {
    if (!isSupabaseConfigured) return { data: { articles: [], total: 0 } }

    const cacheKey = CACHE_KEYS.articles(page, size)
    const cached = getCache<{ articles: Article[], total: number }>(cacheKey)
    if (cached) return { data: cached }

    const from = (page - 1) * size
    const to = from + size - 1

    let { data, count, error } = await supabase
      .from('articles')
      .select('id, title, summary, cover_image, status, publish_time, view_count, like_count, comment_count, category, tags, translations', { count: 'exact' })
      .eq('status', 'published')
      .order('publish_time', { ascending: false })
      .range(from, to)

    if (isMissingArticleLocalizationColumn(error)) {
      const legacy = await supabase
        .from('articles')
        .select('id, title, summary, cover_image, status, publish_time, view_count, like_count, comment_count, category', { count: 'exact' })
        .eq('status', 'published')
        .order('publish_time', { ascending: false })
        .range(from, to)
      data = legacy.data as typeof data
      count = legacy.count
      error = legacy.error
    }

    if (error) throw error
    const result = {
      articles: (data || []).map(item => toCamelCase<Article>(item)),
      total: count || 0
    }
    setCache(cacheKey, result)
    return { data: result }
  },

  async getOne(id: number): Promise<{ data: Article }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const cacheKey = CACHE_KEYS.article(id)
    void supabase.rpc('increment_view_count', { article_id: id }).then(({ error }) => {
      if (error) console.error('Failed to increment view count:', error)
    })

    const cached = getCache<Article>(cacheKey)
    if (cached) return { data: cached }

    let { data, error } = await supabase
      .from('articles')
      .select('id, title, content, summary, cover_image, status, publish_time, view_count, like_count, comment_count, category, tags, translations, created_at')
      .eq('id', id)
      .single()

    if (isMissingArticleLocalizationColumn(error)) {
      const legacy = await supabase
        .from('articles')
        .select('id, title, content, summary, cover_image, status, publish_time, view_count, like_count, comment_count, category, created_at')
        .eq('id', id)
        .single()
      data = legacy.data as typeof data
      error = legacy.error
    }

    if (error) throw error
    const article = toCamelCase<Article>(data)
    setCache(cacheKey, article)
    return { data: article }
  },

  async create(article: Partial<Article>): Promise<{ data: Article }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const payload = toSnakeCase({
      ...article,
      translations: requireEnglishBackup({
        title: article.title || '',
        summary: article.summary || '',
        content: article.content || '',
        category: article.category || '',
        tags: article.tags || [],
      }, article.translations),
    } as Record<string, unknown>)

    let { data, error } = await supabase
      .from('articles')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    removeCache(CACHE_KEYS.articles(1, 10))
    return { data: toCamelCase<Article>(data) }
  },

  async delete(id: number): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
    removeCache(CACHE_KEYS.articles(1, 10))
    removeCache(CACHE_KEYS.article(id))
  },

  async like(id: number): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const { error } = await supabase.rpc('increment_like_count', { article_id: id })
    if (error) throw error
    removeCache(CACHE_KEYS.articles(1, 10))
    removeCache(CACHE_KEYS.article(id))
  }
}

// ==================== 作品集 API ====================

export const portfolioApi = {
  async getAll(): Promise<{ data: PortfolioItem[] }> {
    if (!isSupabaseConfigured) return { data: getDefaultPortfolioItems() }

    const cached = getCache<PortfolioItem[]>(CACHE_KEYS.portfolio)
    if (cached && cached.length > 0) return { data: cached }

    let { data, error } = await supabase
      .from('portfolio_items')
      .select('id, title, description, cover_image, project_url, source_url, tags, translations, featured, sort_order, status, created_at, updated_at')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (isMissingTranslationsColumn(error)) {
      const legacy = await supabase
        .from('portfolio_items')
        .select('id, title, description, cover_image, project_url, source_url, tags, featured, sort_order, status, created_at, updated_at')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      data = legacy.data as typeof data
      error = legacy.error
    }

    if (error) {
      if ((error as { code?: string }).code === '42P01' || (error as { code?: string }).code === 'PGRST205') {
        return { data: getDefaultPortfolioItems() }
      }
      throw error
    }

    const items = (data || []).map(item => mapPortfolioItem(item))
    if (items.length === 0) return { data: getDefaultPortfolioItems() }
    setCache(CACHE_KEYS.portfolio, items)
    return { data: items }
  },

  async create(item: PortfolioInput): Promise<{ data: PortfolioItem }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const payload = toSnakeCase({
      ...item,
      tags: parsePortfolioTags(item.tags),
      translations: requireEnglishBackup({
        title: item.title,
        description: item.description,
        tags: parsePortfolioTags(item.tags),
      }, item.translations),
    } as Record<string, unknown>)

    let { data, error } = await supabase
      .from('portfolio_items')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    removeCache(CACHE_KEYS.portfolio)
    return { data: mapPortfolioItem(data) }
  },

  async delete(id: number): Promise<void> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id)

    if (error) throw error
    removeCache(CACHE_KEYS.portfolio)
  }
}

// ==================== 认证 API ====================

export const authApi = {
  async login(email: string, password: string): Promise<{ data: User }> {
    if (!isSupabaseConfigured) throw new Error('Supabase is not configured')

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !authData.user) {
      throw new Error('Invalid email or password')
    }

    const profile = await this.requireAdminProfile(authData.user.id)
    return { data: profile }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) return null

    try {
      const { data } = await supabase.auth.getSession()
      const userId = data.session?.user.id
      if (!userId) return null
      return await this.requireAdminProfile(userId)
    } catch {
      return null
    }
  },

  async requireAdminProfile(authUserId: string): Promise<User> {
    removeCache(CACHE_KEYS.profile('admin'))
    const { data } = await userApi.getProfile('admin')
    if (data.role !== 'admin' || data.authUserId !== authUserId) {
      await supabase.auth.signOut()
      throw new Error('Current user is not linked to the admin profile')
    }
    return data
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut()
    localStorage.removeItem('user')
  }
}

export default { userApi, galleryApi, articleApi, portfolioApi, authApi }
