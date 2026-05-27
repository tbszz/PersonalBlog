import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeLocale, translate } from '../src/utils/i18n.js'

test('normalizeLocale keeps supported locales and falls back to Chinese', () => {
  assert.equal(normalizeLocale('zh'), 'zh')
  assert.equal(normalizeLocale('en'), 'en')
  assert.equal(normalizeLocale('zh-CN'), 'zh')
  assert.equal(normalizeLocale('fr'), 'zh')
  assert.equal(normalizeLocale(null), 'zh')
})

test('translate returns localized text with Chinese fallback', () => {
  assert.equal(translate('nav.blog', 'zh'), '文章列表')
  assert.equal(translate('nav.blog', 'en'), 'Blog')
  assert.equal(translate('nav.missing', 'en'), 'nav.missing')
})
