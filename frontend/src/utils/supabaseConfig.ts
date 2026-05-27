export interface SupabaseConfigEnv {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

export interface SupabaseConfig {
  url: string
  anonKey: string
  isConfigured: boolean
}

const FALLBACK_SUPABASE_URL = 'http://127.0.0.1:54321'
const FALLBACK_SUPABASE_ANON_KEY = 'missing-anon-key'

export function getSupabaseConfig(env: SupabaseConfigEnv): SupabaseConfig {
  const url = env.VITE_SUPABASE_URL?.trim()
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim()
  const isConfigured = Boolean(url && anonKey)

  return {
    url: url || FALLBACK_SUPABASE_URL,
    anonKey: anonKey || FALLBACK_SUPABASE_ANON_KEY,
    isConfigured,
  }
}
