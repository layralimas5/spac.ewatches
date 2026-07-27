import { siteConfig } from '@/config/site.config'
import { formatPrice } from './format'
import type { Watch } from '@/domain/watch'

/**
 * Toda a conversão do site passa por aqui: o visitante sai do site já dentro
 * de uma conversa com o modelo identificado, sem ter que digitar nada.
 *
 * Se o número ainda não estiver configurado, cai no direct do Instagram em vez
 * de gerar um link quebrado, CTA morto é pior que CTA alternativo.
 */

function buildLink(message: string): string {
  if (!siteConfig.whatsapp.isConfigured) {
    return siteConfig.instagram.url
  }
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`
}

/** Contato genérico: header, footer, CTA de fim de página. */
export function generalContactLink(): string {
  return buildLink('Olá! Vim pelo site da Space Watches e gostaria de mais informações.')
}

/** Interesse em um relógio específico do catálogo. */
export function watchInquiryLink(watch: Watch): string {
  const reference = watch.reference !== undefined ? ` (ref. ${watch.reference})` : ''
  const availability =
    watch.availability === 'pronta-entrega'
      ? 'Vi que está em pronta-entrega'
      : 'Vi que é sob encomenda'

  return buildLink(
    `Olá! Tenho interesse no ${watch.brand} ${watch.name}${reference}, ` +
      `anunciado por ${formatPrice(watch.price)}. ${availability}. ` +
      `Pode me passar mais detalhes?`,
  )
}

/** Importação personalizada: o cliente quer um modelo que não está no catálogo. */
export function customImportLink(): string {
  return buildLink(
    'Olá! Quero fazer uma importação personalizada. ' +
      'O modelo que procuro é: ',
  )
}

/**
 * Rastreio de pedido.
 *
 * O acompanhamento acontece na conversa, então o link já sai com o código
 * digitado: a loja abre o WhatsApp sabendo qual pedido consultar.
 */
export function orderTrackingLink(orderCode: string): string {
  const code = orderCode.trim()
  return buildLink(`Olá! Quero acompanhar o meu pedido ${code}. Pode me dar uma posição?`)
}

/** Rótulo do CTA, coerente com o destino real do link. */
export function contactChannelLabel(): string {
  return siteConfig.whatsapp.isConfigured ? 'WhatsApp' : 'Instagram'
}
