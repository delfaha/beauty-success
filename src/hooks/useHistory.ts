import { useCallback, useEffect, useMemo, useState } from 'react'
import { isStringArray, readStorage, writeStorage } from '@/utils/storage'

const RECENT_PRODUCTS_KEY = 'recently-viewed'
const RECENT_SEARCHES_KEY = 'recent-searches'

/** Produits récemment consultés (le produit courant est enregistré mais exclu de la liste). */
export function useRecentlyViewed(currentId?: string) {
  const [ids] = useState<string[]>(() => readStorage(RECENT_PRODUCTS_KEY, [] as string[], isStringArray))

  useEffect(() => {
    if (!currentId) return
    const stored = readStorage(RECENT_PRODUCTS_KEY, [] as string[], isStringArray)
    writeStorage(RECENT_PRODUCTS_KEY, [currentId, ...stored.filter((id) => id !== currentId)].slice(0, 12))
  }, [currentId])

  return useMemo(() => ids.filter((id) => id !== currentId), [ids, currentId])
}

/** Dernières recherches de l'utilisateur (5 maximum). */
export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>(() =>
    readStorage(RECENT_SEARCHES_KEY, [] as string[], isStringArray),
  )

  const add = useCallback((query: string) => {
    const value = query.trim()
    if (!value) return
    setSearches((current) => {
      const next = [value, ...current.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5)
      writeStorage(RECENT_SEARCHES_KEY, next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    writeStorage(RECENT_SEARCHES_KEY, [])
    setSearches([])
  }, [])

  return { searches, add, clear }
}
