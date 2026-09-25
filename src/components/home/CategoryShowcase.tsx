import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getCollection } from '@/data/collections'
import { categoryTiles, type CategoryTile } from '@/data/content'
import { useProducts } from '@/hooks/useProducts'
import { cn } from '@/utils/cn'
import { pluralize } from '@/utils/format'

const layouts: Record<CategoryTile['layout'], { tile: string; text: string }> = {
  feature: { tile: 'col-span-2 aspect-[4/5] lg:col-span-6 lg:row-span-2 lg:aspect-auto', text: 'text-display' },
  small: { tile: 'col-span-1 aspect-[4/5] lg:col-span-3', text: 'text-heading-sm md:text-heading' },
  wide: { tile: 'col-span-2 aspect-[16/10] lg:col-span-6', text: 'text-display' },
}

/** Grille éditoriale asymétrique : typographie géante posée sur les visuels. */
export function CategoryShowcase() {
  const { products, isLoading } = useProducts()

  return (
    <section className="container-page py-16 md:py-24" aria-labelledby="categories-title">
      <SectionHeader id="categories-title" eyebrow="Nos univers" title="Trouver son parfum" link={{ label: 'Toute la boutique', to: '/shop' }} />
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-12">
        {categoryTiles.map((tile, index) => {
          const collection = getCollection(tile.slug)
          const count = collection ? products.filter(collection.filter).length : 0
          const layout = layouts[tile.layout]
          return (
            <Reveal key={tile.slug} delay={index * 90} variant="clip" className={layout.tile}>
              <Link
                to={`/shop/${tile.slug}`}
                className="group/tile art-host relative block h-full overflow-hidden bg-sand"
                data-cursor="Explorer"
              >
                <div className="card-main absolute inset-0">
                  <ProductImage src={tile.image} alt={tile.alt} />
                </div>
                <div className="card-alt absolute inset-0" aria-hidden="true">
                  <ProductImage src={tile.hoverImage} alt="" />
                </div>
                <div className="tile-text absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 md:p-5">
                  <div>
                    <p className="label-caps">{isLoading ? ' ' : pluralize(count, 'produit')}</p>
                    <h3 className={cn('mt-1 font-extrabold', layout.text)}>{tile.label}</h3>
                  </div>
                  <ArrowRight
                    className="mb-1 size-6 shrink-0 -translate-x-3 opacity-0 transition-all duration-700 ease-expo group-hover/tile:translate-x-0 group-hover/tile:opacity-100"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
      <nav aria-label="Autres sélections" className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {[
          { label: 'Nouveautés', to: '/shop/nouveautes' },
          { label: 'Promotions', to: '/shop/promotions' },
          { label: 'Meilleures ventes', to: '/shop/meilleures-ventes' },
          { label: 'Parfums de luxe', to: '/shop/luxe' },
          { label: 'Moins de 60 €', to: '/shop/accessibles' },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="group inline-flex items-center gap-2 label-caps font-semibold">
            <span className="link-underline">{link.label}</span>
            <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </section>
  )
}
