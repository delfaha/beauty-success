/**
 * Génère public/sitemap.xml à partir des données du catalogue.
 * Usage : npm run sitemap   (URL publique : variable SITE_URL, ex. SITE_URL=https://www.mondomaine.fr)
 * Exécuté directement par Node (≥ 22.18) grâce au retrait natif des types TypeScript.
 */
import { writeFileSync } from 'node:fs'
import { collections } from '../src/data/collections.ts'
import { infoPages } from '../src/data/content.ts'
import { products } from '../src/data/products.ts'

const base = (process.env.SITE_URL ?? 'https://www.beauty-success.example').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const entries: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  ...collections.map((collection) => ({ path: `/shop/${collection.slug}`, priority: '0.8', changefreq: 'daily' })),
  ...products.map((product) => ({ path: `/product/${product.id}`, priority: '0.7', changefreq: 'weekly' })),
  ...Object.keys(infoPages).map((slug) => ({ path: `/aide/${slug}`, priority: '0.3', changefreq: 'monthly' })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) =>
      `  <url>\n    <loc>${base}${entry.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml généré : ${entries.length} URL (${base})`)
