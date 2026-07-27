export interface BannerSlide {
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly ctaLabel: string
  readonly ctaTo: string
  /**
   * Caminho da imagem em `public/banners/`. Enquanto não existir, o slide cai
   * num fundo escuro da marca, o banner nunca aparece quebrado.
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
export interface WideBannerConfig {
  /** Caminho da imagem em `public/banners/`. Proporção recomendada: 1200x300. */
  readonly image?: string
  readonly imageAlt?: string
  /** Destino do clique. Sem destino, o banner fica só como imagem. */
  readonly to?: string
  /**
   * Texto sobre a foto, alinhado à direita. Sem `title`, o banner fica só
   * imagem: um véu escuro sem texto por cima só escureceria a arte à toa.
   */
  readonly eyebrow?: string
  readonly title?: string
  readonly description?: string
  readonly ctaLabel?: string
}

/**
 * Banner largo entre as vitrines da home.
 *
 * Nasce vazio de propósito: o espaço já fica reservado na página, com a
 * proporção final, então colocar a arte depois não desloca nada.
 */
export const wideBanner: WideBannerConfig = {
  image: '/banners/02.webp',
  imageAlt: 'Casal em ambiente noturno, os dois usando relógios de aço no pulso',
  to: '/catalogo',
  eyebrow: 'Originais, com procedência',
  title: 'O relógio certo para a ocasião certa',
  description: 'Pronta-entrega e importação sob encomenda, sempre com caixa e documentos.',
  ctaLabel: 'Ver catálogo',
}

export const bannerSlides: readonly BannerSlide[] = [
  {
    id: 'originais',
    eyebrow: 'Originais · Caixa e documentos',
    title: 'O relógio que você quer, importado de verdade',
    description:
      'Peças originais em pronta-entrega, com procedência verificada antes de qualquer venda.',
    ctaLabel: 'Ver catálogo',
    ctaTo: '/catalogo',
    image: '/banners/01.webp',
    imageAlt: 'Cronógrafo preto com detalhes dourados no pulso, sobre fundo escuro',
  },
  {
    id: 'sob-encomenda',
    eyebrow: 'Importação personalizada',
    title: 'Não está no catálogo? A gente traz',
    description:
      'Você manda a referência, a gente cota com valor e prazo fechados antes de você aprovar.',
    ctaLabel: 'Como funciona',
    ctaTo: '/importacao',
    image: '/banners/02.webp',
    imageAlt: 'Casal em ambiente noturno, os dois usando relógios de aço no pulso',
  },
]
