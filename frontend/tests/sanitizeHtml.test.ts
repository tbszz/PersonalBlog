import test from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeHtml } from '../src/utils/sanitizeHtml.js'

test('sanitizeHtml removes script tags, event handlers, and javascript URLs', () => {
  const dirty = '<h1 onclick="alert(1)">Hi</h1><script>alert(2)</script><a href="javascript:alert(3)">bad</a>'

  const clean = sanitizeHtml(dirty)

  assert.equal(clean.includes('<script'), false)
  assert.equal(clean.includes('onclick'), false)
  assert.equal(clean.includes('javascript:'), false)
  assert.equal(clean.includes('<h1>Hi</h1>'), true)
})

test('sanitizeHtml preserves normal markdown HTML output', () => {
  const dirty = '<p><strong>Hello</strong> <a href="https://example.com">link</a></p>'

  const clean = sanitizeHtml(dirty)

  assert.equal(clean, dirty)
})
