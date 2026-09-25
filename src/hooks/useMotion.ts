import { useEffect, useRef, type RefObject } from 'react'
import { hasFinePointer, prefersReducedMotion } from '@/utils/motion'

/** Effet « magnétique » : l'élément suit légèrement le curseur (souris uniquement). */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !hasFinePointer() || prefersReducedMotion()) return
    element.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)'
    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - (rect.left + rect.width / 2)) * strength
      const y = (event.clientY - (rect.top + rect.height / 2)) * strength
      element.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
    }
    const onLeave = () => {
      element.style.transform = ''
    }
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerleave', onLeave)
    return () => {
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return ref
}

/** Parallaxe verticale douce, relative au centre de l'écran. */
export function useParallax<T extends HTMLElement>(speed = 0.12, scale = 1.08) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return
    const frameHost = element.parentElement ?? element
    let frame = 0
    const update = () => {
      frame = 0
      const rect = frameHost.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed
      element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(${scale})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [speed, scale])

  return ref
}

/** Défilement horizontal au cliquer-glisser (souris), sans déclencher de clic en fin de glissé. */
export function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element || !hasFinePointer()) return
    let startX = 0
    let startLeft = 0
    let pointerId = -1
    let pressed = false
    let moved = false

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      pressed = true
      moved = false
      startX = event.clientX
      startLeft = element.scrollLeft
      pointerId = event.pointerId
    }
    const onMove = (event: PointerEvent) => {
      if (!pressed) return
      const delta = event.clientX - startX
      if (!moved && Math.abs(delta) > 6) {
        moved = true
        element.setPointerCapture(pointerId)
        element.dataset.dragging = 'true'
      }
      if (moved) element.scrollLeft = startLeft - delta
    }
    const onUp = () => {
      if (!pressed) return
      pressed = false
      if (moved) {
        if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
        delete element.dataset.dragging
      }
    }
    const onClick = (event: MouseEvent) => {
      if (moved) {
        event.preventDefault()
        event.stopPropagation()
        moved = false
      }
    }
    const onDragStart = (event: DragEvent) => event.preventDefault()

    element.addEventListener('pointerdown', onDown)
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerup', onUp)
    element.addEventListener('pointercancel', onUp)
    element.addEventListener('click', onClick, true)
    element.addEventListener('dragstart', onDragStart)
    return () => {
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointercancel', onUp)
      element.removeEventListener('click', onClick, true)
      element.removeEventListener('dragstart', onDragStart)
    }
  }, [ref])
}
