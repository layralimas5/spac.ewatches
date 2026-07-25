import type { Watch } from '@/domain/watch'

/**
 * ⚠️ CATÁLOGO DE DEMONSTRAÇÃO — NÃO PUBLICAR COMO ESTÁ.
 *
 * Nomes, referências, preços e specs abaixo são ILUSTRATIVOS, escritos só para
 * a interface ter o que mostrar enquanto o catálogo real não existe. Nenhum
 * destes itens representa estoque verdadeiro da Space Watches.
 *
 * Antes de colocar o site no ar:
 *   1. Substituir estes registros pelos relógios reais
 *   2. Colocar as fotos em `public/catalogo/` com o nome usado em `images.url`
 *   3. Conferir preço, referência e specs de cada peça
 *
 * Quando o Supabase entrar, este arquivo sai e a fonte passa a ser o banco —
 * a UI não muda, porque tudo consome `WatchRepository`.
 */
export const demoWatches: readonly Watch[] = [
  {
    id: 'rolex-datejust-41-jubilee',
    sku: 'RLX-DJ41-JUB',
    stock: 1,
    name: 'Datejust 41 Jubilee',
    brand: 'Rolex',
    reference: '126334',
    condition: 'novo',
    availability: 'pronta-entrega',
    price: 8990000,
    images: [
      { url: '/catalogo/rolex-datejust-41.jpg', alt: 'Rolex Datejust 41 com pulseira Jubilee e mostrador azul' },
    ],
    shortDescription: 'O clássico que nunca sai de linha, em aço com bezel canelado.',
    description:
      'O Datejust 41 é o relógio que define o que é um relógio de vestir moderno. ' +
      'Caixa em aço Oystersteel, bezel canelado em ouro branco 18k e pulseira Jubilee — ' +
      'a combinação mais reconhecível da marca. Acompanha caixa e documentos originais.',
    specs: {
      movement: 'Automático, calibre 3235',
      caseMaterial: 'Aço Oystersteel e ouro branco 18k',
      caseSizeMm: 41,
      glass: 'Safira',
      waterResistance: '100 metros',
      bracelet: 'Jubilee em aço',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 24,
    featured: true,
  },
  {
    id: 'omega-speedmaster-professional',
    sku: 'OMG-SPD-PRO',
    stock: 2,
    name: 'Speedmaster Professional Moonwatch',
    brand: 'Omega',
    reference: '310.30.42.50.01.002',
    condition: 'novo',
    availability: 'pronta-entrega',
    price: 5490000,
    images: [
      { url: '/catalogo/omega-speedmaster.jpg', alt: 'Omega Speedmaster Professional Moonwatch com mostrador preto' },
    ],
    shortDescription: 'O cronógrafo que foi à Lua, com corda manual e vidro Hesalite.',
    description:
      'O Moonwatch mantém a construção que a NASA aprovou: cronógrafo de corda manual, ' +
      'mostrador preto e taquímetro no bezel. Peça de coleção que se usa todo dia.',
    specs: {
      movement: 'Corda manual, calibre 3861 Co-Axial',
      caseMaterial: 'Aço inoxidável',
      caseSizeMm: 42,
      glass: 'Hesalite',
      waterResistance: '50 metros',
      bracelet: 'Aço inoxidável',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 60,
    featured: true,
  },
  {
    id: 'cartier-santos-medium',
    sku: 'CTR-SNT-MED',
    stock: 0,
    name: 'Santos de Cartier Médio',
    brand: 'Cartier',
    reference: 'WSSA0029',
    condition: 'novo',
    availability: 'sob-encomenda',
    price: 4790000,
    images: [
      { url: '/catalogo/cartier-santos.jpg', alt: 'Santos de Cartier médio em aço com mostrador prateado' },
    ],
    shortDescription: 'Caixa quadrada, parafusos aparentes e troca de pulseira sem ferramenta.',
    description:
      'O Santos é o relógio de pulso como conhecemos hoje — Cartier o criou para um aviador ' +
      'que não conseguia ver as horas no relógio de bolso. O sistema QuickSwitch troca a ' +
      'pulseira sem ferramenta nenhuma.',
    specs: {
      movement: 'Automático, calibre 1847 MC',
      caseMaterial: 'Aço inoxidável',
      caseSizeMm: 35,
      glass: 'Safira',
      waterResistance: '100 metros',
      bracelet: 'Aço com QuickSwitch',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 24,
    featured: true,
  },
  {
    id: 'tudor-black-bay-58',
    sku: 'TDR-BB58-NVY',
    stock: 1,
    name: 'Black Bay 58 Navy Blue',
    brand: 'Tudor',
    reference: 'M79030B',
    condition: 'novo',
    availability: 'pronta-entrega',
    price: 2690000,
    images: [
      { url: '/catalogo/tudor-black-bay-58.jpg', alt: 'Tudor Black Bay 58 azul marinho com pulseira de aço' },
    ],
    shortDescription: 'Mergulhador vintage de 39mm — o tamanho que caiu no gosto de todo mundo.',
    description:
      'O Black Bay 58 acertou onde muito mergulhador erra: 39mm e perfil baixo, ' +
      'cabe embaixo da manga. Certificação COSC e 70 horas de reserva de marcha.',
    specs: {
      movement: 'Automático, calibre MT5402 (COSC)',
      caseMaterial: 'Aço inoxidável',
      caseSizeMm: 39,
      glass: 'Safira',
      waterResistance: '200 metros',
      bracelet: 'Aço inoxidável',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 60,
    featured: true,
  },
  {
    id: 'iwc-portugieser-chronograph',
    sku: 'IWC-PRT-CHR',
    stock: 1,
    name: 'Portugieser Chronograph',
    brand: 'IWC',
    reference: 'IW371617',
    condition: 'seminovo',
    availability: 'pronta-entrega',
    price: 4290000,
    previousPrice: 4690000,
    images: [
      { url: '/catalogo/iwc-portugieser.jpg', alt: 'IWC Portugieser Chronograph com mostrador prateado e ponteiros azuis' },
    ],
    shortDescription: 'Cronógrafo de mostrador limpo, com movimento de manufatura.',
    description:
      'Portugieser Chronograph em estado de novo, com pouquíssimo uso. ' +
      'Mostrador prateado com ponteiros azulados e o calibre de manufatura 69355 visível pelo fundo.',
    specs: {
      movement: 'Automático, calibre 69355 de manufatura',
      caseMaterial: 'Aço inoxidável',
      caseSizeMm: 41,
      glass: 'Safira com tratamento antirreflexo',
      waterResistance: '30 metros',
      bracelet: 'Couro de bezerro',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 12,
    featured: false,
  },
  {
    id: 'grand-seiko-snowflake',
    sku: 'GRS-SNW-FLK',
    stock: 3,
    name: 'Snowflake Spring Drive',
    brand: 'Grand Seiko',
    reference: 'SBGA211',
    condition: 'novo',
    availability: 'sob-encomenda',
    price: 4390000,
    images: [
      { url: '/catalogo/grand-seiko-snowflake.jpg', alt: 'Grand Seiko Snowflake com mostrador texturizado branco' },
    ],
    shortDescription: 'O mostrador de neve e o ponteiro que desliza sem tique-taque.',
    description:
      'O Snowflake é famoso por duas coisas: o mostrador que imita neve batida pelo vento ' +
      'e o Spring Drive, movimento em que o ponteiro dos segundos desliza contínuo, sem salto. ' +
      'Caixa em titânio de alta intensidade — mais leve e mais resistente a risco que o aço.',
    specs: {
      movement: 'Spring Drive, calibre 9R65',
      caseMaterial: 'Titânio de alta intensidade',
      caseSizeMm: 41,
      glass: 'Safira com antirreflexo',
      waterResistance: '100 metros',
      bracelet: 'Titânio',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 36,
    featured: false,
  },
  {
    id: 'tag-heuer-carrera-chronograph',
    sku: 'TAG-CAR-CHR',
    stock: 2,
    name: 'Carrera Chronograph',
    brand: 'TAG Heuer',
    reference: 'CBN2A1B',
    condition: 'novo',
    availability: 'pronta-entrega',
    price: 3890000,
    images: [
      { url: '/catalogo/tag-heuer-carrera.jpg', alt: 'TAG Heuer Carrera Chronograph com mostrador preto e fundo transparente' },
    ],
    shortDescription: 'Cronógrafo de corrida com movimento de manufatura e 80h de reserva.',
    description:
      'A Carrera nasceu para corrida e continua com a leitura mais direta do segmento. ' +
      'Calibre Heuer 02 de manufatura, com 80 horas de reserva de marcha e fundo transparente.',
    specs: {
      movement: 'Automático, calibre Heuer 02',
      caseMaterial: 'Aço inoxidável',
      caseSizeMm: 44,
      glass: 'Safira',
      waterResistance: '100 metros',
      bracelet: 'Aço inoxidável',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 24,
    featured: false,
  },
  {
    id: 'longines-master-collection',
    sku: 'LNG-MST-AUT',
    stock: 4,
    name: 'Master Collection Automático',
    brand: 'Longines',
    reference: 'L2.909.4.78.3',
    condition: 'novo',
    availability: 'pronta-entrega',
    price: 1490000,
    images: [
      { url: '/catalogo/longines-master.jpg', alt: 'Longines Master Collection com mostrador prateado e pulseira de couro' },
    ],
    shortDescription: 'Entrada no automático suíço com acabamento de peça bem mais cara.',
    description:
      'A Master Collection é a porta de entrada mais honesta pro relógio suíço automático: ' +
      'mostrador com guilhochê, ponteiros azulados e movimento com espiral de silício.',
    specs: {
      movement: 'Automático, calibre L888.4',
      caseMaterial: 'Aço inoxidável',
      caseSizeMm: 40,
      glass: 'Safira com antirreflexo',
      waterResistance: '30 metros',
      bracelet: 'Couro de jacaré',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 60,
    featured: false,
  },
]
