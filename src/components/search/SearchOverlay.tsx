import { ArrowRight, Search, X } from 'lucide-react'
import { useDeferredValue, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import { Drawer } from '@/components/ui/Drawer'
import { Price } from '@/components/ui/Price'
import { popularSearches } from '@/data/navigation'
import { useRecentSearches } from '@/hooks/useHistory'
import { useProducts } from '@/hooks/useProducts'
import type { Product } from '@/types/product'
import { pluralize } from '@/utils/format'
import { productPath } from '@/utils/product'
import { searchProducts } from '@/utils/search'

function ResultCard({ product, onSelect }: { product: Product; onSelect: () => void }) {
  return (
    <Link to={productPath(product.id)} onClick={onSelect} className="group/tile art-host flex flex-col gap-2.5">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <div className="card-main absolute inset-0">
          <ProductImage src={product.image} alt={`${product.name} — ${product.brand}`} />
        </div>
      </div>
      <div>
        <p className="label-caps text-muted">{product.brand}</p>
        <p className="font-extrabold leading-tight">
          <span className="link-underline">{product.name}</span>
        </p>
        <Price price={product.price} oldPrice={product.oldPrice} size="sm" className="mt-1" />
      </div>
    </Link>
  )
}

/** Recherche instantanée plein écran (raccourci clavier « / »). */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const { products, isLoading } = useProducts()
  const { searches: recent, add: addRecent, clear: clearRecent } = useRecentSearches()
  const navigate = useNavigate()

  const results = useMemo(() => searchProducts(products, deferredQuery), [products, deferredQuery])
  const newArrivals = useMemo(() => products.filter((product) => product.isNew).slice(0, 4), [products])
  const trimmed = query.trim()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!trimmed) return
    addRecent(trimmed)
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    onClose()
  }

  const remember = () => {
    if (trimmed) addRecent(trimmed)
  }

  const chip =
    'border border-ink px-3.5 py-2 label-caps transition-colors duration-300 hover:bg-ink hover:text-bone'

  return (
    <Drawer open={open} onClose={onClose} label="Recherche" side="top" className="overflow-y-auto">
      <div className="container-page pb-10 pt-5 md:pb-14 md:pt-8">
        <div className="flex items-center justify-between">
          <p className="label-caps text-muted">Rechercher dans la boutique</p>
          <button type="button" onClick={onClose} className="group flex items-center gap-2 label-caps font-semibold" aria-label="Fermer la recherche">
            <span className="link-underline hidden sm:inline">Fermer</span>
            <X className="size-5" strokeWidth={1.25} />
          </button>
        </div>

        <form role="search" onSubmit={submit} className="mt-5 flex items-center gap-3 border-b border-ink pb-3 md:mt-8 md:gap-5">
          <Search className="size-6 shrink-0 md:size-9" strokeWidth={1.25} aria-hidden="true" />
          <label htmlFor="search-overlay-input" className="sr-only">
            Rechercher un parfum, une marque ou une note
          </label>
          <input
            id="search-overlay-input"
            data-autofocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Parfum, marque, note…"
            autoComplete="off"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent text-heading font-extrabold outline-none placeholder:text-ink/25 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="grid size-10 place-items-center" aria-label="Effacer la recherche">
              <X className="size-5" strokeWidth={1.25} />
            </button>
          )}
          <button type="submit" className="hidden h-12 items-center gap-2 bg-ink px-6 label-caps font-semibold text-bone sm:flex" disabled={!trimmed}>
            Rechercher
            <ArrowRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </form>

        {trimmed ? (
          <div className="mt-8" aria-live="polite">
            {isLoading ? (
              <p className="label-caps text-muted">Recherche en cours…</p>
            ) : results.length > 0 ? (
              <>
                <p className="label-caps text-muted">
                  {pluralize(results.length, 'résultat')} pour « {trimmed} »
                </p>
                <ul className="mt-5 grid grid-cols-2 gap-x-2.5 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                  {results.slice(0, 6).map(({ product }) => (
                    <li key={product.id} className="animate-fade-up">
                      <ResultCard product={product} onSelect={remember} />
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/search?q=${encodeURIComponent(trimmed)}`}
                  onClick={remember}
                  className="group mt-8 inline-flex items-center gap-2 label-caps font-semibold"
                >
                  <span className="link-underline">Voir {results.length > 1 ? `les ${results.length} résultats` : 'le résultat'}</span>
                  <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                </Link>
              </>
            ) : (
              <div className="max-w-2xl">
                <p className="text-heading-sm font-extrabold">Aucun résultat pour « {trimmed} ».</p>
                <p className="mt-3 text-body text-muted">
                  Vérifiez l’orthographe ou essayez une marque, une note (vanille, rose, cèdre…) ou une catégorie.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button key={term} type="button" className={chip} onClick={() => setQuery(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-12">
            <div className="flex flex-col gap-8 md:col-span-4">
              <div>
                <p className="label-caps text-muted">Recherches populaires</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button key={term} type="button" className={chip} onClick={() => setQuery(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              {recent.length > 0 && (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="label-caps text-muted">Vos dernières recherches</p>
                    <button type="button" onClick={clearRecent} className="label-caps link-underline">
                      Effacer
                    </button>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    {recent.map((term) => (
                      <li key={term}>
                        <button type="button" onClick={() => setQuery(term)} className="text-subheading font-semibold link-underline">
                          {term}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="md:col-span-8">
              <p className="label-caps text-muted">Nouveautés</p>
              <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {newArrivals.map((product) => (
                  <li key={product.id}>
                    <ResultCard product={product} onSelect={onClose} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}
