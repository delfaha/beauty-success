export const SITE = {
  name: 'Beauty Success',
  tagline: 'Parfumerie en ligne',
  description:
    'Beauty Success, votre parfumerie en ligne : parfums femme, homme et unisexes, coffrets cadeaux, nouveautés et promotions. Livraison offerte dès 60 €, échantillons offerts.',
  email: 'bonjour@beauty-success.example',
  phone: '01 84 60 12 34',
  locale: 'fr_FR',
} as const

/** URL publique du site (variable VITE_SITE_URL en production, origine courante + chemin de base sinon). */
export function siteUrl(path = ''): string {
  const base = import.meta.env.VITE_SITE_URL || window.location.origin + import.meta.env.BASE_URL
  return `${base.replace(/\/$/, '')}${path}`
}
