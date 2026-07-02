import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeTheme, resolveTheme } from '../src/utils/theme.js'

test('normalizeTheme always resolves stored preferences to dark', () => {
  assert.equal(normalizeTheme('light'), 'dark')
  assert.equal(normalizeTheme('dark'), 'dark')
  assert.equal(normalizeTheme('system'), 'dark')
  assert.equal(normalizeTheme('unknown'), 'dark')
  assert.equal(normalizeTheme(null), 'dark')
})

test('resolveTheme is dark regardless of OS preference', () => {
  assert.equal(resolveTheme('dark', true), 'dark')
  assert.equal(resolveTheme('dark', false), 'dark')
})
