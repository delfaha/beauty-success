import { Reveal } from '@/components/ui/Reveal'
import { FAMILY_DESCRIPTIONS, FAMILY_LABELS } from '@/data/taxonomy'
import type { Product } from '@/types/product'

const LEVELS = [
  { key: 'top', label: 'Notes de tête', moment: 'Les premières minutes' },
  { key: 'heart', label: 'Notes de cœur', moment: 'Après une heure' },
  { key: 'base', label: 'Notes de fond', moment: 'Le sillage, des heures durant' },
] as const

/** Pyramide olfactive en grandes lignes typographiques (tête, cœur, fond). */
export function OlfactoryPyramid({ product }: { product: Product }) {
  return (
    <section className="bg-dusty py-16 md:py-24" aria-labelledby="notes-title">
      <div className="container-page">
        <div className="flex flex-col gap-4 border-t border-ink pt-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps">Pyramide olfactive</p>
            <h2 id="notes-title" className="mt-4 text-heading font-extrabold">
              Un parfum {FAMILY_LABELS[product.family].toLowerCase()}
            </h2>
          </div>
          <p className="max-w-sm text-body-sm text-ink/80">{FAMILY_DESCRIPTIONS[product.family]}</p>
        </div>
        <dl className="mt-10 border-b border-ink">
          {LEVELS.map((level, index) => (
            <Reveal
              key={level.key}
              delay={index * 110}
              className="group grid gap-3 border-t border-ink/25 py-6 transition-colors duration-500 hover:bg-bone/40 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
            >
              <dt className="md:col-span-3">
                <span className="label-caps font-semibold">
                  {String(index + 1).padStart(2, '0')} — {level.label}
                </span>
                <span className="mt-1 block text-caption text-ink/70">{level.moment}</span>
              </dt>
              <dd className="text-heading-sm font-extrabold transition-transform duration-700 ease-expo group-hover:translate-x-2 md:col-span-9">
                {product.notes[level.key].join(', ')}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
