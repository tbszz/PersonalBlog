import { ref } from 'vue'
import {
  type ResolvedTheme,
  type ThemePreference,
} from './utils/theme'

const THEME_STORAGE_KEY = 'blog_theme'

export const themePreference = ref<ThemePreference>('dark')
export const resolvedTheme = ref<ResolvedTheme>('dark')

export function applyTheme(): void {
  themePreference.value = 'dark'
  resolvedTheme.value = 'dark'

  if (typeof window === 'undefined') return

  document.documentElement.classList.remove('theme-light')
  document.documentElement.classList.add('theme-dark')
  document.documentElement.dataset.theme = 'dark'
  window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
}

export function initTheme(): void {
  applyTheme()
}
