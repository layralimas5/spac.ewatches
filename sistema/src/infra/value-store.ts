const PREFIX = 'spacewatches.gestao'

export interface ValueStore<T> {
  get: () => T
  set: (value: T) => void
  subscribe: (listener: () => void) => () => void
}

/**
 * Guarda um valor único (ajustes, sessão), não uma coleção.
 *
 * Mesma ideia do `createStore`, sem `id` e sem lista: quem consome é
 * `useSyncExternalStore`, então a leitura devolve sempre a mesma referência
 * enquanto nada mudar.
 */
export function createValueStore<T>(name: string, initial: T): ValueStore<T> {
  const key = `${PREFIX}.${name}`
  const listeners = new Set<() => void>()

  function read(): T {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return initial
      const parsed: unknown = JSON.parse(raw)
      // Mescla com o padrão: versão nova do sistema pode ter campo novo.
      return typeof parsed === 'object' && parsed !== null && typeof initial === 'object'
        ? { ...initial, ...(parsed as object) }
        : (parsed as T)
    } catch (cause) {
      console.error(`Não consegui ler "${key}".`, cause)
      return initial
    }
  }

  let snapshot: T = read()

  return {
    get: () => snapshot,
    set: (value) => {
      snapshot = value
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (cause) {
        console.error(`Não consegui salvar "${key}".`, cause)
      }
      for (const listener of listeners) listener()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
