export interface NavChild {
  readonly label: string
  readonly to: string
}

export interface NavItem {
  readonly label: string
  readonly to: string
  /** Quando presente, o item abre um painel de submenu no desktop. */
  readonly children?: readonly NavChild[]
}

/**
 * Menu principal.
 *
 * As sub-rotas são filtros do catálogo, não páginas separadas: `/catalogo` já
 * lê marca, condição e disponibilidade da query string, então cada link do
 * submenu é uma vitrine pronta sem custo de rota nova.
 */
export const navigation: readonly NavItem[] = [
  {
    label: 'Relógios',
    to: '/catalogo',
    children: [
      { label: 'Ver tudo', to: '/catalogo' },
      { label: 'Pronta-entrega', to: '/catalogo?disponibilidade=pronta-entrega' },
      { label: 'Sob encomenda', to: '/catalogo?disponibilidade=sob-encomenda' },
      { label: 'Novos', to: '/catalogo?condicao=novo' },
      { label: 'Seminovos', to: '/catalogo?condicao=seminovo' },
      { label: 'Menor preço', to: '/catalogo?ordenar=menor-preco' },
    ],
  },
  { label: 'Pronta-entrega', to: '/catalogo?disponibilidade=pronta-entrega' },
  { label: 'Importação sob encomenda', to: '/importacao' },
]

/** Texto rotativo da barra promocional, no topo de tudo. */
export const announcements: readonly string[] = [
  'Relógios originais, com caixa e documentos',
  'Frete grátis acima de R$ 1.000',
  'Importação personalizada: você escolhe o modelo, a gente traz',
  'Parcelamento em até 12x',
]
