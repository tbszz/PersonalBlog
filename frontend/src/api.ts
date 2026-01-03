import { supabase } from './lib/supabase'

// ==================== 类型定义 ====================

export interface User {
  id: number
  username: string
  password?: string
  nickname?: string
  avatar?: string
  role: string
  profileJson?: string
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
}

export interface Article {
  id: number
  title: string
  content: string
  summary: string
  coverImage?: string
  status: string
  publishTime: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags?: string[]
  category?: string
}

// ==================== 工具函数 ====================

// 将数据库字段名（snake_case）转换为前端字段名（camelCase）
function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = obj[key]
  }
  return result as T
}

// 将前端字段名（camelCase）转换为数据库字段名（snake_case）
function toSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = obj[key]
  }
  return result
}

// ==================== 用户 API ====================

export const userApi = {
  async getProfile(username: string): Promise<{ data: User }> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) throw error
    return { data: toCamelCase<User>(data) }
  },

  async updateProfile(id: number, userData: Partial<User>): Promise<{ data: User }> {
    const { data, error } = await supabase
      .from('users')
      .update(toSnakeCase(userData as Record<string, unknown>))
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data: toCamelCase<User>(data) }
  }
}

// ==================== 图库 API ====================

export const galleryApi = {
  async getAll(): Promise<{ data: GalleryItem[] }> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: (data || []).map(item => toCamelCase<GalleryItem>(item)) }
  },

  async create(item: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<{ data: GalleryItem }> {
    const { data, error } = await supabase
      .from('gallery')
      .insert(toSnakeCase(item as Record<string, unknown>))
      .select()
      .single()

    if (error) throw error
    return { data: toCamelCase<GalleryItem>(data) }
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async upload(file: File): Promise<{ data: { url: string } }> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `gallery/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    return { data: { url: publicUrl } }
  }
}

// ==================== 文章 API ====================

export const articleApi = {
  async getAll(page = 1, size = 10): Promise<{ data: { articles: Article[], total: number } }> {
    const from = (page - 1) * size
    const to = from + size - 1

    const { data, count, error } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('publish_time', { ascending: false })
      .range(from, to)

    if (error) throw error
    return {
      data: {
        articles: (data || []).map(item => toCamelCase<Article>(item)),
        total: count || 0
      }
    }
  },

  async getOne(id: number): Promise<{ data: Article }> {
    // 增加浏览量
    // 增加浏览量，忽略错误
    await supabase.rpc('increment_view_count', { article_id: id }).then(({ error }) => {
      if (error) console.error('Failed to increment view count:', error)
    })


    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data: toCamelCase<Article>(data) }
  },

  async create(article: Partial<Article>): Promise<{ data: Article }> {
    const { data, error } = await supabase
      .from('articles')
      .insert(toSnakeCase(article as Record<string, unknown>))
      .select()
      .single()

    if (error) throw error
    return { data: toCamelCase<Article>(data) }
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async like(id: number): Promise<void> {
    const { error } = await supabase.rpc('increment_like_count', { article_id: id })
    if (error) throw error
  }
}

// ==================== 认证 API ====================

export const authApi = {
  async login(username: string, password: string): Promise<{ data: User }> {
    // 简单的用户名密码验证（从 users 表查询）
    // 注意：生产环境建议使用 Supabase Auth
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      throw new Error('Invalid username or password')
    }

    // 简单密码验证（演示用，生产环境应使用哈希）
    if (data.password && data.password !== password) {
      throw new Error('Invalid username or password')
    }

    return { data: toCamelCase<User>(data) }
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  logout(): void {
    localStorage.removeItem('user')
  }
}

export default { userApi, galleryApi, articleApi, authApi }

