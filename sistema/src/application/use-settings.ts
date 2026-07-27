import { useSyncExternalStore } from 'react'
import type { Settings } from '@/domain/settings'
import { settingsStore, sessionStore } from '@/infra'

export function useSettings(): Settings {
  return useSyncExternalStore(settingsStore.subscribe, settingsStore.get, settingsStore.get)
}

/**
 * Sessão aberta ou não.
 *
 * ⚠️ Isto NÃO é autenticação: é uma trava local, que só evita que o sistema
 * fique aberto na tela de quem passar pelo computador. Segurança de verdade
 * exige login no servidor, e vem com o Supabase.
 */
export function useSession(): boolean {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.get, sessionStore.get)
}
