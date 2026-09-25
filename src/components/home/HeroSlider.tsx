import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { GhostLink } from '@/components/ui/GhostLink'
import { SplitText } from '@/components/ui/SplitText'
import { heroSlides } from '@/data/content'
import { useMagnetic, useParallax } from '@/hooks/useMotion'
import { cn } from '@/utils/cn'
import { prefersReducedMotion } from '@/utils/motion'

const DURATION = 7000
const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Diaporama éditorial : légende à gauche, visuel plein cadre à droite.
 * Le visuel entrant se dévoile en rideau, le titre se révèle mot à mot.
 * Défilement automatique (désactivé si l'utilisateur préfère réduire les animations),
 * pause au survol et bouton pause accessible.
 */
export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [reducedMotion] = useState(prefersReducedMotion)
  const ctaRef = useMagnetic<HTMLSpanElement>(0.22)
  const visualRef = useParallax<HTMLDivElement>(0.08, 1.06)

  const slide = heroSlides[index]
  const autoplay = !reducedMotion && !paused
  const count = heroSlides.length

  const goTo = (next: number) => {
    const target = (next + count) % count
    if (target === index) return
    setPrevious(index)
    setIndex(target)
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- pause du défilement au survol/focus (WCAG 2.2.2)
    <section
      aria-roledescription="carrousel"
      aria-label="À la une"
      className="relative border-b border-ink"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="grid lg:min-h-[max(34rem,calc(100svh_-_10.5rem))] lg:grid-cols-12">
        <div className="relative order-2 flex flex-col justify-between gap-8 px-4 pb-8 pt-8 md:px-6 lg:order-1 lg:col-span-5 lg:px-10 lg:py-10">
          <h1 className="label-caps">Beauty Success — Parfumerie en ligne, parfums &amp; coffrets</h1>

          <div
            key={slide.id}
            aria-roledescription="diapositive"
            aria-label={`${index + 1} sur ${count}`}
            aria-live={autoplay ? 'off' : 'polite'}
          >
            <p className="animate-fade-up label-caps text-muted">{slide.eyebrow}</p>
            <SplitText as="h2" text={slide.title} trigger="mount" delay={120} className="mt-5 text-display font-extrabold" />
            <p className="mt-6 max-w-md animate-fade-up text-body text-muted [animation-delay:0.45s]">{slide.text}</p>
            <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:0.6s]">
              <span ref={ctaRef} className="inline-block">
                <ButtonLink to={slide.cta.to} size="lg" icon={<ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />}>
                  {slide.cta.label}
                </ButtonLink>
              </span>
              {slide.secondary && <GhostLink to={slide.secondary.to}>{slide.secondary.label}</GhostLink>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="label-caps tabular" aria-hidden="true">
              <span className="font-semibold">{pad(index + 1)}</span> / {pad(count)}
            </p>
            <div className="flex flex-1 gap-1.5">
              {heroSlides.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(itemIndex)}
                  aria-label={`Diapositive ${itemIndex + 1} : ${item.eyebrow}`}
                  aria-current={itemIndex === index ? 'true' : undefined}
                  className="relative h-8 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-ink/20" aria-hidden="true" />
                  <span
                    aria-hidden="true"
                    className="hero-progress absolute inset-x-0 top-1/2 h-px bg-ink"
                    data-running={itemIndex === index && autoplay}
                    data-paused={hovered}
                    data-done={itemIndex < index || (itemIndex === index && !autoplay)}
                    style={{ '--duration': `${DURATION}ms` } as CSSProperties}
                    onAnimationEnd={itemIndex === index ? () => goTo(index + 1) : undefined}
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <button type="button" onClick={() => goTo(index - 1)} className="grid size-10 place-items-center transition-opacity hover:opacity-60" aria-label="Diapositive précédente">
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => goTo(index + 1)} className="grid size-10 place-items-center transition-opacity hover:opacity-60" aria-label="Diapositive suivante">
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  className="grid size-10 place-items-center transition-opacity hover:opacity-60"
                  aria-label={paused ? 'Reprendre le défilement automatique' : 'Mettre en pause le défilement automatique'}
                >
                  {paused ? <Play className="size-4" strokeWidth={1.5} /> : <Pause className="size-4" strokeWidth={1.5} />}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative order-1 aspect-square overflow-hidden bg-ink sm:aspect-[16/11] lg:order-2 lg:col-span-7 lg:aspect-auto">
          <div ref={visualRef} className="absolute inset-0 will-change-transform">
            {heroSlides.map((item, itemIndex) => (
              <div
                key={item.id}
                className="hero-slide absolute inset-0"
                data-state={itemIndex === index ? 'active' : itemIndex === previous ? 'previous' : 'idle'}
                aria-hidden={itemIndex !== index}
              >
                <ProductImage src={item.image} alt={item.caption} live={itemIndex === index} priority={itemIndex === 0} />
              </div>
            ))}
          </div>
          <p className={cn('absolute bottom-4 left-4 z-10 max-w-[70%] label-caps text-bone/85')} aria-hidden="true">
            {slide.caption}
          </p>
          <span className="writing-vertical absolute right-4 top-4 z-10 hidden label-caps text-bone/70 md:block" aria-hidden="true">
            Collection automne 2026
          </span>
        </div>
      </div>
    </section>
  )
}
