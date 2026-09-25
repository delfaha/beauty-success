/**
 * Accès défensif au localStorage (navigation privée, quota, JSON corrompu…).
 * Toutes les clés sont préfixées pour éviter les collisions.
 */
const PREFIX = 'beauty-success:'

export function readStorage<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (isValid && !isValid(parsed)) return fallback
    return parsed as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* stockage indisponible : on ignore, l'état reste en mémoire */
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
  } catch {
    /* ignore */
  }
}

/** Nom complet de la clé, pour écouter l'événement `storage` (synchronisation entre onglets). */
export function storageKey(key: string): string {
  return PREFIX + key
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}
