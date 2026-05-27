import test from 'node:test'
import assert from 'node:assert/strict'
import { getSupabaseConfig } from '../src/utils/supabaseConfig.js'

test('getSupabaseConfig uses provided Supabase environment values', () => {
  const config = getSupabaseConfig({
    VITE_SUPABASE_URL: 'https://example.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'anon-key',
  })

  assert.equal(config.isConfigured, true)
  assert.equal(config.url, 'https://example.supabase.co')
  assert.equal(config.anonKey, 'anon-key')
})

test('getSupabaseConfig returns safe placeholders when env is missing', () => {
  const config = getSupabaseConfig({})

  assert.equal(config.isConfigured, false)
  assert.equal(config.url, 'http://127.0.0.1:54321')
  assert.equal(config.anonKey, 'missing-anon-key')
})
