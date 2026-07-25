import type {
  OrderDraft,
  OrderTotals,
  PaymentGateway,
  PaymentResult,
} from '@/domain/order'
import { formatPrice } from '@/lib/format'
import { formatPostalCode } from '@/domain/shipping'
import { siteConfig } from '@/config/site.config'

/**
 * Fechamento do pedido pelo WhatsApp.
 *
 * Não é um placeholder inerte: é um fluxo de venda real, usado por boa parte do
 * varejo pequeno no Brasil. O checkout coleta tudo (itens, cliente, endereço,
 * frete, meio de pagamento), gera o código do pedido e manda o resumo completo
 * para a loja — o pagamento é combinado na conversa.
 *
 * Assim a loja vende hoje, sem conta de gateway. Quando o Mercado Pago entrar,
 * é só criar `MercadoPagoGateway` com esta mesma interface e trocar a instância
 * em `infra/index.ts`; o checkout não muda.
 */
export class WhatsAppOrderGateway implements PaymentGateway {
  async checkout(draft: OrderDraft, totals: OrderTotals): Promise<PaymentResult> {
    if (!siteConfig.whatsapp.isConfigured) {
      return {
        status: 'unavailable',
        reason:
          'O canal de atendimento ainda não foi configurado nesta loja. ' +
          'Fale com a gente pelo Instagram para concluir o pedido.',
      }
    }

    const orderCode = generateOrderCode()
    const message = buildOrderMessage(orderCode, draft, totals)

    return {
      status: 'pending',
      orderCode,
      redirectUrl: `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`,
    }
  }
}

/**
 * Código curto e legível para citar no atendimento (ex: SW-M8QK2P).
 * Junta tempo e acaso: o tempo evita colisão entre pedidos distintos, o acaso
 * evita dois pedidos no mesmo milissegundo saírem iguais.
 */
function generateOrderCode(): string {
  const time = Date.now().toString(36).toUpperCase().slice(-4)
  const random = Math.random().toString(36).toUpperCase().slice(2, 4)
  return `SW-${time}${random}`
}

function buildOrderMessage(
  orderCode: string,
  draft: OrderDraft,
  totals: OrderTotals,
): string {
  const items = draft.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.brand} ${item.name} (${item.sku}) — ${formatPrice(
          item.unitPrice * item.quantity,
        )}`,
    )
    .join('\n')

  const address = draft.address
  const complement = address.complement !== undefined ? `, ${address.complement}` : ''

  const lines = [
    `*Pedido ${orderCode}* — Space Watches`,
    '',
    '*Itens*',
    items,
    '',
    `Subtotal: ${formatPrice(totals.subtotal)}`,
    `Frete (${draft.shipping.label}): ${
      totals.shipping === 0 ? 'grátis' : formatPrice(totals.shipping)
    }`,
    ...(totals.discount > 0 ? [`Desconto no Pix: -${formatPrice(totals.discount)}`] : []),
    `*Total: ${formatPrice(totals.total)}*`,
    `Pagamento: ${draft.paymentMethod === 'pix' ? 'Pix' : 'Cartão de crédito'}`,
    '',
    '*Cliente*',
    draft.customer.name,
    `CPF: ${draft.customer.document}`,
    `E-mail: ${draft.customer.email}`,
    `Telefone: ${draft.customer.phone}`,
    '',
    '*Entrega*',
    `${address.street}, ${address.number}${complement}`,
    `${address.district} — ${address.city}/${address.state}`,
    `CEP ${formatPostalCode(address.postalCode)}`,
    `Prazo estimado: ${draft.shipping.estimatedDays} dias úteis`,
  ]

  return lines.join('\n')
}
