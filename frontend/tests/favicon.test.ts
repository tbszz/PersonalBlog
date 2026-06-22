import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('site icon asset is a valid PNG', () => {
  const bytes = readFileSync('public/favicon.png')

  assert.equal(bytes[0], 0x89)
  assert.equal(bytes[1], 0x50)
  assert.equal(bytes[2], 0x4e)
  assert.equal(bytes[3], 0x47)
  assert.ok(bytes.length > 100_000)
})

test('html favicon points at the site icon asset', () => {
  const html = readFileSync('index.html', 'utf8')

  assert.match(html, /<link\s+rel="icon"\s+type="image\/png"\s+href="\/favicon\.png"\s*\/>/)
})
