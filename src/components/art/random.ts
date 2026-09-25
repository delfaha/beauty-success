/** Hash FNV-1a : graine déterministe à partir d'un identifiant produit. */
export function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function tornEdge(random: () => number, x0: number, x1: number, y: number, amplitude: number): [number, number][] {
  const points: [number, number][] = []
  let drift = 0
  let x = x0
  while (x < x1) {
    drift = Math.max(-amplitude, Math.min(amplitude, drift + (random() - 0.5) * amplitude))
    points.push([x, y + drift + (random() - 0.5) * amplitude * 0.7])
    x += 4 + random() * 9
  }
  points.push([x1, y + drift])
  return points
}

/** Bande de papier déchirée sur ses bords haut et bas (effet collage). */
export function tornStripPath(random: () => number, x0: number, x1: number, top: number, bottom: number, amplitude = 6): string {
  const upper = tornEdge(random, x0, x1, top, amplitude)
  const lower = tornEdge(random, x0, x1, bottom, amplitude).reverse()
  return `M${[...upper, ...lower].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`
}
