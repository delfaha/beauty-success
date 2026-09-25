import type { ReactNode } from 'react'

/**
 * Texte qui « roule » verticalement au survol du parent `.roll-host`.
 * La seconde copie est masquée aux lecteurs d'écran.
 */
export function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  )
}
