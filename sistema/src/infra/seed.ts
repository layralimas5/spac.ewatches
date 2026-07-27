import type { Product } from '@/domain/product'
import type { Customer } from '@/domain/customer'
import type { Order } from '@/domain/order'
import type { Delivery } from '@/domain/delivery'
import type { FinanceEntry } from '@/domain/finance'

/**
 * Dados de demonstração.
 *
 * ⚠️ Nada aqui é real: peças, clientes e valores existem só para o sistema ter
 * o que mostrar antes do primeiro cadastro. O botão "restaurar demonstração",
 * nos ajustes, volta para este estado.
 *
 * O catálogo espelha o do site de propósito: quando o Supabase entrar, os dois
 * passam a ler a mesma tabela, e ver o mesmo SKU nos dois lugares agora evita
 * descobrir divergência só na migração.
 */

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function dateOnly(days: number): string {
  return daysAgo(days).slice(0, 10)
}

function daysAhead(days: number): string {
  return daysAgo(-days)
}

export const seedProducts: readonly Product[] = [
  {
    id: 'p-rolex-datejust',
    sku: 'RLX-DJ41-JUB',
    brand: 'Rolex',
    model: 'Datejust 41 Jubilee',
    reference: '126334',
    condition: 'novo',
    status: 'disponivel',
    costPrice: 7350000,
    salePrice: 8990000,
    stock: 1,
    minStock: 1,
    supplier: 'Fornecedor Miami',
    site: {
      published: true,
      section: 'destaque',
      availability: 'pronta-entrega',
      shortDescription: 'O clássico que nunca sai de linha, em aço com bezel canelado.',
      description: 'O Datejust 41 é o relógio que define o que é um relógio de vestir moderno. Caixa em aço Oystersteel, bezel canelado em ouro branco 18k e pulseira Jubilee. Acompanha caixa e documentos originais.',
      imageUrl: '/catalogo/rolex-datejust-41.webp',
      imageAlt: 'Rolex Datejust 41 com pulseira Jubilee e mostrador azul',
      specs: {
        movement: 'Automático, calibre 3235',
        caseMaterial: 'Aço Oystersteel e ouro branco 18k',
        caseSizeMm: 41,
        glass: 'Safira',
        waterResistance: '100 metros',
        bracelet: 'Jubilee em aço'
      },
      warrantyMonths: 24,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(48),
  },
  {
    id: 'p-omega-speedmaster',
    sku: 'OMG-SPD-PRO',
    brand: 'Omega',
    model: 'Speedmaster Professional Moonwatch',
    reference: '310.30.42.50.01.002',
    condition: 'novo',
    status: 'disponivel',
    costPrice: 4380000,
    salePrice: 5490000,
    stock: 2,
    minStock: 1,
    supplier: 'Fornecedor Miami',
    site: {
      published: true,
      section: 'destaque',
      availability: 'pronta-entrega',
      shortDescription: 'O cronógrafo que foi à Lua, com corda manual e vidro Hesalite.',
      description: 'O Moonwatch mantém a construção que a NASA aprovou: cronógrafo de corda manual, mostrador preto e taquímetro no bezel. Peça de coleção que se usa todo dia.',
      imageUrl: '/catalogo/omega-speedmaster.webp',
      imageAlt: 'Omega Speedmaster Professional Moonwatch com mostrador preto e pulseira de couro',
      specs: {
        movement: 'Corda manual, calibre 3861 Co-Axial',
        caseMaterial: 'Aço inoxidável',
        caseSizeMm: 42,
        glass: 'Hesalite',
        waterResistance: '50 metros',
        bracelet: 'Couro preto'
      },
      warrantyMonths: 60,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(40),
  },
  {
    id: 'p-cartier-santos',
    sku: 'CTR-SNT-MED',
    brand: 'Cartier',
    model: 'Santos de Cartier Médio',
    reference: 'WSSA0029',
    condition: 'novo',
    status: 'encomenda',
    costPrice: 3900000,
    salePrice: 4790000,
    stock: 0,
    minStock: 1,
    notes: 'Peça sob encomenda, prazo de 30 dias com o fornecedor.',
    site: {
      published: true,
      section: 'catalogo',
      availability: 'sob-encomenda',
      shortDescription: 'Caixa quadrada, parafusos aparentes e troca de pulseira sem ferramenta.',
      description: 'O Santos é o relógio de pulso como conhecemos hoje. O sistema QuickSwitch troca a pulseira sem ferramenta nenhuma.',
      imageUrl: '/catalogo/cartier-santos.webp',
      imageAlt: 'Santos de Cartier médio em aço com mostrador verde e algarismos romanos',
      specs: {
        movement: 'Automático, calibre 1847 MC',
        caseMaterial: 'Aço inoxidável',
        caseSizeMm: 35,
        glass: 'Safira',
        waterResistance: '100 metros',
        bracelet: 'Aço com QuickSwitch'
      },
      warrantyMonths: 24,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(33),
  },
  {
    id: 'p-tudor-bb58',
    sku: 'TDR-BB58-NVY',
    brand: 'Tudor',
    model: 'Black Bay 58 Navy Blue',
    reference: 'M79030B',
    condition: 'novo',
    status: 'reservado',
    costPrice: 2150000,
    salePrice: 2690000,
    stock: 1,
    minStock: 1,
    supplier: 'Parceiro São Paulo',
    site: {
      published: true,
      section: 'pronta-entrega',
      availability: 'pronta-entrega',
      shortDescription: 'Mergulhador vintage de 39mm, o tamanho que caiu no gosto de todo mundo.',
      description: 'O Black Bay 58 acertou onde muito mergulhador erra: 39mm e perfil baixo, cabe embaixo da manga. Certificação COSC e 70 horas de reserva de marcha.',
      imageUrl: '/catalogo/tudor-black-bay-58.webp',
      imageAlt: 'Tudor Black Bay 58 azul marinho com pulseira de aço',
      specs: {
        movement: 'Automático, calibre MT5402 (COSC)',
        caseMaterial: 'Aço inoxidável',
        caseSizeMm: 39,
        glass: 'Safira',
        waterResistance: '200 metros',
        bracelet: 'Aço inoxidável'
      },
      warrantyMonths: 60,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(27),
  },
  {
    id: 'p-iwc-portugieser',
    sku: 'IWC-PRT-CHR',
    brand: 'IWC',
    model: 'Portugieser Chronograph',
    reference: 'IW371617',
    condition: 'seminovo',
    status: 'disponivel',
    costPrice: 3550000,
    salePrice: 4290000,
    stock: 1,
    minStock: 1,
    notes: 'Comprado de cliente, com caixa e documentos.',
    site: {
      published: true,
      section: 'pronta-entrega',
      availability: 'pronta-entrega',
      shortDescription: 'Cronógrafo de mostrador limpo, com movimento de manufatura.',
      description: 'Portugieser Chronograph em estado de novo, com pouquíssimo uso. Calibre de manufatura 69355 visível pelo fundo.',
      imageUrl: '/catalogo/iwc-portugieser.webp',
      imageAlt: 'IWC Portugieser Chronograph em ouro rosé, com mostrador azul e pulseira de couro preta',
      specs: {
        movement: 'Automático, calibre 69355 de manufatura',
        caseMaterial: 'Ouro rosé 18k',
        caseSizeMm: 41,
        glass: 'Safira com tratamento antirreflexo',
        waterResistance: '30 metros',
        bracelet: 'Couro de bezerro'
      },
      warrantyMonths: 12,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(21),
  },
  {
    id: 'p-grand-seiko',
    sku: 'GRS-SNW-FLK',
    brand: 'Grand Seiko',
    model: 'Snowflake Spring Drive',
    reference: 'SBGA211',
    condition: 'novo',
    status: 'disponivel',
    costPrice: 3600000,
    salePrice: 4390000,
    stock: 3,
    minStock: 1,
    supplier: 'Fornecedor Tóquio',
    site: {
      published: true,
      section: 'catalogo',
      availability: 'sob-encomenda',
      shortDescription: 'O mostrador texturizado e o ponteiro que desliza sem tique-taque.',
      description: 'O Snowflake é famoso por duas coisas: o mostrador texturizado e o Spring Drive, movimento em que o ponteiro dos segundos desliza contínuo, sem salto. Caixa em titânio de alta intensidade.',
      imageUrl: '/catalogo/grand-seiko-snowflake.webp',
      imageAlt: 'Grand Seiko Snowflake com mostrador texturizado em rosa claro e pulseira de titânio',
      specs: {
        movement: 'Spring Drive, calibre 9R65',
        caseMaterial: 'Titânio de alta intensidade',
        caseSizeMm: 41,
        glass: 'Safira com antirreflexo',
        waterResistance: '100 metros',
        bracelet: 'Titânio'
      },
      warrantyMonths: 36,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(16),
  },
  {
    id: 'p-tag-carrera',
    sku: 'TAG-CAR-CHR',
    brand: 'TAG Heuer',
    model: 'Carrera Chronograph',
    reference: 'CBN2A1B',
    condition: 'novo',
    status: 'disponivel',
    costPrice: 3100000,
    salePrice: 3890000,
    stock: 2,
    minStock: 1,
    supplier: 'Parceiro São Paulo',
    site: {
      published: true,
      section: 'catalogo',
      availability: 'pronta-entrega',
      shortDescription: 'Cronógrafo de corrida com movimento de manufatura e 80h de reserva.',
      description: 'A Carrera nasceu para corrida e continua com a leitura mais direta do segmento. Calibre Heuer 02 de manufatura, com 80 horas de reserva de marcha e fundo transparente.',
      imageUrl: '/catalogo/tag-heuer-carrera.webp',
      imageAlt: 'TAG Heuer Carrera Chronograph com mostrador azul, detalhes em laranja e pulseira de couro azul',
      specs: {
        movement: 'Automático, calibre Heuer 02',
        caseMaterial: 'Aço inoxidável',
        caseSizeMm: 44,
        glass: 'Safira',
        waterResistance: '100 metros',
        bracelet: 'Couro azul'
      },
      warrantyMonths: 24,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(12),
  },
  {
    id: 'p-longines-master',
    sku: 'LNG-MST-AUT',
    brand: 'Longines',
    model: 'Master Collection Automático',
    reference: 'L2.909.4.78.3',
    condition: 'novo',
    status: 'disponivel',
    costPrice: 1150000,
    salePrice: 1490000,
    stock: 4,
    minStock: 2,
    supplier: 'Fornecedor Miami',
    site: {
      published: false,
      section: 'catalogo',
      availability: 'pronta-entrega',
      shortDescription: 'Entrada no automático suíço com acabamento de peça bem mais cara.',
      description: 'A Master Collection é a porta de entrada mais honesta pro relógio suíço automático: mostrador com guilhochê, ponteiros azulados e movimento com espiral de silício.',
      imageUrl: '/catalogo/longines-master.webp',
      imageAlt: 'Longines Master Collection com mostrador prateado, ponteiros azulados e pulseira de couro azul',
      specs: {
        movement: 'Automático, calibre L888.4',
        caseMaterial: 'Aço inoxidável',
        caseSizeMm: 40,
        glass: 'Safira com antirreflexo',
        waterResistance: '30 metros',
        bracelet: 'Couro de jacaré azul'
      },
      warrantyMonths: 60,
      hasBoxAndPapers: true
    },
    createdAt: daysAgo(9),
  },
]

export const seedCustomers: readonly Customer[] = [
  {
    id: 'c-ana',
    name: 'Ana Prado',
    phone: '11987654321',
    email: 'ana.prado@email.com',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Comprou o primeiro relógio de presente. Procura peça feminina até R$ 20 mil.',
    createdAt: daysAgo(44),
  },
  {
    id: 'c-bruno',
    name: 'Bruno Tavares',
    phone: '21991234567',
    email: 'bruno.tavares@email.com',
    document: '123.456.789-00',
    city: 'Rio de Janeiro',
    state: 'RJ',
    notes: 'Colecionador. Quer aviso quando entrar mergulhador vintage.',
    createdAt: daysAgo(38),
  },
  {
    id: 'c-carla',
    name: 'Carla Menezes',
    phone: '31988887777',
    city: 'Belo Horizonte',
    state: 'MG',
    notes: 'Prefere falar de manhã. Paga sempre no Pix.',
    createdAt: daysAgo(25),
  },
  {
    id: 'c-diego',
    name: 'Diego Fontes',
    phone: '41997776655',
    email: 'diego.fontes@email.com',
    city: 'Curitiba',
    state: 'PR',
    notes: 'Pediu importação do Santos. Aprovou a cotação, aguardando chegada.',
    createdAt: daysAgo(18),
  },
  {
    id: 'c-elisa',
    name: 'Elisa Rangel',
    phone: '51996665544',
    city: 'Porto Alegre',
    state: 'RS',
    notes: 'Primeiro contato pelo Instagram, ainda escolhendo modelo.',
    createdAt: daysAgo(5),
  },
]

export const seedOrders: readonly Order[] = [
  {
    id: 'o-1',
    code: 'SW-K72P1A',
    customerId: 'c-bruno',
    items: [
      {
        productId: 'p-omega-speedmaster',
        description: 'Omega Speedmaster Professional Moonwatch',
        quantity: 1,
        unitPrice: 5490000,
      },
    ],
    status: 'entregue',
    paymentMethod: 'pix',
    shippingCost: 0,
    discount: 274500,
    createdAt: daysAgo(31),
  },
  {
    id: 'o-2',
    code: 'SW-L83Q2B',
    customerId: 'c-ana',
    items: [
      {
        productId: 'p-longines-master',
        description: 'Longines Master Collection Automático',
        quantity: 1,
        unitPrice: 1490000,
      },
    ],
    status: 'entregue',
    paymentMethod: 'cartao',
    shippingCost: 4500,
    discount: 0,
    createdAt: daysAgo(22),
  },
  {
    id: 'o-3',
    code: 'SW-M94R3C',
    customerId: 'c-carla',
    items: [
      {
        productId: 'p-tag-carrera',
        description: 'TAG Heuer Carrera Chronograph',
        quantity: 1,
        unitPrice: 3890000,
      },
    ],
    status: 'enviado',
    paymentMethod: 'pix',
    shippingCost: 0,
    discount: 194500,
    createdAt: daysAgo(6),
  },
  {
    id: 'o-4',
    code: 'SW-N05S4D',
    customerId: 'c-diego',
    items: [
      {
        productId: 'p-cartier-santos',
        description: 'Santos de Cartier Médio (importação)',
        quantity: 1,
        unitPrice: 4790000,
      },
    ],
    status: 'pago',
    paymentMethod: 'transferencia',
    shippingCost: 0,
    discount: 0,
    createdAt: daysAgo(4),
    notes: 'Importação aprovada. Prazo combinado: 30 dias.',
  },
  {
    id: 'o-5',
    code: 'SW-P16T5E',
    customerId: 'c-carla',
    items: [
      {
        productId: 'p-tudor-bb58',
        description: 'Tudor Black Bay 58 Navy Blue',
        quantity: 1,
        unitPrice: 2690000,
      },
    ],
    status: 'confirmado',
    paymentMethod: 'pix',
    shippingCost: 0,
    discount: 0,
    createdAt: daysAgo(2),
    notes: 'Peça reservada. Cliente paga na sexta.',
  },
  {
    id: 'o-6',
    code: 'SW-Q27U6F',
    customerId: 'c-elisa',
    items: [
      {
        productId: 'p-grand-seiko',
        description: 'Grand Seiko Snowflake Spring Drive',
        quantity: 1,
        unitPrice: 4390000,
      },
    ],
    status: 'orcamento',
    paymentMethod: 'pix',
    shippingCost: 0,
    discount: 0,
    createdAt: daysAgo(1),
    notes: 'Enviada a cotação, aguardando resposta.',
  },
]

export const seedDeliveries: readonly Delivery[] = [
  {
    id: 'd-1',
    orderId: 'o-1',
    carrier: 'Correios Sedex',
    trackingCode: 'BR123456789BR',
    status: 'entregue',
    estimatedFor: dateOnly(26),
    updatedAt: daysAgo(26),
  },
  {
    id: 'd-2',
    orderId: 'o-2',
    carrier: 'Correios Sedex',
    trackingCode: 'BR987654321BR',
    status: 'entregue',
    estimatedFor: dateOnly(17),
    updatedAt: daysAgo(17),
  },
  {
    id: 'd-3',
    orderId: 'o-3',
    carrier: 'Correios Sedex',
    trackingCode: 'BR555444333BR',
    status: 'em-transito',
    estimatedFor: daysAhead(2).slice(0, 10),
    updatedAt: daysAgo(1),
  },
  {
    id: 'd-4',
    orderId: 'o-4',
    carrier: 'Retirada em mãos',
    status: 'preparando',
    estimatedFor: daysAhead(26).slice(0, 10),
    updatedAt: daysAgo(4),
    notes: 'Só posta depois que a peça chegar da importação.',
  },
]

export const seedFinance: readonly FinanceEntry[] = [
  {
    id: 'f-1',
    kind: 'entrada',
    category: 'venda',
    description: 'Pedido SW-K72P1A · Omega Speedmaster',
    amount: 5215500,
    date: dateOnly(31),
    orderId: 'o-1',
  },
  {
    id: 'f-2',
    kind: 'saida',
    category: 'compra',
    description: 'Compra Omega Speedmaster',
    amount: 4380000,
    date: dateOnly(40),
  },
  {
    id: 'f-3',
    kind: 'entrada',
    category: 'venda',
    description: 'Pedido SW-L83Q2B · Longines Master',
    amount: 1494500,
    date: dateOnly(22),
    orderId: 'o-2',
  },
  {
    id: 'f-4',
    kind: 'saida',
    category: 'compra',
    description: 'Compra Longines Master (4 peças)',
    amount: 4600000,
    date: dateOnly(24),
  },
  {
    id: 'f-5',
    kind: 'saida',
    category: 'frete',
    description: 'Sedex pedido SW-L83Q2B',
    amount: 4500,
    date: dateOnly(21),
  },
  {
    id: 'f-6',
    kind: 'entrada',
    category: 'venda',
    description: 'Pedido SW-M94R3C · TAG Heuer Carrera',
    amount: 3695500,
    date: dateOnly(6),
    orderId: 'o-3',
  },
  {
    id: 'f-7',
    kind: 'entrada',
    category: 'venda',
    description: 'Pedido SW-N05S4D · Santos de Cartier (importação)',
    amount: 4790000,
    date: dateOnly(4),
    orderId: 'o-4',
  },
  {
    id: 'f-8',
    kind: 'saida',
    category: 'compra',
    description: 'Sinal do Santos de Cartier ao fornecedor',
    amount: 3900000,
    date: dateOnly(3),
  },
  {
    id: 'f-9',
    kind: 'saida',
    category: 'marketing',
    description: 'Impulsionamento no Instagram',
    amount: 45000,
    date: dateOnly(8),
  },
  {
    id: 'f-10',
    kind: 'saida',
    category: 'imposto',
    description: 'Taxa de importação',
    amount: 320000,
    date: dateOnly(5),
  },
  {
    id: 'f-11',
    kind: 'saida',
    category: 'operacional',
    description: 'Embalagem e material de envio',
    amount: 18000,
    date: dateOnly(10),
  },
]
