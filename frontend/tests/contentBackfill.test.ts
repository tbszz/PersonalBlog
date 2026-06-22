import test from 'node:test'
import assert from 'node:assert/strict'
import {
  articleEnglishBackfill,
  galleryEnglishBackfill,
  mergeArticleEnglishBackfill,
  mergeGalleryEnglishBackfill,
  mergeProfileEnglishBackfill,
  profileEnglishBackfill,
} from '../src/data/contentBackfill.js'
import { hasCjk } from '../src/utils/contentLocalization.js'

function collectText(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectText)
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectText)
  return []
}

test('production article and gallery English backfills cover current public content', () => {
  assert.equal(Object.keys(articleEnglishBackfill).length, 8)
  assert.equal(Object.keys(galleryEnglishBackfill).length, 8)
})

test('production English backfills do not contain Chinese characters', () => {
  const text = [
    ...collectText(articleEnglishBackfill),
    ...collectText(galleryEnglishBackfill),
    ...collectText(profileEnglishBackfill),
  ]

  assert.equal(text.some(hasCjk), false)
})

test('production English backfills merge only when translations are missing', () => {
  const article = mergeArticleEnglishBackfill({ id: 7, title: '中文', translations: undefined } as {
    id: number
    title: string
    translations?: { en?: { title?: string } }
  })
  assert.equal(article.translations?.en?.title, 'Superpowers comprehensive skills library')

  const gallery = mergeGalleryEnglishBackfill({ id: 7, description: '中文', translations: undefined } as {
    id: number
    description: string
    translations?: { en?: { description?: string } }
  })
  assert.equal(gallery.translations?.en?.description, 'Iflytek developer TALK leaves traces')

  const profile = mergeProfileEnglishBackfill({ nickname: '中文' } as {
    nickname: string
    locales?: Record<string, unknown>
  })
  assert.equal((profile.locales?.en as typeof profileEnglishBackfill).nickname, profileEnglishBackfill.nickname)

  const existing = mergeArticleEnglishBackfill({ id: 7, translations: { en: { title: 'Existing' } } } as {
    id: number
    translations: { en: { title: string } }
  })
  assert.equal(existing.translations.en.title, 'Existing')
})
