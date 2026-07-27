import { siteConfig } from '@/config/site.config'

interface SeoProps {
  /** Sem o nome da marca, ele é acrescentado aqui. */
  readonly title: string
  readonly description: string
  /** Caminho da página, começando com `/`. Vira canonical e og:url. */
  readonly path: string
  readonly image?: string
  readonly type?: 'website' | 'product'
  /** JSON-LD já montado. Ver `lib/structured-data.ts`. */
  readonly structuredData?: Record<string, unknown>
}

/**
 * Metadados por página.
 *
 * O React 19 iça `<title>`, `<meta>` e `<link>` para o `<head>` sozinho, então
 * basta renderizar aqui, sem react-helmet e sem efeito manual no DOM.
 */
export function Seo({
  title,
  description,
  path,
  image = '/logo.png',
  type = 'website',
  structuredData,
}: SeoProps) {
  const fullTitle = `${title} | ${siteConfig.name}`
  const url = `${siteConfig.url}${path}`
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {structuredData !== undefined && (
        <script
          type="application/ld+json"
          // JSON.stringify de dado próprio e tipado, não há entrada de usuário aqui.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  )
}
