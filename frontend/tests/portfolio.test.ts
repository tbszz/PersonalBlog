import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePortfolioTags } from '../src/utils/portfolio.js'

test('parsePortfolioTags trims, deduplicates, and removes empty tags', () => {
  assert.deepEqual(parsePortfolioTags('Vue, Supabase, Vue, , 作品集'), [
    'Vue',
    'Supabase',
    '作品集',
  ])
})

test('parsePortfolioTags accepts already normalized arrays', () => {
  assert.deepEqual(parsePortfolioTags([' Vue ', '', 'Vite']), ['Vue', 'Vite'])
})
