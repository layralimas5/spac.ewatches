interface Entity {
  readonly id: string
}

export interface Store<T extends Entity> {
  getAll: () => readonly T[]
  subscribe: (listener: () => void) => () => void
  /** Cria ou substitui pelo `id`. */
  upsert: (item: T) => void
  remove: (id: string) => void
  /** Volta aos dados de exemplo. Usado no botão de restaurar demonstração. */
  reset: () => void
}

const PREFIX = 'spacewatches.gestao'

/**
 * Persistência local, adaptador da vez.
 *
 * O sistema nasce guardando no navegador de propósito: dá para operar hoje,
 * sem servidor e sem custo. A troca para o Supabase mexe só neste arquivo,
 * porque as telas conversam com a interface `Store`, nunca com o
 * `localStorage` direto.
 *
 * O que fica combinado desde já para essa migração:
 *   - `id` é string (uuid), igual ao que o Postgres vai gerar
 *   - datas em ISO, para virarem `timestamptz` sem conversão
 *   - dinheiro em centavos inteiros, para virar `bigint`
 */
export function createStore<T extends Entity>(name: string, seed: readonly T[]): Store<T> {
  const key = `${PREFIX}.${name}`
  const listeners = new Set<() => void>()

  function read(): readonly T[] {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return seed

      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return seed

      // Só entra o que tem `id`: dado corrompido à mão não derruba a tela.
      return parsed.filter(
        (item): item is T =>
          typeof item === 'object' && item !== null && typeof (item as Entity).id === 'string',
      )
    } catch (cause) {
      console.error(`Não consegui ler "${key}" do armazenamento local.`, cause)
      return seed
    }
  }

  // `useSyncExternalStore` exige que a leitura devolva sempre a MESMA
  // referência enquanto nada mudar, senão o React entra em laço de renderização.
  let snapshot: readonly T[] = read()

  function write(next: readonly T[]): void {
    snapshot = next
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch (cause) {
      // Cota estourada ou navegador em modo restrito: a tela segue com o dado
      // em memória, mas o usuário precisa saber que não foi salvo.
      console.error(`Não consegui salvar "${key}".`, cause)
    }
    for (const listener of listeners) listener()
  }

  return {
    getAll: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    upsert: (item) => {
      const current = snapshot
      const exists = current.some((entry) => entry.id === item.id)
      write(exists ? current.map((entry) => (entry.id === item.id ? item : entry)) : [item, ...current])
    },
    remove: (id) => {
      write(snapshot.filter((entry) => entry.id !== id))
    },
    reset: () => {
      write(seed)
    },
  }
}

/** Id novo. `randomUUID` existe em todo navegador atual sob HTTPS ou localhost. */
export function newId(): string {
  return crypto.randomUUID()
}
