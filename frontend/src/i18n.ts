import { ref } from 'vue'
import {
  defaultLocale,
  localeNames,
  normalizeLocale,
  translate,
  type Locale,
} from './utils/i18n'

const LOCALE_STORAGE_KEY = 'blog_locale'

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return normalizeLocale(savedLocale || window.navigator.language)
}

export const currentLocale = ref<Locale>(readInitialLocale())
export { localeNames }

export function setLocale(locale: string): void {
  currentLocale.value = normalizeLocale(locale)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, currentLocale.value)
    document.documentElement.lang = currentLocale.value === 'zh' ? 'zh-CN' : 'en'
  }
}

export function toggleLocale(): void {
  setLocale(currentLocale.value === 'zh' ? 'en' : 'zh')
}

export function t(key: string): string {
  return translate(key, currentLocale.value)
}

export function initLocale(): void {
  setLocale(currentLocale.value)
}
