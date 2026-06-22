import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultPortfolioItems } from '../src/data/portfolioSeed.js'
import { hasCjk, hasCompleteEnglishBackup, localizePortfolioItem } from '../src/utils/contentLocalization.js'

test('default portfolio seed contains six polished published projects', () => {
  assert.equal(defaultPortfolioItems.length, 6)
  assert.equal(defaultPortfolioItems.every(item => item.status === 'published'), true)
  assert.equal(defaultPortfolioItems.every(item => item.featured), true)
})

test('default portfolio seed has complete English backups', () => {
  for (const item of defaultPortfolioItems) {
    assert.equal(
      hasCompleteEnglishBackup(
        { title: item.title, description: item.description, tags: item.tags },
        item.translations,
      ),
      true,
      item.title,
    )
  }
})

test('default portfolio seed localizes to English without Chinese text', () => {
  for (const item of defaultPortfolioItems) {
    const localized = localizePortfolioItem(item, 'en') as typeof item
    assert.equal(hasCjk(localized.title), false, localized.title)
    assert.equal(hasCjk(localized.description), false, localized.description)
    assert.equal(localized.tags?.some(hasCjk), false, localized.tags?.join(', '))
  }
})
