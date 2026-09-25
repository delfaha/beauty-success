import { ProductCarousel } from '@/components/product/ProductCarousel'
import { Countdown } from '@/components/ui/Counters'
import { GhostLink } from '@/components/ui/GhostLink'
import { SplitText } from '@/components/ui/SplitText'
import { useProducts } from '@/hooks/useProducts'

export function PromoBand() {
  const { products, isLoading } = useProducts()
  const promotions = products
    .filter((product) => product.isPromotion)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))

  return (
    <section className="bg-dusty py-16 md:py-24" aria-labelledby="promo-title">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-7 self-start lg:sticky lg:top-[calc(var(--header-h,0px)_+_2rem)] lg:col-span-4">
          <p className="label-caps">Offre d’automne · jusqu’à dimanche</p>
          <h2 id="promo-title" className="text-display font-extrabold">
            <SplitText text={'Jusqu’à\n−30 %'} />
          </h2>
          <p className="max-w-sm text-body text-ink/80">
            Une sélection de parfums et de coffrets à prix doux, dans la limite des stocks disponibles. Fin de l’offre dimanche à minuit.
          </p>
          <Countdown />
          <GhostLink to="/shop/promotions">Toutes les promotions</GhostLink>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <ProductCarousel products={promotions} isLoading={isLoading} label="Produits en promotion" perView={3} />
        </div>
      </div>
    </section>
  )
}
