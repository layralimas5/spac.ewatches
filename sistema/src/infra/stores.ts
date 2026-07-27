import type { Product } from '@/domain/product'
import type { Customer } from '@/domain/customer'
import type { Order } from '@/domain/order'
import type { Delivery } from '@/domain/delivery'
import type { FinanceEntry } from '@/domain/finance'
import { defaultSettings, type Settings } from '@/domain/settings'
import { createStore } from './store'
import { createValueStore } from './value-store'
import { seedCustomers, seedDeliveries, seedFinance, seedOrders, seedProducts } from './seed'

/**
 * Instâncias únicas de cada coleção.
 *
 * É aqui que a troca de armazenamento acontece: para migrar ao Supabase, estas
 * cinco linhas passam a apontar para um `createSupabaseStore(...)` com a mesma
 * interface, e nenhuma tela precisa mudar.
 */
export const productStore = createStore<Product>('produtos', seedProducts)
export const customerStore = createStore<Customer>('clientes', seedCustomers)
export const orderStore = createStore<Order>('pedidos', seedOrders)
export const deliveryStore = createStore<Delivery>('entregas', seedDeliveries)
export const financeStore = createStore<FinanceEntry>('financeiro', seedFinance)

export const settingsStore = createValueStore<Settings>('ajustes', defaultSettings)

/** Trava local da tela, não autenticação. Ver `useSession`. */
export const sessionStore = createValueStore<boolean>('sessao', true)

export function resetAll(): void {
  productStore.reset()
  customerStore.reset()
  orderStore.reset()
  deliveryStore.reset()
  financeStore.reset()
}
