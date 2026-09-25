type Rgb = [number, number, number]

function parse(hex: string): Rgb {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? [...clean].map((c) => c + c).join('') : clean
  const value = Number.parseInt(full, 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function toHex(rgb: Rgb): string {
  return `#${rgb
    .map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0'))
    .join('')}`
}

/** Mélange linéaire de deux couleurs (t ∈ [0, 1]). */
export function mix(a: string, b: string, t: number): string {
  const from = parse(a)
  const to = parse(b)
  return toHex([0, 1, 2].map((i) => from[i] + (to[i] - from[i]) * t) as Rgb)
}

/** Éclaircit (amount > 0) ou assombrit (amount < 0) une couleur. */
export function shade(hex: string, amount: number): string {
  return amount >= 0 ? mix(hex, '#ffffff', amount) : mix(hex, '#000000', -amount)
}

export function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const isDark = (hex: string) => luminance(hex) < 0.22
