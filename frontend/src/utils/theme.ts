export const themes = ['dark'] as const
export type ThemePreference = (typeof themes)[number]
export type ResolvedTheme = 'dark'

export function normalizeTheme(_value: string | null | undefined): ThemePreference {
  return 'dark'
}

export function resolveTheme(
  _theme: ThemePreference,
  _prefersDark: boolean,
): ResolvedTheme {
  return 'dark'
}
