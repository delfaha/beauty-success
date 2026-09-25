import { Search } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { CatalogView } from '@/components/catalog/CatalogView'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { popularSearches } from '@/data/navigation'
import { useRecentSearches } from '@/hooks/useHistory'
import { useProducts } from '@/hooks/useProducts'
import { useSeo } from '@/hooks/useSeo'
import { searchProducts } from '@/utils/search'

function SearchForm({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial)
  const navigate = useNavigate()
  const { add } = useRecentSearches()

  // Garde le champ synchronisé avec l'URL (recherche lancée depuis l'en-tête, bouton retour…).
  const [previousInitial, setPreviousInitial] = useState(initial)
  if (previousInitial !== initial) {
    setPreviousInitial(initial)
    setValue(initial)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const query = value.trim()
    if (!query) return
    add(query)
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form role="search" onSubmit={submit} className="mt-8 flex max-w-2xl items-center gap-3 border-b border-ink pb-2">
      <Search className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <label htmlFor="search-page-input" className="sr-only">
        Nouvelle recherche
      </label>
      <input
        id="search-page-input"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Parfum, marque, note…"
        className="h-12 min-w-0 flex-1 bg-transparent text-subheading font-semibold outline-none"
        enterKeyHint="search"
      />
      <button type="submit" className="label-caps font-semibold link-underline">
        Rechercher
      </button>
    </form>
  )
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const query = (params.get('q') ?? '').trim()
  const { products, isLoading } = useProducts()
  const { add } = useRecentSearches()

  const results = useMemo(() => searchProducts(products, query), [products, query])
  const matched = useMemo(() => results.map((result) => result.product), [results])
  const relevance = useMemo(() => new Map(results.map((result) => [result.product.id, result.score])), [results])
  const bestSellers = useMemo(() => products.filter((product) => product.isBestSeller), [products])

  useEffect(() => {
    if (query) add(query)
  }, [query, add])

  useSeo({
    title: query ? `Recherche « ${query} »` : 'Recherche',
    description: query ? `Résultats de recherche pour « ${query} » sur Beauty Success.` : undefined,
    noindex: true,
  })

  const suggestions = (
    <div className="flex flex-wrap gap-2">
      {popularSearches.map((term) => (
        <ButtonLink key={term} to={`/search?q=${encodeURIComponent(term)}`} variant="outline" size="sm">
          {term}
        </ButtonLink>
      ))}
    </div>
  )

  return (
    <>
      <CatalogView
        title={query ? `« ${query} »` : 'Recherche'}
        eyebrow="Résultats de recherche"
        breadcrumb={[{ label: 'Accueil', to: '/' }, { label: 'Recherche' }]}
        products={matched}
        isLoading={isLoading}
        relevance={relevance}
        headerExtra={<SearchForm initial={query} />}
        emptyState={
          <EmptyState
            title={query ? `Aucun résultat pour « ${query} ».` : 'Que recherchez-vous ?'}
            description={
              query
                ? 'Vérifiez l’orthographe, essayez un terme plus général ou l’une de nos recherches populaires. Nos marques étant exclusives, les noms de grandes maisons ne figurent pas au catalogue.'
                : 'Saisissez un nom de parfum, une marque, une note (vanille, rose, cèdre…) ou une catégorie.'
            }
          >
            {suggestions}
          </EmptyState>
        }
      />
      {!isLoading && matched.length === 0 && (
        <section className="container-page pb-20" aria-labelledby="search-bestsellers">
          <h2 id="search-bestsellers" className="mb-8 text-heading-sm font-extrabold">
            Nos meilleures ventes
          </h2>
          <ProductCarousel products={bestSellers} label="Meilleures ventes" />
        </section>
      )}
    </>
  )
}
