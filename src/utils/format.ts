const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

export function formatRating(value: number): string {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

/** Accord simple en français (0 et 1 au singulier). */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString('fr-FR')} ${count > 1 ? plural : singular}`
}

export function roundPrice(value: number): number {
  return Math.round(value * 100) / 100
}
