import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Marquee } from '@/components/ui/Marquee'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { brands } from '@/data/brands'
import { useProducts } from '@/hooks/useProducts'
import { pluralize } from '@/utils/format'
import { brandSlug } from '@/utils/product'

export function BrandsSection() {
  const { products, isLoading } = useProducts()
  const counts = new Map<string, number>()
  for (const product of products) {
    const slug = brandSlug(product.brand)
    counts.set(slug, (counts.get(slug) ?? 0) + 1)
  }

  return (
    <section className="py-16 md:py-24" aria-labelledby="brands-title">
      <div className="container-page">
        <SectionHeader id="brands-title" eyebrow="Nos maisons" title="Dix maisons, mille sillages" link={{ label: 'Toute la boutique', to: '/shop' }} />
      </div>
      <div aria-hidden="true">
        <Marquee duration={60} className="border-y border-ink py-6 md:py-8">
          {brands.map((brand) => (
            <span key={brand.slug} className="flex items-center">
              <span className="whitespace-nowrap px-8 text-heading font-extrabold md:px-12">{brand.name}</span>
              <span className="size-2.5 bg-gold" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="container-page mt-12">
        <ul className="grid grid-cols-2 border-l border-t border-ink md:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand, index) => (
            <Reveal as="li" key={brand.slug} delay={(index % 5) * 60} className="border-b border-r border-ink">
              <Link
                to={`/shop?marque=${brand.slug}`}
                className="group relative isolate flex aspect-[4/3] flex-col justify-between overflow-hidden p-4 transition-colors duration-500 hover:text-bone md:p-5"
              >
                <span
                  className="absolute inset-0 -z-10 translate-y-full bg-ink transition-transform duration-700 ease-expo group-hover:translate-y-0"
                  aria-hidden="true"
                />
                <span className="label-caps text-muted transition-colors duration-500 group-hover:text-bone/70">
                  {brand.origin} · {brand.founded}
                </span>
                <span>
                  <span className="block text-heading-sm font-extrabold">{brand.name}</span>
                  <span className="mt-1 block text-caption text-muted transition-colors duration-500 group-hover:text-bone/70">{brand.tagline}</span>
                </span>
                <span className="flex items-center justify-between label-caps">
                  <span>{isLoading ? ' ' : pluralize(counts.get(brand.slug) ?? 0, 'produit')}</span>
                  <ArrowRight className="size-4 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.25} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
