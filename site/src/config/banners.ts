export interface BannerSlide {
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly ctaLabel: string
  readonly ctaTo: string
  /**
   * Caminho da imagem em `public/banners/`. Enquanto não existir, o slide cai
   * num fundo escuro da marca — o banner nunca aparece quebrado.
   */
  readonly image?: string
  readonly imageAlt?: string
}

/**
 * Slides do carrossel principal.
 *
 * Para colocar as fotos reais: jogue os arquivos em `public/banners/` e
 * preencha `image` e `imageAlt` abaixo. O texto continua por cima, com um véu
 * escuro garantindo leitura sobre qualquer foto.
 */
export const bannerSlides: readonly BannerSlide[] = [
  {
    id: 'originais',
    eyebrow: 'Originais · Caixa e documentos',
    title: 'O relógio que você quer, importado de verdade',
    description:
      'Peças originais em pronta-entrega, com procedência verificada antes de qualquer venda.',
    ctaLabel: 'Ver catálogo',
    ctaTo: '/catalogo',
  },
  {
    id: 'sob-encomenda',
    eyebrow: 'Importação personalizada',
    title: 'Não está no catálogo? A gente traz',
    description:
      'Você manda a referência, a gente cota com valor e prazo fechados antes de você aprovar.',
    ctaLabel: 'Como funciona',
    ctaTo: '/importacao',
  },
]
