import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from '../utils/supabaseConfig'

const supabaseConfig = getSupabaseConfig(import.meta.env)
export const isSupabaseConfigured = supabaseConfig.isConfigured

if (!supabaseConfig.isConfigured) {
    console.warn('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// 类型定义
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: number
                    auth_user_id: string | null
                    username: string
                    password?: string
                    nickname: string | null
                    avatar: string | null
                    role: string
                    profile_json: string | null
                    profile_stats: Json | null
                    wechat_qr_code: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['users']['Insert']>
            }
            articles: {
                Row: {
                    id: number
                    title: string
                    content: string | null
                    summary: string | null
                    cover_image: string | null
                    status: string
                    publish_time: string
                    view_count: number
                    like_count: number
                    comment_count: number
                    category: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at' | 'view_count' | 'like_count' | 'comment_count'>
                Update: Partial<Database['public']['Tables']['articles']['Insert']>
            }
            gallery: {
                Row: {
                    id: number
                    type: 'image' | 'video'
                    url: string
                    thumbnail_url: string | null
                    description: string | null
                    width: number | null
                    height: number | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['gallery']['Insert']>
            }
        }
    }
}
