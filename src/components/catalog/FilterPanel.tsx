import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/FormControls'
import type { CatalogFilters, Facet, FacetKey } from '@/types/catalog'
import { cn } from '@/utils/cn'

const VISIBLE_OPTIONS = 6

function FacetGroup({
  facet,
  onToggle,
  onClear,
}: {
  facet: Facet
  onToggle: (key: FacetKey, value: string) => void
  onClear: (key: FacetKey) => void
}) {
  const [open, setOpen] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const selected = facet.options.filter((option) => option.selected).length
  const options = showAll ? facet.options : facet.options.slice(0, VISIBLE_OPTIONS)
  const panelId = `facet-${facet.key}`

  return (
    <fieldset className="border-t border-ink">
      <legend className="sr-only">{facet.label}</legend>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 label-caps font-semibold"
      >
        <span>
          {facet.label}
          {selected > 0 && <span className="ml-1.5 bg-ink px-1.5 text-bone">{selected}</span>}
        </span>
        <Plus className={cn('size-4 transition-transform duration-500 ease-expo', open && 'rotate-45')} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <div
        id={panelId}
        className={cn('grid transition-[grid-template-rows] duration-500 ease-expo', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pb-5">
            {options.map((option) => (
              <Checkbox
                key={option.value}
                label={option.label}
                count={option.count}
                checked={option.selected}
                disabled={option.count === 0 && !option.selected}
                onChange={() => onToggle(facet.key, option.value)}
              />
            ))}
            <div className="mt-2 flex gap-5">
              {facet.options.length > VISIBLE_OPTIONS && (
                <button type="button" onClick={() => setShowAll((value) => !value)} className="label-caps link-underline">
                  {showAll ? 'Voir moins' : `Voir plus (${facet.options.length - VISIBLE_OPTIONS})`}
                </button>
              )}
              {selected > 0 && (
                <button type="button" onClick={() => onClear(facet.key)} className="label-caps text-muted link-underline">
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  )
}

interface FilterPanelProps {
  facets: Facet[]
  filters: CatalogFilters
  availableCount: number
  onToggle: (key: FacetKey, value: string) => void
  onClearFacet: (key: FacetKey) => void
  onAvailability: (value: boolean) => void
}

export function FilterPanel({ facets, filters, availableCount, onToggle, onClearFacet, onAvailability }: FilterPanelProps) {
  return (
    <div className="flex flex-col border-b border-ink">
      {facets.map((facet) => (
        <FacetGroup key={facet.key} facet={facet} onToggle={onToggle} onClear={onClearFacet} />
      ))}
      <fieldset className="border-t border-ink pb-5 pt-4">
        <legend className="sr-only">Disponibilité</legend>
        <p className="mb-2 label-caps font-semibold" aria-hidden="true">
          Disponibilité
        </p>
        <Checkbox label="En stock uniquement" checked={filters.dispo} onChange={onAvailability} count={availableCount} />
      </fieldset>
    </div>
  )
}
