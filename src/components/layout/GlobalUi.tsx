import { ArrowUp } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigation } from 'react-router'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useMagnetic } from '@/hooks/useMotion'
import { useScrolled } from '@/hooks/useScrolled'
import { cn } from '@/utils/cn'
import { hasFinePointer, prefersReducedMotion, scrollToTop } from '@/utils/motion'
import { Wordmark } from './Wordmark'

/** Bouton « retour en haut » avec contour de progression de lecture. */
export function BackToTop() {
  const visible = useScrolled(900)
  const buttonRef = useMagnetic<HTMLButtonElement>(0.25)
  const progressRef = useRef<SVGRectElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
      progressRef.current?.setAttribute('stroke-dashoffset', String(100 - ratio * 100))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      inert={!visible}
      aria-label="Revenir en haut de la page"
      className={cn(
        'fixed right-4 z-40 grid size-12 place-items-center bg-bone text-ink transition-[opacity,translate] duration-500 ease-expo hover:bg-ink hover:text-bone md:right-6',
        visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
      style={{ bottom: 'calc(1rem + var(--sticky-offset, 0px))' }}
    >
      <svg className="absolute inset-0 size-full" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="0.5" y="0.5" width="47" height="47" fill="none" stroke="currentColor" strokeOpacity="0.2" />
        <rect
          ref={progressRef}
          x="0.5"
          y="0.5"
          width="47"
          height="47"
          fill="none"
          stroke="currentColor"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>
      <ArrowUp className="size-4" strokeWidth={1.5} />
    </button>
  )
}

/** Fine barre en haut de l'écran pendant le chargement d'une page (code splitting). */
export function RouteProgress() {
  const navigation = useNavigation()
  const loading = navigation.state !== 'idle'
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')

  if (loading && phase !== 'loading') setPhase('loading')
  if (!loading && phase === 'loading') setPhase('done')

  useEffect(() => {
    if (phase !== 'done') return
    const timer = window.setTimeout(() => setPhase('idle'), 700)
    return () => window.clearTimeout(timer)
  }, [phase])

  return <div className="route-progress" data-state={phase} aria-hidden="true" />
}

/** Étiquette qui suit la souris au-dessus des éléments `[data-cursor]` (« Voir », « Glisser »). */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !hasFinePointer() || prefersReducedMotion()) return
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let frame = 0

    const tick = () => {
      x += (targetX - x) * 0.22
      y += (targetY - y) * 0.22
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      targetX = event.clientX
      targetY = event.clientY
      const host = (event.target as Element | null)?.closest?.('[data-cursor]')
      const next = host?.getAttribute('data-cursor') || null
      setLabel((current) => (current === next ? current : next))
      if (!frame) frame = requestAnimationFrame(tick)
    }
    const onLeave = () => setLabel(null)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className={cn('cursor-label', label && 'is-active')} aria-hidden="true">
      <span>{label ?? ''}</span>
    </div>
  )
}

const INTRO_KEY = 'beauty-success:intro'

function shouldPlayIntro(): boolean {
  try {
    return !prefersReducedMotion() && !window.sessionStorage.getItem(INTRO_KEY)
  } catch {
    return false
  }
}

/** Écran d'ouverture (une fois par session) : lettres en cascade puis rideau qui se lève. */
export function Preloader() {
  const [phase, setPhase] = useState<'intro' | 'leaving' | 'done'>(() => (shouldPlayIntro() ? 'intro' : 'done'))
  useLockBodyScroll(phase !== 'done')

  useEffect(() => {
    if (phase === 'done') return
    if (phase === 'intro') {
      try {
        window.sessionStorage.setItem(INTRO_KEY, '1')
      } catch {
        /* ignore */
      }
    }
    const timer = window.setTimeout(() => setPhase(phase === 'intro' ? 'leaving' : 'done'), phase === 'intro' ? 1500 : 1100)
    return () => window.clearTimeout(timer)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div className={cn('preloader', phase === 'leaving' && 'is-leaving')} aria-hidden="true">
      <div className="flex flex-col items-center gap-5 px-4">
        <p className="flex overflow-hidden text-[clamp(2.1rem,7.5vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.05em]">
          {[...'BEAUTY SUCCESS'].map((char, index) => (
            <span key={index} className="preloader-letter" style={{ '--i': index } as CSSProperties}>
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </p>
        <p className="animate-fade-in label-caps tracking-[0.35em] [animation-delay:0.7s]">Parfumerie en ligne</p>
      </div>
    </div>
  )
}

/** Écran affiché pendant le tout premier chargement de l'application. */
export function PageLoader() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bone" role="status" aria-label="Chargement de Beauty Success">
      <Wordmark className="animate-pulse text-[1.6rem]" />
    </div>
  )
}
