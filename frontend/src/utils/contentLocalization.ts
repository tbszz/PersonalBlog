import { defaultLocale, normalizeLocale, type Locale } from './i18n.js'

type LocalizedFields = Record<string, unknown>

export type ContentTranslations<T extends LocalizedFields = LocalizedFields> = Partial<Record<Locale, Partial<T>>>

export type TranslatableContent<T extends LocalizedFields = LocalizedFields> = T & {
  translations?: ContentTranslations<T>
}

const exactEnglishText: Record<string, string> = {
  '欢迎来到我的博客': 'Welcome to My Blog',
  '欢迎来到我的个人博客，这里记录我的技术学习和生活感悟。': 'Welcome to my personal blog, where I record my technical learning and reflections on life.',
  '这是我的第一篇博客文章。感谢你的访问！': 'This is my first blog post. Thanks for visiting!',
  '建筑设计': 'Architecture Design',
  '东方美学': 'Eastern Aesthetics',
  '前端开发': 'Frontend Development',
  '作品集': 'Portfolio',
  '随笔': 'Essay',
  '生活': 'Life',
  '技术': 'Technology',
  '摄影': 'Photography',
  '设计': 'Design',
  '代码': 'Code',
}

const phraseEnglishText: Array<[RegExp, string]> = [
  [/个人博客/g, 'personal blog'],
  [/技术学习/g, 'technical learning'],
  [/生活感悟/g, 'reflections on life'],
  [/建筑设计/g, 'architecture design'],
  [/东方美学/g, 'Eastern aesthetics'],
  [/前端开发/g, 'frontend development'],
]

function hasCjk(value: string): boolean {
  return /[\u4e00-\u9fff]/.test(value)
}

export function createEnglishDraft(value: string | undefined | null): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  if (!trimmed) return value
  if (exactEnglishText[trimmed]) return exactEnglishText[trimmed]
  if (!hasCjk(trimmed)) return value

  let drafted = trimmed
  for (const [pattern, replacement] of phraseEnglishText) {
    drafted = drafted.replace(pattern, replacement)
  }

  return drafted === trimmed ? value : drafted
}

export function buildEnglishBackup<T extends LocalizedFields>(fields: T): ContentTranslations<T> {
  const en: Partial<T> = {}

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string') {
      const translated = createEnglishDraft(value)
      if (translated !== undefined) {
        ;(en as Record<string, unknown>)[key] = translated
      }
      continue
    }

    if (Array.isArray(value)) {
      ;(en as Record<string, unknown>)[key] = value.map(item => (
        typeof item === 'string' ? createEnglishDraft(item) ?? item : item
      ))
    }
  }

  return { en }
}

function removeEmptyLocalizedValues<T extends LocalizedFields>(fields: Partial<T> | undefined): Partial<T> {
  if (!fields) return {}
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    cleaned[key] = value
  }
  return cleaned as Partial<T>
}

export function mergeEnglishBackup<T extends LocalizedFields>(
  existing: ContentTranslations<T> | undefined,
  fields: T,
): ContentTranslations<T> {
  const generated = buildEnglishBackup(fields).en ?? {}
  const cleanedExistingEn = removeEmptyLocalizedValues(existing?.en)
  return {
    ...existing,
    en: {
      ...generated,
      ...cleanedExistingEn,
    } as Partial<T>,
  }
}

export function localizeContent<T extends LocalizedFields>(
  content: TranslatableContent<T>,
  locale: string | null | undefined,
  keys: Array<keyof T>,
): TranslatableContent<T> {
  const normalized = normalizeLocale(locale)
  if (normalized === defaultLocale) return content

  const localized = content.translations?.[normalized]
  if (!localized) return content

  const next = { ...content } as TranslatableContent<T>
  for (const key of keys) {
    const value = localized[key]
    if (value !== undefined && value !== null) {
      next[key] = value as T[typeof key]
    }
  }
  return next
}

export function localizeArticle<T extends LocalizedFields>(article: TranslatableContent<T>, locale: string | null | undefined): TranslatableContent<T> {
  return localizeContent(article, locale, ['title', 'summary', 'content', 'category', 'tags'] as Array<keyof T>)
}

export function localizePortfolioItem<T extends LocalizedFields>(item: TranslatableContent<T>, locale: string | null | undefined): TranslatableContent<T> {
  return localizeContent(item, locale, ['title', 'description', 'tags'] as Array<keyof T>)
}

export function localizeGalleryItem<T extends LocalizedFields>(item: TranslatableContent<T>, locale: string | null | undefined): TranslatableContent<T> {
  return localizeContent(item, locale, ['description'] as Array<keyof T>)
}
