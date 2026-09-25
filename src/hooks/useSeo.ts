import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { SITE, siteUrl } from '@/config/site'

interface SeoOptions {
  title?: string
  description?: string
  /** Chemin canonique (par défaut : chemin courant, sans paramètres). */
  canonical?: string
  noindex?: boolean
  type?: 'website' | 'product'
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = href
}

/** Titre, meta description, Open Graph, robots et URL canonique de la page. */
export function useSeo({ title, description = SITE.description, canonical, noindex = false, type = 'website' }: SeoOptions) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — Parfumerie en ligne : parfums & coffrets`
    const url = siteUrl(canonical ?? pathname)
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    setCanonical(url)
  }, [title, description, canonical, noindex, type, pathname])
}
