import { SITE, siteUrl } from '@/config/site'
import { CATEGORY_LABELS } from '@/data/taxonomy'
import type { Product } from '@/types/product'
import { productPath } from './product'

type JsonLd = Record<string, unknown>

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: siteUrl('/'),
    email: SITE.email,
    telephone: SITE.phone,
  }
}

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: siteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.to ? { item: siteUrl(item.to) } : {}),
    })),
  }
}

export function productJsonLd(product: Product): JsonLd {
  const images = product.images.filter((src) => /^https?:\/\//.test(src))
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description,
    category: CATEGORY_LABELS[product.category],
    brand: { '@type': 'Brand', name: product.brand },
    ...(images.length ? { image: images } : {}),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
    },
    offers: {
      '@type': 'Offer',
      url: siteUrl(productPath(product.id)),
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
}

export function itemListJsonLd(products: Product[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: siteUrl(productPath(product.id)),
      name: product.name,
    })),
  }
}
