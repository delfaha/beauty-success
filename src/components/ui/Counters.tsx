import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'
import { prefersReducedMotion } from '@/utils/motion'

/** Nombre qui s'incrémente jusqu'à sa valeur finale lorsqu'il entre dans l'écran. */
export function CountUp({ to, decimals = 0, suffix = '', duration = 1800 }: { to: number; decimals?: number; suffix?: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const [value, setValue] = useState(() => (prefersReducedMotion() ? to : 0))

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = progress === 1 ? 1 : 1 - 2 ** (-10 * progress)
      setValue(to * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration])

  const format = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular">
        {format(value)}
        {suffix}
      </span>
      <span className="sr-only">
        {format(to)}
        {suffix}
      </span>
    </span>
  )
}

/** Prochaine échéance : dimanche 23 h 59 (offre hebdomadaire toujours à venir). */
function nextDeadline(): number {
  const date = new Date()
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7))
  date.setHours(23, 59, 59, 999)
  return date.getTime()
}

const UNITS = [
  { label: 'jours', ms: 86_400_000 },
  { label: 'heures', ms: 3_600_000 },
  { label: 'min', ms: 60_000 },
  { label: 'sec', ms: 1000 },
] as const

export function Countdown({ className }: { className?: string }) {
  const [deadline] = useState(nextDeadline)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const remaining = Math.max(0, deadline - now)
  const parts = UNITS.map((unit, index) => {
    const larger = index === 0 ? Number.POSITIVE_INFINITY : UNITS[index - 1].ms
    const amount = Math.floor((remaining % larger) / unit.ms)
    return { label: unit.label, value: String(amount).padStart(2, '0') }
  })

  return (
    <div className={className}>
      <p className="sr-only">
        L’offre se termine dans {parts[0].value} jours, {parts[1].value} heures et {parts[2].value} minutes.
      </p>
      <div className="flex gap-2.5" aria-hidden="true">
        {parts.map((part) => (
          <div key={part.label} className="flex min-w-16 flex-col items-center border border-ink px-3 py-2.5">
            <span key={part.value} className="digit-in text-heading-sm font-extrabold tabular">
              {part.value}
            </span>
            <span className="label-caps text-muted">{part.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
