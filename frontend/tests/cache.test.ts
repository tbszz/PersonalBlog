import test from 'node:test'
import assert from 'node:assert/strict'
import {
  cacheGetJson,
  cacheRemove,
  cacheSetJson,
  type KeyValueStorage,
} from '../src/utils/cache.js'

function createStorage(): KeyValueStorage {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  }
}

test('cacheGetJson returns unexpired values', () => {
  const storage = createStorage()

  cacheSetJson(storage, 'articles', { total: 2 }, 60_000, 1000)

  assert.deepEqual(cacheGetJson(storage, 'articles', 2000), { total: 2 })
})

test('cacheGetJson removes expired values', () => {
  const storage = createStorage()

  cacheSetJson(storage, 'articles', ['old'], 1000, 1000)

  assert.equal(cacheGetJson(storage, 'articles', 2501), null)
  assert.equal(storage.getItem('articles'), null)
})

test('cache helpers tolerate malformed payloads', () => {
  const storage = createStorage()

  storage.setItem('broken', '{not-json')

  assert.equal(cacheGetJson(storage, 'broken', 1000), null)
  assert.equal(storage.getItem('broken'), null)
})

test('cacheRemove clears a key', () => {
  const storage = createStorage()

  cacheSetJson(storage, 'profile', { ok: true }, 1000, 1000)
  cacheRemove(storage, 'profile')

  assert.equal(cacheGetJson(storage, 'profile', 1000), null)
})
