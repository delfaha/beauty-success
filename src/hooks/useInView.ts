import { useEffect, useRef, useState } from 'react'

interface Options {
  once?: boolean
  rootMargin?: string
  threshold?: number
}

type Listener = (entry: IntersectionObserverEntry) => void

/** Observateurs partagés par jeu d'options — un seul IntersectionObserver pour des dizaines d'éléments. */
const observers = new Map<string, { observer: IntersectionObserver; listeners: Map<Element, Listener> }>()

function observe(element: Element, rootMargin: string, threshold: number, listener: Listener) {
  const key = `${rootMargin}|${threshold}`
  let entry = observers.get(key)
  if (!entry) {
    const listeners = new Map<Element, Listener>()
    const observer = new IntersectionObserver(
      (records) => records.forEach((record) => listeners.get(record.target)?.(record)),
      { rootMargin, threshold },
    )
    entry = { observer, listeners }
    observers.set(key, entry)
  }
  entry.listeners.set(element, listener)
  entry.observer.observe(element)
  const current = entry
  return () => {
    current.listeners.delete(element)
    current.observer.unobserve(element)
  }
}

export function useInView<T extends Element = HTMLDivElement>({
  once = true,
  rootMargin = '0px 0px -8% 0px',
  threshold = 0,
}: Options = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const stop = observe(element, rootMargin, threshold, (record) => {
      if (record.isIntersecting) {
        setInView(true)
        if (once) stop()
      } else if (!once) {
        setInView(false)
      }
    })
    return stop
  }, [once, rootMargin, threshold])

  return { ref, inView }
}
