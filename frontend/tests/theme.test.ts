import test from 'node:test'
import assert from 'node:assert/strict'
import { getNextTheme, normalizeTheme } from '../src/utils/theme.js'

test('normalizeTheme accepts light, dark, system and falls back to system', () => {
  assert.equal(normalizeTheme('light'), 'light')
  assert.equal(normalizeTheme('dark'), 'dark')
  assert.equal(normalizeTheme('system'), 'system')
  assert.equal(normalizeTheme('unknown'), 'system')
  assert.equal(normalizeTheme(null), 'system')
})

test('getNextTheme cycles through system, dark, and light', () => {
  assert.equal(getNextTheme('system'), 'dark')
  assert.equal(getNextTheme('dark'), 'light')
  assert.equal(getNextTheme('light'), 'system')
})
