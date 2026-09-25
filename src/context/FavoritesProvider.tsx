import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isStringArray, readStorage, storageKey, writeStorage } from '@/utils/storage'
import { FavoritesContext, type FavoritesContextValue } from './FavoritesContext'

const KEY = 'favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => readStorage(KEY, [] as string[], isStringArray))

  useEffect(() => writeStorage(KEY, ids), [ids])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey(KEY)) setIds(readStorage(KEY, [] as string[], isStringArray))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback((productId: string) => ids.includes(productId), [ids])

  const toggle = useCallback(
    (productId: string) => {
      const next = !ids.includes(productId)
      setIds((current) => (next ? [productId, ...current.filter((id) => id !== productId)] : current.filter((id) => id !== productId)))
      return next
    },
    [ids],
  )

  const value = useMemo<FavoritesContextValue>(
    () => ({
      ids,
      count: ids.length,
      isFavorite,
      toggle,
      remove: (productId) => setIds((current) => current.filter((id) => id !== productId)),
    }),
    [ids, isFavorite, toggle],
  )

  return <FavoritesContext value={value}>{children}</FavoritesContext>
}
