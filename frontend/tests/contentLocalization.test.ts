import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildEnglishBackup,
  hasCompleteEnglishBackup,
  localizeArticle,
  localizeGalleryItem,
  localizePortfolioItem,
  requireEnglishBackup,
} from '../src/utils/contentLocalization.js'

test('localizeArticle uses the English cached backup for list and detail fields', () => {
  const article = {
    id: 1,
    title: '中文标题',
    summary: '中文摘要',
    content: '中文正文',
    category: '随笔',
    status: 'published',
    publishTime: '2026-06-11T00:00:00Z',
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    translations: {
      en: {
        title: 'English title',
        summary: 'English summary',
        content: 'English body',
        category: 'Essay',
      },
    },
  }

  assert.deepEqual(
    {
      title: localizeArticle(article, 'en').title,
      summary: localizeArticle(article, 'en').summary,
      content: localizeArticle(article, 'en').content,
      category: localizeArticle(article, 'en').category,
    },
    {
      title: 'English title',
      summary: 'English summary',
      content: 'English body',
      category: 'Essay',
    },
  )
  assert.equal(localizeArticle(article, 'zh').title, '中文标题')
})

test('English backup validation rejects untranslated Chinese content', () => {
  const fields = { title: '一篇新文章', content: '这是正文' }

  assert.equal(hasCompleteEnglishBackup(fields, { en: { title: 'A new article', content: 'Body text' } }), true)
  assert.equal(hasCompleteEnglishBackup(fields, { en: { title: '一篇新文章', content: 'Body text' } }), false)
  assert.equal(hasCompleteEnglishBackup({ tags: ['设计', '代码'] }, { en: { tags: ['Design'] } }), false)
  assert.throws(() => requireEnglishBackup(fields, undefined), /complete English translation/)
})

test('localizePortfolioItem uses cached English title, description, and tags', () => {
  const item = {
    id: 1,
    title: '作品标题',
    description: '作品描述',
    tags: ['建筑设计', 'Vue'],
    featured: false,
    sortOrder: 0,
    status: 'published' as const,
    createdAt: '2026-06-11T00:00:00Z',
    translations: {
      en: {
        title: 'Project title',
        description: 'Project description',
        tags: ['Architecture Design', 'Vue'],
      },
    },
  }

  const localized = localizePortfolioItem(item, 'en')

  assert.equal(localized.title, 'Project title')
  assert.equal(localized.description, 'Project description')
  assert.deepEqual(localized.tags, ['Architecture Design', 'Vue'])
})

test('localizeGalleryItem uses cached English description', () => {
  const item = {
    id: 1,
    type: 'image' as const,
    url: 'https://example.com/a.jpg',
    description: '中文描述',
    createdAt: '2026-06-11T00:00:00Z',
    translations: {
      en: {
        description: 'English description',
      },
    },
  }

  assert.equal(localizeGalleryItem(item, 'en').description, 'English description')
  assert.equal(localizeGalleryItem(item, 'zh').description, '中文描述')
})

test('buildEnglishBackup creates a cached English backup object for new content', () => {
  const backup = buildEnglishBackup({
    title: '欢迎来到我的博客',
    summary: '欢迎来到我的个人博客，这里记录我的技术学习和生活感悟。',
    content: '这是我的第一篇博客文章。感谢你的访问！',
    tags: ['建筑设计', 'Vue'],
  })

  assert.deepEqual(backup, {
    en: {
      title: 'Welcome to My Blog',
      summary: 'Welcome to my personal blog, where I record my technical learning and reflections on life.',
      content: 'This is my first blog post. Thanks for visiting!',
      tags: ['Architecture Design', 'Vue'],
    },
  })
})
