import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { demoWatches } from '../src/infra/catalog/watches.data.ts'

/**
 * Gera `public/sitemap.xml` a partir do catálogo, no `prebuild`.
 * Sitemap escrito à mão nasce desatualizado no primeiro relógio novo.
 *
 * Quando o catálogo vier do Supabase, este script passa a consultar o banco,
 * a estrutura de saída continua a mesma.
 */

const BASE_URL = 'https://spacewatches.com.br'

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/catalogo', priority: '0.9', changefreq: 'daily' },
  { path: '/importacao', priority: '0.8', changefreq: 'monthly' },
  { path: '/rastreio', priority: '0.5', changefreq: 'monthly' },
  { path: '/meus-pedidos', priority: '0.4', changefreq: 'monthly' },
] as const

const today = new Date().toISOString().split('T')[0] ?? ''

const urls = [
  ...staticRoutes.map((route) => ({
    loc: `${BASE_URL}${route.path}`,
    priority: route.priority,
    changefreq: route.changefreq,
  })),
  ...demoWatches.map((watch) => ({
    loc: `${BASE_URL}/relogio/${watch.id}`,
    priority: '0.7',
    changefreq: 'weekly',
  })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml')
writeFileSync(outputPath, xml, 'utf8')

console.log(`sitemap.xml gerado com ${urls.length} URLs`)
