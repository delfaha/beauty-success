/** Groupes de filtres disponibles dans les pages catalogue (clés d'URL). */
export type FacetKey = 'genre' | 'type' | 'marque' | 'prix' | 'famille'

export type SortKey =
  | 'pertinence'
  | 'prix-croissant'
  | 'prix-decroissant'
  | 'nouveautes'
  | 'meilleures-ventes'
  | 'mieux-notes'

export interface CatalogFilters {
  genre: string[]
  type: string[]
  marque: string[]
  prix: string[]
  famille: string[]
  /** « En stock uniquement ». */
  dispo: boolean
}

export interface FacetOption {
  value: string
  label: string
  count: number
  selected: boolean
}

export interface Facet {
  key: FacetKey
  label: string
  options: FacetOption[]
}
