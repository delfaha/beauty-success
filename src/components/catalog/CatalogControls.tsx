import { ChevronDown, X } from 'lucide-react'
import { useId } from 'react'
import { FACET_ORDER, SORT_OPTIONS } from '@/data/taxonomy'
import type { CatalogFilters, FacetKey, SortKey } from '@/types/catalog'
import { optionLabel } from '@/utils/catalog'
import { cn } from '@/utils/cn'

export function SortSelect({ value, onChange, className }: { value: SortKey; onChange: (value: SortKey) => void; className?: string }) {
  const id = useId()
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <label htmlFor={id} className="whitespace-nowrap label-caps text-muted">
        Trier par
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as SortKey)}
          className="h-10 appearance-none border-b border-ink bg-transparent pr-7 label-caps font-semibold"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2" strokeWidth={1.5} aria-hidden="true" />
      </div>
    </div>
  )
}

interface ActiveFiltersProps {
  filters: CatalogFilters
  onToggle: (key: FacetKey, value: string) => void
  onAvailability: (value: boolean) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onToggle, onAvailability, onClearAll }: ActiveFiltersProps) {
  const chips = FACET_ORDER.flatMap((key) => filters[key].map((value) => ({ key, value, label: optionLabel(key, value) })))
  if (chips.length === 0 && !filters.dispo) return null

  const chip =
    'group inline-flex items-center gap-2 border border-ink px-3 py-1.5 label-caps transition-colors duration-300 hover:bg-ink hover:text-bone'

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filtres actifs">
      {chips.map((item) => (
        <button key={`${item.key}-${item.value}`} type="button" className={chip} onClick={() => onToggle(item.key, item.value)} aria-label={`Retirer le filtre ${item.label}`}>
          {item.label}
          <X className="size-3.5 transition-transform duration-300 group-hover:rotate-90" strokeWidth={1.5} aria-hidden="true" />
        </button>
      ))}
      {filters.dispo && (
        <button type="button" className={chip} onClick={() => onAvailability(false)} aria-label="Retirer le filtre En stock">
          En stock
          <X className="size-3.5 transition-transform duration-300 group-hover:rotate-90" strokeWidth={1.5} aria-hidden="true" />
        </button>
      )}
      <button type="button" onClick={onClearAll} className="ml-2 label-caps font-semibold link-underline">
        Tout effacer
      </button>
    </div>
  )
}
