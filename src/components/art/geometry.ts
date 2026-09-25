import type { BottleShape } from '@/types/art'

/** Scène de 400 × 500 (ratio 4:5), sol à y = 440. */
export const VIEW_W = 400
export const VIEW_H = 500
export const FLOOR = 440

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export type CapShape = 'block' | 'cylinder' | 'sphere' | 'tall' | 'dome' | 'wide' | 'pump'

export interface BottleGeometry {
  /** Contour extérieur du verre. */
  body: string
  bounds: Rect
  /** Cavité intérieure (jus). */
  inner: string
  liquidTop: number
  /** Haut du fond de verre épais. */
  baseTop: number
  /** Bague métallique entre le verre et le capot. */
  neck: Rect | null
  cap: Rect
  capShape: CapShape
  label: Rect | null
  highlight: { d: string; stroke?: boolean; width?: number }
  /** Position d'une gravure lorsque le flacon n'a pas d'étiquette. */
  engrave: { x: number; y: number } | null
}

function roundedRect(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
}

function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`
}

export function bottleGeometry(shape: BottleShape): BottleGeometry {
  switch (shape) {
    case 'square':
      return {
        body: roundedRect(128, 212, 144, 228, 10),
        bounds: { x: 128, y: 212, w: 144, h: 228 },
        inner: roundedRect(138, 224, 124, 188, 5),
        liquidTop: 240,
        baseTop: 412,
        neck: { x: 181, y: 197, w: 38, h: 17 },
        cap: { x: 154, y: 116, w: 92, h: 83 },
        capShape: 'block',
        label: { x: 150, y: 280, w: 100, h: 112 },
        highlight: { d: roundedRect(139, 226, 8, 186, 4) },
        engrave: null,
      }
    case 'apothecary':
      return {
        body: 'M132 432V266C132 240 150 226 178 220V206H222V220C250 226 268 240 268 266V432Q268 440 260 440H140Q132 440 132 432Z',
        bounds: { x: 132, y: 206, w: 136, h: 234 },
        inner: 'M141 414V268C141 248 156 236 182 230V214H218V230C244 236 259 248 259 268V414Z',
        liquidTop: 252,
        baseTop: 414,
        neck: null,
        cap: { x: 168, y: 124, w: 64, h: 86 },
        capShape: 'cylinder',
        label: { x: 146, y: 288, w: 108, h: 128 },
        highlight: { d: roundedRect(142, 272, 7, 150, 3.5) },
        engrave: null,
      }
    case 'round':
      return {
        body: ellipse(200, 336, 104, 104),
        bounds: { x: 96, y: 232, w: 208, h: 208 },
        inner: ellipse(200, 332, 94, 92),
        liquidTop: 264,
        baseTop: 424,
        neck: { x: 184, y: 214, w: 32, h: 22 },
        cap: { x: 164, y: 146, w: 72, h: 72 },
        capShape: 'sphere',
        label: { x: 150, y: 306, w: 100, h: 78 },
        highlight: { d: 'M121 306A84 84 0 0 1 172 250', stroke: true, width: 9 },
        engrave: null,
      }
    case 'tall':
      return {
        body: roundedRect(150, 178, 100, 262, 7),
        bounds: { x: 150, y: 178, w: 100, h: 262 },
        inner: roundedRect(158, 188, 84, 228, 4),
        liquidTop: 206,
        baseTop: 416,
        neck: { x: 182, y: 163, w: 36, h: 17 },
        cap: { x: 163, y: 62, w: 74, h: 103 },
        capShape: 'tall',
        label: { x: 162, y: 272, w: 76, h: 118 },
        highlight: { d: roundedRect(158, 190, 7, 226, 3.5) },
        engrave: null,
      }
    case 'pebble':
      return {
        body: ellipse(200, 368, 128, 72),
        bounds: { x: 72, y: 296, w: 256, h: 144 },
        inner: ellipse(200, 364, 116, 60),
        liquidTop: 322,
        baseTop: 424,
        neck: { x: 185, y: 280, w: 30, h: 20 },
        cap: { x: 166, y: 212, w: 68, h: 70 },
        capShape: 'dome',
        label: null,
        highlight: { d: 'M98 352Q110 316 164 304', stroke: true, width: 8 },
        engrave: { x: 200, y: 366 },
      }
    case 'flask':
      return {
        body: 'M116 434L138 218Q139 212 145 212H255Q261 212 262 218L284 434Q285 440 278 440H122Q115 440 116 434Z',
        bounds: { x: 116, y: 212, w: 168, h: 228 },
        inner: 'M128 414L147 224H253L272 414Z',
        liquidTop: 242,
        baseTop: 414,
        neck: { x: 181, y: 196, w: 38, h: 18 },
        cap: { x: 144, y: 146, w: 112, h: 52 },
        capShape: 'wide',
        label: { x: 156, y: 286, w: 88, h: 100 },
        highlight: { d: 'M146 226L131 418H139L153 226Z' },
        engrave: null,
      }
    case 'spray':
      return {
        body: roundedRect(160, 162, 80, 278, 9),
        bounds: { x: 160, y: 162, w: 80, h: 278 },
        inner: roundedRect(167, 170, 66, 250, 5),
        liquidTop: 192,
        baseTop: 420,
        neck: { x: 171, y: 140, w: 58, h: 24 },
        cap: { x: 184, y: 104, w: 32, h: 38 },
        capShape: 'pump',
        label: { x: 168, y: 236, w: 64, h: 152 },
        highlight: { d: roundedRect(167, 174, 6, 246, 3) },
        engrave: null,
      }
  }
}
