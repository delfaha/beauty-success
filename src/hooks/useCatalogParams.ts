import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { FacetKey, SortKey } from '@/types/catalog'
import { countActiveFilters, isSortKey, parseFilters } from '@/utils/catalog'

/**
 * État des filtres, du tri et de la pagination stocké dans l'URL :
 * pages partageables, bouton « retour » cohérent, SEO-friendly.
 * ex. /shop/femme?type=eau-de-parfum,parfum&prix=50-100&tri=prix-croissant&page=2
 */
export function useCatalogParams(defaultSort: SortKey = 'pertinence') {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(() => parseFilters(params), [params])
  const rawSort = params.get('tri')
  const sort: SortKey = isSortKey(rawSort) ? rawSort : defaultSort
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1)

  const update = useCallback(
    (mutate: (next: URLSearchParams) => void, { resetPage = true } = {}) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          mutate(next)
          if (resetPage) next.delete('page')
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setParams],
  )

  const toggleFilter = useCallback(
    (key: FacetKey, value: string) =>
      update((next) => {
        const values = new Set((next.get(key) ?? '').split(',').filter(Boolean))
        if (values.has(value)) values.delete(value)
        else values.add(value)
        if (values.size) next.set(key, [...values].join(','))
        else next.delete(key)
      }),
    [update],
  )

  const clearFacet = useCallback((key: FacetKey) => update((next) => next.delete(key)), [update])

  const setAvailability = useCallback(
    (onlyAvailable: boolean) =>
      update((next) => {
        if (onlyAvailable) next.set('dispo', '1')
        else next.delete('dispo')
      }),
    [update],
  )

  const setSort = useCallback(
    (value: SortKey) =>
      update((next) => {
        if (value === defaultSort) next.delete('tri')
        else next.set('tri', value)
      }),
    [update, defaultSort],
  )

  const clearAll = useCallback(
    () =>
      update((next) => {
        for (const key of ['genre', 'type', 'marque', 'prix', 'famille', 'dispo']) next.delete(key)
      }),
    [update],
  )

  const setPage = useCallback(
    (value: number) =>
      update(
        (next) => {
          if (value <= 1) next.delete('page')
          else next.set('page', String(value))
        },
        { resetPage: false },
      ),
    [update],
  )

  return {
    filters,
    sort,
    page,
    activeCount: countActiveFilters(filters),
    toggleFilter,
    clearFacet,
    setAvailability,
    setSort,
    clearAll,
    setPage,
  }
}
