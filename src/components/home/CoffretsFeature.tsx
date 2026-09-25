import { Check } from 'lucide-react'
import { ProductCarousel } from '@/components/product/ProductCarousel'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SplitText } from '@/components/ui/SplitText'
import { useParallax } from '@/hooks/useMotion'
import { useProducts } from '@/hooks/useProducts'

const PERKS = ['Emballage cadeau offert', 'Carte personnalisée', 'Livraison express 24 h']

export function CoffretsFeature() {
  const { products, isLoading } = useProducts()
  const coffrets = products.filter((product) => product.category === 'coffret')
  const visualRef = useParallax<HTMLDivElement>(0.1, 1.1)

  return (
    <section aria-labelledby="coffrets-title">
      <div className="relative overflow-hidden bg-ink text-bone">
        <div className="grid lg:grid-cols-12">
          <div className="relative z-10 flex flex-col items-start justify-end gap-7 px-4 py-14 md:px-6 lg:col-span-5 lg:px-10 lg:py-20">
            <p className="label-caps text-bone/70">Coffrets cadeaux</p>
            <h2 id="coffrets-title" className="text-display font-extrabold lg:-mr-[40%]">
              <SplitText text={'L’art\nd’offrir.'} />
            </h2>
            <p className="max-w-md text-body text-bone/75">
              Eaux de parfum et soins assortis, miniatures à découvrir, éditions limitées : des écrins composés par nos maisons, prêts à offrir.
            </p>
            <ul className="flex flex-col gap-2">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-body-sm">
                  <Check className="size-4 text-gold" strokeWidth={1.75} aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
            <ButtonLink to="/shop/coffrets" variant="light" size="lg">
              Voir tous les coffrets
            </ButtonLink>
          </div>
          <Reveal variant="clip" className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:col-span-7 lg:aspect-auto lg:min-h-[42rem]">
            <div ref={visualRef} className="absolute inset-0">
              <ProductImage src="art:coffret-velours-pourpre/noir" alt="Coffret Velours Pourpre de Maison Verlaine, écrin noir et or" live />
            </div>
          </Reveal>
        </div>
      </div>
      <div className="container-page py-14 md:py-20">
        <ProductCarousel products={coffrets} isLoading={isLoading} label="Coffrets parfum" />
      </div>
    </section>
  )
}
