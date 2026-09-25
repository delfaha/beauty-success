/** Minuscule, sans accents ni ponctuation — base de la recherche et des slugs. */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' et ')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9%]+/g, ' ')
    .trim()
}

export function slugify(value: string): string {
  return normalizeText(value).replace(/\s+/g, '-')
}

/** Découpe un texte en lignes d'au plus `maxChars` caractères (mots entiers). */
export function wrapWords(text: string, maxChars: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!current) {
      current = word
    } else if (`${current} ${word}`.length <= maxChars) {
      current = `${current} ${word}`
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}
