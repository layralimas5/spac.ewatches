/**
 * Porta de entrada da infraestrutura.
 *
 * As telas importam daqui, nunca de `store.ts` ou de um adaptador específico.
 * É o que torna a troca de `localStorage` por Supabase um detalhe interno.
 */
export { newId } from './store'
export type { Store } from './store'
export type { ValueStore } from './value-store'
export {
  customerStore,
  deliveryStore,
  financeStore,
  orderStore,
  productStore,
  resetAll,
  sessionStore,
  settingsStore,
} from './stores'
