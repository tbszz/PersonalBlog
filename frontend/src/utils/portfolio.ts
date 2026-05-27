export function parsePortfolioTags(tags: string | string[] | undefined | null): string[] {
  const rawTags = Array.isArray(tags) ? tags : (tags || '').split(',')
  const seen = new Set<string>()
  const result: string[] = []

  for (const rawTag of rawTags) {
    const tag = rawTag.trim()
    if (!tag || seen.has(tag)) continue
    seen.add(tag)
    result.push(tag)
  }

  return result
}
