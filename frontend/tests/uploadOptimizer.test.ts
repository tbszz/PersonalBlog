import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getOptimizedImageFileName,
  shouldTryImageOptimization,
} from '../src/utils/uploadOptimizer.js'

test('shouldTryImageOptimization targets large raster images only', () => {
  assert.equal(shouldTryImageOptimization({ type: 'image/jpeg', size: 2_000_000 }), true)
  assert.equal(shouldTryImageOptimization({ type: 'image/webp', size: 100_000 }), false)
  assert.equal(shouldTryImageOptimization({ type: 'image/svg+xml', size: 2_000_000 }), false)
  assert.equal(shouldTryImageOptimization({ type: 'video/mp4', size: 2_000_000 }), false)
})

test('getOptimizedImageFileName normalizes names to webp', () => {
  assert.equal(getOptimizedImageFileName('My Avatar.PNG'), 'my-avatar.webp')
  assert.equal(getOptimizedImageFileName('  weird @ file name  '), 'weird-file-name.webp')
  assert.equal(getOptimizedImageFileName('照片.jpg'), 'image.webp')
})
