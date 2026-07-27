import type { Watch } from '@/domain/watch'

/**
 * ⚠️ CATÁLOGO DE DEMONSTRAÇÃO: NÃO PUBLICAR COMO ESTÁ.
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
 * Quando o Supabase entrar, este arquivo sai e a fonte passa a ser o banco,
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
      { url: '/catalogo/rolex-datejust-41.webp', alt: 'Rolex Datejust 41 com pulseira Jubilee e mostrador azul' },
    ],
    colors: [
      { name: 'Azul', hex: '#1f3a68' },
      { name: 'Prateado', hex: '#c9ccd1' },
      { name: 'Champanhe', hex: '#d8c390' },
    ],
    shortDescription: 'O clássico que nunca sai de linha, em aço com bezel canelado.',
    description:
      'O Datejust 41 é o relógio que define o que é um relógio de vestir moderno. ' +
      'Caixa em aço Oystersteel, bezel canelado em ouro branco 18k e pulseira Jubilee, ' +
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
      { url: '/catalogo/omega-speedmaster.webp', alt: 'Omega Speedmaster Professional Moonwatch com mostrador preto e pulseira de couro' },
    ],
    colors: [{ name: 'Preto', hex: '#141414' }],
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
      bracelet: 'Couro preto',
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
      { url: '/catalogo/cartier-santos.webp', alt: 'Santos de Cartier médio em aço com mostrador verde e algarismos romanos' },
    ],
    colors: [
      { name: 'Verde', hex: '#22452f' },
      { name: 'Prateado', hex: '#d2d5d9' },
      { name: 'Azul', hex: '#26406e' },
    ],
    shortDescription: 'Caixa quadrada, parafusos aparentes e troca de pulseira sem ferramenta.',
    description:
      'O Santos é o relógio de pulso como conhecemos hoje, Cartier o criou para um aviador ' +
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
      { url: '/catalogo/tudor-black-bay-58.webp', alt: 'Tudor Black Bay 58 azul marinho com pulseira de aço' },
    ],
    colors: [
      { name: 'Azul marinho', hex: '#1c2b4a' },
      { name: 'Preto', hex: '#141414' },
    ],
    shortDescription: 'Mergulhador vintage de 39mm, o tamanho que caiu no gosto de todo mundo.',
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
      { url: '/catalogo/iwc-portugieser.webp', alt: 'IWC Portugieser Chronograph em ouro rosé, com mostrador azul e pulseira de couro preta' },
    ],
    colors: [
      { name: 'Azul', hex: '#1a2740' },
      { name: 'Prateado', hex: '#d5d8dc' },
    ],
    shortDescription: 'Cronógrafo de mostrador limpo, com movimento de manufatura.',
    description:
      'Portugieser Chronograph em estado de novo, com pouquíssimo uso. ' +
      'Mostrador prateado com ponteiros azulados e o calibre de manufatura 69355 visível pelo fundo.',
    specs: {
      movement: 'Automático, calibre 69355 de manufatura',
      caseMaterial: 'Ouro rosé 18k',
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
      { url: '/catalogo/grand-seiko-snowflake.webp', alt: 'Grand Seiko Snowflake com mostrador texturizado em rosa claro e pulseira de titânio' },
    ],
    colors: [
      { name: 'Rosa claro', hex: '#f3e0e1' },
      { name: 'Branco neve', hex: '#eef1f4' },
    ],
    shortDescription: 'O mostrador de neve e o ponteiro que desliza sem tique-taque.',
    description:
      'O Snowflake é famoso por duas coisas: o mostrador que imita neve batida pelo vento ' +
      'e o Spring Drive, movimento em que o ponteiro dos segundos desliza contínuo, sem salto. ' +
      'Caixa em titânio de alta intensidade, mais leve e mais resistente a risco que o aço.',
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
      { url: '/catalogo/tag-heuer-carrera.webp', alt: 'TAG Heuer Carrera Chronograph com mostrador azul, detalhes em laranja e pulseira de couro azul' },
    ],
    colors: [
      { name: 'Azul', hex: '#1b4f8a' },
      { name: 'Preto', hex: '#141414' },
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
      bracelet: 'Couro azul',
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
      { url: '/catalogo/longines-master.webp', alt: 'Longines Master Collection com mostrador prateado, ponteiros azulados e pulseira de couro azul' },
    ],
    colors: [
      { name: 'Prateado', hex: '#d7dade' },
      { name: 'Branco', hex: '#f2f4f6' },
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
      bracelet: 'Couro de jacaré azul',
    },
    hasBoxAndPapers: true,
    warrantyMonths: 60,
    featured: false,
  },
]
