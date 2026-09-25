/** Description des visuels produits générés en SVG (placeholders « photo studio »). */

export type BottleShape = 'square' | 'apothecary' | 'round' | 'tall' | 'pebble' | 'flask' | 'spray'

export type CapFinish = 'gold' | 'black' | 'wood' | 'ivory' | 'silver'

export type LabelTone = 'cream' | 'black' | 'none'

export interface BottleArt {
  shape: BottleShape
  /** Couleur du jus (ou du verre lorsque le flacon est opaque). */
  liquid: string
  opaque?: boolean
  cap: CapFinish
  label: LabelTone
}

export interface BoxArt {
  color: string
  accent: 'gold' | 'black' | 'cream'
}

export interface ArtSpec {
  kind: 'bottle' | 'coffret'
  bottle: BottleArt
  /** Fond clair de la vue « studio ». */
  backdrop: string
  /** Papier déchiré en arrière-plan (collage éditorial). */
  paper?: string
  /** Emballage (coffret ou étui). */
  box?: BoxArt
  /** Nombre de miniatures pour les coffrets découverte. */
  minis?: number
}

export type ArtView = 'front' | 'noir' | 'detail' | 'pack'
