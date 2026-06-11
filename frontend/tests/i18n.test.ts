import test from 'node:test'
import assert from 'node:assert/strict'
import { localizeProfile, normalizeLocale, translate } from '../src/utils/i18n.js'

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

test('English locale includes all static shell text', () => {
  assert.equal(translate('brand.name', 'en'), 'Zouzi')
  assert.equal(translate('profile.saveFailed', 'en'), 'Failed to save. Please retry.')
  assert.equal(translate('article.imageAlt', 'en'), 'Image')
})

test('localizeProfile uses locale-specific profile content when available', () => {
  const profile = {
    nickname: '邹子',
    slogan: '中文标语',
    subSlogan: '中文副标题',
    bio: {
      who: '中文 WHO',
      what: '中文 WHAT',
      attitude: '中文态度',
    },
    tags: [
      { text: '中文标签', style: 'border-blue-400/20' },
    ],
    techStack: ['Vue', 'Supabase'],
    locales: {
      en: {
        nickname: 'Zouzi',
        slogan: 'English slogan',
        subSlogan: 'English subtitle',
        bio: {
          who: 'English WHO',
          what: 'English WHAT',
          attitude: 'English attitude',
        },
        tags: [
          { text: 'English tag', style: 'border-blue-400/20' },
        ],
      },
    },
  }

  const localized = localizeProfile(profile, 'en')

  assert.equal(localized.nickname, 'Zouzi')
  assert.equal(localized.slogan, 'English slogan')
  assert.equal(localized.subSlogan, 'English subtitle')
  assert.equal(localized.bio.who, 'English WHO')
  assert.equal(localized.bio.what, 'English WHAT')
  assert.equal(localized.bio.attitude, 'English attitude')
  assert.equal(localized.tags[0].text, 'English tag')
  assert.deepEqual(localized.techStack, ['Vue', 'Supabase'])
})

test('localizeProfile translates known Chinese profile defaults in English mode', () => {
  const profile = {
    nickname: '邹子',
    slogan: '囿于昼夜',
    subSlogan: '流浪于山川湖海，囿于昼夜厨房与爱',
    bio: {
      who: '建筑学生 / 前端开发者 / 设计爱好者',
      what: '热衷于用代码构建具有东方美学的数字空间，探索技术与人文的交界。',
      attitude: '保持热爱，奔赴山海。',
    },
    tags: [
      { text: 'Vue', style: 'border-blue-400/20' },
      { text: '建筑设计', style: 'border-purple-400/20' },
      { text: '东方美学', style: 'border-emerald-400/20' },
    ],
    techStack: ['Vue', 'TypeScript'],
  }

  const localized = localizeProfile(profile, 'en')

  assert.equal(localized.nickname, 'Zouzi')
  assert.equal(localized.slogan, 'Bound by Day and Night')
  assert.equal(localized.subSlogan, 'Wandering through mountains, rivers, lakes, and seas; held by day, night, kitchens, and love.')
  assert.equal(localized.bio.who, 'Architecture student / Frontend developer / Design enthusiast')
  assert.equal(localized.bio.what, 'I build digital spaces with Eastern aesthetics through code, exploring where technology and the humanities meet.')
  assert.equal(localized.bio.attitude, 'Stay passionate and keep moving toward vast horizons.')
  assert.deepEqual(localized.tags.map(tag => tag.text), ['Vue', 'Architecture Design', 'Eastern Aesthetics'])
})
