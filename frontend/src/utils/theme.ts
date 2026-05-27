export const themes = ['system', 'dark', 'light'] as const
export type ThemePreference = (typeof themes)[number]
export type ResolvedTheme = 'dark' | 'light'

export function normalizeTheme(value: string | null | undefined): ThemePreference {
  if (value === 'dark' || value === 'light' || value === 'system') return value
  return 'system'
}

export function getNextTheme(theme: ThemePreference): ThemePreference {
  if (theme === 'system') return 'dark'
  if (theme === 'dark') return 'light'
  return 'system'
}

export function resolveTheme(
  theme: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  if (theme === 'system') return prefersDark ? 'dark' : 'light'
  return theme
}
