import type { Product } from '@/domain/product'
import type { Customer } from '@/domain/customer'
import type { Order } from '@/domain/order'
import type { Delivery } from '@/domain/delivery'
import type { FinanceEntry } from '@/domain/finance'
import { createStore } from './store'
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

export function resetAll(): void {
  productStore.reset()
  customerStore.reset()
  orderStore.reset()
  deliveryStore.reset()
  financeStore.reset()
}
