import { useSyncExternalStore } from 'react'
import type { Store } from '@/infra/store'
import {
  customerStore,
  deliveryStore,
  financeStore,
  orderStore,
  productStore,
} from '@/infra/stores'
import type { Product } from '@/domain/product'
import type { Customer } from '@/domain/customer'
import type { Order } from '@/domain/order'
import type { Delivery } from '@/domain/delivery'
import type { FinanceEntry } from '@/domain/finance'

/**
 * Liga um componente a uma coleção.
 *
 * `useSyncExternalStore` é o caminho oficial do React para estado que vive
 * fora dele: qualquer tela que salve um registro faz todas as outras
 * atualizarem, sem contexto, sem biblioteca de estado e sem prop drilling.
 */
function useCollection<T extends { readonly id: string }>(store: Store<T>): readonly T[] {
  return useSyncExternalStore(store.subscribe, store.getAll, store.getAll)
}

export function useProducts(): readonly Product[] {
  return useCollection(productStore)
}

export function useCustomers(): readonly Customer[] {
  return useCollection(customerStore)
}

export function useOrders(): readonly Order[] {
  return useCollection(orderStore)
}

export function useDeliveries(): readonly Delivery[] {
  return useCollection(deliveryStore)
}

export function useFinanceEntries(): readonly FinanceEntry[] {
  return useCollection(financeStore)
}
