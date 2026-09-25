import { ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ProductImage } from '@/components/product/ProductImage'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAMILY_DESCRIPTIONS, FAMILY_LABELS } from '@/data/taxonomy'
import { useProducts } from '@/hooks/useProducts'
import type { OlfactoryFamily } from '@/types/product'
import { cn } from '@/utils/cn'
import { hasFinePointer, prefersReducedMotion } from '@/utils/motion'

const FAMILIES: OlfactoryFamily[] = ['floral', 'boise', 'oriental', 'gourmand', 'hesperide', 'aquatique', 'musque', 'aromatique']

/**
 * Liste typographique des familles olfactives. Au survol (souris), un visuel
 * flotte et suit le curseur avec inertie ; il change en rideau d'une famille à l'autre.
 */
export function FamilyExplorer() {
  const { products } = useProducts()
  const [active, setActive] = useState<OlfactoryFamily | null>(null)
  const [interactive, setInteractive] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const families = useMemo(
    () =>
      FAMILIES.map((family) => {
        const list = products.filter((product) => product.family === family)
        const hero = [...list].sort((a, b) => b.popularity - a.popularity)[0]
        return { family, count: list.length, hero }
      }).filter((entry) => entry.count > 0),
    [products],
  )

  useEffect(() => {
    const section = sectionRef.current
    const preview = previewRef.current
    if (!section || !preview || !hasFinePointer()) return
    setInteractive(true)
    const smooth = !prefersReducedMotion()
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let frame = 0
    const render = () => {
      x += (targetX - x) * (smooth ? 0.12 : 1)
      y += (targetY - y) * (smooth ? 0.12 : 1)
      const tilt = Math.max(-8, Math.min(8, (targetX - x) * 0.05))
      preview.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(render) : 0
    }
    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      targetX = event.clientX - rect.left - preview.offsetWidth / 2
      targetY = event.clientY - rect.top - preview.offsetHeight / 2
      if (!frame) frame = requestAnimationFrame(render)
    }
    section.addEventListener('pointermove', onMove)
    return () => {
      section.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24"
      aria-labelledby="families-title"
      onPointerLeave={() => setActive(null)}
    >
      <div className="container-page">
        <SectionHeader id="families-title" eyebrow="Trouver son sillage" title="Par famille olfactive" />
        <ul className="relative z-10 border-b border-ink">
          {families.map((entry, index) => (
            <li key={entry.family} className="border-t border-ink/20 first:border-ink">
              <Link
                to={`/shop?famille=${entry.family}`}
                onPointerEnter={() => setActive(entry.family)}
                className="group grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 py-4 md:grid-cols-[3rem_1fr_minmax(0,22rem)_2rem] md:gap-8 md:py-5"
              >
                <span className="label-caps text-muted tabular">{String(index + 1).padStart(2, '0')}</span>
                <span className="flex items-baseline gap-3">
                  <span className="text-heading font-extrabold transition-transform duration-700 ease-expo group-hover:translate-x-3 md:group-hover:translate-x-6">
                    {FAMILY_LABELS[entry.family]}
                  </span>
                  <span className="label-caps text-muted">{entry.count}</span>
                </span>
                <span className="hidden text-body-sm text-muted md:block">{FAMILY_DESCRIPTIONS[entry.family]}</span>
                <ArrowRight
                  className="size-6 -translate-x-3 self-center opacity-0 transition-all duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={previewRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute left-0 top-0 z-20 h-[21rem] w-[16.5rem] overflow-hidden bg-ink transition-opacity duration-500',
          interactive && active ? 'opacity-100' : 'opacity-0',
          !interactive && 'hidden',
        )}
      >
        {families.map((entry) =>
          entry.hero ? (
            <div
              key={entry.family}
              className={cn(
                'absolute inset-0 transition-[clip-path] duration-700 ease-quart',
                active === entry.family ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(100%_0_0_0)]',
              )}
            >
              <ProductImage src={entry.hero.images[1] ?? entry.hero.image} alt="" live={active === entry.family} />
            </div>
          ) : null,
        )}
      </div>
    </section>
  )
}
