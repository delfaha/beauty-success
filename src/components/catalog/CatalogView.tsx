import { LoaderCircle, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductImage } from '@/components/product/ProductImage'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { JsonLd } from '@/components/ui/JsonLd'
import { VerticalLabel } from '@/components/ui/SectionHeader'
import { SplitText } from '@/components/ui/SplitText'
import { PAGE_SIZE } from '@/config/shop'
import type { NavLink as NavLinkItem } from '@/data/navigation'
import { useCatalogParams } from '@/hooks/useCatalogParams'
import type { FacetKey, SortKey } from '@/types/catalog'
import type { Product } from '@/types/product'
import { applyFilters, buildFacets, sortProducts } from '@/utils/catalog'
import { cn } from '@/utils/cn'
import { pluralize } from '@/utils/format'
import { productPath } from '@/utils/product'
import { itemListJsonLd, type BreadcrumbItem } from '@/utils/seo'
import { ActiveFilters, SortSelect } from './CatalogControls'
import { FilterPanel } from './FilterPanel'

const NO_FACETS: FacetKey[] = []

interface CatalogViewProps {
  title: string
  eyebrow?: string
  description?: ReactNode
  breadcrumb: BreadcrumbItem[]
  products: Product[]
  isLoading: boolean
  hiddenFacets?: FacetKey[]
  defaultSort?: SortKey
  /** Scores de pertinence (recherche). */
  relevance?: Map<string, number>
  /** Produit illustrant l'en-tête. */
  visual?: Product
  quickLinks?: NavLinkItem[]
  headerExtra?: ReactNode
  emptyState?: ReactNode
}

function CatalogVisual({ product }: { product: Product }) {
  return (
    <Link
      to={productPath(product.id)}
      className="group/tile art-host relative ml-auto hidden aspect-[4/5] w-full max-w-[17rem] overflow-hidden bg-sand lg:block"
      aria-label={`À la une : ${product.name}, ${product.brand}`}
      data-cursor="Voir"
    >
      <div className="card-main absolute inset-0">
        <ProductImage src={product.image} alt="" priority />
      </div>
      <div className="card-alt absolute inset-0">
        <ProductImage src={product.images[1] ?? product.image} alt="" />
      </div>
      <span className="tile-text absolute inset-x-3 bottom-3 flex items-center justify-between label-caps font-semibold">
        <span>À la une</span>
        <span>{product.name}</span>
      </span>
    </Link>
  )
}

/**
 * Page catalogue complète : en-tête éditorial, barre d'outils collante,
 * filtres à facettes (panneau latéral ou tiroir mobile), tri, chargement progressif.
 * L'état vit dans l'URL (partage, retour arrière, SEO).
 */
export function CatalogView({
  title,
  eyebrow,
  description,
  breadcrumb,
  products,
  isLoading,
  hiddenFacets = NO_FACETS,
  defaultSort = 'pertinence',
  relevance,
  visual,
  quickLinks,
  headerExtra,
  emptyState,
}: CatalogViewProps) {
  const { filters, sort, page, activeCount, toggleFilter, clearFacet, setAvailability, setSort, clearAll, setPage } =
    useCatalogParams(defaultSort)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadTimer = useRef(0)
  const gridRef = useRef<HTMLDivElement>(null)
  const focusIndex = useRef<number | null>(null)

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters])
  const sorted = useMemo(() => sortProducts(filtered, sort, relevance), [filtered, sort, relevance])
  const facets = useMemo(() => buildFacets(products, filters, hiddenFacets), [products, filters, hiddenFacets])
  const availableCount = useMemo(
    () => applyFilters(products, { ...filters, dispo: false }).filter((product) => product.stock > 0).length,
    [products, filters],
  )

  const visibleCount = Math.min(sorted.length, page * PAGE_SIZE)
  const visible = sorted.slice(0, visibleCount)
  const total = sorted.length

  useEffect(() => () => window.clearTimeout(loadTimer.current), [])

  // Après « Voir plus », le focus clavier passe au premier nouveau produit.
  useEffect(() => {
    if (focusIndex.current === null) return
    const links = gridRef.current?.querySelectorAll<HTMLAnchorElement>('article h3 a')
    links?.[focusIndex.current]?.focus({ preventScroll: true })
    focusIndex.current = null
  }, [visibleCount])

  const loadMore = () => {
    setLoadingMore(true)
    loadTimer.current = window.setTimeout(() => {
      focusIndex.current = visibleCount
      setPage(page + 1)
      setLoadingMore(false)
    }, 450)
  }

  const filterPanel = (
    <FilterPanel
      facets={facets}
      filters={filters}
      availableCount={availableCount}
      onToggle={toggleFilter}
      onClearFacet={clearFacet}
      onAvailability={setAvailability}
    />
  )

  return (
    <>
      {!isLoading && visible.length > 0 && <JsonLd data={itemListJsonLd(visible.slice(0, PAGE_SIZE))} />}

      <section className="container-page pb-10 pt-6 md:pb-14" aria-labelledby="catalog-title">
        <Breadcrumb items={breadcrumb} />
        <div className="mt-8 grid items-end gap-8 lg:grid-cols-12 lg:mt-12">
          <div className="lg:col-span-8">
            {eyebrow && <p className="label-caps">{eyebrow}</p>}
            <h1 id="catalog-title" className="mt-4 text-display font-extrabold">
              <SplitText text={title} trigger="mount" />
            </h1>
            <p className="mt-6 label-caps font-semibold" aria-live="polite">
              {isLoading ? 'Chargement des produits…' : pluralize(total, 'produit')}
            </p>
            {description && <div className="mt-3 max-w-xl text-body text-muted">{description}</div>}
            {headerExtra}
          </div>
          <div className="lg:col-span-4">{visual && <CatalogVisual product={visual} />}</div>
        </div>
        {quickLinks && (
          <nav aria-label="Univers" className="scrollbar-none -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            {quickLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="shrink-0 border border-ink px-4 py-2 label-caps transition-colors duration-300 hover:bg-ink hover:text-bone"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </section>

      <div className="sticky z-30 border-y border-ink bg-bone" style={{ top: 'var(--header-h, 0px)' }}>
        <div className="container-page flex h-14 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 label-caps font-semibold lg:hidden"
            aria-haspopup="dialog"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Filtrer{activeCount > 0 && ` (${activeCount})`}
          </button>
          <p className="hidden label-caps text-muted lg:block">
            {isLoading ? '…' : `${pluralize(total, 'résultat')}${activeCount ? ` · ${pluralize(activeCount, 'filtre actif', 'filtres actifs')}` : ''}`}
          </p>
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="container-page relative grid gap-10 pb-24 pt-8 lg:grid-cols-[15.5rem_1fr] xl:gap-14">
        <VerticalLabel className="absolute -left-2 top-10">
          {title} — {pluralize(total, 'produit')}
        </VerticalLabel>
        <aside className="hidden lg:block" aria-label="Filtres">
          <div className="scrollbar-none sticky max-h-[calc(100dvh_-_var(--header-h,0px)_-_6rem)] overflow-y-auto pb-6 top-[calc(var(--header-h,0px)_+_4.5rem)]">
            {filterPanel}
          </div>
        </aside>

        <section aria-label="Produits" className="min-w-0">
          <ActiveFilters filters={filters} onToggle={toggleFilter} onAvailability={setAvailability} onClearAll={clearAll} />

          {!isLoading && total === 0 ? (
            (emptyState ?? (
              <EmptyState
                title="Aucun parfum ne correspond à ces critères."
                description="Élargissez votre sélection en retirant un filtre, ou laissez-vous guider par nos meilleures ventes."
              >
                {activeCount > 0 && (
                  <Button onClick={clearAll} variant="primary">
                    Réinitialiser les filtres
                  </Button>
                )}
                <ButtonLink to="/shop/meilleures-ventes" variant="outline">
                  Meilleures ventes
                </ButtonLink>
              </EmptyState>
            ))
          ) : (
            <div ref={gridRef}>
              <ProductGrid products={visible} isLoading={isLoading} skeletonCount={6} label={title} />
            </div>
          )}

          {!isLoading && total > 0 && (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <p className="text-body-sm" aria-live="polite">
                Vous avez vu <strong className="font-extrabold">{visibleCount}</strong> {visibleCount > 1 ? 'produits' : 'produit'} sur {total}
              </p>
              <div className="h-0.5 w-56 bg-ink/15" aria-hidden="true">
                <div className="h-full bg-ink transition-[width] duration-700 ease-expo" style={{ width: `${(visibleCount / total) * 100}%` }} />
              </div>
              {visibleCount < total && (
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="mt-2"
                  icon={loadingMore ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : undefined}
                >
                  {loadingMore ? 'Chargement…' : 'Voir plus de produits'}
                </Button>
              )}
            </div>
          )}
        </section>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} label="Filtrer et trier" side="left">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink px-5">
          <p className="label-caps font-semibold">Filtrer & trier</p>
          <button type="button" onClick={() => setFiltersOpen(false)} className="grid size-10 place-items-center" aria-label="Fermer les filtres">
            <X className="size-5" strokeWidth={1.25} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          <SortSelect value={sort} onChange={setSort} className="py-5" />
          <ActiveFilters filters={filters} onToggle={toggleFilter} onAvailability={setAvailability} onClearAll={clearAll} />
          {filterPanel}
        </div>
        <div className={cn('grid shrink-0 gap-2 border-t border-ink p-4', activeCount > 0 ? 'grid-cols-2' : 'grid-cols-1')}>
          {activeCount > 0 && (
            <Button variant="outline" onClick={clearAll}>
              Effacer
            </Button>
          )}
          <Button onClick={() => setFiltersOpen(false)}>Voir {pluralize(total, 'produit')}</Button>
        </div>
      </Drawer>
    </>
  )
}
