import { ref } from 'vue'
import {
  getNextTheme,
  normalizeTheme,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from './utils/theme'

const THEME_STORAGE_KEY = 'blog_theme'

function prefersDark(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readInitialTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
}

export const themePreference = ref<ThemePreference>(readInitialTheme())
export const resolvedTheme = ref<ResolvedTheme>(resolveTheme(themePreference.value, prefersDark()))

export function applyTheme(theme: ThemePreference = themePreference.value): void {
  themePreference.value = normalizeTheme(theme)
  resolvedTheme.value = resolveTheme(themePreference.value, prefersDark())

  if (typeof window === 'undefined') return

  document.documentElement.classList.toggle('theme-light', resolvedTheme.value === 'light')
  document.documentElement.classList.toggle('theme-dark', resolvedTheme.value === 'dark')
  document.documentElement.dataset.theme = resolvedTheme.value
  window.localStorage.setItem(THEME_STORAGE_KEY, themePreference.value)
}

export function cycleTheme(): void {
  applyTheme(getNextTheme(themePreference.value))
}

export function initTheme(): void {
  applyTheme(themePreference.value)
  if (typeof window === 'undefined') return

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => applyTheme(themePreference.value))
}
