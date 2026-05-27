export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

interface CacheEnvelope<T> {
  expiresAt: number
  value: T
}

export function cacheGetJson<T>(
  storage: KeyValueStorage | undefined | null,
  key: string,
  now = Date.now(),
): T | null {
  if (!storage) return null

  const raw = storage.getItem(key)
  if (!raw) return null

  try {
    const envelope = JSON.parse(raw) as CacheEnvelope<T>
    if (!envelope || typeof envelope.expiresAt !== 'number' || !('value' in envelope)) {
      cacheRemove(storage, key)
      return null
    }
    if (envelope.expiresAt <= now) {
      cacheRemove(storage, key)
      return null
    }
    return envelope.value
  } catch {
    cacheRemove(storage, key)
    return null
  }
}

export function cacheSetJson<T>(
  storage: KeyValueStorage | undefined | null,
  key: string,
  value: T,
  ttlMs: number,
  now = Date.now(),
): void {
  if (!storage || ttlMs <= 0) return

  const envelope: CacheEnvelope<T> = {
    expiresAt: now + ttlMs,
    value,
  }
  storage.setItem(key, JSON.stringify(envelope))
}

export function cacheRemove(storage: KeyValueStorage | undefined | null, key: string): void {
  storage?.removeItem(key)
}

export function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') return null
  return window.localStorage
}
