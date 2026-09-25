import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { prefersReducedMotion } from '@/utils/motion'

/** Défilement horizontal infini en CSS (pause au survol). Le contenu est dupliqué. */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={cn('group/marquee flex overflow-hidden', className)}>
      <div
        className="flex w-max shrink-0 animate-marquee group-hover/marquee:[animation-play-state:paused]"
        style={{ '--marquee-duration': `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' } as CSSProperties}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Bandeau typographique géant dont la vitesse et le sens suivent le défilement de la page.
 * Décoratif : masqué aux technologies d'assistance.
 */
export function ScrollMarquee({ items, className }: { items: string[]; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || prefersReducedMotion()) return
    let x = 0
    let direction = -1
    let boost = 0
    let lastY = window.scrollY
    let frame = 0
    let visible = false

    const tick = () => {
      const half = track.scrollWidth / 2
      x += direction * (0.55 + boost)
      boost *= 0.92
      if (x <= -half) x += half
      if (x > 0) x -= half
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const onScroll = () => {
      const delta = window.scrollY - lastY
      lastY = window.scrollY
      if (delta !== 0) direction = delta > 0 ? -1 : 1
      boost = Math.min(boost + Math.abs(delta) * 0.12, 14)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(tick)
    })
    observer.observe(track)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  const content = (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 text-display font-extrabold md:px-10">{item}</span>
          <span className="size-3 bg-gold md:size-4" />
        </span>
      ))}
    </div>
  )

  return (
    <div className={cn('overflow-hidden', className)} aria-hidden="true">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {content}
        {content}
      </div>
    </div>
  )
}
