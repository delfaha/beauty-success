import { useEffect } from 'react'

let locks = 0

/** Bloque le défilement de la page (tiroirs, menus plein écran). Gère les verrous imbriqués. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return
    locks += 1
    document.documentElement.style.overflow = 'hidden'
    return () => {
      locks -= 1
      if (locks === 0) document.documentElement.style.overflow = ''
    }
  }, [active])
}
