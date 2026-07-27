/**
 * Núcleo do domínio: o que é um relógio no catálogo da Space Watches.
 * Sem React, sem fetch, sem Supabase, só as regras do negócio.
 */

/** Como o cliente recebe o relógio. Define o CTA e o prazo mostrados na UI. */
export type Availability =
  /** Já está em mãos, envio imediato. */
  | 'pronta-entrega'
  /** Importação personalizada: a loja traz sob encomenda. */
  | 'sob-encomenda'

export type Condition = 'novo' | 'seminovo'

/** Preço em centavos de real. Inteiro para nunca somar float. */
export type PriceInCents = number

export interface WatchImage {
  readonly url: string
  /** Descrição para leitor de tela. Obrigatória, imagem de produto sem alt é barreira de acesso. */
  readonly alt: string
}

/**
 * Variação de cor da peça (mostrador, pulseira ou caixa).
 *
 * Fica no domínio porque é atributo do produto, não enfeite de tela: quando o
 * sistema de gestão entrar, cada variação vira estoque próprio.
 */
export interface WatchColor {
  readonly name: string
  /** Cor CSS da bolinha mostrada na vitrine. */
  readonly hex: string
}

export interface WatchSpecs {
  readonly movement: string
  readonly caseMaterial: string
  readonly caseSizeMm: number
  readonly glass: string
  readonly waterResistance: string
  readonly bracelet: string
}

export interface Watch {
  /** Slug estável usado na URL. Ex: "rolex-datejust-41-jubilee". */
  readonly id: string
  /** Código interno da peça, exibido na página de produto. */
  readonly sku: string
  readonly name: string
  readonly brand: string
  readonly reference?: string
  /**
   * Unidades disponíveis. `0` esgota a peça e desliga a compra.
   * Relógio importado costuma ser peça única, então `1` é o caso comum.
   */
  readonly stock: number
  readonly condition: Condition
  readonly availability: Availability
  readonly price: PriceInCents
  /** Preço anterior, quando houver ajuste real. Nunca usar como recurso de urgência falsa. */
  readonly previousPrice?: PriceInCents
  readonly images: readonly WatchImage[]
  /** Cores em que a peça sai. Ausente quando o modelo tem uma versão só. */
  readonly colors?: readonly WatchColor[]
  readonly shortDescription: string
  readonly description: string
  readonly specs: WatchSpecs
  /** Caixa e documentos originais, fator decisivo de confiança em importado. */
  readonly hasBoxAndPapers: boolean
  readonly warrantyMonths: number
  readonly featured: boolean
}

/**
 * Filtros do catálogo.
 *
 * Cada grupo aceita várias opções ao mesmo tempo: dentro do grupo vale OU
 * (Rolex OU Tudor), entre grupos vale E (Rolex OU Tudor, E novo). É como o
 * comprador pensa, ele quer ver duas marcas na mesma tela, não escolher uma.
 *
 * Lista vazia ou ausente significa "sem restrição", não "nenhum resultado".
 */
export interface CatalogFilters {
  readonly brands?: readonly string[]
  readonly availabilities?: readonly Availability[]
  readonly conditions?: readonly Condition[]
  readonly maxPrice?: PriceInCents
  /** Busca livre por nome, marca ou referência. */
  readonly query?: string
}

export type CatalogSort = 'relevancia' | 'menor-preco' | 'maior-preco'

/**
 * Categoria da vitrine (hoje, a marca).
 *
 * A capa sai do próprio catálogo, não de um arquivo separado: marca nova
 * cadastrada já aparece com foto, e ninguém precisa lembrar de subir uma
 * imagem de categoria à parte.
 */
export interface CatalogCategory {
  readonly brand: string
  readonly image?: WatchImage
  /** Quantas peças da marca estão no catálogo. */
  readonly count: number
}

/** Primeira imagem do relógio, ou `undefined` se o cadastro vier sem foto. */
export function primaryImage(watch: Watch): WatchImage | undefined {
  return watch.images[0]
}

export function isDiscounted(watch: Watch): boolean {
  return watch.previousPrice !== undefined && watch.previousPrice > watch.price
}

/**
 * Desconto em pontos percentuais inteiros, arredondado para baixo.
 *
 * Para baixo de propósito: anunciar 30% quando o desconto real é 29,7% é
 * propaganda enganosa por arredondamento. `null` quando não há desconto.
 */
export function isSoldOut(watch: Watch): boolean {
  return watch.stock <= 0
}

/** Aviso de escassez só quando ele é verdade: exatamente uma peça restante. */
export function isLastUnit(watch: Watch): boolean {
  return watch.stock === 1
}

export function discountPercent(watch: Watch): number | null {
  if (watch.previousPrice === undefined || watch.previousPrice <= watch.price) return null
  return Math.floor(((watch.previousPrice - watch.price) / watch.previousPrice) * 100)
}

/** Sem seleção no grupo, tudo passa. Com seleção, basta bater com uma opção. */
function matchesGroup<T>(selected: readonly T[] | undefined, value: T): boolean {
  return selected === undefined || selected.length === 0 || selected.includes(value)
}

export function matchesFilters(watch: Watch, filters: CatalogFilters): boolean {
  if (!matchesGroup(filters.brands, watch.brand)) return false
  if (!matchesGroup(filters.availabilities, watch.availability)) return false
  if (!matchesGroup(filters.conditions, watch.condition)) return false
  if (filters.maxPrice !== undefined && watch.price > filters.maxPrice) return false

  if (filters.query !== undefined && filters.query.trim() !== '') {
    const haystack = [watch.name, watch.brand, watch.reference ?? '']
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(filters.query.trim().toLowerCase())) return false
  }

  return true
}

export function sortWatches(watches: readonly Watch[], sort: CatalogSort): Watch[] {
  const sorted = [...watches]

  switch (sort) {
    case 'menor-preco':
      return sorted.sort((a, b) => a.price - b.price)
    case 'maior-preco':
      return sorted.sort((a, b) => b.price - a.price)
    case 'relevancia':
      // Destaque primeiro, pronta-entrega antes de encomenda: o que converte mais rápido sobe.
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        if (a.availability !== b.availability) return a.availability === 'pronta-entrega' ? -1 : 1
        return a.price - b.price
      })
  }
}
