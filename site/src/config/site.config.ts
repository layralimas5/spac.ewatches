/**
 * Configuração pública da Space Watches.
 * Nada de segredo aqui, tudo neste arquivo vai pro bundle do navegador.
 */

/**
 * Número de WhatsApp no formato internacional, só dígitos (ex: 5511999999999).
 * Definido em `.env.local` (ver `.env.example`). Enquanto não for preenchido,
 * os CTAs continuam renderizando mas avisam no console em desenvolvimento.
 */
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

if (import.meta.env.DEV && whatsappNumber === '') {
  console.warn(
    '[Space Watches] VITE_WHATSAPP_NUMBER não definido. ' +
      'Copie .env.example para .env.local e preencha o número da loja, ' +
      'senão os botões de contato não levam a lugar nenhum.',
  )
}

export const siteConfig = {
  name: 'Space Watches',
  /** Usado em title/OG. Curto de propósito, o nome já carrega o resto. */
  tagline: 'Relógios originais e importação personalizada',
  description:
    'Relógios importados originais, com caixa e documentos, e importação personalizada sob encomenda. ' +
    'Você escolhe o modelo, a Space Watches traz.',
  /** Trocar pelo domínio real quando publicar, usado em canonical, OG e sitemap. */
  url: 'https://spacewatches.com.br',
  instagram: {
    handle: 'spac.ewatches',
    url: 'https://www.instagram.com/spac.ewatches/',
  },
  whatsapp: {
    number: whatsappNumber,
    isConfigured: whatsappNumber !== '',
  },
  /**
   * Número de parcelas exibido no card e na página do produto.
   * É indicativo, a condição real é fechada no atendimento.
   */
  installments: 12,
} as const

export type SiteConfig = typeof siteConfig
