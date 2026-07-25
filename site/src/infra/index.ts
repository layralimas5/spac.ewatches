import type { ShippingProvider } from '@/domain/shipping'
import type { PaymentGateway } from '@/domain/order'
import { TableShippingProvider } from './shipping/table-shipping-provider'
import { WhatsAppOrderGateway } from './payment/whatsapp-order-gateway'

/**
 * Único ponto do app que escolhe as implementações de infraestrutura.
 *
 * Trocar por serviço real é uma linha cada:
 *   · frete      → `new MelhorEnvioShippingProvider(token)`
 *   · pagamento  → `new MercadoPagoGateway(publicKey)`
 *
 * Nenhuma página ou componente importa as classes concretas — todos dependem
 * das interfaces em `domain/`.
 */
export const shippingProvider: ShippingProvider = new TableShippingProvider()
export const paymentGateway: PaymentGateway = new WhatsAppOrderGateway()
